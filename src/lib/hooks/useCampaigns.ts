"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { decodeEventLog, type Address } from "viem";
import { privateGrantVaultAbi } from "@/lib/abis";
import { env } from "@/lib/env";
import type { Campaign, PayoutMetadata } from "@/lib/types";

type CampaignCreatedLogArgs = {
  id?: bigint;
};

export function useCampaigns() {
  const publicClient = usePublicClient({ chainId: arbitrumSepolia.id });
  const vaultAddress = env.vaultAddress;

  return useQuery({
    queryKey: ["campaigns", vaultAddress],
    enabled: Boolean(publicClient && vaultAddress),
    queryFn: async () => {
      if (!publicClient || !vaultAddress) return [] as Campaign[];
      const event = privateGrantVaultAbi.find(
        (item) => item.type === "event" && item.name === "CampaignCreated"
      );
      if (!event) return [] as Campaign[];

      const logs = await publicClient.getLogs({
        address: vaultAddress,
        event,
        fromBlock: 0n,
        toBlock: "latest"
      });

      const ids = logs
        .map((log) => {
          const decoded = decodeEventLog({
            abi: privateGrantVaultAbi,
            data: log.data,
            topics: log.topics
          });
          return (decoded.args as CampaignCreatedLogArgs).id;
        })
        .filter((id): id is bigint => typeof id === "bigint");

      const uniqueIds = [...new Set(ids.map((id) => id.toString()))].map(BigInt);
      const campaigns = await Promise.all(
        uniqueIds.map((id) =>
          publicClient.readContract({
            address: vaultAddress,
            abi: privateGrantVaultAbi,
            functionName: "getCampaign",
            args: [id]
          })
        )
      );

      return campaigns.map((campaign) => normalizeCampaign(campaign));
    }
  });
}

export function useCampaign(id?: bigint) {
  const publicClient = usePublicClient({ chainId: arbitrumSepolia.id });
  const vaultAddress = env.vaultAddress;

  return useQuery({
    queryKey: ["campaign", vaultAddress, id?.toString()],
    enabled: Boolean(publicClient && vaultAddress && id),
    queryFn: async () => {
      if (!publicClient || !vaultAddress || !id) throw new Error("Missing campaign context");
      const campaign = await publicClient.readContract({
        address: vaultAddress,
        abi: privateGrantVaultAbi,
        functionName: "getCampaign",
        args: [id]
      });
      return normalizeCampaign(campaign);
    }
  });
}

export function usePayouts(id?: bigint) {
  const publicClient = usePublicClient({ chainId: arbitrumSepolia.id });
  const vaultAddress = env.vaultAddress;

  return useQuery({
    queryKey: ["payouts", vaultAddress, id?.toString()],
    enabled: Boolean(publicClient && vaultAddress && id),
    queryFn: async () => {
      if (!publicClient || !vaultAddress || !id) return [] as PayoutMetadata[];
      const count = await publicClient.readContract({
        address: vaultAddress,
        abi: privateGrantVaultAbi,
        functionName: "payoutCount",
        args: [id]
      });
      const payouts = await Promise.all(
        Array.from({ length: Number(count) }, (_, index) =>
          publicClient.readContract({
            address: vaultAddress,
            abi: privateGrantVaultAbi,
            functionName: "getPayout",
            args: [id, BigInt(index)]
          })
        )
      );
      return payouts.map((payout) => payout as PayoutMetadata);
    }
  });
}

export function useRecipientPayouts(recipient?: Address) {
  const campaigns = useCampaigns();
  const publicClient = usePublicClient({ chainId: arbitrumSepolia.id });
  const vaultAddress = env.vaultAddress;

  return useQuery({
    queryKey: ["recipient-payouts", vaultAddress, recipient, campaigns.data?.length],
    enabled: Boolean(publicClient && vaultAddress && recipient && campaigns.data),
    queryFn: async () => {
      if (!campaigns.data || !recipient || !publicClient || !vaultAddress) return [];
      const rows: Array<{ campaign: Campaign; payout: PayoutMetadata; index: number }> = [];
      for (const campaign of campaigns.data) {
        const count = await publicClient.readContract({
          address: vaultAddress,
          abi: privateGrantVaultAbi,
          functionName: "payoutCount",
          args: [campaign.id]
        });
        for (let i = 0; i < Number(count); i++) {
          const payout = (await publicClient.readContract({
            address: vaultAddress,
            abi: privateGrantVaultAbi,
            functionName: "getPayout",
            args: [campaign.id, BigInt(i)]
          })) as PayoutMetadata;
          if (payout.recipient.toLowerCase() === recipient.toLowerCase()) {
            rows.push({ campaign, payout, index: i });
          }
        }
      }
      return rows;
    }
  });
}

function normalizeCampaign(value: unknown): Campaign {
  const campaign = value as Campaign;
  return {
    ...campaign,
    id: BigInt(campaign.id),
    publicBudget: BigInt(campaign.publicBudget),
    deadline: BigInt(campaign.deadline),
    createdAt: BigInt(campaign.createdAt)
  };
}

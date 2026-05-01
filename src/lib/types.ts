import type { Address, Hex } from "viem";

export type Campaign = {
  id: bigint;
  sponsor: Address;
  token: Address;
  confidentialToken: Address;
  name: string;
  description: string;
  category: string;
  publicBudget: bigint;
  deadline: bigint;
  createdAt: bigint;
  auditor: Address;
  isActive: boolean;
};

export type PayoutMetadata = {
  recipient: Address;
  operator: Address;
  confidentialTransferRef: Hex;
  memo: string;
  createdAt: bigint;
};

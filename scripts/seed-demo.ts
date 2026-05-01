import fs from "node:fs";
import path from "node:path";
import { createEthersHandleClient } from "@iexec-nox/handle";
import type { LogDescription } from "ethers";
import { ethers, network } from "hardhat";

type Deployment = {
  privateGrantVault: string;
  testToken: string;
  confidentialToken: string;
};

async function main() {
  const [sponsor] = await ethers.getSigners();
  const deployment = loadDeployment();
  const recipient = process.env.DEMO_RECIPIENT || sponsor.address;
  const auditor = process.env.DEMO_AUDITOR || ethers.ZeroAddress;
  const budget = ethers.parseUnits("25000", 6);
  const shieldAmount = ethers.parseUnits("1000", 6);
  const payoutAmount = ethers.parseUnits("125", 6);

  const vault = await ethers.getContractAt("PrivateGrantVault", deployment.privateGrantVault);
  const token = await ethers.getContractAt("PrivateGrantTestToken", deployment.testToken);
  const confidentialToken = await ethers.getContractAt(
    "NoxERC20ConfidentialWrapper",
    deployment.confidentialToken
  );

  console.log("Creating sample campaign...");
  const createTx = await vault.createCampaign(
    "DoraHacks Nox Builder Rewards",
    "Seeded real Arbitrum Sepolia campaign for confidential bounty payouts",
    deployment.testToken,
    deployment.confidentialToken,
    "hackathon reward",
    budget,
    BigInt(Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60),
    auditor
  );
  const createReceipt = await createTx.wait();
  const parsedLogs: Array<LogDescription | null> = [];
  for (const log of createReceipt?.logs ?? []) {
    try {
      parsedLogs.push(vault.interface.parseLog(log));
    } catch {
      parsedLogs.push(null);
    }
  }
  const event = parsedLogs.find(
    (log: LogDescription | null): log is LogDescription => log?.name === "CampaignCreated"
  );
  const campaignId = event?.args.id;
  if (campaignId === undefined) throw new Error("CampaignCreated event not found");
  console.log(`Campaign id: ${campaignId}`);

  console.log("Approving and shielding ERC-20 funds...");
  await (await token.approve(deployment.privateGrantVault, shieldAmount)).wait();
  await (await vault.shieldCampaignFunds(campaignId, shieldAmount)).wait();

  console.log("Authorizing vault as Nox ERC-7984 operator...");
  const operatorUntil = BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
  await (await confidentialToken.setOperator(deployment.privateGrantVault, operatorUntil)).wait();

  console.log("Encrypting payout amount with Nox Handle SDK...");
  const handleClient = await createEthersHandleClient(sponsor);
  const { handle, handleProof } = await handleClient.encryptInput(
    payoutAmount,
    "uint256",
    deployment.privateGrantVault as `0x${string}`
  );

  console.log("Sending confidential payout...");
  const payoutTx = await vault.sendConfidentialPayout(
    campaignId,
    recipient,
    handle,
    handleProof,
    "Seeded demo payout"
  );
  await payoutTx.wait();

  console.log(`Demo campaign seeded. Payout tx: ${payoutTx.hash}`);
}

function loadDeployment(): Deployment {
  const file = path.join(process.cwd(), "deployments", `${network.name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing deployment file at ${file}. Run deploy first.`);
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Deployment;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import fs from "node:fs";
import path from "node:path";
import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address} on ${network.name}`);

  const token = await ethers.deployContract("PrivateGrantTestToken");
  await token.waitForDeployment();
  console.log(`PrivateGrantTestToken: ${await token.getAddress()}`);

  const wrapper = await ethers.deployContract("NoxERC20ConfidentialWrapper", [
    await token.getAddress(),
    "Private pgUSDC",
    "pPGUSDC",
    "ipfs://privategrant-vault/confidential-pgusdc"
  ]);
  await wrapper.waitForDeployment();
  console.log(`NoxERC20ConfidentialWrapper: ${await wrapper.getAddress()}`);

  const vault = await ethers.deployContract("PrivateGrantVault");
  await vault.waitForDeployment();
  console.log(`PrivateGrantVault: ${await vault.getAddress()}`);

  const deployment = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    privateGrantVault: await vault.getAddress(),
    testToken: await token.getAddress(),
    confidentialToken: await wrapper.getAddress(),
    noxCompute: "0xd464B198f06756a1d00be223634b85E0a731c229"
  };

  const deploymentsDir = path.join(process.cwd(), "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    `${JSON.stringify(deployment, null, 2)}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

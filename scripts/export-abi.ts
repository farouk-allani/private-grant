import fs from "node:fs";
import path from "node:path";
import hre from "hardhat";

async function main() {
  await hre.run("compile");
  const vault = await hre.artifacts.readArtifact("PrivateGrantVault");
  const wrapper = await hre.artifacts.readArtifact("NoxERC20ConfidentialWrapper");
  const token = await hre.artifacts.readArtifact("PrivateGrantTestToken");

  const outDir = path.join(process.cwd(), "src", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "contract-abis.ts"),
    [
      "export const generatedPrivateGrantVaultAbi = ",
      JSON.stringify(vault.abi, null, 2),
      " as const;\n",
      "export const generatedNoxWrapperAbi = ",
      JSON.stringify(wrapper.abi, null, 2),
      " as const;\n",
      "export const generatedTestTokenAbi = ",
      JSON.stringify(token.abi, null, 2),
      " as const;\n"
    ].join("")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

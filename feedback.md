# iExec Nox Developer Feedback

## What was easy

- The package names are clear once discovered: `@iexec-nox/nox-protocol-contracts`, `@iexec-nox/nox-confidential-contracts`, and `@iexec-nox/handle`.
- The ERC-7984 interfaces are readable and make it clear which functions accept `externalEuint256` plus proof versus an already-authorized `euint256`.
- The Handle SDK README gives enough information to encrypt inputs and decrypt handles with viem or ethers.
- Arbitrum Sepolia defaults are built into the Handle SDK, including gateway, NoxCompute, and subgraph configuration.

## What was hard

- The proof ownership/application-contract flow is subtle. For a coordinator contract like PrivateGrantVault, the amount must be encrypted for the coordinator and converted with `Nox.fromExternal` before calling the confidential token `euint256` overload.
- The wrapper flow is not shown as a complete app example. It took package inspection to confirm `ERC20ToERC7984Wrapper.wrap(to, amount)` and the concrete wrapper constructor pattern.
- ACL/viewer APIs currently expose grant and read operations, but no obvious revoke operation.
- The package README mentions Node.js 24 and Hardhat 3, while this MVP compiled successfully on Node 22 with Hardhat 2. Clearer compatibility notes would help hackathon teams.

## Docs and tooling gaps

- A full "confidential ERC-20 wrapper + confidential payout" tutorial would reduce integration risk.
- Examples should include a coordinator contract that calls `Nox.fromExternal` and then invokes ERC-7984 with `euint256`.
- The docs should explicitly state what remains public during wrap/shield operations.
- A table of deployed NoxCompute addresses and supported chains would be helpful.
- A viewer revocation roadmap or current limitation note would prevent apps from overpromising selective disclosure behavior.

## ERC-7984/Nox compatibility notes

This project intentionally avoided OpenZeppelin confidential contracts and Zama FHE because the challenge requires the iExec/Nox TEE-based implementation. The Solidity imports come only from the official `@iexec-nox` packages for confidential-token and Nox protocol behavior.

## Suggestions for the iExec team

- Publish a minimal ERC-7984 wrapper deployment script for Arbitrum Sepolia.
- Add a reference dApp showing viem + wagmi + `@iexec-nox/handle`.
- Document the proof binding between `owner`, `applicationContract`, and the contract that calls `NoxCompute.validateInputProof`.
- Add examples for auditor/viewer disclosure and clarify whether viewer revocation is planned.

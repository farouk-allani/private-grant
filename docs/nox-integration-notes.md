# Nox Integration Notes

PrivateGrant Vault intentionally uses the iExec Nox TEE-backed packages:

- `@iexec-nox/nox-protocol-contracts@0.2.2`
- `@iexec-nox/nox-confidential-contracts@0.1.0`
- `@iexec-nox/handle@0.1.0-beta.10`

It does not import OpenZeppelin confidential contracts and does not use Zama FHE.

## Verified API Surface

The current Nox confidential token package exposes:

- `IERC7984.confidentialTransfer(to, externalEuint256, bytes)`
- `IERC7984.confidentialTransfer(to, euint256)`
- `IERC7984.confidentialTransferFrom(from, to, externalEuint256, bytes)`
- `IERC7984.confidentialTransferFrom(from, to, euint256)`
- `IERC7984.confidentialBalanceOf(account) returns (euint256)`
- `IERC7984.setOperator(operator, until)`
- `IERC20ToERC7984Wrapper.wrap(to, amount)`
- `IERC20ToERC7984Wrapper.unwrap(...)`

The Handle SDK exposes:

- `createViemHandleClient(walletClient)`
- `createEthersHandleClient(signer)`
- `encryptInput(value, "uint256", applicationContract)`
- `decrypt(handle)`
- `publicDecrypt(handle)`
- `viewACL(handle)`

Built-in Handle SDK defaults include Arbitrum Sepolia chain id `421614` and NoxCompute address `0xd464B198f06756a1d00be223634b85E0a731c229`.

## Payout Flow

The vault cannot pass a user-encrypted external handle directly into the token's `externalEuint256` overload, because inside the token the proof owner would be the vault, not the sponsor EOA.

The implemented flow is:

1. Sponsor encrypts the payout amount using `@iexec-nox/handle`.
2. The encryption `applicationContract` is `PrivateGrantVault`.
3. Sponsor calls `PrivateGrantVault.sendConfidentialPayout(...)`.
4. The vault calls `Nox.fromExternal(encryptedAmount, proof)`.
5. That validation grants the vault transient access to the `euint256` handle.
6. The vault grants the confidential token transient access to the amount handle for its internal
   balance math.
7. The vault calls `IERC7984.confidentialTransferFrom(sponsor, recipient, euint256Amount)`.
8. The sponsor must have called `setOperator(vault, until)` on the confidential token.
9. The vault emits only recipient and encrypted handle metadata, never the plaintext private payout amount.

## Shielding Flow

`shieldCampaignFunds` pulls public ERC-20 funds from the sponsor and calls the official Nox wrapper:

```solidity
IERC20ToERC7984Wrapper(confidentialToken).wrap(msg.sender, amount)
```

The shield amount is public because the ERC-20 transfer and wrapper mint are public funding operations. Individual payout amounts remain confidential.

## ACL Notes

The inspected Nox SDK exposes `addViewer` and `isViewer`; it does not expose a viewer removal method in the current package. PrivateGrant Vault therefore:

- Grants auditor viewer access for vault-routed payout handles.
- Records app-level auditor revocation for future grants.
- Documents that already-granted Nox viewer access cannot currently be removed by this package.

## Network Notes

The Nox Solidity SDK currently resolves Arbitrum Sepolia and local dev chains. Arbitrum mainnet support is marked as not deployed in the package SDK, so the MVP targets Arbitrum Sepolia first.

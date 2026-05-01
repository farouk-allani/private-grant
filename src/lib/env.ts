import { isAddress, type Address } from "viem";

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
export const ARBITRUM_SEPOLIA_RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";

export function optionalAddress(value?: string): Address | undefined {
  return value && isAddress(value) ? value : undefined;
}

export const env = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || ARBITRUM_SEPOLIA_CHAIN_ID),
  arbitrumSepoliaRpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL_ARBITRUM_SEPOLIA || ARBITRUM_SEPOLIA_RPC_URL,
  vaultAddress: optionalAddress(process.env.NEXT_PUBLIC_PRIVATE_GRANT_VAULT_ADDRESS),
  defaultErc20: optionalAddress(process.env.NEXT_PUBLIC_DEFAULT_ERC20_ADDRESS),
  defaultConfidentialToken: optionalAddress(
    process.env.NEXT_PUBLIC_DEFAULT_CONFIDENTIAL_TOKEN_ADDRESS
  ),
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""
};

"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton() {
  return <ConnectButton chainStatus="icon" accountStatus="address" showBalance={false} />;
}

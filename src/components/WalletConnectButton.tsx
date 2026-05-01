"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const connected = mounted && account && chain;

        return (
          <div
            aria-hidden={!mounted}
            className={!mounted ? "pointer-events-none opacity-0" : undefined}
          >
            {!connected ? (
              <button
                type="button"
                onClick={openConnectModal}
                className="inline-flex h-11 items-center justify-center rounded-[28px] border border-muted-dark bg-ink px-5 text-xs font-black uppercase tracking-[0.08em] text-primary transition hover:bg-charcoal"
              >
                Connect wallet
              </button>
            ) : chain.unsupported ? (
              <button
                type="button"
                onClick={openChainModal}
                className="inline-flex h-11 items-center justify-center rounded-[28px] border-b-4 border-red-900/40 bg-danger px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition active:translate-y-[2px] active:border-b-2"
              >
                Wrong network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openChainModal}
                  className="hidden h-11 items-center rounded-full border border-border bg-surface px-4 font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-primary-deep transition hover:border-primary sm:inline-flex"
                >
                  {chain.name}
                </button>
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="inline-flex h-11 items-center justify-center rounded-[28px] border border-muted-dark bg-ink px-5 text-xs font-black uppercase tracking-[0.08em] text-primary transition hover:bg-charcoal"
                >
                  {account.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

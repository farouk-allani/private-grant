"use client";

import { motion } from "framer-motion";
import { Eye, FileCheck2, ShieldCheck, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const nodes = [
  {
    icon: WalletCards,
    label: "Sponsor",
    value: "0x74B2...19AC",
    meta: "Funds campaign"
  },
  {
    icon: ShieldCheck,
    label: "Nox vault",
    value: "Amount encrypted",
    meta: "TEE handle"
  },
  {
    icon: Users,
    label: "Recipients",
    value: "5 private payouts",
    meta: "Private balances"
  }
];

export function LandingVaultVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-[32px] border border-muted-dark bg-ink p-3 shadow-[0_24px_70px_rgba(17,16,11,0.3)] sm:max-w-[600px] lg:justify-self-end">
      <div className="absolute inset-0 dark-grid opacity-70" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/18 to-transparent" />
      <div className="relative overflow-hidden rounded-[24px] border border-muted-dark bg-[#0C0B08] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted-dark pb-3">
          <div>
            <p className="technical-label text-primary">Live vault route</p>
            <h3 className="mt-2 text-xl font-black uppercase leading-none text-[#FFFDF3] sm:text-2xl">
              Encrypted payout flow
            </h3>
          </div>
          <Badge variant="secondary">Arbitrum Sepolia</Badge>
        </div>

        <div className="relative mt-4 rounded-[24px] border border-muted-dark bg-ink/70 p-3 shadow-insetVault">
          <div className="absolute left-[17%] right-[17%] top-1/2 hidden h-0.5 -translate-y-1/2 bg-primary/20 sm:block" />
          <motion.div
            className="absolute top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_rgba(255,216,0,0.85)] sm:block"
            initial={{ left: "17%", opacity: 0.5 }}
            animate={{ left: ["17%", "50%", "83%"], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative grid gap-3 sm:grid-cols-3">
            {nodes.map((node) => (
              <div
                key={node.label}
                className="min-w-0 rounded-[18px] border border-muted-dark bg-charcoal/95 p-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <node.icon className="h-5 w-5" />
                </span>
                <p className="technical-label mt-4 text-dark-muted">{node.label}</p>
                <p className="mt-1 text-sm font-black text-[#FFFDF3]">{node.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary/80">
                  {node.meta}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-[20px] border border-primary/20 bg-primary/10 p-3">
            <div className="flex items-center gap-2 text-primary">
              <FileCheck2 className="h-4 w-4" />
              <p className="technical-label">Encrypted handles</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[".... RLC", ".... USDC", "handle 0x8f...21", "proof TEE"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-primary/25 bg-[#080806]/70 px-3 py-2 text-center font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-muted-dark bg-[#080806]/90 p-3">
            <div className="flex items-center gap-2 text-primary">
              <Eye className="h-4 w-4" />
              <p className="technical-label">Observer sees</p>
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs text-dark-muted">
              <p>tx 0x9a2c...f31e</p>
              <p>campaign #04</p>
              <p>amount: encrypted</p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2">
              <p className="technical-label text-primary">Auditor view</p>
              <Badge variant="warning" className="h-6 px-2 text-[0.58rem]">
                Limited
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

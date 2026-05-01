"use client";

import { motion } from "framer-motion";
import { Eye, FileCheck2, Shield, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const nodes = [
  {
    icon: WalletCards,
    label: "Sponsor wallet",
    value: "0x74B2...19AC",
    className: "left-5 top-8 md:left-8"
  },
  {
    icon: Shield,
    label: "Confidential token",
    value: "•••• RLC handle",
    className: "right-5 top-28 md:right-8"
  },
  {
    icon: Users,
    label: "Recipients",
    value: "5 private payouts",
    className: "bottom-10 right-5 md:right-8"
  },
  {
    icon: FileCheck2,
    label: "Auditor view",
    value: "Proof without leakage",
    className: "bottom-8 left-5 md:left-8"
  }
];

export function LandingVaultVisual() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-muted-dark bg-ink p-4 shadow-[0_24px_80px_rgba(17,16,11,0.34)]">
      <div className="absolute inset-0 dark-grid opacity-70" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent" />
      <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-muted-dark bg-[#0C0B08] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted-dark pb-4">
          <div>
            <p className="technical-label text-primary">Live vault route</p>
            <h3 className="mt-2 text-2xl font-black uppercase leading-none text-[#FFFDF3]">
              Encrypted payout flow
            </h3>
          </div>
          <Badge variant="secondary">Arbitrum Sepolia</Badge>
        </div>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 680 520" aria-hidden="true">
          <path
            d="M130 108 C250 108 230 230 340 230 C455 230 430 368 555 382"
            stroke="rgba(255,216,0,0.18)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M340 230 C250 310 190 365 122 407"
            stroke="rgba(255,216,0,0.18)"
            strokeWidth="3"
            fill="none"
          />
          <motion.path
            d="M130 108 C250 108 230 230 340 230 C455 230 430 368 555 382"
            stroke="#FFD800"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="18 18"
            initial={{ strokeDashoffset: 80, opacity: 0.55 }}
            animate={{ strokeDashoffset: 0, opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M340 230 C250 310 190 365 122 407"
            stroke="#FFD800"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="10 16"
            initial={{ strokeDashoffset: 60, opacity: 0.35 }}
            animate={{ strokeDashoffset: 0, opacity: [0.3, 0.75, 0.3] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {nodes.map((node, index) => (
          <motion.div
            key={node.label}
            className={`absolute w-[min(250px,calc(100%-40px))] rounded-2xl border border-muted-dark bg-charcoal/95 p-4 shadow-insetVault ${node.className}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.55 }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <node.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="technical-label text-dark-muted">{node.label}</p>
                <p className="mt-1 text-sm font-black text-[#FFFDF3]">{node.value}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="absolute left-1/2 top-[42%] flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/35 bg-primary/10"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-primary bg-ink">
            <div className="h-11 w-8 bg-primary [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          </div>
        </motion.div>

        <motion.div
          className="absolute right-8 top-56 hidden w-56 rounded-2xl border border-primary/20 bg-[#080806]/90 p-4 md:block"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
        >
          <div className="flex items-center gap-2 text-primary">
            <Eye className="h-4 w-4" />
            <p className="technical-label">Observer sees</p>
          </div>
          <div className="mt-4 space-y-2 font-mono text-xs text-dark-muted">
            <p>tx 0x9a2c...f31e</p>
            <p>campaign #04</p>
            <p>amount: encrypted</p>
          </div>
        </motion.div>

        <div className="absolute left-1/2 top-[70%] grid w-[min(420px,calc(100%-40px))] -translate-x-1/2 gap-2 sm:grid-cols-2">
          {["•••• RLC", "•••• USDC", "handle: 0x8f...21", "proof: TEE"].map((item) => (
            <div
              key={item}
              className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-center font-mono text-xs font-extrabold uppercase tracking-[0.12em] text-primary"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

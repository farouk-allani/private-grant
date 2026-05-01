import Link from "next/link";
import { ArrowRight, EyeOff, ShieldCheck, Trophy, WalletCards } from "lucide-react";
import { ConfidentialBadge } from "@/components/ConfidentialBadge";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
  {
    icon: Trophy,
    title: "Grant and bounty payouts",
    text: "Public campaigns remain auditable while individual builder rewards stay confidential."
  },
  {
    icon: WalletCards,
    title: "DAO payroll",
    text: "Teams can settle contributors without publishing compensation strategy to competitors."
  },
  {
    icon: EyeOff,
    title: "Selective disclosure",
    text: "Auditors can be granted Nox viewer access when confidential handles need review."
  }
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-vault-grid grid-field opacity-25" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-12 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <ConfidentialBadge />
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
              PrivateGrant Vault
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Confidential grant, bounty, and payroll payouts powered by iExec Nox Confidential
              Tokens. Sponsors can shield ERC-20 funds and send private ERC-7984 payouts while
              campaign funding and settlement remain auditable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-slate-950 transition hover:bg-primary/90"
              >
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Link>
              <WalletConnectButton />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <Card key={item.title} className="bg-surface/72">
                <CardHeader>
                  <item.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted">{item.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why privacy matters
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Transparent payout rails leak compensation, reward strategy, and contributor leverage.
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-muted">
            <p>
              PrivateGrant Vault keeps campaign metadata public for judges, communities, and DAO
              accounting, while payout amounts are represented by Nox encrypted handles rather than
              plaintext values in the vault.
            </p>
            <p>
              The MVP uses the iExec Nox TEE-based ERC-7984 implementation from @iexec-nox packages,
              not the OpenZeppelin/Zama FHE confidential contracts.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

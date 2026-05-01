import Link from "next/link";
import {
  BrainCircuit,
  CircleDot,
  FileSearch,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { NetworkGuard } from "@/components/NetworkGuard";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { LogoMark } from "@/components/brand/LogoMark";

const appNav = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/create", label: "Create", icon: PlusCircle },
  { href: "/app/recipient", label: "Recipient", icon: UserRound },
  { href: "/app/auditor", label: "Auditor", icon: FileSearch },
  { href: "/app/ai-review", label: "AI Review", icon: BrainCircuit }
] as const;

export function AppShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="h-fit rounded-[36px] border border-muted-dark bg-ink p-4 text-[#FFFDF3] shadow-[0_24px_80px_rgba(17,16,11,0.18)] lg:sticky lg:top-28">
        <div className="dark-grid rounded-[28px] border border-muted-dark bg-charcoal p-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="technical-label text-primary">Vault command</p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.06em]">Nox payout OS</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-muted-dark bg-ink/70 px-3 py-3 text-xs font-black uppercase tracking-[0.08em] text-dark-muted transition hover:border-primary/50 hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <CircleDot className="h-4 w-4 animate-pulse" />
              <p className="technical-label">Real chain mode</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-dark-muted">
              Campaigns, payout refs, and balances are read from the deployed vault. Empty means no
              matching on-chain data.
            </p>
          </div>
        </div>
      </aside>

      <section className="grid min-w-0 gap-6">
        <div className="rounded-[36px] border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(17,16,11,0.08)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary-deep" />
                <p className="technical-label text-primary-deep">iExec Nox Confidential Tokens</p>
              </div>
              <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-ink md:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">{description}</p>
            </div>
            <div className="sm:hidden md:block">
              <WalletConnectButton />
            </div>
          </div>
        </div>
        <NetworkGuard />
        {children}
      </section>
    </main>
  );
}

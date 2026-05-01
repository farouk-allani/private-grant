import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Binary,
  BriefcaseBusiness,
  CircleDollarSign,
  EyeOff,
  FileSearch,
  GitBranch,
  LockKeyhole,
  Route,
  ShieldCheck,
  Trophy,
  Users,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LandingVaultVisual } from "@/components/LandingVaultVisual";
import { Badge } from "@/components/ui/badge";

const problemCards = [
  {
    title: "Bounty hunters see everyone's rewards",
    text: "Plaintext payouts turn reward sizing into a public negotiation table."
  },
  {
    title: "Competitors infer team priorities",
    text: "Grant amounts expose which protocols, teams, and markets matter most."
  },
  {
    title: "Payroll exposes relationships",
    text: "Contributor payments can reveal sensitive role, seniority, and vendor data."
  },
  {
    title: "DAO treasuries need proof",
    text: "Teams still need settlement records without broadcasting every private amount."
  }
];

const solutionSteps = [
  ["01", "Fund campaign", "Sponsors publish grant, bounty, or payroll metadata with a public budget."],
  ["02", "Shield ERC-20", "Approved tokens are wrapped into the campaign's Nox Confidential Token."],
  ["03", "Send privately", "Payout amounts become encrypted handles before the vault records settlement."],
  ["04", "Audit selectively", "Observers see activity; authorized parties can inspect supported handles."]
];

const demoPanels = [
  ["Create Campaign", "Public brief, token address, category, deadline, optional auditor."],
  ["Shield Funds", "ERC-20 approval moves into a Nox confidential wrapper."],
  ["Send Confidential Payout", "Recipient and memo are public; amount is encrypted."],
  ["Recipient Balance", "Wallet signature decrypts handles only when access allows."],
  ["Auditor Access", "Sponsors grant viewer context without making amounts global."]
];

const useCases: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Trophy, title: "Hackathon rewards", text: "Reward builders without revealing every prize split." },
  {
    icon: Users,
    title: "DAO contributor payments",
    text: "Keep contributor compensation private while settlement remains visible."
  },
  {
    icon: WalletCards,
    title: "Private grants",
    text: "Fund ecosystem work without publishing sensitive allocation strategy."
  },
  {
    icon: BriefcaseBusiness,
    title: "Web3 payroll",
    text: "Move recurring contributor payouts through confidential rails."
  },
  {
    icon: CircleDollarSign,
    title: "Ecosystem incentives",
    text: "Run partner and growth incentives with less information leakage."
  },
  { icon: FileSearch, title: "RWA pilots", text: "Test private allocation flows with auditable public anchors." }
];

const technicalItems = [
  "Nox Confidential Token",
  "TEE-backed confidential execution",
  "ERC-7984 compatibility",
  "Arbitrum Sepolia deployment",
  "ChainGPT AI review assistant",
  "No mocked blockchain data"
];

const architectureItems: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: GitBranch,
    title: "PrivateGrantVault",
    text: "Campaign metadata, payout refs, auditor records"
  },
  {
    icon: LockKeyhole,
    title: "Nox ERC-7984 wrapper",
    text: "Confidential balances and encrypted uint256 handles"
  },
  {
    icon: Binary,
    title: "TEE handle flow",
    text: "Wallet SDK encrypts amount before settlement transaction"
  },
  {
    icon: BadgeCheck,
    title: "Arbiscan audit trail",
    text: "Observers verify that settlement activity happened"
  },
  {
    icon: Route,
    title: "ChainGPT review",
    text: "Optional submission review; never required for payout execution"
  }
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-vault-grid opacity-60" />
        <div className="noise-field absolute inset-0" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div>
            <Badge variant="secondary">Nox Confidential Token dApp</Badge>
            <h1 className="mt-7 max-w-4xl text-[2.75rem] font-black uppercase leading-[0.92] text-ink sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
              Private payouts for serious Web3 teams
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Create grant, bounty, and payroll campaigns where payout amounts and balances stay
              confidential while settlement remains auditable on Arbitrum Sepolia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[28px] border-b-4 border-primary-deep bg-primary px-7 text-xs font-black uppercase tracking-[0.08em] text-ink shadow-glow transition-all hover:bg-primary-hover active:translate-y-[2px] active:border-b-2"
              >
                Launch Vault
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[28px] border-2 border-ink px-7 text-xs font-black uppercase tracking-[0.08em] text-ink transition hover:bg-ink hover:text-primary"
              >
                View Demo Flow
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Nox TEE-backed", "ERC-7984 compatible", "Arbitrum Sepolia", "No mock data"].map(
                (item) => (
                  <Badge key={item}>{item}</Badge>
                )
              )}
            </div>
          </div>
          <LandingVaultVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="technical-label text-primary-deep">The payout problem</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-ink md:text-6xl">
            Public payouts leak strategy
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {problemCards.map((card, index) => (
            <div
              key={card.title}
              className="group rounded-[28px] border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(17,16,11,0.07)] transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="font-mono text-xs font-black text-primary-deep">0{index + 1}</p>
              <h3 className="mt-6 text-2xl font-black leading-tight text-ink">{card.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <p className="technical-label text-primary-deep">Private rail, public anchor</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-ink md:text-6xl">
              Shield the amount. Keep the proof.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              PrivateGrant Vault keeps the campaign and settlement trail visible while Nox handles
              remove plaintext payout amounts from the public surface.
            </p>
          </div>
          <div className="grid gap-4">
            {solutionSteps.map(([number, title, text]) => (
              <div key={number} className="grid gap-4 rounded-[28px] border border-border bg-background p-5 sm:grid-cols-[76px_1fr]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 border-primary-deep bg-primary font-mono text-xl font-black text-ink">
                  {number}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-ink px-4 py-20 text-[#FFFDF3] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="technical-label text-primary">Product demo</p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] md:text-6xl">
                Inside the confidential vault
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-dark-muted">
              The live app routes map to this flow: create a campaign, shield funds, send
              confidential payouts, let recipients decrypt balances, and grant auditors limited
              review access where supported.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {demoPanels.map(([title, text], index) => (
              <div key={title} className="rounded-[28px] border border-muted-dark bg-charcoal p-5 shadow-insetVault">
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-black text-ink">
                    {index + 1}
                  </span>
                  <Badge variant={index === 2 ? "primary" : "secondary"}>{index === 2 ? "Live Tx" : "Nox"}</Badge>
                </div>
                <h3 className="text-xl font-black text-[#FFFDF3]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-dark-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="technical-label text-primary-deep">Where it fits</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-ink md:text-6xl">
              Private rewards for public ecosystems
            </h2>
          </div>
          <Badge variant="primary">Builder-focused</Badge>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[28px] border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary">
              <Icon className="h-7 w-7 text-primary-deep" />
              <h3 className="mt-6 text-2xl font-black text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-soft px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="technical-label text-primary-deep">Technical spine</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-ink md:text-6xl">
              Built on Nox, not fake privacy
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              The interface reads deployed vault state, contract events, and Nox handles. Empty
              states stay honest when the chain has nothing to show.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {technicalItems.map((item) => (
                <Badge key={item} variant={item === "No mocked blockchain data" ? "primary" : "default"}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[36px] border border-muted-dark bg-ink p-6 text-[#FFFDF3] shadow-[0_24px_80px_rgba(17,16,11,0.24)]">
            <div className="dark-grid rounded-[28px] border border-muted-dark bg-charcoal p-5">
              <div className="grid gap-4">
                {architectureItems.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="grid gap-4 rounded-2xl border border-muted-dark bg-ink/80 p-4 sm:grid-cols-[44px_1fr]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="technical-label text-primary">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-dark-muted">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[36px] border border-muted-dark bg-ink p-8 text-[#FFFDF3] shadow-[0_24px_80px_rgba(17,16,11,0.22)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="technical-label text-primary">Ready for a real campaign?</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none md:text-5xl">
              Ready to launch a private campaign?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-dark-muted">
              Your campaign is public. Your payouts do not have to be.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[28px] border-b-4 border-primary-deep bg-primary px-7 text-xs font-black uppercase tracking-[0.08em] text-ink shadow-glow transition-all hover:bg-primary-hover active:translate-y-[2px] active:border-b-2"
          >
            Open App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "PrivateGrant Vault",
  description:
    "Confidential grant, bounty, and payroll payouts powered by iExec Nox Confidential Tokens.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/app-icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="vault-shell min-h-screen antialiased">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-border bg-[rgba(250,247,234,0.82)] backdrop-blur-[10px]">
            <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
              <LogoWordmark />
              <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/70 p-1 text-[0.72rem] font-black uppercase tracking-[0.08em] text-ink shadow-[0_10px_40px_rgba(17,16,11,0.06)] lg:flex">
                <Link className="rounded-full px-4 py-2 transition hover:bg-primary-pale hover:text-primary-deep" href="/app">
                  Dashboard
                </Link>
                <Link className="rounded-full px-4 py-2 transition hover:bg-primary-pale hover:text-primary-deep" href="/app/create">
                  Create
                </Link>
                <Link className="rounded-full px-4 py-2 transition hover:bg-primary-pale hover:text-primary-deep" href="/app/recipient">
                  Recipient
                </Link>
                <Link className="rounded-full px-4 py-2 transition hover:bg-primary-pale hover:text-primary-deep" href="/app/auditor">
                  Auditor
                </Link>
                <Link className="rounded-full px-4 py-2 transition hover:bg-primary-pale hover:text-primary-deep" href="/app/ai-review">
                  AI Review
                </Link>
              </nav>
              <div className="hidden sm:block">
                <WalletConnectButton />
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-muted sm:px-6 lg:hidden">
              <Link className="shrink-0 rounded-full border border-border bg-surface px-3 py-2" href="/app">
                Dashboard
              </Link>
              <Link className="shrink-0 rounded-full border border-border bg-surface px-3 py-2" href="/app/create">
                Create
              </Link>
              <Link className="shrink-0 rounded-full border border-border bg-surface px-3 py-2" href="/app/recipient">
                Recipient
              </Link>
              <Link className="shrink-0 rounded-full border border-border bg-surface px-3 py-2" href="/app/auditor">
                Auditor
              </Link>
              <Link className="shrink-0 rounded-full border border-border bg-surface px-3 py-2" href="/app/ai-review">
                AI Review
              </Link>
            </nav>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}

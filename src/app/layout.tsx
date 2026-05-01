import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrivateGrant Vault",
  description:
    "Confidential grant, bounty, and payroll payouts powered by iExec Nox Confidential Tokens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="vault-shell min-h-screen antialiased">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-white/10 bg-background/78 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2 font-semibold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span>PrivateGrant Vault</span>
              </Link>
              <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
                <Link className="transition hover:text-white" href="/app">
                  Dashboard
                </Link>
                <Link className="transition hover:text-white" href="/app/create">
                  Create
                </Link>
                <Link className="transition hover:text-white" href="/app/recipient">
                  Recipient
                </Link>
                <Link className="transition hover:text-white" href="/app/auditor">
                  Auditor
                </Link>
                <Link className="transition hover:text-white" href="/app/ai-review">
                  AI Review
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import { NetworkGuard } from "@/components/NetworkGuard";
import { WalletConnectButton } from "@/components/WalletConnectButton";

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
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            iExec Nox Confidential Tokens
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">{description}</p>
        </div>
        <WalletConnectButton />
      </div>
      <NetworkGuard />
      {children}
    </main>
  );
}

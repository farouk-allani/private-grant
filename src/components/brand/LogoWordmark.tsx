import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

export function LogoWordmark({
  href = "/",
  className
}: {
  href?: "/" | null;
  className?: string;
}) {
  const content = (
    <>
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="flex items-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-[0.06em] text-ink">
        <span>PrivateGrant</span>
        <span className="rounded-full bg-ink px-2.5 py-1 text-[0.68rem] text-primary">Vault</span>
      </span>
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center gap-3", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-3", className)} aria-label="PrivateGrant Vault home">
      {content}
    </Link>
  );
}

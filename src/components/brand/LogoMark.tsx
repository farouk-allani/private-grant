import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-10 w-10", className)}
      viewBox="0 0 64 64"
      role="img"
      aria-label="PrivateGrant Vault logo mark"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="18" fill="#11100B" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="16.5" stroke="#FFD800" strokeOpacity="0.22" strokeWidth="3" />
      <path
        d="M20 32C20 25.373 25.373 20 32 20C38.627 20 44 25.373 44 32C44 38.627 38.627 44 32 44C25.373 44 20 38.627 20 32Z"
        stroke="#FFD800"
        strokeWidth="6"
      />
      <path
        d="M12 30H21.5C25 30 27.25 34 31.25 34H42.5C47 34 49.25 38 52 41"
        stroke="#FFD800"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="47.5" cy="37" r="4.5" fill="#FFD800" />
      <path d="M25 26L32 42L39 26H34.75L32 33.5L29.25 26H25Z" fill="#11100B" />
      <path d="M31.5 15H32.5" stroke="#FFD800" strokeWidth="4" strokeLinecap="round" />
      <path d="M31.5 49H32.5" stroke="#FFD800" strokeWidth="4" strokeLinecap="round" />
      <path d="M49 31.5V32.5" stroke="#FFD800" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

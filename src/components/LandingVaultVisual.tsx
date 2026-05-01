import Image from "next/image";
import heroImage from "../../public/hero-image.png";

export function LandingVaultVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[min(calc(100vw-2rem),22rem)] sm:max-w-[600px] lg:justify-self-end">
      <div className="relative overflow-hidden p-2 ">
        <div className="absolute inset-0 dark-grid opacity-50" aria-hidden="true" />
        <div className="relative aspect-[1448/1086] overflow-hidden ">
          <Image
            src={heroImage}
            alt="PrivateGrant vault interface showing confidential payout activity"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 600px, (min-width: 640px) 600px, calc(100vw - 2rem)"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

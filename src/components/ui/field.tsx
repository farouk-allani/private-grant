import * as React from "react";

export function Field({
  label,
  error,
  description,
  children
}: {
  label: string;
  error?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-current">
      <span className="uppercase tracking-[0.06em]">{label}</span>
      {description ? <span className="-mt-1 text-xs font-medium leading-5 opacity-70">{description}</span> : null}
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

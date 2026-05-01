import * as React from "react";

export function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

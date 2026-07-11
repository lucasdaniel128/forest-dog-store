import type { ReactNode } from "react";

interface TrustItemProps {
  icon: ReactNode;
  label: string;
}

export function TrustItem({ icon, label }: TrustItemProps) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-muted-custom">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
        {icon}
      </span>
      <span className="leading-snug">{label}</span>
    </div>
  );
}

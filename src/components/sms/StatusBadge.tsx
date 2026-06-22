import { Check, Clock, X } from "lucide-react";
import type { SmsStatusCode } from "@/lib/types";

const MAP = {
  1: { label: "Teslim Edildi", icon: Check, cls: "bg-success/15 text-success border-success/30" },
  0: { label: "Başarısız", icon: X, cls: "bg-destructive/15 text-destructive border-destructive/30" },
  2: { label: "Bekliyor", icon: Clock, cls: "bg-warning/15 text-warning border-warning/40" },
} as const;

export function StatusBadge({ status }: { status: SmsStatusCode }) {
  const m = MAP[status];
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${m.cls}`}
    >
      <Icon className="h-3 w-3" />
      {m.label}
    </span>
  );
}

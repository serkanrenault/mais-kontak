import { AlertTriangle } from "lucide-react";
import type { SmsMetrics } from "@/lib/sms";

export function CharCounter({ metrics }: { metrics: SmsMetrics }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        {metrics.isUnicode && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 font-medium text-warning">
            <AlertTriangle className="h-3 w-3" /> Türkçe karakter — limit 70
          </span>
        )}
        <span className="text-muted-foreground">
          {metrics.parts} parça · kodlama {metrics.isUnicode ? "UCS-2" : "GSM-7"}
        </span>
      </div>
      <span
        className={`font-mono tabular-nums ${
          metrics.remaining < 10 ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {metrics.count} / {metrics.limit}
      </span>
    </div>
  );
}

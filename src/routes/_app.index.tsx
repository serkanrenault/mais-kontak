import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Activity, CheckCircle2, Clock, Send, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/config/features";
import { MOCK_DAILY_USAGE } from "@/lib/mockData";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [{ title: "Gösterge Paneli — Mais Kontak" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  if (!FEATURES.ENABLE_ANALYTICS_DASHBOARD) return <Navigate to="/send" />;
  const { history } = useStore();
  const total = history.length;
  const delivered = history.filter((h) => h.status === 1).length;
  const failed = history.filter((h) => h.status === 0).length;
  const pending = history.filter((h) => h.status === 2).length;
  const rate = total ? Math.round((delivered / total) * 100) : 0;
  const max = Math.max(...MOCK_DAILY_USAGE.map((d) => d.count));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gösterge Paneli</h1>
        <p className="text-sm text-muted-foreground">Bugünkü gönderim ve performans özeti.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam SMS" value={total.toString()} icon={Send} />
        <StatCard label="Başarı Oranı" value={`%${rate}`} icon={Activity} accent />
        <StatCard label="Teslim Edildi" value={delivered.toString()} icon={CheckCircle2} tone="success" />
        <StatCard label="Başarısız" value={failed.toString()} icon={XCircle} tone="destructive" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Haftalık Gönderim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-56">
            {MOCK_DAILY_USAGE.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${(d.count / max) * 100}%` }}
                    title={`${d.count}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
                <span className="text-xs font-medium tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" /> Bekleyen ({pending})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Şu anda Turatel kuyruğunda {pending} mesaj teslimat onayı bekliyor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
  accent?: boolean;
  tone?: "success" | "destructive";
}) {
  const iconCls = accent
    ? "text-primary"
    : tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Icon className={`h-4 w-4 ${iconCls}`} />
        </div>
        <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

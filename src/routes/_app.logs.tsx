import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Info, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_SYSTEM_LOGS } from "@/lib/mockData";
import type { SystemLog } from "@/lib/types";

export const Route = createFileRoute("/_app/logs")({
  head: () => ({ meta: [{ title: "Sistem Kayıtları — Mais Kontak" }] }),
  component: LogsPage,
});

function levelBadge(level: SystemLog["level"]) {
  const map = {
    info: { cls: "bg-secondary text-secondary-foreground", icon: Info, label: "Bilgi" },
    warn: { cls: "bg-warning/15 text-warning border border-warning/40", icon: TriangleAlert, label: "Uyarı" },
    error: { cls: "bg-destructive/15 text-destructive border border-destructive/30", icon: AlertCircle, label: "Hata" },
  } as const;
  const m = map[level];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  );
}

function LogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sistem Kayıtları</h1>
        <p className="text-sm text-muted-foreground">
          Yönetici görünümü — uygulama ve Turatel köprüsü olayları.
        </p>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Tarih</TableHead>
                <TableHead className="w-24">Seviye</TableHead>
                <TableHead>Kullanıcı / Servis</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Detay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SYSTEM_LOGS.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">
                    {new Date(l.date).toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell>{levelBadge(l.level)}</TableCell>
                  <TableCell className="font-mono text-xs">{l.actor}</TableCell>
                  <TableCell className="font-medium">{l.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

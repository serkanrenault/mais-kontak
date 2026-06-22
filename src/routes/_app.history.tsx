import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/sms/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "SMS Geçmişi — Mais Kontak" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchQ =
        !q ||
        h.phone.includes(q) ||
        h.agentName.toLowerCase().includes(q.toLowerCase()) ||
        h.message.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || String(h.status) === status;
      return matchQ && matchS;
    });
  }, [history, q, status]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SMS Geçmişi</h1>
        <p className="text-sm text-muted-foreground">
          Tüm gönderim dökümünü görüntüleyin ve filtreleyin.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Numara, ajan veya mesaj ara..."
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="1">Teslim Edildi</SelectItem>
            <SelectItem value="2">Bekliyor</SelectItem>
            <SelectItem value="0">Başarısız</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Tarih</TableHead>
                <TableHead>Ajan</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead className="w-24">Originator</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead className="w-36">Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">
                    {new Date(h.date).toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell>{h.agentName}</TableCell>
                  <TableCell className="font-mono text-xs">{h.phone}</TableCell>
                  <TableCell>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                      {h.originator}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {h.message}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={h.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

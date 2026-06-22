import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Send, Variable } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CharCounter } from "@/components/sms/CharCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FEATURES } from "@/config/features";
import { useAuth } from "@/lib/auth";
import { analyzeSms, extractParams, substituteParams } from "@/lib/sms";
import { useStore } from "@/lib/store";
import type { Brand } from "@/lib/types";

export const Route = createFileRoute("/_app/send")({
  head: () => ({ meta: [{ title: "SMS Gönder — Mais Kontak" }] }),
  component: SendPage,
});

function SendPage() {
  const { user } = useAuth();
  const { templates, addHistory } = useStore();
  const [brand, setBrand] = useState<Brand>("Renault");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [scheduledAt, setScheduledAt] = useState("");
  const [sending, setSending] = useState(false);

  const detectedParams = useMemo(() => extractParams(body), [body]);
  const finalText = useMemo(
    () => (FEATURES.ENABLE_DYNAMIC_TEMPLATES ? substituteParams(body, params) : body),
    [body, params],
  );
  const metrics = useMemo(() => analyzeSms(finalText), [finalText]);

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const t = templates.find((x) => x.id === id);
    if (t) {
      setBody(t.body);
      setBrand(t.brand);
      setParams({});
    }
  };

  const submit = async () => {
    if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) {
      return toast.error("Geçerli bir telefon numarası girin");
    }
    if (!finalText.trim()) return toast.error("Mesaj gövdesi boş olamaz");

    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    addHistory({
      date: new Date().toISOString(),
      agentName: user?.name ?? "Bilinmiyor",
      phone,
      originator: brand,
      message: finalText,
      status: 2,
      scheduledAt: scheduledAt || undefined,
    });
    toast.success(scheduledAt ? "SMS planlandı" : "SMS gönderildi", {
      description: `${metrics.parts} parça · ${brand}`,
    });
    setSending(false);
    setPhone("");
    setBody("");
    setParams({});
    setScheduledAt("");
    setTemplateId("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">SMS Gönder</h1>
          <p className="text-sm text-muted-foreground">
            Marka, alıcı ve mesaj bilgilerini doldurarak gönderim yapın.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gönderim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Marka (Originator)</Label>
                <Select value={brand} onValueChange={(v) => setBrand(v as Brand)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Renault">Renault</SelectItem>
                    <SelectItem value="Dacia">Dacia</SelectItem>
                    <SelectItem value="Alpine">Alpine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Alıcı Numarası</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 532 123 45 67"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Şablon (opsiyonel)</Label>
              <Select value={templateId} onValueChange={applyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Şablon seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      [{t.brand}] {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Mesaj</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Mesajınızı yazın..."
              />
              <CharCounter metrics={metrics} />
            </div>

            {FEATURES.ENABLE_DYNAMIC_TEMPLATES && detectedParams.length > 0 && (
              <div className="grid gap-2 rounded-md border border-border bg-secondary/40 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Variable className="h-4 w-4 text-primary" /> Dinamik Parametreler
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {detectedParams.map((p) => (
                    <div key={p} className="grid gap-1">
                      <Label className="text-xs">{p}</Label>
                      <Input
                        value={params[p] ?? ""}
                        onChange={(e) => setParams({ ...params, [p]: e.target.value })}
                        placeholder={`[##${p}##]`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {FEATURES.ENABLE_SCHEDULED_SMS && (
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" /> İleri Tarihli Gönderim
                  (opsiyonel)
                </Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={submit} disabled={sending} size="lg">
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Gönderiliyor..." : scheduledAt ? "Planla" : "Gönder"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <div className="text-xs text-muted-foreground">
                {brand} · {phone || "alıcı numarası"}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed min-h-24">
                {finalText || (
                  <span className="text-muted-foreground italic">Mesaj önizlemesi burada görünür.</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
                <span>{metrics.parts} parça</span>
                <span className="tabular-nums">
                  {metrics.count}/{metrics.limit}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Karakter Kuralı</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• GSM-7 (standart): 160 karakter / parça</p>
            <p>• UCS-2 (Türkçe Ğ, Ş, ö vb.): 70 karakter / parça</p>
            <p>• Uzun mesajlarda parça başına 153 / 67 karakter kullanılır.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profil — Mais Kontak" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");

  const change = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cur || !next) return toast.error("Tüm alanları doldurun");
    if (next !== conf) return toast.error("Yeni şifreler eşleşmiyor");
    toast.success("Şifre değiştirildi (demo)");
    setCur("");
    setNext("");
    setConf("");
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil ve Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap bilgileriniz ve tercihler.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hesap</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ad Soyad</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">E-posta</span>
            <span className="font-mono text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rol</span>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
              {user?.role}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Açık / Koyu tema geçişi</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={change} className="grid gap-3">
            <div className="grid gap-2">
              <Label>Mevcut Şifre</Label>
              <Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Yeni Şifre</Label>
              <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Yeni Şifre (Tekrar)</Label>
              <Input type="password" value={conf} onChange={(e) => setConf(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" /> Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Çıkış Yap
        </Button>
      </div>
    </div>
  );
}

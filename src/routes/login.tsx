import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import kontakLogo from "@/assets/kontak-logo.png";


export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Giriş — Mais Kontak" },
      { name: "description", content: "Mais Kontak SMS yönetim platformuna giriş yapın." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("agent@renaultmais.com.tr");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("E-posta ve şifre zorunludur");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Hoş geldiniz");
      navigate({ to: "/" });
    } catch {
      toast.error("Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <img
                src={kontakLogo}
                alt="Mais Kontak"
                className="h-16 w-auto object-contain"
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Demo: herhangi bir e-posta ve şifre ile giriş yapabilirsiniz.
              </p>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center mt-6">© OYAK Renault Mais</p>
      </div>
    </div>
  );
}

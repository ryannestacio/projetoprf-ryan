import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { useAuth } from "@/lib/auth";
import prfLogo from "@/assets/prf-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Acesso liberado",
        description: "Autenticacao concluida com sucesso.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: "Confira seu e-mail e senha do Firebase Authentication.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.22),_transparent_28%),linear-gradient(180deg,_hsl(220_33%_12%),_hsl(220_28%_8%))] px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="relative hidden overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_hsl(220_27%_14%/.88),_hsl(220_26%_10%/.96))] p-10 shadow-card backdrop-blur lg:block">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative max-w-lg space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Area restrita de Ryan
              </div>
              <img
                src={prfLogo}
                alt="Logo da PRF"
                className="h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-elevated"
              />
              <h1 className="font-display text-5xl font-black leading-tight text-white">
                Controle tatico pessoal para a sua jornada PRF.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-slate-300">
                Ambiente privado com autenticacao, sincronizacao no Firestore e acesso reservado para o painel de estudo do Ryan.
              </p>
              <div className="grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Planejamento semanal, notas, revisoes e cronometro sincronizados com seguranca.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Sessao protegida por e-mail e senha, com permanencia no navegador apos autenticacao.
                </div>
              </div>
            </div>
          </section>

          <Card className="border-white/10 bg-card/90 shadow-elevated backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-primary">
                  <LockKeyhole className="h-6 w-6" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Login seguro</span>
                </div>
                <img
                  src={prfLogo}
                  alt="Logo da PRF"
                  className="h-14 w-14 rounded-2xl border border-border/60 object-cover shadow-card"
                />
              </div>
              <div className="space-y-1">
                <CardTitle className="font-display text-3xl">Area restrita</CardTitle>
                <p className="font-display text-lg font-semibold text-primary">Ryan</p>
              </div>
              <CardDescription>
                Entre com o usuario criado no Firebase Authentication para acessar seu painel privado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Sua senha"
                    required
                  />
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                  {submitting ? "Entrando..." : "Acessar painel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Login;

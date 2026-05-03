import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, PackageOpen, User, ArrowRight, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/lib/asset-data";
import { cn } from "@/lib/utils";

const roles: { id: Role; title: string; desc: string; Icon: typeof Shield }[] = [
  { id: "admin", title: "Admin", desc: "Full control over assets, teams & ops.", Icon: Shield },
  { id: "allocator", title: "Asset Allocator", desc: "Issue, recall and inventory assets.", Icon: PackageOpen },
  { id: "employee", title: "Employee", desc: "View your assets and request new ones.", Icon: User },
];

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard/${role}`);
  };

  return (
    <main className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />

      <div className="relative container mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 items-center min-h-screen">
        {/* Left: brand panel */}
        <section className="hidden lg:flex flex-col gap-8 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Boxes className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Asset Tracker</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.05]">
              Every asset, <br />
              <span className="text-gradient">accounted for.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              A unified workspace for admins, allocators and employees to manage hardware,
              requests and maintenance — without the spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
            {[
              { k: "1,248", v: "Assets tracked" },
              { k: "98.2%", v: "Utilization" },
              { k: "24h", v: "Avg. allocation" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-4">
                <div className="text-2xl font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: login card */}
        <section className="w-full max-w-md mx-auto lg:ml-auto animate-fade-up">
          <div className="glass rounded-3xl p-8 shadow-elegant">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Boxes className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">Asset Tracker</span>
            </div>

            <h2 className="text-3xl font-semibold mb-1">Welcome back</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose a role to continue.</p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map(({ id, title, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={cn(
                    "group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-xs",
                    role === id
                      ? "border-primary bg-primary/10 text-foreground shadow-glow"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border/80"
                  )}
                >
                  <Icon className={cn("h-5 w-5", role === id && "text-primary")} />
                  <span className="font-medium leading-tight text-center">{title}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-5 px-1">
              {roles.find((r) => r.id === role)?.desc}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 bg-input/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 bg-input/60"
                />
              </div>

              <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 font-semibold shadow-glow">
                Sign in as {roles.find((r) => r.id === role)?.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Demo login — any credentials work.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;

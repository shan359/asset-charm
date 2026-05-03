import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
import { Boxes, LogOut, Search, Bell } from "lucide-react";
import { roleConfig, Role } from "@/lib/asset-data";
import { renderSection } from "@/components/dashboard/sections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  if (!role || !(role in roleConfig)) return <Navigate to="/" replace />;
  const cfg = roleConfig[role as Role];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl min-h-screen sticky top-0">
          <div className="p-6 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Boxes className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold leading-none">Asset Tracker</p>
              <p className="text-xs text-sidebar-foreground mt-1">{cfg.label}</p>
            </div>
          </div>
          <nav className="flex-1 px-3 space-y-0.5">
            {cfg.sections.map((s) => {
              const Icon = (Icons as any)[s.icon] ?? Icons.Circle;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-sidebar-border">
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full justify-start text-sidebar-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-6 py-3.5">
              <div className="flex-1 max-w-md relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search assets, employees, requests..." className="pl-9 bg-secondary/50 border-border/60" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
              <div className="h-9 w-9 rounded-full bg-gradient-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                {cfg.label[0]}
              </div>
            </div>
            {/* Mobile nav */}
            <div className="lg:hidden px-4 pb-3 flex gap-2 overflow-x-auto">
              {cfg.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs whitespace-nowrap border",
                    active === s.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </header>

          <main className="p-6 lg:p-8 space-y-8">
            <div className="animate-fade-up">
              <p className="text-xs uppercase tracking-wider text-primary font-medium mb-2">{cfg.label} Workspace</p>
              <h1 className="text-3xl lg:text-4xl font-semibold">
                {cfg.sections.find((s) => s.id === active)?.label}
              </h1>
              <p className="text-muted-foreground mt-1.5 max-w-2xl">{cfg.tagline}</p>
            </div>

            {renderSection(role as Role, active)}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

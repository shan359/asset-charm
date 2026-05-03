import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const StatCard = ({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "accent" | "muted";
}) => (
  <div className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-transform animate-fade-up">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className="text-3xl font-semibold mt-2">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center",
          tone === "primary" && "bg-primary/15 text-primary",
          tone === "accent" && "bg-accent/15 text-accent",
          tone === "muted" && "bg-secondary text-muted-foreground"
        )}
      >
        {icon}
      </div>
    </div>
  </div>
);

export const Section = ({ title, desc, children, action }: { title: string; desc?: string; children: ReactNode; action?: ReactNode }) => (
  <section className="space-y-4 animate-fade-up">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Available: "bg-primary/15 text-primary",
    Assigned: "bg-accent/15 text-accent",
    Maintenance: "bg-destructive/15 text-destructive",
    Pending: "bg-accent/15 text-accent",
    Approved: "bg-primary/15 text-primary",
    Rejected: "bg-destructive/15 text-destructive",
    "In Progress": "bg-accent/15 text-accent",
    Completed: "bg-primary/15 text-primary",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", map[status] ?? "bg-secondary text-muted-foreground")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};

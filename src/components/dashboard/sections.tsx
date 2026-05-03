import { mockAssets, mockRequests, mockEmployees, mockTasks, Role } from "@/lib/asset-data";
import { StatCard, Section, StatusPill } from "./Primitives";
import { Boxes, Inbox, Users, Wrench, PackageCheck, UserCheck, ListChecks, CheckCircle2, PackagePlus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Table = ({ headers, rows }: { headers: string[]; rows: (string | JSX.Element)[][] }) => (
  <div className="glass rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 border-b border-border">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left font-medium text-muted-foreground px-5 py-3 text-xs uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors">
              {r.map((c, j) => <td key={j} className="px-5 py-3.5">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const assetRows = (filter?: (a: typeof mockAssets[number]) => boolean) =>
  mockAssets.filter(filter ?? (() => true)).map((a) => [
    <span className="font-mono text-xs text-muted-foreground">{a.id}</span>,
    <span className="font-medium">{a.name}</span>,
    a.category,
    a.assignee,
    a.location,
    <StatusPill status={a.status} />,
  ]);

export const renderSection = (role: Role, sectionId: string) => {
  // Overview per role
  if (sectionId === "overview") {
    if (role === "admin") {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Assets" value="1,248" hint="+12 this week" icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="Open Requests" value="23" hint="6 urgent" icon={<Inbox className="h-5 w-5" />} tone="accent" />
            <StatCard label="Employees" value="184" hint="across 9 teams" icon={<Users className="h-5 w-5" />} />
            <StatCard label="In Maintenance" value="14" hint="ETA 3 days" icon={<Wrench className="h-5 w-5" />} tone="accent" />
          </div>
          <Section title="Recent Requests" desc="Latest asset requests across the organization.">
            <Table headers={["ID", "Employee", "Item", "Date", "Status"]} rows={mockRequests.map((r) => [
              <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
            ])} />
          </Section>
        </div>
      );
    }
    if (role === "allocator") {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="All Assets" value="1,248" icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="Requested" value="23" icon={<Inbox className="h-5 w-5" />} tone="accent" />
            <StatCard label="Available" value="412" icon={<PackageCheck className="h-5 w-5" />} />
            <StatCard label="Assigned" value="822" icon={<UserCheck className="h-5 w-5" />} tone="accent" />
          </div>
          <Section title="Allocator Queue" desc="Pending requests waiting for allocation.">
            <Table headers={["ID", "Employee", "Item", "Date", "Status"]} rows={mockRequests.map((r) => [
              <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
            ])} />
          </Section>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <div className="glass rounded-2xl p-6 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground">MR</div>
          <div>
            <h3 className="text-xl font-semibold">Welcome back, Maya</h3>
            <p className="text-sm text-muted-foreground">Product Designer · Design Team · 4 active assets</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Assets Used" value="4" icon={<Boxes className="h-5 w-5" />} />
          <StatCard label="In Maintenance" value="1" icon={<Wrench className="h-5 w-5" />} tone="accent" />
          <StatCard label="Open Tasks" value="3" icon={<ListChecks className="h-5 w-5" />} tone="accent" />
          <StatCard label="Completed" value="27" icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>
        <Section title="Your Tasks">
          <Table headers={["ID", "Task", "Due", "Status"]} rows={mockTasks.slice(0, 4).map((t) => [
            <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.due, <StatusPill status={t.status} />,
          ])} />
        </Section>
      </div>
    );
  }

  // Shared sections
  if (sectionId === "all-assets") return <Section title="All Assets" desc="Complete inventory across locations."><Table headers={["ID", "Name", "Category", "Assignee", "Location", "Status"]} rows={assetRows()} /></Section>;
  if (sectionId === "requests" || sectionId === "requested")
    return <Section title="Asset Requests" desc="Review pending and recent requests.">
      <Table headers={["ID", "Employee", "Item", "Date", "Status"]} rows={mockRequests.map((r) => [
        <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
      ])} />
    </Section>;
  if (sectionId === "employees")
    return <Section title="Employees" desc="People and their assigned hardware.">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockEmployees.map((e) => (
          <div key={e.id} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-accent flex items-center justify-center font-semibold text-accent-foreground">{e.name.split(" ").map(n => n[0]).join("")}</div>
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.role} · {e.dept}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Assets</span>
              <span className="font-semibold">{e.assets}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>;
  if (sectionId === "assigned" || sectionId === "used")
    return <Section title={sectionId === "used" ? "Assets Used" : "Assigned Assets"}><Table headers={["ID", "Name", "Category", "Assignee", "Location", "Status"]} rows={assetRows((a) => a.status === "Assigned")} /></Section>;
  if (sectionId === "available" || sectionId === "remaining")
    return <Section title={sectionId === "remaining" ? "Remaining Assets" : "Available Assets"}><Table headers={["ID", "Name", "Category", "Assignee", "Location", "Status"]} rows={assetRows((a) => a.status === "Available")} /></Section>;
  if (sectionId === "maintenance")
    return <Section title="Maintenance" desc="Assets currently being serviced."><Table headers={["ID", "Name", "Category", "Assignee", "Location", "Status"]} rows={assetRows((a) => a.status === "Maintenance")} /></Section>;
  if (sectionId === "tasks-assigned")
    return <Section title="Assigned Tasks"><Table headers={["ID", "Task", "Assignee", "Due", "Status"]} rows={mockTasks.filter(t => t.status !== "Completed").map((t) => [
      <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.assignee, t.due, <StatusPill status={t.status} />,
    ])} /></Section>;
  if (sectionId === "tasks-completed")
    return <Section title="Completed Tasks"><Table headers={["ID", "Task", "Assignee", "Due", "Status"]} rows={mockTasks.filter(t => t.status === "Completed").map((t) => [
      <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.assignee, t.due, <StatusPill status={t.status} />,
    ])} /></Section>;

  if (sectionId === "profile")
    return <Section title="My Details">
      <div className="glass rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-5 pb-6 border-b border-border">
          <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl font-semibold text-primary-foreground">MR</div>
          <div>
            <h3 className="text-2xl font-semibold">Maya Rao</h3>
            <p className="text-muted-foreground">Product Designer · Design Team</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-6 mt-6 text-sm">
          {[["Employee ID", "EMP-01"], ["Email", "maya.rao@company.com"], ["Location", "Bangalore HQ"], ["Joined", "Mar 2022"], ["Manager", "Aditya Singh"], ["Phone", "+91 98XXX XXXXX"]].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>;

  if (sectionId === "add")
    return <Section title="Add Asset" desc="Register a new asset into inventory.">
      <form className="glass rounded-2xl p-6 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Asset Name</Label><Input placeholder='MacBook Pro 16" M3' /></div>
          <div className="space-y-2"><Label>Category</Label><Input placeholder="Laptop" /></div>
          <div className="space-y-2"><Label>Serial Number</Label><Input placeholder="C02XXXXXXXXX" /></div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="Bangalore HQ" /></div>
        </div>
        <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Condition, accessories, etc." /></div>
        <Button type="button" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><PackagePlus className="h-4 w-4 mr-2" />Add Asset</Button>
      </form>
    </Section>;

  if (sectionId === "delete")
    return <Section title="Delete Asset" desc="Remove an asset from inventory.">
      <Table headers={["ID", "Name", "Category", "Status", ""]} rows={mockAssets.slice(0, 6).map((a) => [
        <span className="font-mono text-xs text-muted-foreground">{a.id}</span>, a.name, a.category, <StatusPill status={a.status} />,
        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4 mr-1" />Delete</Button>,
      ])} />
    </Section>;

  if (sectionId === "request")
    return <Section title="Request a New Asset">
      <form className="glass rounded-2xl p-6 max-w-2xl space-y-4">
        <div className="space-y-2"><Label>Asset Type</Label><Input placeholder="e.g. External SSD 2TB" /></div>
        <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Why do you need this?" rows={4} /></div>
        <div className="space-y-2"><Label>Priority</Label><Input placeholder="Low / Medium / High" /></div>
        <Button type="button" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><PackagePlus className="h-4 w-4 mr-2" />Submit Request</Button>
      </form>
    </Section>;

  return <div className="text-muted-foreground">Coming soon.</div>;
};

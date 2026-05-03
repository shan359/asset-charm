import { useState } from "react";
import { toast } from "sonner";
import { mockAssets, mockRequests, mockEmployees, mockTasks, Role } from "@/lib/asset-data";
import { StatCard, Section, StatusPill } from "./Primitives";
import { Boxes, Inbox, Users, Wrench, PackageCheck, UserCheck, ListChecks, CheckCircle2, PackagePlus, Trash2, Check, X, Eye, Pencil, Send, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Asset = typeof mockAssets[number];
type Request = typeof mockRequests[number];
type Task = typeof mockTasks[number];

const Table = ({ headers, rows, empty }: { headers: string[]; rows: (string | JSX.Element)[][]; empty?: string }) => (
  <div className="glass rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 border-b border-border">
          <tr>{headers.map((h) => <th key={h} className="text-left font-medium text-muted-foreground px-5 py-3 text-xs uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-5 py-12 text-center text-muted-foreground text-sm">{empty ?? "No records."}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors">
              {r.map((c, j) => <td key={j} className="px-5 py-3.5">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SectionToolbar = ({ onSearch, onExport }: { onSearch: (q: string) => void; onExport: () => void }) => (
  <div className="flex gap-2 flex-wrap">
    <Input placeholder="Filter..." onChange={(e) => onSearch(e.target.value)} className="h-9 w-44 bg-secondary/50" />
    <Button variant="outline" size="sm" onClick={() => toast.info("Filters opened")} className="h-9"><Filter className="h-4 w-4 mr-1.5" />Filter</Button>
    <Button variant="outline" size="sm" onClick={onExport} className="h-9"><Download className="h-4 w-4 mr-1.5" />Export</Button>
  </div>
);

const exportCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${filename}`);
};

export const DashboardSections = ({ role, sectionId }: { role: Role; sectionId: string }) => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Asset | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Asset | null>(null);
  const [form, setForm] = useState({ name: "", category: "", serial: "", location: "", notes: "" });
  const [reqForm, setReqForm] = useState({ item: "", reason: "", priority: "Medium" });

  const filterAssets = (extra?: (a: Asset) => boolean) =>
    assets.filter((a) => (!extra || extra(a)) && (!query || `${a.id} ${a.name} ${a.category} ${a.assignee} ${a.location}`.toLowerCase().includes(query.toLowerCase())));

  const assetActions = (a: Asset) => (
    <div className="flex gap-1 justify-end">
      <Button size="sm" variant="ghost" onClick={() => setViewing(a)}><Eye className="h-4 w-4" /></Button>
      <Button size="sm" variant="ghost" onClick={() => toast.success(`Editing ${a.id}`)}><Pencil className="h-4 w-4" /></Button>
      {role !== "employee" && (
        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmDelete(a)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const assetRow = (a: Asset) => [
    <span className="font-mono text-xs text-muted-foreground">{a.id}</span>,
    <span className="font-medium">{a.name}</span>,
    a.category,
    a.assignee,
    a.location,
    <StatusPill status={a.status} />,
    assetActions(a),
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return toast.error("Name and category are required");
    const newAsset: Asset = {
      id: `AST-${1050 + assets.length}`,
      name: form.name,
      category: form.category,
      status: "Available",
      assignee: "—",
      location: form.location || "Storage A",
    };
    setAssets((a) => [newAsset, ...a]);
    setForm({ name: "", category: "", serial: "", location: "", notes: "" });
    toast.success(`${newAsset.name} added to inventory`);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setAssets((a) => a.filter((x) => x.id !== confirmDelete.id));
    toast.success(`${confirmDelete.id} deleted`);
    setConfirmDelete(null);
  };

  const updateRequest = (id: string, status: string) => {
    setRequests((rs) => rs.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Request ${id} ${status.toLowerCase()}`);
  };

  const completeTask = (id: string) => {
    setTasks((ts) => ts.map((t) => t.id === id ? { ...t, status: "Completed" } : t));
    toast.success(`Task ${id} marked complete`);
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.item) return toast.error("Please describe the asset you need");
    const newReq: Request = {
      id: `REQ-${200 + requests.length + 1}`,
      employee: "Maya Rao",
      item: reqForm.item,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "Pending",
    };
    setRequests((r) => [newReq, ...r]);
    setReqForm({ item: "", reason: "", priority: "Medium" });
    toast.success("Request submitted for approval");
  };

  const headerWithActions = (cols: string[]) => [...cols, ""];

  const content = () => {
    // OVERVIEW
    if (sectionId === "overview") {
      if (role === "admin") return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Assets" value={assets.length} hint="+12 this week" icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="Open Requests" value={requests.filter(r => r.status === "Pending").length} hint="Action needed" icon={<Inbox className="h-5 w-5" />} tone="accent" />
            <StatCard label="Employees" value={mockEmployees.length} hint="across 9 teams" icon={<Users className="h-5 w-5" />} />
            <StatCard label="In Maintenance" value={assets.filter(a => a.status === "Maintenance").length} hint="ETA 3 days" icon={<Wrench className="h-5 w-5" />} tone="accent" />
          </div>
          <Section title="Recent Requests" desc="Latest asset requests across the organization."
            action={<Button size="sm" variant="outline" onClick={() => toast.info("Opening all requests")}>View all</Button>}>
            <Table headers={["ID", "Employee", "Item", "Date", "Status", ""]} rows={requests.slice(0, 4).map((r) => [
              <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
              <div className="flex gap-1 justify-end">
                {r.status === "Pending" ? (<>
                  <Button size="sm" variant="ghost" className="text-primary" onClick={() => updateRequest(r.id, "Approved")}><Check className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateRequest(r.id, "Rejected")}><X className="h-4 w-4" /></Button>
                </>) : <span className="text-xs text-muted-foreground">—</span>}
              </div>,
            ])} />
          </Section>
        </div>
      );
      if (role === "allocator") return (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="All Assets" value={assets.length} icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="Requested" value={requests.filter(r => r.status === "Pending").length} icon={<Inbox className="h-5 w-5" />} tone="accent" />
            <StatCard label="Available" value={assets.filter(a => a.status === "Available").length} icon={<PackageCheck className="h-5 w-5" />} />
            <StatCard label="Assigned" value={assets.filter(a => a.status === "Assigned").length} icon={<UserCheck className="h-5 w-5" />} tone="accent" />
          </div>
          <Section title="Allocator Queue" desc="Pending requests waiting for allocation.">
            <Table headers={["ID", "Employee", "Item", "Date", "Status", ""]} rows={requests.map((r) => [
              <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
              <div className="flex gap-1 justify-end">
                {r.status === "Pending" ? (<>
                  <Button size="sm" variant="outline" onClick={() => updateRequest(r.id, "Approved")}><Check className="h-4 w-4 mr-1" />Allocate</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateRequest(r.id, "Rejected")}><X className="h-4 w-4" /></Button>
                </>) : <span className="text-xs text-muted-foreground">{r.status}</span>}
              </div>,
            ])} />
          </Section>
        </div>
      );
      return (
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground">MR</div>
            <div>
              <h3 className="text-xl font-semibold">Welcome back, Maya</h3>
              <p className="text-sm text-muted-foreground">Product Designer · Design Team · {assets.filter(a => a.assignee === "Maya Rao").length} active assets</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Assets Used" value={assets.filter(a => a.assignee === "Maya Rao").length} icon={<Boxes className="h-5 w-5" />} />
            <StatCard label="In Maintenance" value={1} icon={<Wrench className="h-5 w-5" />} tone="accent" />
            <StatCard label="Open Tasks" value={tasks.filter(t => t.status !== "Completed").length} icon={<ListChecks className="h-5 w-5" />} tone="accent" />
            <StatCard label="Completed" value={tasks.filter(t => t.status === "Completed").length} icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>
          <Section title="Your Tasks">
            <Table headers={["ID", "Task", "Due", "Status", ""]} rows={tasks.slice(0, 4).map((t) => [
              <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.due, <StatusPill status={t.status} />,
              t.status !== "Completed" ? <Button size="sm" variant="outline" onClick={() => completeTask(t.id)}><Check className="h-4 w-4 mr-1" />Complete</Button> : <span className="text-xs text-muted-foreground">Done</span>,
            ])} />
          </Section>
        </div>
      );
    }

    // ASSETS
    if (sectionId === "all-assets")
      return <Section title="All Assets" desc="Complete inventory across locations."
        action={<SectionToolbar onSearch={setQuery} onExport={() => exportCsv("assets.csv", ["ID","Name","Category","Assignee","Location","Status"], filterAssets().map(a => [a.id, a.name, a.category, a.assignee, a.location, a.status]))} />}>
        <Table headers={headerWithActions(["ID","Name","Category","Assignee","Location","Status"])} rows={filterAssets().map(assetRow)} empty="No assets match your filter." />
      </Section>;

    if (sectionId === "requests" || sectionId === "requested")
      return <Section title="Asset Requests" desc="Review pending and recent requests.">
        <Table headers={["ID", "Employee", "Item", "Date", "Status", ""]} rows={requests.map((r) => [
          <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, r.employee, r.item, r.date, <StatusPill status={r.status} />,
          <div className="flex gap-1 justify-end">
            {r.status === "Pending" ? (<>
              <Button size="sm" variant="outline" onClick={() => updateRequest(r.id, "Approved")}><Check className="h-4 w-4 mr-1" />Approve</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateRequest(r.id, "Rejected")}><X className="h-4 w-4 mr-1" />Reject</Button>
            </>) : <Button size="sm" variant="ghost" onClick={() => updateRequest(r.id, "Pending")}>Reopen</Button>}
          </div>,
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
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Viewing ${e.name}'s profile`)}>View</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`Message sent to ${e.name}`)}><Send className="h-3.5 w-3.5 mr-1" />Message</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>;

    if (sectionId === "assigned" || sectionId === "used") {
      const filter = sectionId === "used"
        ? (a: Asset) => a.assignee === "Maya Rao" || a.status === "Assigned"
        : (a: Asset) => a.status === "Assigned";
      return <Section title={sectionId === "used" ? "Assets Used" : "Assigned Assets"}>
        <Table headers={headerWithActions(["ID","Name","Category","Assignee","Location","Status"])} rows={filterAssets(filter).map(assetRow)} />
      </Section>;
    }
    if (sectionId === "available" || sectionId === "remaining")
      return <Section title={sectionId === "remaining" ? "Remaining Assets" : "Available Assets"}>
        <Table headers={headerWithActions(["ID","Name","Category","Assignee","Location","Status"])} rows={filterAssets(a => a.status === "Available").map(assetRow)} />
      </Section>;
    if (sectionId === "maintenance")
      return <Section title="Maintenance" desc="Assets currently being serviced."
        action={role === "admin" ? <Button size="sm" variant="outline" onClick={() => toast.success("Maintenance schedule updated")}>Schedule</Button> : undefined}>
        <Table headers={headerWithActions(["ID","Name","Category","Assignee","Location","Status"])} rows={filterAssets(a => a.status === "Maintenance").map(assetRow)} />
      </Section>;

    if (sectionId === "tasks-assigned")
      return <Section title="Assigned Tasks">
        <Table headers={["ID", "Task", "Assignee", "Due", "Status", ""]} rows={tasks.filter(t => t.status !== "Completed").map((t) => [
          <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.assignee, t.due, <StatusPill status={t.status} />,
          <Button size="sm" variant="outline" onClick={() => completeTask(t.id)}><Check className="h-4 w-4 mr-1" />Complete</Button>,
        ])} empty="No assigned tasks. Great job!" />
      </Section>;
    if (sectionId === "tasks-completed")
      return <Section title="Completed Tasks">
        <Table headers={["ID", "Task", "Assignee", "Due", "Status"]} rows={tasks.filter(t => t.status === "Completed").map((t) => [
          <span className="font-mono text-xs text-muted-foreground">{t.id}</span>, t.title, t.assignee, t.due, <StatusPill status={t.status} />,
        ])} />
      </Section>;

    if (sectionId === "profile")
      return <Section title="My Details" action={<Button variant="outline" onClick={() => toast.success("Profile saved")}><Pencil className="h-4 w-4 mr-2" />Edit Profile</Button>}>
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
        <form onSubmit={handleAdd} className="glass rounded-2xl p-6 max-w-2xl space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Asset Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder='MacBook Pro 16" M3' /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Laptop" /></div>
            <div className="space-y-2"><Label>Serial Number</Label><Input value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} placeholder="C02XXXXXXXXX" /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bangalore HQ" /></div>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Condition, accessories, etc." /></div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><PackagePlus className="h-4 w-4 mr-2" />Add Asset</Button>
            <Button type="button" variant="outline" onClick={() => setForm({ name: "", category: "", serial: "", location: "", notes: "" })}>Reset</Button>
          </div>
        </form>
      </Section>;

    if (sectionId === "delete")
      return <Section title="Delete Asset" desc="Remove an asset from inventory.">
        <Table headers={["ID", "Name", "Category", "Status", ""]} rows={assets.map((a) => [
          <span className="font-mono text-xs text-muted-foreground">{a.id}</span>, a.name, a.category, <StatusPill status={a.status} />,
          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmDelete(a)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>,
        ])} />
      </Section>;

    if (sectionId === "request")
      return <Section title="Request a New Asset">
        <form onSubmit={submitRequest} className="glass rounded-2xl p-6 max-w-2xl space-y-4">
          <div className="space-y-2"><Label>Asset Type</Label><Input value={reqForm.item} onChange={(e) => setReqForm({ ...reqForm, item: e.target.value })} placeholder="e.g. External SSD 2TB" /></div>
          <div className="space-y-2"><Label>Reason</Label><Textarea value={reqForm.reason} onChange={(e) => setReqForm({ ...reqForm, reason: e.target.value })} placeholder="Why do you need this?" rows={4} /></div>
          <div className="space-y-2"><Label>Priority</Label><Input value={reqForm.priority} onChange={(e) => setReqForm({ ...reqForm, priority: e.target.value })} placeholder="Low / Medium / High" /></div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Send className="h-4 w-4 mr-2" />Submit Request</Button>
            <Button type="button" variant="outline" onClick={() => setReqForm({ item: "", reason: "", priority: "Medium" })}>Clear</Button>
          </div>
        </form>
      </Section>;

    return <div className="text-muted-foreground">Coming soon.</div>;
  };

  return (
    <>
      {content()}

      {/* View asset dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">{viewing?.id}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs uppercase text-muted-foreground">Category</dt><dd className="mt-1 font-medium">{viewing.category}</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Status</dt><dd className="mt-1"><StatusPill status={viewing.status} /></dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Assignee</dt><dd className="mt-1 font-medium">{viewing.assignee}</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Location</dt><dd className="mt-1 font-medium">{viewing.location}</dd></div>
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            <Button className="bg-gradient-primary text-primary-foreground" onClick={() => { toast.success("Action performed"); setViewing(null); }}>Manage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete asset?</DialogTitle>
            <DialogDescription>
              {confirmDelete && <>This will remove <span className="font-medium text-foreground">{confirmDelete.name}</span> ({confirmDelete.id}) from inventory. This action cannot be undone.</>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

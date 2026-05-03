export type Role = "admin" | "allocator" | "employee";

export const roleConfig: Record<Role, { label: string; tagline: string; sections: { id: string; label: string; icon: string }[] }> = {
  admin: {
    label: "Administrator",
    tagline: "Full visibility across every asset, request and team member.",
    sections: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "all-assets", label: "All Assets", icon: "Boxes" },
      { id: "requests", label: "Requests", icon: "Inbox" },
      { id: "employees", label: "Employees", icon: "Users" },
      { id: "assigned", label: "Assigned Assets", icon: "UserCheck" },
      { id: "available", label: "Available Assets", icon: "PackageCheck" },
      { id: "maintenance", label: "Maintenance", icon: "Wrench" },
      { id: "tasks-assigned", label: "Assigned Tasks", icon: "ListChecks" },
      { id: "tasks-completed", label: "Completed Tasks", icon: "CheckCircle2" },
    ],
  },
  allocator: {
    label: "Asset Allocator",
    tagline: "Allocate, track and manage the entire asset inventory.",
    sections: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "all-assets", label: "All Assets", icon: "Boxes" },
      { id: "requested", label: "Requested Assets", icon: "Inbox" },
      { id: "remaining", label: "Remaining Assets", icon: "PackageCheck" },
      { id: "assigned", label: "Assigned Assets", icon: "UserCheck" },
      { id: "add", label: "Add Asset", icon: "PackagePlus" },
      { id: "delete", label: "Delete Asset", icon: "Trash2" },
    ],
  },
  employee: {
    label: "Employee",
    tagline: "Your assets, tasks and requests at a glance.",
    sections: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "profile", label: "My Details", icon: "User" },
      { id: "used", label: "Assets Used", icon: "Boxes" },
      { id: "maintenance", label: "Under Maintenance", icon: "Wrench" },
      { id: "tasks-assigned", label: "Assigned Tasks", icon: "ListChecks" },
      { id: "tasks-completed", label: "Completed Tasks", icon: "CheckCircle2" },
      { id: "request", label: "Request Asset", icon: "PackagePlus" },
    ],
  },
};

export const mockAssets = [
  { id: "AST-1042", name: 'MacBook Pro 16" M3', category: "Laptop", status: "Assigned", assignee: "Maya Rao", location: "Bangalore HQ" },
  { id: "AST-1043", name: "Dell UltraSharp 27\"", category: "Monitor", status: "Available", assignee: "—", location: "Storage A" },
  { id: "AST-1044", name: "Logitech MX Master 3", category: "Peripheral", status: "Assigned", assignee: "Arjun Mehta", location: "Bangalore HQ" },
  { id: "AST-1045", name: "iPhone 15 Pro", category: "Mobile", status: "Maintenance", assignee: "—", location: "Service Center" },
  { id: "AST-1046", name: "Herman Miller Aeron", category: "Furniture", status: "Available", assignee: "—", location: "Storage B" },
  { id: "AST-1047", name: "ThinkPad X1 Carbon", category: "Laptop", status: "Assigned", assignee: "Priya Sharma", location: "Mumbai" },
  { id: "AST-1048", name: "iPad Pro 12.9\"", category: "Tablet", status: "Maintenance", assignee: "—", location: "Service Center" },
  { id: "AST-1049", name: "Sony WH-1000XM5", category: "Peripheral", status: "Available", assignee: "—", location: "Storage A" },
];

export const mockRequests = [
  { id: "REQ-201", employee: "Arjun Mehta", item: "External SSD 2TB", date: "May 1", status: "Pending" },
  { id: "REQ-202", employee: "Maya Rao", item: "Standing Desk", date: "Apr 29", status: "Approved" },
  { id: "REQ-203", employee: "Sahil Khan", item: "Wacom Tablet", date: "Apr 28", status: "Pending" },
  { id: "REQ-204", employee: "Priya Sharma", item: "Noise-cancelling Headphones", date: "Apr 27", status: "Rejected" },
];

export const mockEmployees = [
  { id: "EMP-01", name: "Maya Rao", role: "Product Designer", assets: 4, dept: "Design" },
  { id: "EMP-02", name: "Arjun Mehta", role: "Senior Engineer", assets: 5, dept: "Engineering" },
  { id: "EMP-03", name: "Priya Sharma", role: "PM", assets: 3, dept: "Product" },
  { id: "EMP-04", name: "Sahil Khan", role: "Data Analyst", assets: 2, dept: "Data" },
  { id: "EMP-05", name: "Neha Verma", role: "Marketing Lead", assets: 3, dept: "Marketing" },
];

export const mockTasks = [
  { id: "TSK-11", title: "Audit Q2 laptop inventory", assignee: "Arjun Mehta", due: "May 7", status: "In Progress" },
  { id: "TSK-12", title: "Process maintenance batch", assignee: "Maya Rao", due: "May 5", status: "In Progress" },
  { id: "TSK-13", title: "Onboard 12 new joiners", assignee: "Priya Sharma", due: "May 10", status: "Completed" },
  { id: "TSK-14", title: "Retire EOL monitors", assignee: "Sahil Khan", due: "Apr 30", status: "Completed" },
  { id: "TSK-15", title: "Approve pending requests", assignee: "Neha Verma", due: "May 3", status: "In Progress" },
];

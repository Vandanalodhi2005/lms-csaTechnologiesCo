"use client";

import * as React from "react";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { cn } from "@/utils";
import { toast } from "sonner";
import { adminStaff, staffRoleSummary, staffActivityTemplates } from "@/constants/adminStaff.js";
import { adminRoles, permissionGroups, permissionDefinitions } from "@/constants/adminRolesPermissions.js";
import {
  AlertTriangle,
  ArrowDownToLine,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  IDCard,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";

// Frontend role/permission state is for UI demonstration only. Production authorization must be enforced server-side.
// Future production architecture should include server-side authentication, RBAC checks, secure invitation flows, and audit logging.

const STAFF_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "invited", label: "Invited" },
  { key: "suspended", label: "Suspended" },
  { key: "inactive", label: "Inactive" },
];

const PER_PAGE = 10;
const permissionActions = ["view", "create", "edit", "delete", "approve", "export"];
const actionLabels = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  export: "Export",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateValue) {
  if (!dateValue || dateValue === "Never") return "Never";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusVariant(status) {
  switch (status) {
    case "Active":
      return "success";
    case "Invited":
      return "info";
    case "Suspended":
      return "warning";
    case "Inactive":
      return "secondary";
    default:
      return "default";
  }
}

function buildActivityTimeline(staffName) {
  return [
    `${staffName} logged into Admin Dashboard`,
    "Updated course approval",
    "Reviewed student account",
    "Updated category",
    "Reviewed platform reports",
  ].map((entry, index) => ({
    text: entry,
    time: ["2 hours ago", "Yesterday", "2 days ago", "4 days ago", "1 week ago"][index % 5],
  }));
}

function getRolePermissionPreview(roleName) {
  const summary = staffRoleSummary[roleName] || staffRoleSummary["Support Agent"];
  return summary.permissionPreview;
}

function getPermissionScoreForRole(roleName) {
  const summary = staffRoleSummary[roleName] || staffRoleSummary["Support Agent"];
  return summary.permissions;
}

function getAccessLevelForRole(roleName) {
  const summary = staffRoleSummary[roleName] || staffRoleSummary["Support Agent"];
  return summary.accessLevel;
}

function toTitleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function ModalShell({ open, title, description, onClose, children, size = "md" }) {
  const dialogRef = React.useRef(null);
  const lastFocusedRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return undefined;
    lastFocusedRef.current = document.activeElement;

    const getFocusable = () => {
      const node = dialogRef.current;
      if (!node) return [];
      return Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR));
    };

    const initialFocusable = getFocusable();
    if (initialFocusable.length > 0) {
      initialFocusable[0].focus();
    } else if (dialogRef.current) {
      dialogRef.current.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === "function") {
        lastFocusedRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6",
          size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-xl"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-modal-title"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 id="staff-modal-title" className="text-xl font-bold text-slate-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function RolePreviewCard({ roleName }) {
  const previewItems = getRolePermissionPreview(roleName);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current Role</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{roleName}</p>
        </div>
        <Badge variant="default" size="sm">{getAccessLevelForRole(roleName)}</Badge>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Permission count:</span> {getPermissionScoreForRole(roleName)}
        </p>
        <p className="mb-2 text-sm font-semibold text-slate-700">Permissions</p>
        <div className="flex flex-wrap gap-2">
          {previewItems.map((permission) => (
            <Badge key={permission} variant="secondary" size="sm" className="border-slate-200 bg-white text-slate-700">
              {permission}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionPreviewModal({ open, staff, onClose }) {
  if (!open || !staff) return null;

  const roleDefinition = adminRoles.find((role) => role.name === staff.role) || adminRoles[0];

  return (
    <ModalShell
      open={open}
      title="Permissions"
      description="Permissions shown here are for demonstration. Production authorization must be enforced server-side."
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-5">
        <RolePreviewCard roleName={staff.role} />

        <div className="space-y-3">
          {permissionGroups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.items.map((itemKey) => {
                  const item = permissionDefinitions.find((definition) => definition.key === itemKey);
                  const permissionSet = roleDefinition.permissions?.[itemKey] || {};
                  return (
                    <div key={`${group.title}-${itemKey}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-700">{item?.label || itemKey}</span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{Object.values(permissionSet).filter(Boolean).length} active</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {permissionActions.map((actionKey) => (
                          <span
                            key={`${itemKey}-${actionKey}`}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium",
                              permissionSet[actionKey]
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-500"
                            )}
                          >
                            {actionLabels[actionKey]}
                            {permissionSet[actionKey] ? <Check className="h-3 w-3" aria-hidden="true" /> : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

export default function StaffManagementClient() {
  const [staffList, setStaffList] = React.useState(adminStaff);
  const [tab, setTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [lastActiveFilter, setLastActiveFilter] = React.useState("any");
  const [sortBy, setSortBy] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [menuOpenId, setMenuOpenId] = React.useState(null);
  const [detailStaff, setDetailStaff] = React.useState(null);
  const [assignmentStaff, setAssignmentStaff] = React.useState(null);
  const [assignmentRole, setAssignmentRole] = React.useState("");
  const [permissionStaff, setPermissionStaff] = React.useState(null);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [editStaff, setEditStaff] = React.useState(null);
  const [confirmAction, setConfirmAction] = React.useState({ open: false, type: "", staff: null });
  const [inviteForm, setInviteForm] = React.useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "",
    role: "Admin",
    message: "",
  });
  const [inviteErrors, setInviteErrors] = React.useState({});
  const [editErrors, setEditErrors] = React.useState({});

  const roleOptions = React.useMemo(
    () => ["All Roles", ...Array.from(new Set(staffList.map((member) => member.role)))],
    [staffList]
  );

  const filteredStaff = React.useMemo(() => {
    let result = [...staffList];

    if (tab !== "all") {
      result = result.filter((member) => member.status.toLowerCase() === tab);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((member) => {
        const haystack = `${member.name} ${member.email} ${member.id}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    if (roleFilter !== "all") {
      result = result.filter((member) => member.role === roleFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((member) => member.status === statusFilter);
    }

    if (lastActiveFilter !== "any") {
      result = result.filter((member) => {
        if (member.lastActive === "Never") {
          return lastActiveFilter === "never";
        }

        const lastDate = new Date(member.lastActive);
        const now = new Date();
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        if (lastActiveFilter === "today") return diffDays === 0;
        if (lastActiveFilter === "7days") return diffDays <= 7;
        if (lastActiveFilter === "30days") return diffDays <= 30;
        return true;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.joinedAt) - new Date(b.joinedAt);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recently-active":
          return new Date(b.lastActive === "Never" ? "2000-01-01" : b.lastActive) - new Date(a.lastActive === "Never" ? "2000-01-01" : a.lastActive);
        case "newest":
        default:
          return new Date(b.joinedAt) - new Date(a.joinedAt);
      }
    });

    return result;
  }, [staffList, tab, search, roleFilter, statusFilter, lastActiveFilter, sortBy]);

  React.useEffect(() => {
    setPage(1);
  }, [tab, search, roleFilter, statusFilter, lastActiveFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / PER_PAGE));
  const paginatedStaff = filteredStaff.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = React.useMemo(
    () => ({
      total: staffList.length,
      active: staffList.filter((member) => member.status === "Active").length,
      invited: staffList.filter((member) => member.status === "Invited").length,
      suspended: staffList.filter((member) => member.status === "Suspended").length,
    }),
    [staffList]
  );

  function resetFilters() {
    setTab("all");
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setLastActiveFilter("any");
    setSortBy("newest");
  }

  function openInviteModal() {
    setInviteOpen(true);
    setInviteErrors({});
  }

  function validateInviteForm() {
    const errors = {};
    if (!inviteForm.name.trim()) errors.name = "Full name is required.";
    else if (inviteForm.name.trim().length < 2) errors.name = "Full name must be at least 2 characters.";
    else if (inviteForm.name.trim().length > 80) errors.name = "Full name cannot exceed 80 characters.";

    if (!inviteForm.email.trim()) errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email.trim())) errors.email = "Please enter a valid email address.";

    if (inviteForm.jobTitle && inviteForm.jobTitle.trim().length > 100) {
      errors.jobTitle = "Job title cannot exceed 100 characters.";
    }

    if (inviteForm.department && inviteForm.department.trim().length > 100) {
      errors.department = "Department cannot exceed 100 characters.";
    }

    if (!inviteForm.role) errors.role = "Role is required.";

    if (inviteForm.message && inviteForm.message.trim().length > 500) {
      errors.message = "Personal message cannot exceed 500 characters.";
    }

    setInviteErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSendInvitation() {
    if (!validateInviteForm()) return;

    const nextId = `STF-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newStaffMember = {
      id: nextId,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      jobTitle: inviteForm.jobTitle.trim() || "New Staff Member",
      role: inviteForm.role,
      status: "Invited",
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "Never",
      avatar: getInitials(inviteForm.name.trim()),
      department: inviteForm.department.trim() || "Administration",
      phone: "+1 555 010 0000",
      permissions: getPermissionScoreForRole(inviteForm.role),
      accessLevel: getAccessLevelForRole(inviteForm.role),
    };

    setStaffList((current) => [newStaffMember, ...current]);
    setInviteOpen(false);
    setInviteForm({
      name: "",
      email: "",
      jobTitle: "",
      department: "",
      role: "Admin",
      message: "",
    });
    toast.success("Invitation created in demo mode.");
  }

  function validateEditForm(member) {
    const errors = {};
    if (!member.name.trim()) errors.name = "Name is required.";
    else if (member.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    else if (member.name.trim().length > 80) errors.name = "Name cannot exceed 80 characters.";

    if (!member.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email.trim())) errors.email = "Please enter a valid email address.";

    if (member.jobTitle && member.jobTitle.trim().length > 100) {
      errors.jobTitle = "Job title cannot exceed 100 characters.";
    }

    if (member.department && member.department.trim().length > 100) {
      errors.department = "Department cannot exceed 100 characters.";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleEditSave() {
    if (!editStaff) return;
    const member = { ...editStaff };
    if (!validateEditForm(member)) return;

    setStaffList((current) =>
      current.map((staff) =>
        staff.id === member.id
          ? {
              ...staff,
              name: member.name.trim(),
              email: member.email.trim(),
              jobTitle: member.jobTitle.trim() || staff.jobTitle,
              department: member.department.trim() || staff.department,
              role: member.role,
              status: member.status,
              permissions: getPermissionScoreForRole(member.role),
              accessLevel: getAccessLevelForRole(member.role),
            }
          : staff
      )
    );
    setEditStaff(null);
    setEditErrors({});
    toast.success("Staff details updated in demo mode.");
  }

  function handleAssignRole() {
    if (!assignmentStaff || !assignmentRole) return;

    setStaffList((current) =>
      current.map((staff) =>
        staff.id === assignmentStaff.id
          ? {
              ...staff,
              role: assignmentRole,
              permissions: getPermissionScoreForRole(assignmentRole),
              accessLevel: getAccessLevelForRole(assignmentRole),
            }
          : staff
      )
    );

    setAssignmentStaff(null);
    toast.success("Role updated successfully.");
  }

  function handleAction(actionType, staff) {
    setMenuOpenId(null);

    if (actionType === "view") {
      setDetailStaff(staff);
      return;
    }

    if (actionType === "edit") {
      setEditStaff({ ...staff });
      setEditErrors({});
      return;
    }

    if (actionType === "assign-role") {
      setAssignmentStaff(staff);
      setAssignmentRole(staff.role);
      return;
    }

    if (actionType === "permissions") {
      setPermissionStaff(staff);
      return;
    }

    if (actionType === "suspend") {
      setConfirmAction({ open: true, type: "suspend", staff });
      return;
    }

    if (actionType === "activate") {
      setConfirmAction({ open: true, type: "activate", staff });
      return;
    }

    if (actionType === "resend") {
      setConfirmAction({ open: true, type: "resend", staff });
      return;
    }

    if (actionType === "revoke") {
      setConfirmAction({ open: true, type: "revoke", staff });
      return;
    }

    if (actionType === "delete") {
      setConfirmAction({ open: true, type: "delete", staff });
    }
  }

  function handleConfirmAction() {
    const staff = confirmAction.staff;
    if (!staff) return;

    if (confirmAction.type === "suspend") {
      setStaffList((current) => current.map((item) => (item.id === staff.id ? { ...item, status: "Suspended" } : item)));
      toast.success("Staff suspended in demo mode.");
    }

    if (confirmAction.type === "activate") {
      setStaffList((current) => current.map((item) => (item.id === staff.id ? { ...item, status: "Active" } : item)));
      toast.success("Staff activated in demo mode.");
    }

    if (confirmAction.type === "resend") {
      toast.success("Invitation resent in demo mode. No email was sent.");
    }

    if (confirmAction.type === "revoke") {
      setStaffList((current) => current.map((item) => (item.id === staff.id ? { ...item, status: "Inactive" } : item)));
      toast.success("Invitation revoked in demo mode.");
    }

    if (confirmAction.type === "delete") {
      if (staff.role === "Super Admin") {
        toast.error("System role cannot be deleted.");
      } else {
        setStaffList((current) => current.filter((item) => item.id !== staff.id));
        toast.success("Staff deleted from demo data.");
      }
    }

    setConfirmAction({ open: false, type: "", staff: null });
  }

  function getStaffActions(staff) {
    const actions = [
      { label: "View Details", value: "view", icon: Eye },
      { label: "Edit Staff", value: "edit", icon: Pencil },
      { label: "Assign Role", value: "assign-role", icon: UserCog },
      { label: "View Permissions", value: "permissions", icon: ShieldCheck },
    ];

    if (staff.status === "Active") {
      actions.push({ label: "Suspend", value: "suspend", icon: AlertTriangle });
    }

    if (staff.status === "Invited") {
      actions.push({ label: "Resend Invitation", value: "resend", icon: Mail });
      actions.push({ label: "Revoke Invitation", value: "revoke", icon: X });
    }

    if (staff.status === "Suspended" || staff.status === "Inactive") {
      actions.push({ label: "Activate", value: "activate", icon: Check });
    }

    if (staff.status === "Inactive") {
      actions.push({ label: "Delete", value: "delete", icon: Trash2, destructive: true });
    }

    if (staff.role === "Super Admin" && actions.some((action) => action.value === "delete")) {
      actions[actions.findIndex((action) => action.value === "delete")].disabled = true;
      actions[actions.findIndex((action) => action.value === "delete")].tooltip = "System role cannot be deleted.";
    }

    return actions;
  }

  function exportStaffCsv() {
    const headers = ["Name", "Email", "Staff ID", "Role", "Status", "Joined", "Last Active"];
    const rows = filteredStaff.map((member) => [
      member.name,
      member.email,
      member.id,
      member.role,
      member.status,
      formatDate(member.joinedAt),
      formatDate(member.lastActive),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "edulearn-staff.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Filtered staff exported as CSV.");
  }

  const selectedStaff = detailStaff || null;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            <span className="hover:text-primary-600">Admin</span>
            <span>/</span>
            <span className="text-slate-700">Staff</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Management</h1>
          <p className="mt-2 text-sm text-slate-600">Manage internal staff accounts, roles, invitations, and account status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" leftIcon={<ArrowDownToLine className="h-4 w-4" />} onClick={exportStaffCsv}>
            Export Staff
          </Button>
          <Button type="button" leftIcon={<Plus className="h-4 w-4" />} onClick={openInviteModal}>
            Invite Staff
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-700">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Demo Staff Management</p>
            <p className="mt-1 text-blue-800/90">Staff accounts and role assignments shown here are mock data. Authentication, invitations, and server-side permissions will be connected later.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Total Staff</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Active Staff</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.active}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Pending Invitations</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.invited}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Suspended Staff</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.suspended}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {STAFF_TABS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setTab(option.key)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                  tab === option.key ? "bg-primary-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="staff-search" className="sr-only">Search staff by name, email, or staff ID</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                id="staff-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search staff by name, email, or staff ID..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Role</label>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option === "All Roles" ? "all" : option}>
                  {option === "All Roles" ? "All Roles" : option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Last Active</label>
            <select
              value={lastActiveFilter}
              onChange={(event) => setLastActiveFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="any">Any Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sort</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="recently-active">Recently Active</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" leftIcon={<RefreshCcw className="h-3.5 w-3.5" />} onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-slate-900">No staff members found</p>
          <p className="mt-2 text-sm text-slate-600">Try changing your search or filters.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    {[
                      "Staff",
                      "Staff ID",
                      "Role",
                      "Email",
                      "Joined",
                      "Last Active",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedStaff.map((member) => (
                    <tr key={member.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                            {member.avatar || getInitials(member.name)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">{member.jobTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{member.id}</td>
                      <td className="px-4 py-3">
                        <Badge variant="default" size="sm" className="border-primary-200 bg-primary-50 text-primary-700">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{member.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(member.joinedAt)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(member.lastActive)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(member.status)} size="sm" className="capitalize">
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            type="button"
                            aria-label={`Actions for ${member.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onClick={() => setMenuOpenId((current) => (current === member.id ? null : member.id))}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </button>

                          {menuOpenId === member.id ? (
                            <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                              {getStaffActions(member).map((action) => {
                                const Icon = action.icon;
                                const disabled = action.disabled;
                                return (
                                  <button
                                    key={action.value}
                                    type="button"
                                    disabled={disabled}
                                    title={action.tooltip}
                                    onClick={() => handleAction(action.value, member)}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition",
                                      action.destructive ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100",
                                      disabled && "cursor-not-allowed opacity-50"
                                    )}
                                  >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {paginatedStaff.map((member) => (
              <div key={member.id} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                      {member.avatar || getInitials(member.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.id}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(member.status)} size="sm" className="capitalize">
                    {member.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Role:</span> {member.role}</p>
                  <p><span className="font-medium text-slate-800">Email:</span> {member.email}</p>
                  <p><span className="font-medium text-slate-800">Joined:</span> {formatDate(member.joinedAt)}</p>
                  <p><span className="font-medium text-slate-800">Last Active:</span> {formatDate(member.lastActive)}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-500">{member.jobTitle}</div>
                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Actions for ${member.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onClick={() => setMenuOpenId((current) => (current === member.id ? null : member.id))}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>

                    {menuOpenId === member.id ? (
                      <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        {getStaffActions(member).map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.value}
                              type="button"
                              onClick={() => handleAction(action.value, member)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition",
                                action.destructive ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100"
                              )}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing {(filteredStaff.length === 0 ? 0 : (page - 1) * PER_PAGE + 1)}–{Math.min(page * PER_PAGE, filteredStaff.length)} of {filteredStaff.length} staff members
            </p>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </Button>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-700">
                <span className="font-medium">{page}</span>
                <span>/</span>
                <span>{totalPages}</span>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedStaff ? (
        <ModalShell open={Boolean(detailStaff)} title="Staff Details" description="Mock information for local staff management view." onClose={() => setDetailStaff(null)} size="lg">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {selectedStaff.avatar || getInitials(selectedStaff.name)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xl font-bold text-slate-900">{selectedStaff.name}</h4>
                <p className="text-sm text-slate-600">{selectedStaff.jobTitle}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Profile</p>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-800">Email:</span> {selectedStaff.email}</p>
                  <p><span className="font-semibold text-slate-800">Staff ID:</span> {selectedStaff.id}</p>
                  <p><span className="font-semibold text-slate-800">Department:</span> {selectedStaff.department}</p>
                  <p><span className="font-semibold text-slate-800">Status:</span> {selectedStaff.status}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Role &amp; Access</p>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-800">Role:</span> {selectedStaff.role}</p>
                  <p><span className="font-semibold text-slate-800">Joined:</span> {formatDate(selectedStaff.joinedAt)}</p>
                  <p><span className="font-semibold text-slate-800">Last Active:</span> {formatDate(selectedStaff.lastActive)}</p>
                  <p><span className="font-semibold text-slate-800">Permission Count:</span> {selectedStaff.permissions}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Activity Summary</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">Login count</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{selectedStaff.permissions + 6}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">Courses managed</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedStaff.permissions - 10}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">Users managed</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedStaff.permissions - 6}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">Last action</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedStaff.lastActive === "Never" ? "No activity" : "Review"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Recent Activity</p>
              <div className="mt-3 space-y-3">
                {buildActivityTimeline(selectedStaff.name).map((item) => (
                  <div key={`${selectedStaff.id}-${item.text}`} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-600" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{item.text}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {assignmentStaff ? (
        <ModalShell open={Boolean(assignmentStaff)} title="Role Assignment" description="Frontend-only role assignment demo. No real authorization change occurs here." onClose={() => setAssignmentStaff(null)} size="lg">
          <div className="space-y-5">
            <RolePreviewCard roleName={assignmentStaff.role} />

            <div>
              <label htmlFor="assign-role" className="mb-2 block text-sm font-medium text-slate-700">Select role</label>
              <select
                id="assign-role"
                value={assignmentRole}
                onChange={(event) => setAssignmentRole(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {roleOptions.filter((item) => item !== "All Roles").map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Permission preview</p>
              <p className="mt-1 text-xs text-slate-500">
                {getAccessLevelForRole(assignmentRole || assignmentStaff.role)} · {getPermissionScoreForRole(assignmentRole || assignmentStaff.role)} permissions
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {getRolePermissionPreview(assignmentRole || assignmentStaff.role).map((permission) => (
                  <Badge key={permission} variant="secondary" size="sm" className="border-slate-200 bg-white text-slate-700">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button type="button" variant="outline" onClick={() => setAssignmentStaff(null)}>Cancel</Button>
              <Button type="button" onClick={handleAssignRole} disabled={!assignmentRole}>Assign Role</Button>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {permissionStaff ? (
        <PermissionPreviewModal open={Boolean(permissionStaff)} staff={permissionStaff} onClose={() => setPermissionStaff(null)} />
      ) : null}

      <ModalShell open={inviteOpen} title="Invite Staff" description="Create a local mock invitation. No real email is sent." onClose={() => setInviteOpen(false)} size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <label htmlFor="invite-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                id="invite-name"
                value={inviteForm.name}
                onChange={(event) => setInviteForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                maxLength={80}
              />
              {inviteErrors.name ? <p className="mt-1 text-xs text-red-600">{inviteErrors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="invite-email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                id="invite-email"
                type="email"
                value={inviteForm.email}
                onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              />
              {inviteErrors.email ? <p className="mt-1 text-xs text-red-600">{inviteErrors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="invite-job-title" className="mb-2 block text-sm font-medium text-slate-700">Job Title</label>
              <input
                id="invite-job-title"
                value={inviteForm.jobTitle}
                onChange={(event) => setInviteForm((current) => ({ ...current, jobTitle: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                maxLength={100}
              />
              {inviteErrors.jobTitle ? <p className="mt-1 text-xs text-red-600">{inviteErrors.jobTitle}</p> : null}
            </div>

            <div>
              <label htmlFor="invite-department" className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <input
                id="invite-department"
                value={inviteForm.department}
                onChange={(event) => setInviteForm((current) => ({ ...current, department: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                maxLength={100}
              />
              {inviteErrors.department ? <p className="mt-1 text-xs text-red-600">{inviteErrors.department}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="invite-role" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <select
                id="invite-role"
                value={inviteForm.role}
                onChange={(event) => setInviteForm((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {roleOptions.filter((item) => item !== "All Roles").map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {inviteErrors.role ? <p className="mt-1 text-xs text-red-600">{inviteErrors.role}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="invite-message" className="mb-2 block text-sm font-medium text-slate-700">Personal Message</label>
              <textarea
                id="invite-message"
                rows={4}
                value={inviteForm.message}
                onChange={(event) => setInviteForm((current) => ({ ...current, message: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                maxLength={500}
                placeholder="Add a short welcome note for the invited staff member."
              />
              {inviteErrors.message ? <p className="mt-1 text-xs text-red-600">{inviteErrors.message}</p> : null}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSendInvitation}>Send Invitation</Button>
          </div>
        </div>
      </ModalShell>

      {editStaff ? (
        <ModalShell open={Boolean(editStaff)} title="Edit Staff" description="Update staff profile information and role assignment in demo mode." onClose={() => setEditStaff(null)} size="lg">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                <input
                  id="edit-name"
                  value={editStaff.name}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, name: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                />
                {editErrors.name ? <p className="mt-1 text-xs text-red-600">{editErrors.name}</p> : null}
              </div>

              <div>
                <label htmlFor="edit-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editStaff.email}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, email: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                />
                {editErrors.email ? <p className="mt-1 text-xs text-red-600">{editErrors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="edit-job" className="mb-2 block text-sm font-medium text-slate-700">Job Title</label>
                <input
                  id="edit-job"
                  value={editStaff.jobTitle}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, jobTitle: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                />
                {editErrors.jobTitle ? <p className="mt-1 text-xs text-red-600">{editErrors.jobTitle}</p> : null}
              </div>

              <div>
                <label htmlFor="edit-department" className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <input
                  id="edit-department"
                  value={editStaff.department}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, department: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                />
                {editErrors.department ? <p className="mt-1 text-xs text-red-600">{editErrors.department}</p> : null}
              </div>

              <div>
                <label htmlFor="edit-role" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <select
                  id="edit-role"
                  value={editStaff.role}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, role: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                >
                  {roleOptions.filter((item) => item !== "All Roles").map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select
                  id="edit-status"
                  value={editStaff.status}
                  onChange={(event) => setEditStaff((current) => current ? { ...current, status: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                >
                  <option value="Active">Active</option>
                  <option value="Invited">Invited</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditStaff(null)}>Cancel</Button>
              <Button type="button" onClick={handleEditSave}>Save Changes</Button>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {confirmAction.open && confirmAction.staff ? (
        <ModalShell
          open={confirmAction.open}
          title={
            confirmAction.type === "suspend"
              ? "Suspend Staff Account?"
              : confirmAction.type === "activate"
                ? "Activate Staff Account?"
                : confirmAction.type === "resend"
                  ? "Resend invitation?"
                  : confirmAction.type === "revoke"
                    ? "Revoke invitation?"
                    : confirmAction.type === "delete"
                      ? "Delete Staff?"
                      : "Confirm action"
          }
          description={
            confirmAction.type === "suspend"
              ? "This will mark the staff account as suspended in the demo interface."
              : confirmAction.type === "activate"
                ? "This will reactivate the staff account in the demo interface."
                : confirmAction.type === "resend"
                  ? "The invitation will be marked as resent in demo mode. No email will be sent."
                  : confirmAction.type === "revoke"
                    ? "This will revoke the invitation and mark the staff account as inactive."
                    : confirmAction.type === "delete"
                      ? "This action removes the staff record from the current demo interface."
                      : "Confirm this action."
          }
          onClose={() => setConfirmAction({ open: false, type: "", staff: null })}
          size="sm"
        >
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setConfirmAction({ open: false, type: "", staff: null })}>Cancel</Button>
            <Button
              type="button"
              variant={confirmAction.type === "delete" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              {confirmAction.type === "suspend" ? "Suspend Staff" : confirmAction.type === "activate" ? "Activate Staff" : confirmAction.type === "resend" ? "Resend" : confirmAction.type === "revoke" ? "Revoke Invitation" : confirmAction.type === "delete" ? "Delete" : "Confirm"}
            </Button>
          </div>
        </ModalShell>
      ) : null}

    </div>
  );
}

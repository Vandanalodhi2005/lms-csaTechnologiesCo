"use client";

import * as React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import { cn, getInitials } from "@/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  Filter,
  KeyRound,
  LayoutGrid,
  Lock,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Trash2,
  Undo2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import {
  adminRoles,
  permissionDefinitions,
  permissionGroups,
  roleActivityRecords,
  roleUserAssignments,
  lockedPermissionsByRole,
  createDefaultPermissionSet,
} from "@/constants/adminRolesPermissions.js";

const permissionActions = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
  { key: "export", label: "Export" },
];

const clonePermissions = (value) => JSON.parse(JSON.stringify(value));

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getPermissionCount(permissions) {
  return Object.values(permissions || {}).reduce((total, permissionMap) => {
    const values = Object.values(permissionMap || {});
    return total + values.filter(Boolean).length;
  }, 0);
}

function getPermissionSummary(permissions) {
  return permissionActions.reduce((summary, action) => {
    summary[action.key] = Object.values(permissions || {}).reduce((total, permissionMap) => {
      return total + Number(Boolean(permissionMap?.[action.key]));
    }, 0);
    return summary;
  }, {});
}

function getRoleStatusColor(status) {
  if (status === "active") return "success";
  if (status === "inactive") return "secondary";
  return "warning";
}

function getRoleTypeColor(type) {
  return type === "system" ? "default" : "info";
}

function getRoleUsers(roleId) {
  return roleUserAssignments[roleId] || [];
}

function createBlankRolePermissions() {
  return createDefaultPermissionSet();
}

function getLockedPermissions(roleId) {
  return new Set(lockedPermissionsByRole[roleId] || []);
}

function RoleStatCard({ icon: Icon, title, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function ModalShell({ open, title, description, onClose, children, size = "md" }) {
  React.useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm">
      <div
        className={cn(
          "w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6",
          size === "lg" ? "max-w-2xl" : "max-w-xl"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h3>
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

function PermissionToggle({ label, checked, disabled, onChange, title }) {
  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 focus-within:ring-2 focus-within:ring-primary-500/20">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        title={title}
      />
      <span>{label}</span>
    </label>
  );
}

export default function RolesPermissionsClient() {
  const [roles, setRoles] = React.useState(() => clonePermissions(adminRoles));
  const [selectedRoleId, setSelectedRoleId] = React.useState(adminRoles[0].id);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [sortOption, setSortOption] = React.useState("name-asc");
  const [toastMessage, setToastMessage] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showUsersModal, setShowUsersModal] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false);
  const [pendingRoleId, setPendingRoleId] = React.useState(null);
  const [compareRoleA, setCompareRoleA] = React.useState("role-admin");
  const [compareRoleB, setCompareRoleB] = React.useState("role-moderator");
  const [createForm, setCreateForm] = React.useState({
    name: "",
    description: "",
    permissions: createBlankRolePermissions(),
  });
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    status: "active",
    permissions: createBlankRolePermissions(),
  });
  const [duplicateName, setDuplicateName] = React.useState("");
  const [roleSearch, setRoleSearch] = React.useState("");
  const [createError, setCreateError] = React.useState("");
  const [saveStatus, setSaveStatus] = React.useState("Saved");

  const selectedRole = React.useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId]
  );

  const [draftPermissions, setDraftPermissions] = React.useState(() => clonePermissions(selectedRole.permissions));

  React.useEffect(() => {
    if (!selectedRole) return;
    setDraftPermissions(clonePermissions(selectedRole.permissions));
    setSaveStatus("Saved");
  }, [selectedRole]);

  React.useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const hasUnsavedChanges = React.useMemo(
    () => JSON.stringify(draftPermissions) !== JSON.stringify(selectedRole?.permissions || {}),
    [draftPermissions, selectedRole]
  );

  const filteredRoles = React.useMemo(() => {
    let nextRoles = [...roles];

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      nextRoles = nextRoles.filter((role) => {
        const matchesName = role.name.toLowerCase().includes(searchTerm);
        const matchesDescription = role.description.toLowerCase().includes(searchTerm);
        return matchesName || matchesDescription;
      });
    }

    if (statusFilter !== "all") {
      nextRoles = nextRoles.filter((role) => role.status === statusFilter);
    }

    if (typeFilter !== "all") {
      nextRoles = nextRoles.filter((role) => role.type === typeFilter);
    }

    nextRoles.sort((left, right) => {
      switch (sortOption) {
        case "name-desc":
          return right.name.localeCompare(left.name);
        case "most-users":
          return right.usersCount - left.usersCount;
        case "most-permissions":
          return getPermissionCount(right.permissions) - getPermissionCount(left.permissions);
        default:
          return left.name.localeCompare(right.name);
      }
    });

    return nextRoles;
  }, [roles, search, statusFilter, typeFilter, sortOption]);

  React.useEffect(() => {
    if (!filteredRoles.length) return;
    const stillExists = filteredRoles.some((role) => role.id === selectedRoleId);
    if (!stillExists) {
      setSelectedRoleId(filteredRoles[0].id);
    }
  }, [filteredRoles, selectedRoleId]);

  const permissionSummary = React.useMemo(
    () => getPermissionSummary(draftPermissions),
    [draftPermissions]
  );

  const allRoleStats = React.useMemo(
    () => ({
      totalRoles: roles.length,
      activeRoles: roles.filter((role) => role.status === "active").length,
      customRoles: roles.filter((role) => role.type === "custom").length,
      assignedStaff: roles.reduce((sum, role) => sum + role.usersCount, 0),
    }),
    [roles]
  );

  const roleA = roles.find((role) => role.id === compareRoleA) || roles[0];
  const roleB = roles.find((role) => role.id === compareRoleB) || roles[1] || roles[0];

  const compareRows = React.useMemo(() => {
    const rows = [];
    permissionDefinitions.forEach((permission) => {
      const left = roleA.permissions?.[permission.key] || createBlankRolePermissions()[permission.key];
      const right = roleB.permissions?.[permission.key] || createBlankRolePermissions()[permission.key];
      permissionActions.forEach((action) => {
        rows.push({
          id: `${permission.key}-${action.key}`,
          label: permission.label,
          action: action.label,
          left: left[action.key] ? "Yes" : "No",
          right: right[action.key] ? "Yes" : "No",
          different: left[action.key] !== right[action.key],
        });
      });
    });
    return rows;
  }, [roleA, roleB]);

  function updatePermission(moduleKey, actionKey, nextValue) {
    setSaveStatus("Unsaved changes");
    setDraftPermissions((current) => ({
      ...current,
      [moduleKey]: {
        ...current[moduleKey],
        [actionKey]: nextValue,
      },
    }));
  }

  function handleSelectRole(nextRoleId) {
    if (selectedRole && hasUnsavedChanges && nextRoleId !== selectedRoleId) {
      setPendingRoleId(nextRoleId);
      setShowDiscardConfirm(true);
      return;
    }

    setSelectedRoleId(nextRoleId);
  }

  function handleDiscardChanges() {
    setShowDiscardConfirm(false);
    if (pendingRoleId) {
      setSelectedRoleId(pendingRoleId);
      setPendingRoleId(null);
    }
  }

  function handleSavePermissions() {
    if (!selectedRole) return;

    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== selectedRole.id) return role;
        return { ...role, permissions: clonePermissions(draftPermissions), updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );

    setSaveStatus("Saved successfully");
    setToastMessage("Permissions updated successfully.");
  }

  function handleCancelPermissions() {
    setDraftPermissions(clonePermissions(selectedRole.permissions));
    setSaveStatus("Saved");
  }

  function handleResetPermissions() {
    setShowResetConfirm(false);
    setDraftPermissions(clonePermissions(selectedRole.permissions));
    setSaveStatus("Saved");
    setToastMessage("Permissions restored to the demo default.");
  }

  function handleCreateRole() {
    const trimmedName = createForm.name.trim();
    if (!trimmedName) {
      setCreateError("Role name is required.");
      return;
    }

    if (trimmedName.length > 50) {
      setCreateError("Role name cannot exceed 50 characters.");
      return;
    }

    if (createForm.description.length > 250) {
      setCreateError("Role description cannot exceed 250 characters.");
      return;
    }

    const exists = roles.some((role) => role.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      setCreateError("Role name already exists.");
      return;
    }

    const newRole = {
      id: `role-${Date.now()}`,
      name: trimmedName,
      description: createForm.description.trim() || "Custom role created for specialized access management.",
      type: "custom",
      status: "active",
      usersCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      permissions: clonePermissions(createForm.permissions),
    };

    setRoles((currentRoles) => [newRole, ...currentRoles]);
    setSelectedRoleId(newRole.id);
    setCreateForm({
      name: "",
      description: "",
      permissions: createBlankRolePermissions(),
    });
    setCreateError("");
    setShowCreateModal(false);
    setToastMessage("Role created successfully.");
  }

  function handleDuplicateRole() {
    const trimmedName = duplicateName.trim();
    if (!trimmedName) {
      return;
    }

    const duplicateRole = {
      id: `role-${Date.now()}`,
      name: trimmedName,
      description: selectedRole.description,
      type: "custom",
      status: "active",
      usersCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      permissions: clonePermissions(selectedRole.permissions),
    };

    setRoles((currentRoles) => [duplicateRole, ...currentRoles]);
    setSelectedRoleId(duplicateRole.id);
    setDuplicateName("");
    setShowDuplicateModal(false);
    setToastMessage("Role duplicated successfully.");
  }

  function handleRoleAction(action) {
    if (!selectedRole) return;

    if (action === "activate") {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === selectedRole.id ? { ...role, status: "active", updatedAt: new Date().toISOString().slice(0, 10) } : role
        )
      );
      setToastMessage(`${selectedRole.name} activated.`);
      return;
    }

    if (action === "deactivate") {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === selectedRole.id ? { ...role, status: "inactive", updatedAt: new Date().toISOString().slice(0, 10) } : role
        )
      );
      setToastMessage(`${selectedRole.name} deactivated.`);
      return;
    }

    if (action === "delete") {
      if (selectedRole.type === "system") {
        setToastMessage("System role cannot be deleted.");
        return;
      }
      setShowDeleteModal(true);
    }

    if (action === "edit") {
      setEditForm({
        name: selectedRole.name,
        description: selectedRole.description,
        status: selectedRole.status,
        permissions: clonePermissions(selectedRole.permissions),
      });
      setShowEditModal(true);
    }

    if (action === "duplicate") {
      setDuplicateName(`${selectedRole.name} Copy`);
      setShowDuplicateModal(true);
    }

    if (action === "users") {
      setShowUsersModal(true);
    }
  }

  function confirmDeleteRole() {
    if (!selectedRole || selectedRole.type === "system") return;

    setRoles((currentRoles) => currentRoles.filter((role) => role.id !== selectedRole.id));
    setShowDeleteModal(false);
    const firstAvailable = roles.find((role) => role.id !== selectedRole.id && role.id !== selectedRoleId) || roles[0];
    if (firstAvailable) {
      setSelectedRoleId(firstAvailable.id);
    }
    setToastMessage(`${selectedRole.name} removed from the demo configuration.`);
  }

  function handleEditRoleSave() {
    const trimmedName = editForm.name.trim();
    if (!trimmedName) return;
    if (trimmedName.length > 50) return;
    if (editForm.description.length > 250) return;

    if (selectedRole.type === "system" && selectedRole.name !== trimmedName) {
      setToastMessage("This is a system role. Some core permissions cannot be modified.");
    }

    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== selectedRole.id) return role;
        return {
          ...role,
          name: trimmedName,
          description: editForm.description.trim() || role.description,
          status: editForm.status,
          permissions: clonePermissions(editForm.permissions),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );

    setShowEditModal(false);
    setToastMessage("Role updated successfully.");
  }

  function setGroupPermission(groupItems, value) {
    setDraftPermissions((current) => {
      const nextPermissions = clonePermissions(current);
      groupItems.forEach((moduleKey) => {
        if (!nextPermissions[moduleKey]) return;
        Object.keys(nextPermissions[moduleKey]).forEach((permissionKey) => {
          nextPermissions[moduleKey][permissionKey] = value;
        });
      });
      return nextPermissions;
    });
    setSaveStatus("Unsaved changes");
  }

  const selectedUsers = getRoleUsers(selectedRole.id);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
            <span>/</span>
            <span className="text-slate-700">Roles &amp; Permissions</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roles &amp; Permissions</h1>
          <p className="mt-2 text-sm text-slate-600">Manage administrative roles, staff access levels, and platform permissions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Create Role
          </Button>
          <Link href="/admin/audit-logs" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            View Audit Logs
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-primary-100 p-2 text-primary-700">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Demo Permissions</p>
            <p className="mt-1 text-primary-800/90">
              Role and permission changes are currently stored locally for demonstration only. Production authorization must be enforced server-side.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RoleStatCard icon={LayoutGrid} title="Total Roles" value={allRoleStats.totalRoles} detail="Demo role definitions" />
        <RoleStatCard icon={UserCheck} title="Active Roles" value={allRoleStats.activeRoles} detail="Currently enabled" />
        <RoleStatCard icon={KeyRound} title="Custom Roles" value={allRoleStats.customRoles} detail="User-configured roles" />
        <RoleStatCard icon={Users} title="Assigned Staff" value={allRoleStats.assignedStaff} detail="Users mapped to roles" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search roles"
              placeholder="Search roles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Role Type</label>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="all">All</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Sort</label>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="most-users">Most Users</option>
                <option value="most-permissions">Most Permissions</option>
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<RefreshCcw className="h-3.5 w-3.5" />}
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setTypeFilter("all");
                setSortOption("name-asc");
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {filteredRoles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <p className="text-base font-semibold text-slate-900">No roles found</p>
                <p className="mt-2 text-sm text-slate-600">Try changing your search or filters.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredRoles.map((role) => {
                const isSelected = role.id === selectedRole?.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role.id)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                      isSelected ? "border-primary-200 bg-primary-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-slate-900">{role.name}</p>
                          {role.type === "system" ? (
                            <Badge variant="default" size="sm" className="gap-1">
                              <KeyRound className="h-3 w-3" aria-hidden="true" /> System
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{role.description}</p>
                      </div>
                      <Badge variant={getRoleStatusColor(role.status)} size="sm" className="capitalize">
                        {role.status}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span>{getPermissionCount(role.permissions)} permissions</span>
                      <span className="text-slate-300">•</span>
                      <span>{role.usersCount} users</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedRole?.name}</h2>
                  <Badge variant={getRoleTypeColor(selectedRole?.type)} size="sm" className="capitalize">
                    {selectedRole?.type === "system" ? "System Role" : "Custom Role"}
                  </Badge>
                  <Badge variant={getRoleStatusColor(selectedRole?.status)} size="sm" className="capitalize">
                    {selectedRole?.status}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{selectedRole?.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => handleRoleAction("edit")}>Edit</Button>
                <Button type="button" variant="outline" size="sm" leftIcon={<Copy className="h-3.5 w-3.5" />} onClick={() => handleRoleAction("duplicate")}>Duplicate</Button>
                <Button type="button" variant="outline" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />} onClick={() => handleRoleAction("users")}>View Users</Button>
                {selectedRole?.type === "custom" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={selectedRole.status === "active" ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    onClick={() => handleRoleAction(selectedRole.status === "active" ? "deactivate" : "activate")}
                  >
                    {selectedRole.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                ) : null}
                {selectedRole?.type === "custom" ? (
                  <Button type="button" variant="destructive" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => handleRoleAction("delete")}>Delete</Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" leftIcon={<AlertTriangle className="h-3.5 w-3.5" />} onClick={() => setToastMessage("System role cannot be deleted.")}>Delete</Button>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Type</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {selectedRole?.type === "system" ? <KeyRound className="h-4 w-4 text-primary-600" aria-hidden="true" /> : <UserCheck className="h-4 w-4 text-slate-500" aria-hidden="true" />}
                  {selectedRole?.type === "system" ? "System Role" : "Custom Role"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p>
                <p className="mt-2 text-sm font-semibold capitalize text-slate-800">{selectedRole?.status}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Users</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selectedRole?.usersCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Permissions</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{getPermissionCount(selectedRole?.permissions)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Created</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                  <Clock3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  {formatDate(selectedRole?.createdAt)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                  <Activity className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  {formatDate(selectedRole?.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Permission Summary</p>
                <p className="text-xs text-slate-500">Selected role overview</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className={cn("rounded-full px-2 py-1 font-medium", hasUnsavedChanges ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700")}>
                  {hasUnsavedChanges ? "Unsaved changes" : "Saved"}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {permissionActions.map((action) => (
                <div key={action.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{action.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{permissionSummary[action.key] || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Permission Matrix</h3>
                <p className="text-sm text-slate-600">Adjust local demo permissions for this role.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setRoleSearch("")}>Reset View</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowResetConfirm(true)}>Reset Permissions</Button>
              </div>
            </div>

            {hasUnsavedChanges ? (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Unsaved changes
              </div>
            ) : null}

            <div className="space-y-4">
              {permissionGroups.map((group) => (
                <div key={group.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{group.title}</h4>
                      <span className="text-xs text-slate-500">{group.items.length} modules</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGroupPermission(group.items, true)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setGroupPermission(group.items, false)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-[560px]">
                      <div className="grid grid-cols-[1.5fr_repeat(6,minmax(0,1fr))] gap-2 rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                        <div className="px-2 py-2">Permission</div>
                        {permissionActions.map((action) => (
                          <div key={action.key} className="px-2 py-2 text-center">
                            {action.label}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 space-y-2">
                        {group.items.map((moduleKey) => {
                          const moduleName = permissionDefinitions.find((item) => item.key === moduleKey)?.label || moduleKey;
                          const modulePermissions = draftPermissions?.[moduleKey] || createBlankRolePermissions()[moduleKey];
                          const lockedModule = getLockedPermissions(selectedRole.id).has(moduleKey);

                          return (
                            <div key={moduleKey} className="grid grid-cols-[1.5fr_repeat(6,minmax(0,1fr))] gap-2 rounded-xl border border-slate-200 bg-white p-2">
                              <div className="flex items-center justify-between gap-2 px-2 py-2">
                                <span className="text-sm font-medium text-slate-700">{moduleName}</span>
                                {lockedModule ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600" title="Core Super Admin permissions cannot be changed in this demo.">
                                    <Lock className="h-3 w-3" aria-hidden="true" /> Locked
                                  </span>
                                ) : null}
                              </div>

                              {permissionActions.map((action) => {
                                const isLocked = lockedModule;
                                const checked = Boolean(modulePermissions[action.key]);
                                return (
                                  <div key={`${moduleKey}-${action.key}`} className="flex items-center justify-center px-1 py-2">
                                    <PermissionToggle
                                      label={action.label}
                                      checked={checked}
                                      disabled={isLocked}
                                      title={isLocked ? "Core Super Admin permissions cannot be changed in this demo." : undefined}
                                      onChange={(nextValue) => updatePermission(moduleKey, action.key, nextValue)}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">{saveStatus}</div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" onClick={handleCancelPermissions}>Cancel</Button>
                <Button type="button" onClick={handleSavePermissions}>Save Permissions</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900">Assigned Users</h3>
                <Button type="button" variant="outline" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />} onClick={() => setShowUsersModal(true)}>
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {selectedUsers.map((user) => (
                  <div key={`${selectedRole.id}-${user.email}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{user.name}</p>
                        <p className="truncate text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Role</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">{user.role}</p>
                      <Badge variant={user.status === "Active" ? "success" : "secondary"} size="sm" className="mt-2 capitalize">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <h3 className="text-lg font-bold text-slate-900">Compare Role</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Role A</label>
                  <select
                    value={compareRoleA}
                    onChange={(event) => setCompareRoleA(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Role B</label>
                  <select
                    value={compareRoleB}
                    onChange={(event) => setCompareRoleB(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Permission</span>
                  <span>{roleA.name}</span>
                  <span>{roleB.name}</span>
                </div>
                <div className="max-h-[340px] overflow-y-auto">
                  {compareRows.filter((row) => row.different).slice(0, 18).map((row) => (
                    <div key={row.id} className="grid grid-cols-[1.2fr_0.8fr_0.8fr] border-t border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-800">{row.label} / {row.action}</span>
                      <span className={cn("font-medium", row.left === "Yes" ? "text-emerald-700" : "text-slate-500")}>
                        {row.left}
                      </span>
                      <span className={cn("font-medium", row.right === "Yes" ? "text-emerald-700" : "text-slate-500")}>
                        {row.right}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900">Recent Role Activity</h3>
              <Link href="/admin/audit-logs" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                View Audit Logs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {roleActivityRecords.map((activity) => (
                <div key={`${activity.action}-${activity.actor}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{activity.action}</p>
                    <p className="mt-1 text-sm text-slate-500">{activity.actor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{activity.timestamp}</p>
                    <Badge variant={activity.status === "Success" ? "success" : "warning"} size="sm" className="mt-2">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <ModalShell
        open={showCreateModal}
        title="Create Role"
        description="Add a custom role for local demo permission management."
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="role-name" className="mb-2 block text-sm font-medium text-slate-700">Role Name</label>
            <input
              id="role-name"
              value={createForm.name}
              onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              placeholder="Course Manager"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="role-description" className="mb-2 block text-sm font-medium text-slate-700">Role Description</label>
            <textarea
              id="role-description"
              rows={4}
              value={createForm.description}
              onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              placeholder="Describe the role responsibilities and access scope."
              maxLength={250}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">Role Type</p>
              <Badge variant="info" size="sm">Custom</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-900">Permissions</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {permissionDefinitions.map((permission) => (
                <label key={permission.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <span>{permission.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(createForm.permissions[permission.key]?.view)}
                    onChange={(event) => {
                      setCreateForm((current) => ({
                        ...current,
                        permissions: {
                          ...current.permissions,
                          [permission.key]: {
                            ...current.permissions[permission.key],
                            view: event.target.checked,
                            create: event.target.checked ? current.permissions[permission.key]?.create || false : false,
                            edit: event.target.checked ? current.permissions[permission.key]?.edit || false : false,
                            delete: event.target.checked ? current.permissions[permission.key]?.delete || false : false,
                            approve: event.target.checked ? current.permissions[permission.key]?.approve || false : false,
                            export: event.target.checked ? current.permissions[permission.key]?.export || false : false,
                          },
                        },
                      }));
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {createError ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{createError}</p> : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateRole}>Create Role</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={showDuplicateModal}
        title="Duplicate Role"
        description="Create a copy of this role with a new name and the same permission set."
        onClose={() => setShowDuplicateModal(false)}
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="duplicate-role-name" className="mb-2 block text-sm font-medium text-slate-700">Role Name</label>
            <input
              id="duplicate-role-name"
              value={duplicateName}
              onChange={(event) => setDuplicateName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              maxLength={50}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowDuplicateModal(false)}>Cancel</Button>
            <Button type="button" onClick={handleDuplicateRole}>Duplicate Role</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={showEditModal}
        title={selectedRole?.type === "system" ? "Edit Role" : "Edit Role"}
        description={selectedRole?.type === "system" ? "This is a system role. Some core permissions cannot be modified." : "Update the role description, status, and associated access."}
        onClose={() => setShowEditModal(false)}
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="edit-role-name" className="mb-2 block text-sm font-medium text-slate-700">Role Name</label>
            <input
              id="edit-role-name"
              value={editForm.name}
              onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="edit-role-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="edit-role-description"
              rows={4}
              value={editForm.description}
              onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              maxLength={250}
            />
          </div>

          <div>
            <label htmlFor="edit-role-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select
              id="edit-role-status"
              value={editForm.status}
              onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-900">Permissions</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {permissionDefinitions.map((permission) => (
                <label key={permission.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <span>{permission.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.permissions[permission.key]?.view)}
                    onChange={(event) => {
                      setEditForm((current) => ({
                        ...current,
                        permissions: {
                          ...current.permissions,
                          [permission.key]: {
                            ...current.permissions[permission.key],
                            view: event.target.checked,
                          },
                        },
                      }));
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="button" onClick={handleEditRoleSave}>Save Changes</Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={showUsersModal}
        title={`${selectedRole?.name} assigned users`}
        description="Mock user access assignments for this role."
        onClose={() => setShowUsersModal(false)}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search users"
              placeholder="Search users..."
              value={roleSearch}
              onChange={(event) => setRoleSearch(event.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr] bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span>Name</span>
              <span>Email</span>
              <span>Status</span>
              <span>Assigned</span>
            </div>
            {selectedUsers
              .filter((user) => {
                const query = roleSearch.toLowerCase();
                return !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
              })
              .map((user) => (
                <div key={`${selectedRole.id}-${user.email}-modal`} className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr] items-center border-t border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                  <span className="font-medium text-slate-800">{user.name}</span>
                  <span>{user.email}</span>
                  <span>
                    <Badge variant={user.status === "Active" ? "success" : "secondary"} size="sm" className="capitalize">
                      {user.status}
                    </Badge>
                  </span>
                  <span>Today</span>
                </div>
              ))}
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={showDeleteModal}
        title="Delete Role?"
        description="This role will be removed from the demo configuration. Assigned users will not be affected because this is mock data."
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={confirmDeleteRole}>Delete Role</Button>
        </div>
      </ModalShell>

      <ModalShell
        open={showResetConfirm}
        title="Reset permissions?"
        description="Restore this role's permissions to the default demo configuration?"
        onClose={() => setShowResetConfirm(false)}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
          <Button type="button" onClick={handleResetPermissions}>Reset</Button>
        </div>
      </ModalShell>

      <ModalShell
        open={showDiscardConfirm}
        title="Unsaved permission changes"
        description="You have unsaved permission changes. Continue without saving?"
        onClose={() => setShowDiscardConfirm(false)}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setShowDiscardConfirm(false)}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={handleDiscardChanges}>Discard Changes</Button>
          <Button type="button" onClick={() => setShowDiscardConfirm(false)}>Stay</Button>
        </div>
      </ModalShell>

      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

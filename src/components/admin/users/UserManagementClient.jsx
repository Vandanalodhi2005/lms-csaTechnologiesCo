"use client";

import * as React from "react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminUsers, adminUsersSummary } from "@/constants/adminUsers.js";
import {
  ArrowUpDown,
  Ban,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";

const USERS_PER_PAGE = 10;
const tabOptions = [
  { key: "all", label: "All Users" },
  { key: "student", label: "Students" },
  { key: "instructor", label: "Instructors" },
  { key: "admin", label: "Admins" },
  { key: "inactive", label: "Inactive" },
];

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "instructor", label: "Instructor" },
  { value: "admin", label: "Admin" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const dateOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusVariant(status) {
  const normalized = status?.toLowerCase();
  if (normalized === "active") return "success";
  if (normalized === "inactive") return "secondary";
  if (normalized === "suspended") return "danger";
  return "default";
}

function getRoleVariant(role) {
  const normalized = role?.toLowerCase();
  if (normalized === "student") return "default";
  if (normalized === "instructor") return "info";
  if (normalized === "admin") return "purple";
  return "secondary";
}

function toSentenceCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function formatJoinedDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDateComparisonValue(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 0;
  return date.getTime();
}

function matchesDateFilter(user, filter) {
  if (filter === "all") return true;
  const now = new Date();
  const joined = new Date(`${user.joinedAt}T00:00:00`);
  const diffInDays = Math.floor((now.getTime() - joined.getTime()) / 86400000);

  if (filter === "today") return diffInDays <= 1;
  if (filter === "week") return diffInDays <= 7;
  if (filter === "month") return diffInDays <= 30;
  if (filter === "year") return diffInDays <= 365;
  return true;
}

function ModalShell({ open, title, onClose, children, width = "max-w-2xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className={cn("w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6", width)} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function UserStats() {
  const summaryItems = [
    { label: "Total Users", value: formatNumber(adminUsersSummary.totalUsers), change: "+8.4% this month", icon: Users },
    { label: "Students", value: formatNumber(adminUsersSummary.students), change: "+7.1% this month", icon: Users },
    { label: "Instructors", value: formatNumber(adminUsersSummary.instructors), change: "+3.2% this month", icon: UserCog },
    { label: "Administrators", value: formatNumber(adminUsersSummary.administrators), change: "+1.8% this month", icon: ShieldCheck },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map(({ label, value, change, icon: Icon }) => (
        <article key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
            </div>
            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-emerald-600">{change}</p>
        </article>
      ))}
    </section>
  );
}

function UserFilters({
  search,
  selectedRole,
  selectedStatus,
  selectedDate,
  sortBy,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onDateChange,
  onSortChange,
  onReset,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-slate-700">
            Search users
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search users by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 xl:flex-1">
          <div>
            <label htmlFor="role-filter" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
            <div className="relative">
              <select
                id="role-filter"
                value={selectedRole}
                onChange={(event) => onRoleChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <div className="relative">
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(event) => onStatusChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="date-filter" className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <div className="relative">
              <select
                id="date-filter"
                value={selectedDate}
                onChange={(event) => onDateChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="sort-filter" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
            <div className="relative">
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onReset}
              leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav aria-label="User tabs" className="flex flex-wrap gap-2">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              activeTab === tab.key
                ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
            onClick={() => onChange(tab.key)}
            aria-pressed={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function UserTable({ users, onView, onEdit, onToggleStatus, onDelete, openActionUserId, onOpenActions }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Courses</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.username}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant={getRoleVariant(user.role)} size="sm" className="capitalize">
                  {toSentenceCase(user.role)}
                </Badge>
              </td>
              <td className="max-w-[220px] px-4 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">{user.email}</span>
                </div>
              </td>
              <td className="px-4 py-4">{formatJoinedDate(user.joinedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>{user.courses} {user.courses === 1 ? "course" : "courses"}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant={getStatusVariant(user.status)} size="sm" className="capitalize">
                  {user.status}
                </Badge>
              </td>
              <td className="px-4 py-4">{user.lastActive}</td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onView(user)}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={`View ${user.name}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={`Edit ${user.name}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => onOpenActions(user.id)}
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={`Open actions for ${user.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {user.id === openActionUserId && (
                      <div role="menu" className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        <button type="button" onClick={() => onView(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          <Eye className="h-4 w-4" aria-hidden="true" /> View User
                        </button>
                        <button type="button" onClick={() => onEdit(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit User
                        </button>
                        <button type="button" onClick={() => onToggleStatus(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          {user.status === "active" ? <Ban className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                          {user.status === "active" ? "Suspend User" : "Activate User"}
                        </button>
                        <button type="button" onClick={() => onDelete(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserMobileCard({ user, onView, onEdit, onToggleStatus, onDelete, openActionUserId, onOpenActions }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => onOpenActions(user.id)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`Open actions for ${user.name}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {user.id === openActionUserId && (
            <div role="menu" className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button type="button" onClick={() => onView(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <Eye className="h-4 w-4" aria-hidden="true" /> View User
              </button>
              <button type="button" onClick={() => onEdit(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <Pencil className="h-4 w-4" aria-hidden="true" /> Edit User
              </button>
              <button type="button" onClick={() => onToggleStatus(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                {user.status === "active" ? <Ban className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                {user.status === "active" ? "Suspend User" : "Activate User"}
              </button>
              <button type="button" onClick={() => onDelete(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Role</span>
          <Badge variant={getRoleVariant(user.role)} size="sm" className="capitalize">{toSentenceCase(user.role)}</Badge>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Status</span>
          <Badge variant={getStatusVariant(user.status)} size="sm" className="capitalize">{user.status}</Badge>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Courses</span>
          <span>{user.courses}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Last Active</span>
          <span>{user.lastActive}</span>
        </div>
      </div>
    </div>
  );
}

function UserPagination({ currentPage, totalPages, totalUsers, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const displayStart = (currentPage - 1) * USERS_PER_PAGE + 1;
  const displayEnd = Math.min(currentPage * USERS_PER_PAGE, totalUsers);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{displayStart}–{displayEnd}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalUsers)}</span> users
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pages.slice(0, 5).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500",
              currentPage === page
                ? "bg-primary-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
            )}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function UserManagementClient() {
  const [users, setUsers] = React.useState(adminUsers);
  const [search, setSearch] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedDate, setSelectedDate] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("all");
  const [actionMenuUserId, setActionMenuUserId] = React.useState(null);
  const [viewUser, setViewUser] = React.useState(null);
  const [editUser, setEditUser] = React.useState(null);
  const [deleteUser, setDeleteUser] = React.useState(null);
  const [toggleUser, setToggleUser] = React.useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    role: "student",
    status: "active",
  });
  const [formErrors, setFormErrors] = React.useState({});

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRole, selectedStatus, selectedDate, activeTab]);

  React.useEffect(() => {
    setActionMenuUserId(null);
  }, [currentPage, search, selectedRole, selectedStatus, selectedDate, activeTab]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const filteredUsers = React.useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    let nextUsers = [...users];

    if (lowerSearch) {
      nextUsers = nextUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedRole !== "all") {
      nextUsers = nextUsers.filter((user) => user.role === selectedRole);
    }

    if (selectedStatus !== "all") {
      nextUsers = nextUsers.filter((user) => user.status === selectedStatus);
    }

    if (selectedDate !== "all") {
      nextUsers = nextUsers.filter((user) => matchesDateFilter(user, selectedDate));
    }

    if (activeTab !== "all") {
      if (activeTab === "inactive") {
        nextUsers = nextUsers.filter((user) => user.status === "inactive");
      } else {
        nextUsers = nextUsers.filter((user) => user.role === activeTab);
      }
    }

    if (sortBy === "newest") {
      nextUsers.sort((a, b) => getDateComparisonValue(b.joinedAt) - getDateComparisonValue(a.joinedAt));
    } else if (sortBy === "oldest") {
      nextUsers.sort((a, b) => getDateComparisonValue(a.joinedAt) - getDateComparisonValue(b.joinedAt));
    } else if (sortBy === "name-asc") {
      nextUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      nextUsers.sort((a, b) => b.name.localeCompare(a.name));
    }

    return nextUsers;
  }, [users, search, selectedRole, selectedStatus, selectedDate, sortBy, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice((safePage - 1) * USERS_PER_PAGE, safePage * USERS_PER_PAGE);

  React.useEffect(() => {
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setSelectedDate("all");
    setSortBy("newest");
    setActiveTab("all");
  };

  const handleAddUser = () => {
    const errors = {};

    if (!formValues.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formValues.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = "A valid email is required.";
    }
    if (!formValues.role) {
      errors.role = "Role is required.";
    }
    if (!formValues.status) {
      errors.status = "Status is required.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const newUser = {
      id: `USR${String(Math.max(0, ...users.map((user) => Number(user.id.replace(/\D/g, "")))) + 1).padStart(3, "0")}`,
      name: formValues.name.trim(),
      username: `@${formValues.name.trim().toLowerCase().replace(/\s+/g, "")}`,
      email: formValues.email.trim(),
      role: formValues.role,
      status: formValues.status,
      joinedAt: new Date().toISOString().slice(0, 10),
      courses: 0,
      completedCourses: 0,
      certificates: 0,
      lastActive: "Just now",
      avatar: null,
    };

    setUsers((currentUsers) => [newUser, ...currentUsers]);
    setIsAddUserOpen(false);
    setFormValues({ name: "", email: "", role: "student", status: "active" });
    setFormErrors({});
    setStatusMessage("User created successfully.");
  };

  const handleSaveUser = () => {
    if (!editUser) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editUser.id
          ? {
              ...user,
              name: editUser.name,
              email: editUser.email,
              role: editUser.role,
              status: editUser.status,
            }
          : user
      )
    );

    setEditUser(null);
    setStatusMessage("User updated successfully.");
  };

  const handleToggleStatus = (user) => {
    const targetStatus = user.status === "active" ? "suspended" : "active";
    setToggleUser({ ...user, nextStatus: targetStatus });
  };

  const confirmToggleStatus = () => {
    if (!toggleUser) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === toggleUser.id ? { ...user, status: toggleUser.nextStatus, lastActive: "Just now" } : user
      )
    );

    setToggleUser(null);
    setStatusMessage(
      toggleUser.nextStatus === "suspended" ? `User suspended successfully.` : `User activated successfully.`
    );
  };

  const handleDeleteUser = () => {
    if (!deleteUser) return;
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== deleteUser.id));
    setDeleteUser(null);
    setStatusMessage("User deleted from the demo dataset.");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setActionMenuUserId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <span>Admin</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Users</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Platform access</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">User Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Manage students, instructors, administrators, and other registered users across the EduLearn platform.
            </p>
          </div>

          <Button
            type="button"
            variant="default"
            size="default"
            leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
          {statusMessage}
        </div>
      ) : null}

      <UserStats />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">User Directory</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:flex">
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
            Live demo data
          </div>
        </div>

        <UserFilters
          search={search}
          selectedRole={selectedRole}
          selectedStatus={selectedStatus}
          selectedDate={selectedDate}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onDateChange={setSelectedDate}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />

        <div className="mt-5">
          <UserTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">No users found</h3>
            <p className="mt-2 text-sm text-slate-600">Try changing your search or filter criteria.</p>
            <div className="mt-5 flex justify-center">
              <Button type="button" variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <UserTable
                users={paginatedUsers}
                onView={setViewUser}
                onEdit={setEditUser}
                onToggleStatus={handleToggleStatus}
                onDelete={setDeleteUser}
                openActionUserId={actionMenuUserId}
                onOpenActions={setActionMenuUserId}
              />

              {paginatedUsers.map((user) => (
                <div key={user.id} className="md:hidden">
                  <UserMobileCard
                    user={user}
                    onView={setViewUser}
                    onEdit={setEditUser}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setDeleteUser}
                    openActionUserId={actionMenuUserId}
                    onOpenActions={setActionMenuUserId}
                  />
                </div>
              ))}
            </div>

            <UserPagination
              currentPage={safePage}
              totalPages={totalPages}
              totalUsers={adminUsersSummary.totalUsers}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <ModalShell open={Boolean(isAddUserOpen)} title="Add User" onClose={() => setIsAddUserOpen(false)} width="max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="add-user-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              id="add-user-name"
              type="text"
              value={formValues.name}
              onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
            {formErrors.name ? <p className="mt-1 text-xs text-red-600">{formErrors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="add-user-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="add-user-email"
              type="email"
              value={formValues.email}
              onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
            {formErrors.email ? <p className="mt-1 text-xs text-red-600">{formErrors.email}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-user-role" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <select
                id="add-user-role"
                value={formValues.role}
                onChange={(event) => setFormValues((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
              {formErrors.role ? <p className="mt-1 text-xs text-red-600">{formErrors.role}</p> : null}
            </div>

            <div>
              <label htmlFor="add-user-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select
                id="add-user-status"
                value={formValues.status}
                onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              {formErrors.status ? <p className="mt-1 text-xs text-red-600">{formErrors.status}</p> : null}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddUser}>
              Create User
            </Button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={Boolean(viewUser)} title="User Details" onClose={() => setViewUser(null)} width="max-w-2xl">
        {viewUser ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
              <Avatar name={viewUser.name} size="xl" />
              <div>
                <h4 className="text-2xl font-bold text-slate-900">{viewUser.name}</h4>
                <p className="text-sm text-slate-500">{viewUser.username}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900">{viewUser.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Role</p>
                <div className="mt-2">
                  <Badge variant={getRoleVariant(viewUser.role)} size="sm" className="capitalize">{toSentenceCase(viewUser.role)}</Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(viewUser.status)} size="sm" className="capitalize">{viewUser.status}</Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration Date</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{formatJoinedDate(viewUser.joinedAt)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Last Active</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{viewUser.lastActive}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Courses</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{viewUser.courses}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completed Courses</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{viewUser.completedCourses}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Certificates</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{viewUser.certificates}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Account Information</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Joined on {formatJoinedDate(viewUser.joinedAt)}
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(editUser)} title="Edit User" onClose={() => setEditUser(null)} width="max-w-xl">
        {editUser ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-user-name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                id="edit-user-name"
                type="text"
                value={editUser.name}
                onChange={(event) => setEditUser((current) => current ? { ...current, name: event.target.value } : current)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              />
            </div>

            <div>
              <label htmlFor="edit-user-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="edit-user-email"
                type="email"
                value={editUser.email}
                onChange={(event) => setEditUser((current) => current ? { ...current, email: event.target.value } : current)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-user-role" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <select
                  id="edit-user-role"
                  value={editUser.role}
                  onChange={(event) => setEditUser((current) => current ? { ...current, role: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-user-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select
                  id="edit-user-status"
                  value={editUser.status}
                  onChange={(event) => setEditUser((current) => current ? { ...current, status: event.target.value } : current)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveUser}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell
        open={Boolean(toggleUser)}
        title={toggleUser?.status === "active" ? "Suspend User?" : "Activate User?"}
        onClose={() => setToggleUser(null)}
        width="max-w-md"
      >
        {toggleUser ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Are you sure you want to {toggleUser.nextStatus === "suspended" ? "suspend" : "activate"} {toggleUser.name}?
            </p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setToggleUser(null)}>
                Cancel
              </Button>
              <Button type="button" variant={toggleUser.nextStatus === "suspended" ? "destructive" : "success"} onClick={confirmToggleStatus}>
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteUser)} title="Delete User?" onClose={() => setDeleteUser(null)} width="max-w-md">
        {deleteUser ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              This action will remove the user from the current demo dataset.
            </p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteUser(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      {/* TODO: enforce server-side admin authorization before rendering this page in production. */}
    </div>
  );
}

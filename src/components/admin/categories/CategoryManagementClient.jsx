"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import Badge from "@/components/ui/Badge.jsx";
import Button from "@/components/ui/Button.jsx";
import { adminCategories, adminCategoriesSummary } from "@/constants/adminCategories.js";
import {
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  Layers3,
  Megaphone,
  MoreHorizontal,
  Palette,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Terminal,
  Trash2,
  X,
} from "lucide-react";

const CATEGORIES_PER_PAGE = 8;

const tabs = [
  { key: "all", label: "All Categories" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "popular", label: "Popular" },
  { key: "empty", label: "Empty" },
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const courseCountOptions = [
  { value: "all", label: "All" },
  { value: "0", label: "0 Courses" },
  { value: "1-10", label: "1–10 Courses" },
  { value: "11-50", label: "11–50 Courses" },
  { value: "50+", label: "50+ Courses" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "courses-desc", label: "Most Courses" },
  { value: "courses-asc", label: "Least Courses" },
];

const statusVariantMap = {
  active: "success",
  inactive: "secondary",
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getDateValue(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getCategoryIcon(iconName) {
  const iconMap = {
    Code2,
    Terminal,
    Palette,
    BriefcaseBusiness,
    Megaphone,
    Database,
    Cloud,
    Sparkles,
    Camera,
    FolderOpen,
  };
  return iconMap[iconName] || Layers3;
}

function getCategoryActions(category) {
  const actions = [{ label: "View Category", type: "view" }, { label: "Edit Category", type: "edit" }, { label: "View Subcategories", type: "subcategories" }, { label: "Add Subcategory", type: "add-subcategory" }];

  if (category.status === "active") {
    actions.push({ label: "Deactivate Category", type: "deactivate" });
  } else {
    actions.push({ label: "Activate Category", type: "activate" });
  }

  actions.push({ label: "Delete Category", type: "delete" });
  return actions;
}

function getSubcategoryActions(subcategory) {
  return [{ label: "Edit Subcategory", type: "edit" }, { label: "Delete Subcategory", type: "delete" }];
}

function StatusBadge({ status }) {
  return (
    <Badge variant={statusVariantMap[status] || "secondary"} size="sm" className="capitalize">
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  );
}

function ModalShell({ open, title, onClose, children, width = "max-w-2xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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

function DrawerShell({ open, title, onClose, children, width = "max-w-xl" }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]">
      <div className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function CategoryStats() {
  const summaryItems = [
    { label: "Total Categories", value: formatNumber(adminCategoriesSummary.totalCategories), detail: "All course groups", icon: Layers3 },
    { label: "Active Categories", value: formatNumber(adminCategoriesSummary.activeCategories), detail: "Currently visible", icon: CheckCircle2 },
    { label: "Total Subcategories", value: formatNumber(adminCategoriesSummary.totalSubcategories), detail: "Across all categories", icon: Tag },
    { label: "Uncategorized Courses", value: formatNumber(adminCategoriesSummary.uncategorizedCourses), detail: "Need assignment", icon: FileText },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map(({ label, value, detail, icon: Icon }) => (
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
          <p className="mt-4 text-xs text-slate-500">{detail}</p>
        </article>
      ))}
    </section>
  );
}

function CategoryFilters({
  search,
  status,
  courseCount,
  sortBy,
  onSearchChange,
  onStatusChange,
  onCourseCountChange,
  onSortChange,
  onReset,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex-1">
          <label htmlFor="category-search" className="mb-2 block text-sm font-medium text-slate-700">Search categories</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search categories or subcategories..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:flex-[1.4]">
          <div>
            <label htmlFor="category-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <div className="relative">
              <select id="category-status" value={status} onChange={(event) => onStatusChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="category-course-count" className="mb-2 block text-sm font-medium text-slate-700">Course Count</label>
            <div className="relative">
              <select id="category-course-count" value={courseCount} onChange={(event) => onCourseCountChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {courseCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="category-sort" className="mb-2 block text-sm font-medium text-slate-700">Sort</label>
            <div className="relative">
              <select id="category-sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="outline" onClick={onReset} leftIcon={<Filter className="h-4 w-4" aria-hidden="true" />}>
          Reset Filters
        </Button>
      </div>
    </section>
  );
}

function CategoryTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav aria-label="Category tabs" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={activeTab === tab.key}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              activeTab === tab.key ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function CategoryTable({ categories, onView, onEdit, onSubcategories, onAddSubcategory, onActivate, onDeactivate, onDelete, openActionCategoryId, onOpenActions }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Subcategories</th>
            <th className="px-4 py-3">Courses</th>
            <th className="px-4 py-3">Students</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            return (
              <tr key={category.id} className="border-t border-slate-200 align-middle text-sm text-slate-700">
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{category.name}</p>
                      <p className="truncate text-xs text-slate-500">/{category.slug}</p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">{category.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">{category.subcategories.length} subcategories</p>
                    <button type="button" onClick={() => onSubcategories(category)} className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-md">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-800">{formatNumber(category.courseCount)} courses</td>
                <td className="px-4 py-4 text-slate-800">{formatNumber(category.studentCount)}</td>
                <td className="px-4 py-4"><StatusBadge status={category.status} /></td>
                <td className="px-4 py-4 text-slate-600">{formatDate(category.createdAt)}</td>
                <td className="px-4 py-4 text-slate-600">{formatDate(category.updatedAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" aria-label={`View ${category.name}`} onClick={() => onView(category)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Eye className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" aria-label={`Edit ${category.name}`} onClick={() => onEdit(category)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                    <div className="relative">
                      <button type="button" aria-label={`Open actions for ${category.name}`} onClick={() => onOpenActions(category.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
                      {category.id === openActionCategoryId && (
                        <div role="menu" aria-label={`Actions for ${category.name}`} className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                          {getCategoryActions(category).map((action) => (
                            <button
                              key={action.type}
                              type="button"
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => {
                                if (action.type === "view") onView(category);
                                if (action.type === "edit") onEdit(category);
                                if (action.type === "subcategories") onSubcategories(category);
                                if (action.type === "add-subcategory") onAddSubcategory(category);
                                if (action.type === "activate") onActivate(category);
                                if (action.type === "deactivate") onDeactivate(category);
                                if (action.type === "delete") onDelete(category);
                                onOpenActions(null);
                              }}
                            >
                              {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "subcategories" && <Layers3 className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "add-subcategory" && <Plus className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "activate" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "deactivate" && <X className="h-4 w-4" aria-hidden="true" />}
                              {action.type === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CategoryMobileCard({ category, onView, onEdit, onSubcategories, onAddSubcategory, onActivate, onDeactivate, onDelete, openActionCategoryId, onOpenActions }) {
  const Icon = getCategoryIcon(category.icon);
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{category.name}</p>
            <p className="truncate text-xs text-slate-500">/{category.slug}</p>
          </div>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Open actions for ${category.name}`} onClick={() => onOpenActions(category.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
          {category.id === openActionCategoryId && (
            <div role="menu" aria-label={`Actions for ${category.name}`} className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {getCategoryActions(category).map((action) => (
                <button
                  key={action.type}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    if (action.type === "view") onView(category);
                    if (action.type === "edit") onEdit(category);
                    if (action.type === "subcategories") onSubcategories(category);
                    if (action.type === "add-subcategory") onAddSubcategory(category);
                    if (action.type === "activate") onActivate(category);
                    if (action.type === "deactivate") onDeactivate(category);
                    if (action.type === "delete") onDelete(category);
                    onOpenActions(null);
                  }}
                >
                  {action.type === "view" && <Eye className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "edit" && <Pencil className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "subcategories" && <Layers3 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "add-subcategory" && <Plus className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "activate" && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "deactivate" && <X className="h-4 w-4" aria-hidden="true" />}
                  {action.type === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">{category.description}</p>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Subcategories</span><span>{category.subcategories.length}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Courses</span><span>{formatNumber(category.courseCount)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Students</span><span>{formatNumber(category.studentCount)}</span></div>
        <div className="flex items-center justify-between gap-2"><span className="text-slate-500">Status</span><StatusBadge status={category.status} /></div>
      </div>
    </div>
  );
}

function CategoryPagination({ currentPage, totalPages, totalCategories, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * CATEGORIES_PER_PAGE, totalCategories);

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{startIndex}–{endIndex}</span> of <span className="font-semibold text-slate-900">{formatNumber(totalCategories)}</span> categories</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500",
              currentPage === page ? "bg-primary-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
            )}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export default function CategoryManagementClient() {
  const [categories, setCategories] = React.useState(adminCategories);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [courseCount, setCourseCount] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [activeTab, setActiveTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openActionCategoryId, setOpenActionCategoryId] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubcategoryCategory, setSelectedSubcategoryCategory] = React.useState(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [isSubcategoryFormOpen, setIsSubcategoryFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [editingSubcategory, setEditingSubcategory] = React.useState(null);
  const [categoryForm, setCategoryForm] = React.useState({ name: "", slug: "", description: "", icon: "Code2", status: "active", seoTitle: "", seoDescription: "" });
  const [categoryErrors, setCategoryErrors] = React.useState({});
  const [subcategoryForm, setSubcategoryForm] = React.useState({ name: "", slug: "", description: "", status: "active" });
  const [subcategoryErrors, setSubcategoryErrors] = React.useState({});
  const [activateCategory, setActivateCategory] = React.useState(null);
  const [deactivateCategory, setDeactivateCategory] = React.useState(null);
  const [deleteCategory, setDeleteCategory] = React.useState(null);
  const [deleteSubcategory, setDeleteSubcategory] = React.useState(null);

  React.useEffect(() => {
    setOpenActionCategoryId(null);
  }, [search, status, courseCount, sortBy, activeTab, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, courseCount, activeTab]);

  React.useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = window.setTimeout(() => setStatusMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[role='menu']") && !event.target.closest('[aria-label*="Open actions"]')) {
        setOpenActionCategoryId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredCategories = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    let nextCategories = [...categories];

    if (term) {
      nextCategories = nextCategories.filter((category) => {
        const haystack = [
          category.name,
          category.description,
          category.slug,
          ...(category.subcategories || []).map((subcategory) => `${subcategory.name} ${subcategory.slug}`),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    if (status !== "all") {
      nextCategories = nextCategories.filter((category) => category.status === status);
    }

    if (courseCount !== "all") {
      if (courseCount === "0") nextCategories = nextCategories.filter((category) => category.courseCount === 0);
      if (courseCount === "1-10") nextCategories = nextCategories.filter((category) => category.courseCount > 0 && category.courseCount <= 10);
      if (courseCount === "11-50") nextCategories = nextCategories.filter((category) => category.courseCount >= 11 && category.courseCount <= 50);
      if (courseCount === "50+") nextCategories = nextCategories.filter((category) => category.courseCount > 50);
    }

    if (activeTab === "active") nextCategories = nextCategories.filter((category) => category.status === "active");
    if (activeTab === "inactive") nextCategories = nextCategories.filter((category) => category.status === "inactive");
    if (activeTab === "popular") nextCategories = nextCategories.sort((a, b) => b.courseCount - a.courseCount);
    if (activeTab === "empty") nextCategories = nextCategories.filter((category) => category.courseCount === 0);

    switch (sortBy) {
      case "newest":
        nextCategories.sort((a, b) => getDateValue(b.createdAt) - getDateValue(a.createdAt));
        break;
      case "oldest":
        nextCategories.sort((a, b) => getDateValue(a.createdAt) - getDateValue(b.createdAt));
        break;
      case "name-asc":
        nextCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        nextCategories.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "courses-desc":
        nextCategories.sort((a, b) => b.courseCount - a.courseCount);
        break;
      case "courses-asc":
        nextCategories.sort((a, b) => a.courseCount - b.courseCount);
        break;
      default:
        break;
    }

    return nextCategories;
  }, [categories, search, status, courseCount, sortBy, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCategories = filteredCategories.slice((safeCurrentPage - 1) * CATEGORIES_PER_PAGE, safeCurrentPage * CATEGORIES_PER_PAGE);

  React.useEffect(() => {
    if (safeCurrentPage !== currentPage) setCurrentPage(safeCurrentPage);
  }, [safeCurrentPage, currentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setCourseCount("all");
    setSortBy("newest");
    setActiveTab("all");
    setCurrentPage(1);
  };

  const handleOpenCategoryForm = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        status: category.status,
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", slug: "", description: "", icon: "Code2", status: "active", seoTitle: "", seoDescription: "" });
    }
    setCategoryErrors({});
    setIsCategoryFormOpen(true);
  };

  const validateCategoryForm = () => {
    const errors = {};
    if (!categoryForm.name.trim()) errors.name = "Category name is required.";
    if (!categoryForm.slug.trim()) errors.slug = "Slug is required.";
    if (!categoryForm.description.trim()) errors.description = "Description is required.";
    if (!categoryForm.status) errors.status = "Status is required.";
    return errors;
  };

  const handleCategorySubmit = () => {
    const errors = validateCategoryForm();
    setCategoryErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const nextCategory = {
      id: editingCategory ? editingCategory.id : `CAT-${String(categories.length + 1).padStart(3, "0")}`,
      name: categoryForm.name.trim(),
      slug: slugify(categoryForm.slug || categoryForm.name),
      description: categoryForm.description.trim(),
      icon: categoryForm.icon,
      status: categoryForm.status,
      createdAt: editingCategory ? editingCategory.createdAt : new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      seoTitle: categoryForm.seoTitle.trim(),
      seoDescription: categoryForm.seoDescription.trim(),
      courseCount: editingCategory ? editingCategory.courseCount : 0,
      studentCount: editingCategory ? editingCategory.studentCount : 0,
      averageRating: editingCategory ? editingCategory.averageRating : 0,
      completionRate: editingCategory ? editingCategory.completionRate : 0,
      subcategories: editingCategory ? editingCategory.subcategories : [],
      topCourses: editingCategory ? editingCategory.topCourses : [],
    };

    if (editingCategory) {
      setCategories((current) => current.map((item) => item.id === editingCategory.id ? nextCategory : item));
      setStatusMessage("Category updated successfully.");
    } else {
      setCategories((current) => [nextCategory, ...current]);
      setStatusMessage("Category created successfully.");
    }

    setIsCategoryFormOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "", description: "", icon: "Code2", status: "active", seoTitle: "", seoDescription: "" });
  };

  const handleOpenSubcategoryForm = (category, subcategory = null) => {
    setSelectedSubcategoryCategory(category);
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryForm({
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        status: subcategory.status,
      });
    } else {
      setEditingSubcategory(null);
      setSubcategoryForm({ name: "", slug: "", description: "", status: "active" });
    }
    setSubcategoryErrors({});
    setIsSubcategoryFormOpen(true);
  };

  const validateSubcategoryForm = () => {
    const errors = {};
    if (!subcategoryForm.name.trim()) errors.name = "Subcategory name is required.";
    if (!subcategoryForm.slug.trim()) errors.slug = "Slug is required.";
    if (!subcategoryForm.description.trim()) errors.description = "Description is required.";
    if (!subcategoryForm.status) errors.status = "Status is required.";
    return errors;
  };

  const handleSubcategorySubmit = () => {
    if (!selectedSubcategoryCategory) return;
    const errors = validateSubcategoryForm();
    setSubcategoryErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newSubcategory = {
      id: editingSubcategory ? editingSubcategory.id : `SUB-${String(Date.now()).slice(-6)}`,
      name: subcategoryForm.name.trim(),
      slug: slugify(subcategoryForm.slug || subcategoryForm.name),
      description: subcategoryForm.description.trim(),
      status: subcategoryForm.status,
      courseCount: editingSubcategory ? editingSubcategory.courseCount : 0,
    };

    setCategories((current) =>
      current.map((category) => {
        if (category.id !== selectedSubcategoryCategory.id) return category;
        const nextSubcategories = editingSubcategory
          ? category.subcategories.map((item) => (item.id === editingSubcategory.id ? newSubcategory : item))
          : [newSubcategory, ...(category.subcategories || [])];

        const nextCourseCount = nextSubcategories.reduce((sum, item) => sum + Number(item.courseCount || 0), 0);

        return {
          ...category,
          subcategories: nextSubcategories,
          courseCount: editingSubcategory ? category.courseCount : nextCourseCount,
          studentCount: editingSubcategory ? category.studentCount : category.studentCount,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );

    setStatusMessage(editingSubcategory ? "Subcategory updated successfully." : "Subcategory created successfully.");
    setIsSubcategoryFormOpen(false);
    setSelectedSubcategoryCategory(null);
    setEditingSubcategory(null);
    setSubcategoryForm({ name: "", slug: "", description: "", status: "active" });
  };

  const handleDeleteCategory = () => {
    if (!deleteCategory) return;
    if (deleteCategory.courseCount > 0 || deleteCategory.subcategories.length > 0) {
      setDeleteCategory({ ...deleteCategory, protected: true });
      return;
    }

    setCategories((current) => current.filter((category) => category.id !== deleteCategory.id));
    setDeleteCategory(null);
    setStatusMessage("Category deleted successfully.");
  };

  const handleDeleteSubcategory = () => {
    if (!selectedSubcategoryCategory || !deleteSubcategory) return;
    setCategories((current) =>
      current.map((category) => {
        if (category.id !== selectedSubcategoryCategory.id) return category;
        const remaining = category.subcategories.filter((item) => item.id !== deleteSubcategory.id);
        const nextCourseCount = remaining.reduce((sum, item) => sum + Number(item.courseCount || 0), 0);
        return {
          ...category,
          subcategories: remaining,
          courseCount: nextCourseCount,
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );
    setDeleteSubcategory(null);
    setStatusMessage("Subcategory deleted successfully.");
  };

  const handleStatusToggle = (category, nextStatus) => {
    setCategories((current) => current.map((item) => item.id === category.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString().slice(0, 10) } : item));
    setStatusMessage(`Category ${nextStatus === "active" ? "activated" : "deactivated"} successfully.`);
    setActivateCategory(null);
    setDeactivateCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-primary-600">Admin</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-900">Categories</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Organization</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Category Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Organize EduLearn courses into categories and subcategories for easier discovery and navigation.</p>
          </div>

          <Button type="button" variant="default" onClick={() => handleOpenCategoryForm()} leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
            Add Category
          </Button>
        </div>
      </div>

      {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{statusMessage}</div> : null}

      <CategoryStats />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600"><Layers3 className="h-4 w-4" aria-hidden="true" /><span className="text-sm font-medium">Category Directory</span></div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:flex"><Tag className="h-3.5 w-3.5" aria-hidden="true" />Live catalog</div>
        </div>

        <CategoryFilters
          search={search}
          status={status}
          courseCount={courseCount}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onCourseCountChange={setCourseCount}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />

        <div className="mt-5"><CategoryTabs activeTab={activeTab} onChange={setActiveTab} /></div>
      </div>

      <section className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">No categories found</h3>
            <p className="mt-2 text-sm text-slate-600">Try changing your search or filter criteria.</p>
            <div className="mt-5 flex justify-center"><Button type="button" variant="outline" onClick={handleResetFilters}>Reset Filters</Button></div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <CategoryTable
                categories={paginatedCategories}
                onView={setSelectedCategory}
                onEdit={handleOpenCategoryForm}
                onSubcategories={setSelectedSubcategoryCategory}
                onAddSubcategory={handleOpenSubcategoryForm}
                onActivate={(category) => setActivateCategory(category)}
                onDeactivate={(category) => setDeactivateCategory(category)}
                onDelete={(category) => setDeleteCategory(category)}
                openActionCategoryId={openActionCategoryId}
                onOpenActions={setOpenActionCategoryId}
              />

              {paginatedCategories.map((category) => (
                <CategoryMobileCard
                  key={category.id}
                  category={category}
                  onView={setSelectedCategory}
                  onEdit={handleOpenCategoryForm}
                  onSubcategories={setSelectedSubcategoryCategory}
                  onAddSubcategory={handleOpenSubcategoryForm}
                  onActivate={(item) => setActivateCategory(item)}
                  onDeactivate={(item) => setDeactivateCategory(item)}
                  onDelete={(item) => setDeleteCategory(item)}
                  openActionCategoryId={openActionCategoryId}
                  onOpenActions={setOpenActionCategoryId}
                />
              ))}
            </div>

            <CategoryPagination currentPage={safeCurrentPage} totalPages={totalPages} totalCategories={filteredCategories.length} onPageChange={(page) => setCurrentPage(page)} />
          </>
        )}
      </section>

      <ModalShell open={Boolean(selectedCategory)} title="Category Details" onClose={() => setSelectedCategory(null)} width="max-w-5xl">
        {selectedCategory ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50 text-slate-700">
                {React.createElement(getCategoryIcon(selectedCategory.icon), { className: "h-8 w-8" })}
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">{selectedCategory.name}</h4>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span>/{selectedCategory.slug}</span>
                  <span className="text-slate-300">•</span>
                  <span>{selectedCategory.subcategories.length} subcategories</span>
                  <span className="text-slate-300">•</span>
                  <span>{formatNumber(selectedCategory.courseCount)} courses</span>
                </div>
                <StatusBadge status={selectedCategory.status} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Description</p>
                <p className="mt-2 text-sm text-slate-700">{selectedCategory.description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Created</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(selectedCategory.createdAt)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Updated</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(selectedCategory.updatedAt)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p>
                <div className="mt-2"><StatusBadge status={selectedCategory.status} /></div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h5 className="mb-3 text-lg font-semibold text-slate-900">Category Performance</h5>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Courses</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(selectedCategory.courseCount)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Students</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{formatNumber(selectedCategory.studentCount)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Subcategories</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedCategory.subcategories.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Average Course Rating</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedCategory.averageRating ? selectedCategory.averageRating.toFixed(1) : "0.0"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completion Rate</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedCategory.completionRate}%</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Subcategory Count</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedCategory.subcategories.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h5 className="mb-3 text-lg font-semibold text-slate-900">Top Courses</h5>
                {selectedCategory.topCourses && selectedCategory.topCourses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCategory.topCourses.map((course) => (
                      <div key={course.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{course.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{formatNumber(course.students)} students</p>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400" aria-hidden="true" />
                            <span className="text-xs font-medium text-slate-700">{course.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">No top courses yet.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={isCategoryFormOpen} title={editingCategory ? "Edit Category" : "Add Category"} onClose={() => { setIsCategoryFormOpen(false); setEditingCategory(null); setCategoryErrors({}); }} width="max-w-2xl">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="category-name" className="mb-2 block text-sm font-medium text-slate-700">Category Name</label>
              <input id="category-name" value={categoryForm.name} onChange={(event) => {
                const nextName = event.target.value;
                setCategoryForm((current) => ({ ...current, name: nextName, slug: current.slug || slugify(nextName) }));
                if (categoryErrors.name) setCategoryErrors((current) => ({ ...current, name: "" }));
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="e.g. Web Development" />
              {categoryErrors.name ? <p className="mt-1 text-xs text-red-600">{categoryErrors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="category-slug" className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
              <input id="category-slug" value={categoryForm.slug} onChange={(event) => {
                setCategoryForm((current) => ({ ...current, slug: slugify(event.target.value) }));
                if (categoryErrors.slug) setCategoryErrors((current) => ({ ...current, slug: "" }));
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="web-development" />
              {categoryErrors.slug ? <p className="mt-1 text-xs text-red-600">{categoryErrors.slug}</p> : null}
            </div>

            <div>
              <label htmlFor="category-icon" className="mb-2 block text-sm font-medium text-slate-700">Icon</label>
              <select id="category-icon" value={categoryForm.icon} onChange={(event) => setCategoryForm((current) => ({ ...current, icon: event.target.value }))} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="Code2">Code2</option>
                <option value="Terminal">Terminal</option>
                <option value="Palette">Palette</option>
                <option value="BriefcaseBusiness">BriefcaseBusiness</option>
                <option value="Megaphone">Megaphone</option>
                <option value="Database">Database</option>
                <option value="Cloud">Cloud</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Camera">Camera</option>
                <option value="FolderOpen">FolderOpen</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="category-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea id="category-description" value={categoryForm.description} onChange={(event) => {
                setCategoryForm((current) => ({ ...current, description: event.target.value }));
                if (categoryErrors.description) setCategoryErrors((current) => ({ ...current, description: "" }));
              }} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Describe the category and what learners will discover." />
              {categoryErrors.description ? <p className="mt-1 text-xs text-red-600">{categoryErrors.description}</p> : null}
            </div>

            <div>
              <label htmlFor="category-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="category-status" value={categoryForm.status} onChange={(event) => {
                setCategoryForm((current) => ({ ...current, status: event.target.value }));
                if (categoryErrors.status) setCategoryErrors((current) => ({ ...current, status: "" }));
              }} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {categoryErrors.status ? <p className="mt-1 text-xs text-red-600">{categoryErrors.status}</p> : null}
            </div>

            <div>
              <label htmlFor="category-seo-title" className="mb-2 block text-sm font-medium text-slate-700">SEO Title</label>
              <input id="category-seo-title" value={categoryForm.seoTitle} onChange={(event) => setCategoryForm((current) => ({ ...current, seoTitle: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional SEO title" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="category-seo-description" className="mb-2 block text-sm font-medium text-slate-700">SEO Description</label>
              <textarea id="category-seo-description" value={categoryForm.seoDescription} onChange={(event) => setCategoryForm((current) => ({ ...current, seoDescription: event.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Optional meta description" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { setIsCategoryFormOpen(false); setEditingCategory(null); setCategoryErrors({}); }}>Cancel</Button>
            <Button type="button" onClick={handleCategorySubmit}>{editingCategory ? "Save Changes" : "Create Category"}</Button>
          </div>
        </div>
      </ModalShell>

      <DrawerShell open={Boolean(selectedSubcategoryCategory)} title={selectedSubcategoryCategory ? `${selectedSubcategoryCategory.name} Subcategories` : "Subcategories"} onClose={() => { setSelectedSubcategoryCategory(null); setDeleteSubcategory(null); }}>
        {selectedSubcategoryCategory ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Category</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                  {React.createElement(getCategoryIcon(selectedSubcategoryCategory.icon), { className: "h-5 w-5" })}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedSubcategoryCategory.name}</p>
                  <p className="text-xs text-slate-500">/{selectedSubcategoryCategory.slug}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="default" onClick={() => handleOpenSubcategoryForm(selectedSubcategoryCategory)} leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}>
                Add Subcategory
              </Button>
            </div>

            <div className="space-y-3">
              {selectedSubcategoryCategory.subcategories && selectedSubcategoryCategory.subcategories.length > 0 ? (
                selectedSubcategoryCategory.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{subcategory.name}</p>
                        <p className="text-xs text-slate-500">/{subcategory.slug}</p>
                        <p className="mt-2 text-sm text-slate-600">{subcategory.description}</p>
                      </div>
                      <StatusBadge status={subcategory.status} />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                      <span>{formatNumber(subcategory.courseCount)} courses</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleOpenSubcategoryForm(selectedSubcategoryCategory, subcategory)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                        </button>
                        <button type="button" onClick={() => { setDeleteSubcategory(subcategory); }} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">No subcategories yet.</div>
              )}
            </div>
          </div>
        ) : null}
      </DrawerShell>

      <ModalShell open={isSubcategoryFormOpen} title={editingSubcategory ? "Edit Subcategory" : "Add Subcategory"} onClose={() => { setIsSubcategoryFormOpen(false); setEditingSubcategory(null); setSelectedSubcategoryCategory(null); setSubcategoryErrors({}); }} width="max-w-lg">
        {selectedSubcategoryCategory ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Parent Category</p>
              <p className="mt-2 font-medium text-slate-900">{selectedSubcategoryCategory.name}</p>
            </div>

            <div>
              <label htmlFor="subcategory-name" className="mb-2 block text-sm font-medium text-slate-700">Subcategory Name</label>
              <input id="subcategory-name" value={subcategoryForm.name} onChange={(event) => {
                const nextName = event.target.value;
                setSubcategoryForm((current) => ({ ...current, name: nextName, slug: current.slug || slugify(nextName) }));
                if (subcategoryErrors.name) setSubcategoryErrors((current) => ({ ...current, name: "" }));
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="e.g. Frontend Development" />
              {subcategoryErrors.name ? <p className="mt-1 text-xs text-red-600">{subcategoryErrors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="subcategory-slug" className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
              <input id="subcategory-slug" value={subcategoryForm.slug} onChange={(event) => {
                setSubcategoryForm((current) => ({ ...current, slug: slugify(event.target.value) }));
                if (subcategoryErrors.slug) setSubcategoryErrors((current) => ({ ...current, slug: "" }));
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="frontend-development" />
              {subcategoryErrors.slug ? <p className="mt-1 text-xs text-red-600">{subcategoryErrors.slug}</p> : null}
            </div>

            <div>
              <label htmlFor="subcategory-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea id="subcategory-description" value={subcategoryForm.description} onChange={(event) => {
                setSubcategoryForm((current) => ({ ...current, description: event.target.value }));
                if (subcategoryErrors.description) setSubcategoryErrors((current) => ({ ...current, description: "" }));
              }} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" placeholder="Describe this subcategory." />
              {subcategoryErrors.description ? <p className="mt-1 text-xs text-red-600">{subcategoryErrors.description}</p> : null}
            </div>

            <div>
              <label htmlFor="subcategory-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
              <select id="subcategory-status" value={subcategoryForm.status} onChange={(event) => {
                setSubcategoryForm((current) => ({ ...current, status: event.target.value }));
                if (subcategoryErrors.status) setSubcategoryErrors((current) => ({ ...current, status: "" }));
              }} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {subcategoryErrors.status ? <p className="mt-1 text-xs text-red-600">{subcategoryErrors.status}</p> : null}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsSubcategoryFormOpen(false); setEditingSubcategory(null); setSelectedSubcategoryCategory(null); setSubcategoryErrors({}); }}>Cancel</Button>
              <Button type="button" onClick={handleSubcategorySubmit}>{editingSubcategory ? "Save Changes" : "Create Subcategory"}</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(activateCategory)} title="Activate Category?" onClose={() => setActivateCategory(null)} width="max-w-md">
        {activateCategory ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to activate <span className="font-semibold text-slate-900">{activateCategory.name}</span>?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setActivateCategory(null)}>Cancel</Button>
              <Button type="button" onClick={() => handleStatusToggle(activateCategory, "active")}>Confirm</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deactivateCategory)} title="Deactivate Category?" onClose={() => setDeactivateCategory(null)} width="max-w-md">
        {deactivateCategory ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Are you sure you want to deactivate <span className="font-semibold text-slate-900">{deactivateCategory.name}</span>?</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeactivateCategory(null)}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={() => handleStatusToggle(deactivateCategory, "inactive")}>Confirm</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteCategory)} title="Delete Category?" onClose={() => setDeleteCategory(null)} width="max-w-md">
        {deleteCategory ? (
          <div className="space-y-5">
            {deleteCategory.protected ? (
              <div>
                <p className="text-sm text-slate-700">This category contains courses or subcategories. In a production system, courses should be reassigned before deletion.</p>
                <p className="mt-3 text-sm font-medium text-slate-900">{deleteCategory.name}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">This will remove the category from the current demo dataset.</p>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteCategory(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteCategory} disabled={Boolean(deleteCategory.protected)}>
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell open={Boolean(deleteSubcategory)} title="Delete Subcategory?" onClose={() => setDeleteSubcategory(null)} width="max-w-md">
        {deleteSubcategory ? (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">This will remove the subcategory from the current demo dataset.</p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteSubcategory(null)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteSubcategory}>Delete</Button>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

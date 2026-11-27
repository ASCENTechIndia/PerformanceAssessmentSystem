import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Network,
  User,
  Clock,
  CalendarDays,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Layers,
  Users,
  ListChecks,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../../../apiClient";

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const walk = (nodes, fn) =>
  nodes.forEach((n) => {
    fn(n);
    walk(n.children || [], fn);
  });

const StatusBadge = ({ name, bg, fg }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold whitespace-nowrap"
    style={{ backgroundColor: bg || "#F1F5F9", color: fg || "#475569" }}
  >
    {name || "—"}
  </span>
);

const TreeNode = ({ node, isRoot, isLast, collapsed, onToggle }) => {
  const kids = node.children || [];
  const hasKids = kids.length > 0;
  const isCollapsed = collapsed.has(node.task_id);
  const inactive = node.isactive === "N";

  return (
    <li className={`relative ${isRoot ? "" : "pl-7 pt-3"}`}>
      {/* Connector lines (not for the root) */}
      {!isRoot && (
        <>
          <span
            aria-hidden
            className={`absolute left-0 top-0 w-0.5 bg-slate-300 ${
              isLast ? "h-[39px]" : "h-full"
            }`}
          />
          <span
            aria-hidden
            className="absolute left-0 top-[38px] h-0.5 w-7 bg-slate-300"
          />
        </>
      )}

      {/* Task card */}
      <div
        className={`flex flex-wrap items-start gap-3 rounded-xl border bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md
          ${isRoot ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}
          ${inactive ? "opacity-60" : ""}`}
      >
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold
            ${isRoot ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}
          title={node.engname}
        >
          {getInitials(node.engname)}
        </div>

        {/* Main info */}
        <div className="min-w-[220px] flex-1">
          <p className="text-[13.5px] font-semibold leading-snug text-slate-800">
            {node.task_title}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-slate-600">
              Task Id: {node.task_id}
            </span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-blue-700">
              Assign To: {node.assignedtoname}
            </span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-blue-700">
              Level {node.hierarchy_level}
            </span>
            {isRoot && (
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                Your task
              </span>
            )}
            {inactive && (
              <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-red-600">
                Inactive
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {node.engname || "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {node.excepteddays ?? "—"}{" "}
              {node.excepteddays === 1 ? "day" : "days"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              {node.insdt ? node.insdt.split(" ")[0] : "—"}
            </span>
          </div>
        </div>

        {/* Right side: status + expand */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <StatusBadge
            name={node.statusname}
            bg={node.bgcolor}
            fg={node.forecolor}
          />

          {hasKids ? (
            <button
              onClick={() => onToggle(node.task_id)}
              aria-expanded={!isCollapsed}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200 transition-colors hover:bg-blue-100"
            >
              {kids.length} subtask{kids.length > 1 ? "s" : ""}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isCollapsed ? "-rotate-90" : ""
                }`}
              />
            </button>
          ) : (
            <span className="text-[10.5px] font-medium text-slate-400">
              Not sub-divided
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasKids && !isCollapsed && (
        <ul className="ml-5">
          {kids.map((child, i) => (
            <TreeNode
              key={child.task_id}
              node={child}
              isRoot={false}
              isLast={i === kids.length - 1}
              collapsed={collapsed}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TaskHierarchyModal = ({ open, taskId, onClose }) => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(new Set());

  // Fetch hierarchy when the popup opens
  useEffect(() => {
    if (!open || !taskId) return;
    let cancelled = false;

    const fetchHierarchy = async () => {
      setLoading(true);
      setTree([]);
      setCollapsed(new Set());
      try {
        const res = await apiClient.get(
          `/getHierarchyViewData?taskId=${taskId}`,
        );
        if (cancelled) return;
        setTree(res.success && Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) toast.error("Failed to load task hierarchy");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHierarchy();
    return () => {
      cancelled = true;
    };
  }, [open, taskId]);

  // Lock page scroll + close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Summary numbers
  const stats = useMemo(() => {
    let total = 0;
    let maxLevel = 0;
    const people = new Set();
    const collapsible = []; // parents below level 1 (used by "Collapse all")

    walk(tree, (n) => {
      total += 1;
      maxLevel = Math.max(maxLevel, n.hierarchy_level || 1);
      if (n.engname) people.add(n.engname);
      if (n.children?.length && (n.hierarchy_level || 1) > 1) {
        collapsible.push(n.task_id);
      }
    });

    return { total, maxLevel, people: people.size, collapsible };
  }, [tree]);

  const toggleNode = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
        <div className="h-[3px] w-full flex-shrink-0 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400" />

        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-slate-100 px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Network className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-800">
                Task Hierarchy
              </h2>
              <p className="mt-0.5 text-[12px] text-slate-500">
                See how task #{taskId} was assigned and sub-divided
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Summary + controls */}
        {!loading && tree.length > 0 && (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/60 px-6 py-3">
            {[
              { icon: ListChecks, label: "Tasks", value: stats.total },
              { icon: Layers, label: "Levels", value: stats.maxLevel },
              { icon: Users, label: "People", value: stats.people },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                <span className="text-[13px] font-semibold text-slate-800">
                  {value}
                </span>
                <span className="text-[11.5px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tree area */}
        <div className="flex-1 overflow-auto bg-slate-50/40 p-6">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[84px] animate-pulse rounded-xl bg-slate-100"
                  style={{ marginLeft: i === 0 ? 0 : 48 }}
                />
              ))}
            </div>
          ) : tree.length === 0 ? (
            <div className="mx-auto flex max-w-sm flex-col items-center py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No hierarchy found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                This task has not been assigned or sub-divided yet.
              </p>
            </div>
          ) : (
            <ul className="min-w-[340px] space-y-4">
              {tree.map((root) => (
                <TreeNode
                  key={root.task_id}
                  node={root}
                  isRoot
                  isLast
                  collapsed={collapsed}
                  onToggle={toggleNode}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button onClick={onClose} className="submit-btn">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TaskHierarchyModal;

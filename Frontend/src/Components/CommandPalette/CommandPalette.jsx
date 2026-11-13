import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { ALL_NAV } from "../../Config/menuConfig";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

const CommandPalette = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [recentIds, setRecentIds] = useLocalStorage("pas.command.recents", []);

  /* Build the list: recents first (when no query), then all nav */
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return ALL_NAV.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          (i.group || "").toLowerCase().includes(q),
      );
    }
    const recents = recentIds
      .map((id) => ALL_NAV.find((i) => i.id === id))
      .filter(Boolean)
      .map((i) => ({ ...i, group: `Recent · ${i.group}` }));
    const remaining = ALL_NAV.filter((i) => !recentIds.includes(i.id));
    return [...recents, ...remaining];
  }, [query, recentIds]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const selectItem = (item) => {
    if (!item) return;
    if (item.path) {
      navigate(item.path);
      setRecentIds((prev) =>
        [item.id, ...prev.filter((id) => id !== item.id)].slice(0, 5),
      );
    }
    item.onSelect?.();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        selectItem(items[activeIndex]);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items, activeIndex, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_160ms_ease-out]"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Command palette"
        className="relative w-full max-w-xl bg-white rounded-2xl ring-1 ring-slate-200
          shadow-[0_24px_64px_-16px_rgba(15,23,42,0.4)]
          overflow-hidden animate-[paletteIn_180ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Top brand hairline */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions, or jump to…"
            className="flex-1 bg-transparent outline-none text-[14px] text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center h-6 px-1.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No results for "{query}"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try a different term
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {items.map((item, idx) => {
                const Icon = item.icon;
                const isActive = idx === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => selectItem(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                        transition-colors duration-100
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                          transition-colors duration-100
                          ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {Icon ? (
                          <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                        ) : (
                          <span className="w-1 h-1 rounded-full bg-current" />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-medium truncate">
                          {item.label}
                        </span>
                        {item.group && (
                          <span className="block text-[10.5px] text-slate-400 truncate">
                            {item.group}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 h-10 border-t border-slate-100 bg-slate-50/60 text-[10.5px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9.5px] font-semibold bg-white ring-1 ring-slate-200 rounded">
                ↑
              </kbd>
              <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9.5px] font-semibold bg-white ring-1 ring-slate-200 rounded">
                ↓
              </kbd>
              <span className="ml-1">navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center h-[18px] px-1.5 text-[9.5px] font-semibold bg-white ring-1 ring-slate-200 rounded">
                ↵
              </kbd>
              <span>select</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>PAS Command</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

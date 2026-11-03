import { useState, useEffect } from "react";
import Navbar from "../HOC/Navbar/Navbar";
import Header from "../HOC/Header/Header";
import CommandPalette from "../Components/CommandPalette/CommandPalette";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Layout = ({ title, breadcrumb, children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "pas.sidebar.collapsed",
    false,
  );
  const [paletteOpen, setPaletteOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) setIsMobileOpen((v) => !v);
    else setIsCollapsed((v) => !v);
  };

  /* Global hotkeys: ⌘K / Ctrl+K opens palette; [ toggles sidebar */
  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (
        e.key === "[" &&
        !isMeta &&
        !e.target.closest("input, textarea, [contenteditable]")
      ) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen relative">
      <Navbar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden transition-all duration-300
          bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/40`}
      >
        <Header
          toggleSidebar={handleToggleSidebar}
          onOpenCommandPalette={() => setPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4">
          <div className="max-w-screen-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.08)] overflow-hidden">
              {/* Brand accent strip */}
              <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

              {(title || breadcrumb) && (
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-white via-white to-emerald-50/40">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-sky-500" />
                    <div className="flex-1 min-w-0">
                      {title && (
                        <h1 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight truncate">
                          {title}
                        </h1>
                      )}
                      {breadcrumb && (
                        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Link
                            to={breadcrumb.homeLink || "/dashboard"}
                            className="inline-flex items-center gap-1 hover:text-emerald-600 transition-colors"
                          >
                            <Home className="w-3 h-3" />
                            {breadcrumb.homeText || "Home"}
                          </Link>
                          {breadcrumb.current && (
                            <>
                              <ChevronRight className="w-3 h-3 text-emerald-400/70" />
                              <span className="text-emerald-700 font-medium">
                                {breadcrumb.current}
                              </span>
                            </>
                          )}
                        </nav>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 md:p-4">{children}</div>
            </div>
          </div>
        </main>
      </div>

      {/* Global command palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};

export default Layout;

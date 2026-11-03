import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Shapes, ChevronDown, Gauge } from "lucide-react";
import SidebarItem from "../../Components/SidebarItem";

// 🔹 Icon mapping by menu label
const iconMap = {
  Home: LayoutDashboard,
  Default: Shapes,
};

const STATIC_MENU = [
  {
    MENUID: 1,
    MENUTITLE: "Master",
    children: [
      // { MENUID: 101, MENUTITLE: "Master", PAGEPATH: "" },
    ],
  },
];

const Navbar = ({
  title = "Performance Assessment System",
  isOpen,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({});
  const { pathname } = useLocation();

  // 🔹 Auto-open the section containing the active page
  useEffect(() => {
    STATIC_MENU.forEach((section) => {
      const hasActive = section.children?.some(
        (item) => item.PAGEPATH === pathname,
      );
      if (hasActive) {
        setOpenSections((prev) => ({ ...prev, [section.MENUID]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (menuId) => {
    setOpenSections((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => onClose && onClose()}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-screen w-64 flex flex-col
          bg-white border-r border-slate-200
          shadow-[2px_0_16px_-6px_rgba(15,23,42,0.08)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:-ml-64 md:translate-x-0"}`}
      >
        {/* ---------- Brand accent strip ---------- */}
        <div className="flex-shrink-0 h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        {/* ---------- Brand Header ---------- */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <div
            className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500
            flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(16,185,129,0.55)]"
          >
            <Gauge className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[12.5px] font-semibold text-slate-800 tracking-tight leading-snug">
              {title}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-600/80 mt-1">
              Assessment Suite
            </span>
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Home */}
          <div className="mb-4">
            <SidebarItem
              icon={LayoutDashboard}
              label="Home"
              path="/dashboard"
              isOpen={true}
              onClick={() => onClose && onClose()}
            />
          </div>

          {/* Section label */}
          {STATIC_MENU.length > 0 && (
            <div className="flex items-center gap-2 px-3 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Modules
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            </div>
          )}

          {/* Accordion Menu */}
          <div className="space-y-1">
            {STATIC_MENU.map((section) => {
              const isOpenSection = openSections[section.MENUID] ?? false;

              return (
                <div key={section.MENUID}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.MENUID)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl
                      text-[13.5px] font-semibold transition-colors duration-150 group
                      ${
                        isOpenSection
                          ? "bg-emerald-50/80 text-emerald-700"
                          : "text-slate-600 hover:bg-sky-50 hover:text-slate-800"
                      }`}
                  >
                    <span className="tracking-tight">{section.MENUTITLE}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300
                        ${
                          isOpenSection
                            ? "rotate-180 text-emerald-500"
                            : "text-slate-400 group-hover:text-sky-500"
                        }`}
                    />
                  </button>

                  {/* Children */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpenSection ? "max-h-[600px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                  >
                    <div className="ml-4 pl-3 border-l-2 border-emerald-100/80 space-y-1">
                      {(section.children || []).map((item) => {
                        const Icon = iconMap[item.MENUTITLE] || iconMap.Default;
                        return (
                          <SidebarItem
                            key={item.MENUID}
                            icon={Icon}
                            label={item.MENUTITLE}
                            path={item.PAGEPATH}
                            isOpen={true}
                            onClick={() => onClose && onClose()}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ---------- Footer ---------- */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-sky-50/60">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
            <p className="text-[10px] font-medium text-slate-500">
              © {new Date().getFullYear()} · PAS v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

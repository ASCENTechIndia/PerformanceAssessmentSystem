import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Gauge, LayoutDashboard, Shapes } from "lucide-react";
import SidebarItem from "../../Components/SidebarItem";
import { STATIC_MENU, HOME_ITEM } from "../../Config/menuConfig";

const Navbar = ({
  title = "Performance Assessment System",
  isOpen,
  isCollapsed,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({});
  const { pathname } = useLocation();

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

  const toggleSection = (menuId) =>
    setOpenSections((prev) => ({ ...prev, [menuId]: !prev[menuId] }));

  const railWidth = isCollapsed ? "md:w-16" : "md:w-64";

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
          transition-[transform,width] duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${railWidth}`}
      >
        {/* Brand accent strip — blue → sky → cyan */}
        <div className="flex-shrink-0 h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

        {/* Brand */}
        <div
          className={`flex-shrink-0 flex items-center gap-3 h-16 border-b border-slate-100 transition-all duration-300
            ${isCollapsed ? "md:justify-center md:px-0" : "px-4"} px-4`}
        >
          <div
            className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500
            flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(59,130,246,0.55)]"
          >
            <Gauge className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div
            className={`flex flex-col leading-tight min-w-0 overflow-hidden transition-all duration-200
              ${isCollapsed ? "md:opacity-0 md:w-0" : "opacity-100"}`}
          >
            <span className="text-[12.5px] font-semibold text-slate-800 tracking-tight leading-snug">
              {title}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-600/80 mt-1">
              Assessment Suite
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Home */}
          <div className="mb-4">
            <SidebarItem
              icon={LayoutDashboard}
              label="Home"
              path="/dashboard"
              isOpen={!isCollapsed}
              onClick={() => onClose && onClose()}
            />
          </div>

          {/* Section label */}
          {STATIC_MENU.length > 0 && !isCollapsed && (
            <div className="flex items-center gap-2 px-3 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Modules
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            </div>
          )}

          {/* Accordion */}
          <div className="space-y-1">
            {STATIC_MENU.map((section) => {
              const isOpenSection = openSections[section.MENUID] ?? false;
              return (
                <div key={section.MENUID}>
                  {!isCollapsed && (
                    <button
                      onClick={() => toggleSection(section.MENUID)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl
                        text-[13.5px] font-semibold transition-colors duration-150 group
                        ${
                          isOpenSection
                            ? "bg-blue-50/80 text-blue-700"
                            : "text-slate-600 hover:bg-sky-50 hover:text-slate-800"
                        }`}
                    >
                      <span className="tracking-tight">
                        {section.MENUTITLE}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300
                          ${
                            isOpenSection
                              ? "rotate-180 text-blue-500"
                              : "text-slate-400 group-hover:text-sky-500"
                          }`}
                      />
                    </button>
                  )}

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpenSection || isCollapsed ? "max-h-[600px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
                  >
                    <div
                      className={`${isCollapsed ? "" : "ml-4 pl-3 border-l-2 border-blue-100/80"} space-y-1`}
                    >
                      {(section.children || []).map((item) => (
                        <SidebarItem
                          key={item.MENUID}
                          icon={item.ICON || Shapes}
                          label={item.MENUTITLE}
                          path={item.PAGEPATH}
                          isOpen={!isCollapsed}
                          onClick={() => onClose && onClose()}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={`flex-shrink-0 border-t border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-sky-50/60 transition-all duration-200
            ${isCollapsed ? "md:px-2 md:py-3" : "px-4 py-3"}`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.18)]" />
            {!isCollapsed && (
              <p className="text-[10px] font-medium text-slate-500">
                © {new Date().getFullYear()} · PAS v1.0.0
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, path, isOpen = true, onClick }) => {
  // Collapsed (icon-only) mode
  if (!isOpen) {
    return (
      <NavLink
        to={path || "#"}
        onClick={onClick}
        title={label}
        className={({ isActive }) =>
          `flex items-center justify-center py-2.5 rounded-xl transition-colors duration-150
          ${
            isActive
              ? "bg-emerald-50 text-emerald-600"
              : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
          }`
        }
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
      </NavLink>
    );
  }

  return (
    <NavLink
      to={path || "#"}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium
        transition-all duration-150
        ${
          isActive
            ? "bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.18)]"
            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-emerald-500
              transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
          />
          <Icon
            className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150
              ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-sky-500"}`}
            strokeWidth={2}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;

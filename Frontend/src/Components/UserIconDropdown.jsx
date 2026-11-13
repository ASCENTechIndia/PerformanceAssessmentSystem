import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
// import Cookies from "js-cookie"; // ⚠️ see notes — needed only if your context logout() doesn't clear token cookies

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getInitials = (value = "") => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
};

const UserIconDropdown = ({
  name = "",
  imageUrl = "",
  className = "w-10 h-10",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, logout } = useAuth();
  const wrapperRef = useRef(null);

  const userId = user?.userId;

  /* Close on outside click / Esc */
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      const res = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          in_UserId: String(userId),
          in_ipaddr: "23.3.1",
        }),
      });
      const data = await res.json();
      if (res.ok && data.errorCode === 9999) {
        console.log("Logout successful:", data.errorMessage);
      } else {
        console.warn("Logout API responded with an error:", data);
      }
    } catch (err) {
      console.error("Error calling logout API:", err);
    } finally {
      localStorage.clear();
      logout(); // clears context + redirects
      setUser(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      {/* ---------- Trigger ---------- */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className={`group relative inline-flex items-center justify-center rounded-full
          bg-gradient-to-br from-blue-500 to-sky-500 text-white
          ring-2 ring-white
          shadow-[0_4px_12px_-4px_rgba(59,130,246,0.55)]
          hover:shadow-[0_6px_16px_-4px_rgba(59,130,246,0.7)]
          hover:scale-[1.03] active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
          transition-all duration-150
          ${className}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || "User"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-[11px] font-semibold tracking-wider">
            {getInitials(name)}
          </span>
        )}

        {/* Online dot */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full
            bg-blue-500 ring-2 ring-white"
        />
      </button>

      {/* ---------- Dropdown ---------- */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl
            bg-white ring-1 ring-slate-200
            shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)]
            overflow-hidden z-50"
        >
          {/* Brand accent strip */}
          <div className="h-[3px] bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
            <div className="w-11 h-11 flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || "User"}
                  className="w-full h-full rounded-full object-cover ring-2 ring-blue-100"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center
                    bg-gradient-to-br from-blue-500 to-sky-500 text-white
                    text-sm font-semibold ring-2 ring-blue-100"
                >
                  {getInitials(name)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div
                className="text-sm font-semibold text-slate-800 truncate"
                title={name}
              >
                {name || "User"}
              </div>
              <div
                className="text-[11px] text-slate-500 truncate"
                title={userId}
              >
                {userId ? `ID · ${userId}` : "Signed in"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
                text-[13px] font-medium text-rose-600
                hover:bg-rose-50 hover:text-rose-700
                active:scale-[0.99] transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" strokeWidth={2.2} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIconDropdown;

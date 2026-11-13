import { useState, useEffect, useRef } from "react";
import { Menu, Search, Bell, CheckCheck } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import UserIconDropdown from "../../Components/UserIconDropdown";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Q3 cycle opened",
    body: "Assessments for Q3 are now available.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Review requested",
    body: "Ravi requested your review on EMP-047.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Report ready",
    body: "Department Comparison · Oct 2026 is ready.",
    time: "Yesterday",
    unread: false,
  },
];

const Header = ({ toggleSidebar, onOpenCommandPalette }) => {
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const userName = user?.username;
  const [corpName, setCorpName] = useState("");
  const [corpEName, setCorpEName] = useState("");
  const [logo, setLogo] = useState(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const fetchCorpDetails = async () => {
      if (!ulbId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/textLogo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ulbId }),
        });
        const data = await res.json();
        if (data.success) {
          setCorpName(data.data.ABC_MUNICIPAL_TEXT);
          setCorpEName(data.data.ABC_MUNICIPAL_ETEXT);
          setLogo(data.data.ULBLOGO);
        }
      } catch (err) {
        console.error("Error fetching corporation details:", err);
      }
    };
    fetchCorpDetails();
  }, [ulbId]);

  useEffect(() => {
    if (!notifOpen) return;
    const onDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [notifOpen]);

  return (
    <header
      className="relative  top-0 z-30 w-full h-[67px] px-3 sm:px-4 md:px-6
        bg-white/80 backdrop-blur-md
        border-b border-slate-200/80
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        flex items-center justify-between gap-3"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px
          bg-gradient-to-r from-emerald-300/0 via-emerald-300/60 to-sky-300/0"
      />

      {/* Left */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-600
            hover:bg-sky-50 hover:text-sky-700
            active:scale-95 transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          aria-label="Toggle sidebar"
          title="Toggle sidebar  [  ]"
        >
          <Menu className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center gap-3 min-w-0 px-2">
        {logo && (
          <div
            className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-xl overflow-hidden
            bg-white ring-1 ring-slate-200/80
            shadow-[0_2px_8px_-2px_rgba(15,23,42,0.12)]
            flex items-center justify-center"
          >
            <img
              src={logo}
              alt="Corporation Logo"
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="hidden md:flex flex-col items-center justify-center min-w-0 leading-tight text-center">
          <h1
            className="text-[15px] md:text-[17px] font-semibold text-slate-800 tracking-tight
              truncate max-w-[40vw]"
            title={corpName || corpEName}
          >
            {corpName || corpEName || "Municipal Corporation"}
          </h1>
          <p
            className="text-[9.5px] md:text-[10.5px] font-semibold uppercase tracking-[0.18em]
            bg-blue-500 bg-clip-text text-transparent"
          >
            Performance Assessment System
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-xl
            bg-slate-50 ring-1 ring-slate-200/80 text-slate-500
            hover:bg-white hover:ring-emerald-200
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          title="Search  ⌘K"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-[12px] font-medium">Search</span>
          <kbd
            className="inline-flex items-center h-6 px-1.5 ml-2 text-[10px] font-semibold
            text-slate-500 bg-white ring-1 ring-slate-200 rounded-md"
          >
            ⌘K
          </kbd>
        </button>
        {/* Compact icon search for mobile */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-700
            transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={2.2} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-xl text-slate-600
              hover:bg-sky-50 hover:text-sky-700
              active:scale-95 transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="w-5 h-5" strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500
                ring-2 ring-white animate-pulse"
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white
                ring-1 ring-slate-200 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)]
                overflow-hidden z-50"
            >
              <div className="h-[3px] bg-gradient-to-r from-blue-600 via-blue-400 to-sky-500" />
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-[13px] font-semibold text-slate-800">
                  Notifications
                  {unreadCount > 0 && (
                    <span
                      className="ml-2 inline-flex items-center justify-center px-1.5 h-5 text-[10px]
                      font-semibold text-blue-700 bg-blue-50 rounded-md"
                    >
                      {unreadCount}
                    </span>
                  )}
                </p>
                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, unread: false })),
                    )
                  }
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700
                    inline-flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer
                      ${n.unread ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0
                          ${n.unread ? "bg-blue-500" : "bg-slate-300"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold text-slate-800 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="hidden sm:block h-6 w-px bg-slate-200/80"
          aria-hidden="true"
        />
        <UserIconDropdown name={userName} className="w-9 h-9 md:w-10 md:h-10" />
      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import UserIconDropdown from "../../Components/UserIconDropdown";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = ({ toggleSidebar: parentToggleSidebar }) => {
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const userName = user?.username;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [corpName, setCorpName] = useState("");
  const [corpEName, setCorpEName] = useState("");
  const [logo, setLogo] = useState(null);

  // Fetch corporation details
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    parentToggleSidebar();
  };

  return (
    <header
      className="relative sticky top-0 z-30 w-full h-[81px] px-3 sm:px-4 md:px-6
        bg-white/80 backdrop-blur-md
        border-b border-slate-200/80
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        flex items-center justify-between gap-3"
    >
      {/* Signature bottom hairline */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px
          bg-gradient-to-r from-emerald-300/0 via-emerald-300/60 to-sky-300/0"
      />

      {/* ---------- Left: Menu toggle ---------- */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-600
            hover:bg-sky-50 hover:text-sky-700
            active:scale-95 transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </div>

      {/* ---------- Center: Logo + Title ---------- */}
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

        <div className="flex flex-col items-center justify-center min-w-0 leading-tight text-center">
          <h1
            className="text-md sm:text-base md:text-[17px] font-semibold
              text-slate-800 tracking-tight
              truncate max-w-[60vw] sm:max-w-[50vw] md:max-w-[40vw]"
            title={corpName || corpEName}
          >
            {corpName || corpEName || "Municipal Corporation"}
          </h1>
          <p
            className="text-[9.5px] sm:text-[10px] md:text-[10.5px] font-semibold uppercase tracking-[0.18em]
              bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent"
          >
            Performance Assessment System
          </p>
        </div>
      </div>

      {/* ---------- Right: User dropdown ---------- */}
      <div className="flex items-center gap-3 flex-shrink-0">
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

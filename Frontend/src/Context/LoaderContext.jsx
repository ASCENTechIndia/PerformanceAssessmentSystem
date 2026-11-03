// import { createContext, useState, useContext } from "react";

// const LoaderContext = createContext();

// export const LoaderProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);
//   return (
//     <LoaderContext.Provider value={{ loading, setLoading }}>
//       {children}
//     </LoaderContext.Provider>
//   );
// };

// export const useLoader = () => useContext(LoaderContext);

















import { createContext, useState, useContext, useEffect, useRef } from "react";

const LoaderContext = createContext();


const LoaderOverlay = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={message || "Loading"}
    className="fixed inset-0 z-[9999] flex items-center justify-center
      bg-white/80 backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-4">
      
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500 border-r-sky-500" />
      </div>

      
      {message && (
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em]
          bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
          {message}
        </p>
      )}
    </div>

    {/* Screen-reader fallback */}
    <span className="sr-only">{message || "Loading…"}</span>
  </div>
);


export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => setVisible(true), 150);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading]);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {visible && <LoaderOverlay />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
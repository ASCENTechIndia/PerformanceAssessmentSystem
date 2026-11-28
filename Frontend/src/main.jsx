
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { LoaderProvider } from "./Context/LoaderContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ConfirmationProvider } from "./Context/ConfirmationContext.jsx";

import Spinner from "./Components/Spinner.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <ConfirmationProvider>
          <Spinner />
          <App />

          <Toaster
            position="top-right"
            richColors
            duration={3000}
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "rounded-xl border border-slate-200 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)]",
                title: "text-[13px] font-semibold",
                description: "text-[12px]",
                success: "!bg-emerald-50 !border-emerald-200 !text-emerald-800",
                error: "!bg-rose-50 !border-rose-200 !text-rose-800",
                actionButton: "!bg-emerald-500 !text-white",
              },
            }}
          />
        </ConfirmationProvider>
      </AuthProvider>
    </LoaderProvider>
  </StrictMode>
);

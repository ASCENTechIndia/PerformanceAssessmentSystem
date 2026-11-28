
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationContext = createContext(null);

export const ConfirmationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Are you sure?");
  const [title, setTitle] = useState("Confirm Action");

  const resolveRef = useRef(null);

  const confirmAction = useCallback((customMessage = "Are you sure?", customTitle = "Confirm Action") => {
    // Resolve any previous pending confirmation
    resolveRef.current?.(false);

    setMessage(customMessage);
    setTitle(customTitle);
    setIsOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  return (
    <ConfirmationContext.Provider value={{ confirmAction }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Confirmation Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <h2
                  id="confirmation-title"
                  className="text-lg font-semibold text-slate-800"
                >
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message */}
            <div className="px-5 py-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error(
      "useConfirmation must be used within ConfirmationProvider"
    );
  }

  return context;
};

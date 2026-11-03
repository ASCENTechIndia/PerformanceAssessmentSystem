
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const CustomDropdown = ({
  options = [],
  value = "",
  onChange,
  placeholder = "-- Select --",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className}`}
    >
      {/* Dropdown Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          form-input-box w-full flex items-center justify-between
          border border-gray-400 rounded-xl px-3 py-2
          text-sm text-left bg-white
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div
          className="
            absolute z-50 w-full
            bg-white border border-gray-200
            rounded-xl shadow-lg
            overflow-hidden
            animate-in fade-in slide-in-from-top-1
          "
        >
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto p-1"
          >
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected =
                  String(option.value) === String(value);

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full flex items-center justify-between
                        px-3 py-2.5 text-sm text-left
                        rounded-lg transition-colors duration-150
                        ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {option.label}

                      {isSelected && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">
                No options available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

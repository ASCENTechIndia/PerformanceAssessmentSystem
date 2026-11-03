
import React from "react";

const CustomInput = ({
  value = "",
  onChange,
  placeholder = "Enter here",
  type = "text",
  name,
  disabled = false,
  required = false,
  maxLength,
  minLength,
  allowOnlyNumbers = false,
  allowOnlyLetters = false,
  removeSpecialCharacters = false,
  allowDecimal = false,
  allowNegative = false,
  className = "",
  ...rest
}) => {

  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Only numbers
    if (allowOnlyNumbers) {
      inputValue = inputValue.replace(/[^0-9]/g, "");
    }

    // Numbers with decimal support
    if (allowDecimal) {
      inputValue = inputValue.replace(/[^0-9.]/g, "");

      // Allow only one decimal point
      const parts = inputValue.split(".");
      if (parts.length > 2) {
        inputValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    // Allow negative numbers
    if (allowNegative && !allowOnlyNumbers && !allowDecimal) {
      inputValue = inputValue.replace(/[^0-9-]/g, "");
      inputValue =
        (inputValue.startsWith("-") ? "-" : "") +
        inputValue.replace(/-/g, "");
    }

    // Only letters and spaces
    if (allowOnlyLetters) {
      inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
    }

    // Remove special characters
    if (removeSpecialCharacters) {
      inputValue = inputValue.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    // Maximum length
    if (maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    onChange?.(inputValue);
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      minLength={minLength}
      className={`
        form-input-box w-full
        border border-gray-400
        rounded-xl px-3 py-2
        text-sm
        focus:outline-none
        focus:border-blue-500
        focus:ring-2 focus:ring-blue-200
        disabled:bg-gray-100
        disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    />
  );
};

export default CustomInput;

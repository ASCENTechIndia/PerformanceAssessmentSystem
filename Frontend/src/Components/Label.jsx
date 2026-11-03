import React from "react";

const Label = ({ htmlFor, text, required = false, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 ${className}`}
    >
      <span className="text-[#007A70] ml-3">{text}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Label;

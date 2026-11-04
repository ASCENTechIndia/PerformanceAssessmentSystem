import React from "react";

const Label = ({ htmlFor, text, required = false, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`${className ? className : "pas-label"}`}
    >
      <span className="">{text}</span>
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
};

export default Label;

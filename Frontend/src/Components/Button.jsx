import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary, secondary, danger
  size = "md", // sm, md, lg
  disabled = false,
  className = "",
  ...rest
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
    "transition-all duration-150 select-none whitespace-nowrap " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  // const variantStyles = {
  //   primary:
  //     "bg-blue-600 text-white shadow-sm " +
  //     "hover:bg-blue-700 hover:shadow " +
  //     "active:scale-[0.98] " +
  //     "focus:ring-blue-500/40",

  //   secondary:
  //     "bg-white text-slate-700 border border-slate-300 shadow-sm " +
  //     "hover:bg-slate-50 hover:border-slate-400 " +
  //     "active:scale-[0.98] " +
  //     "focus:ring-slate-400/40",

  //   danger:
  //     "bg-red-600 text-white shadow-sm " +
  //     "hover:bg-red-700 hover:shadow " +
  //     "active:scale-[0.98] " +
  //     "focus:ring-red-500/40",
  // };

  const variantStyles = {
    primary:
      "bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-sm " +
      "hover:from-green-700 hover:to-blue-700 hover:shadow-md " +
      "active:scale-[0.98] " +
      "focus:ring-green-500/40",

    secondary:
      "bg-gradient-to-br from-amber-100 to-amber-50 text-slate-700 border border-green-200 shadow-sm " +
      "hover:from-green-200 hover:to-amber-100 hover:shadow-md " +
      "active:scale-[0.98] " +
      "focus:ring-green-400/40",

    danger:
      "bg-gradient-to-r from-red-900 to-red-600 text-white shadow-sm " +
      "hover:from-red-950 hover:to-red-700 hover:shadow-md " +
      "active:scale-[0.98] " +
      "focus:ring-red-500/40",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

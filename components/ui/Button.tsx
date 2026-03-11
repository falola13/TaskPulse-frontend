import clsx from "clsx";
import React from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset";
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  type = "button",
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2 transition-offset-2 transition";
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/80 focus:ring-blue-500",
    secondary:
      "bg-secondary text-white text-gray-8-- hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-none border border-primary text-black",
  };
  return (
    <button
      type={type}
      className={clsx(baseStyles, variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="size-6 border-secondary border-t-2 border-b-2 rounded-full  animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

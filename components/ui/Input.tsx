import clsx from "clsx";
import React, { forwardRef } from "react";

type InputProps = {
  label: string;
  name?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", error, className, icon, ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col space-y-1", className)}>
        <label
          htmlFor={props.id || props.name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={clsx(
              "w-full py-2 border rounded-md text-white focus:outline-none focus:ring-1 focus:ring-primary",
              error ? "border-red-500" : "border-gray-300",
              icon ? "pr-10 pl-3" : "px-3",
            )}
            {...props}
          />
          {icon && (
            <span className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {icon}
            </span>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;

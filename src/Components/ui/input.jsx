// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
"use client";
import React from "react";
import { cn } from "../../utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const Input = React.forwardRef(
  ({ className, type = "text", wrapperClass, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div className={cn("relative", wrapperClass)}>
        <input
          ref={ref}
          type={inputType}
          className={cn(
            // added 'aceternity-input' for hover animation
            "aceternity-input block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-2 z-10 flex items-center rounded px-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full status-badge";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    open: "bg-blue-100 text-blue-800 border border-blue-200",
    inProgress: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    resolved: "bg-green-100 text-green-800 border border-green-200",
    closed: "bg-gray-100 text-gray-600 border border-gray-200",
    critical: "bg-red-100 text-red-800 border border-red-200",
    high: "bg-orange-100 text-orange-800 border border-orange-200",
    medium: "bg-blue-100 text-blue-800 border border-blue-200",
    low: "bg-gray-100 text-gray-600 border border-gray-200"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
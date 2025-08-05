import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
          isActive
            ? "active text-white"
            : "text-gray-700 hover:text-gray-900",
          className
        )
      }
    >
      <ApperIcon name={icon} size={18} className="mr-3" />
      {children}
    </NavLink>
  );
};

export default NavItem;
import React from "react";
import Button from "@/components/atoms/Button";
import Breadcrumbs from "@/components/molecules/Breadcrumbs";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMobileMenuToggle, title, showNewButton = false, onNewClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <div className="ml-4 lg:ml-0">
            <Breadcrumbs />
          </div>
        </div>

        {showNewButton && (
          <Button onClick={onNewClick} className="gap-2">
            <ApperIcon name="Plus" size={16} />
            New Issue
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
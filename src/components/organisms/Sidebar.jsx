import React from "react";
import { motion } from "framer-motion";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden modal-backdrop"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" size={20} className="text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">TrackFlow</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/dashboard" icon="LayoutDashboard">
            Dashboard
          </NavItem>
          <NavItem to="/issues" icon="Bug">
            Issues
          </NavItem>
          <NavItem to="/projects" icon="Folder">
            Projects
          </NavItem>
          <NavItem to="/reports" icon="BarChart3">
            Reports
          </NavItem>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" size={20} className="text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">TrackFlow</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/dashboard" icon="LayoutDashboard">
            Dashboard
          </NavItem>
          <NavItem to="/issues" icon="Bug">
            Issues
          </NavItem>
          <NavItem to="/projects" icon="Folder">
            Projects
          </NavItem>
          <NavItem to="/reports" icon="BarChart3">
            Reports
          </NavItem>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
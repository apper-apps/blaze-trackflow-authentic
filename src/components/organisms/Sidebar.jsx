import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

        {/* User Profile and Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          {user && (
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.emailAddress}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.emailAddress}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="LogOut" size={16} className="mr-3" />
            Logout
          </button>
        </div>
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
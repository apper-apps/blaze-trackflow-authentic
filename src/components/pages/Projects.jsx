import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Projects = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Organize and manage your projects</p>
        </div>

        {/* Placeholder for future projects content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Folder" size={32} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Projects Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            This section will help you organize issues by projects, manage project settings, and track project progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
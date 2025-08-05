import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your team's progress and performance</p>
        </div>

        {/* Placeholder for future dashboard content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BarChart3" size={32} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            This section will display key metrics, charts, and insights about your team's issue tracking performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(x => x);

  const breadcrumbNames = {
    dashboard: "Dashboard",
    issues: "Issues",
    projects: "Projects",
    reports: "Reports"
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link 
        to="/" 
        className="hover:text-primary-600 transition-colors duration-200"
      >
        TrackFlow
      </Link>
      
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNames[pathname] || pathname;

        return (
          <React.Fragment key={pathname}>
            <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{displayName}</span>
            ) : (
              <Link 
                to={routeTo}
                className="hover:text-primary-600 transition-colors duration-200"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
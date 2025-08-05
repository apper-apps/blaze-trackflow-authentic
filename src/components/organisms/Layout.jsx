import React, { Children, cloneElement, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
const isIssuesPage = location.pathname === "/issues";
  const isDashboardPage = location.pathname === "/dashboard";
  const isProjectsPage = location.pathname === "/projects" || location.pathname.startsWith("/projects/");
  const handleNewIssue = () => {
    // Find the Issues component and call its handleNewIssue method
    const issuesChild = Children.toArray(children).find(child => 
      child.type?.name === 'Issues'
    );
    if (issuesChild && issuesChild.ref?.current?.handleNewIssue) {
      issuesChild.ref.current.handleNewIssue();
    }
  };

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <div className="flex flex-col flex-1 lg:ml-64">
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
showNewButton={isIssuesPage || isDashboardPage || isProjectsPage}
          onNewClick={() => {
            if (isIssuesPage && window.handleNewIssue) {
              window.handleNewIssue();
            } else if (isDashboardPage) {
              // Navigate to issues page and trigger new issue modal
              window.location.href = '/issues';
              setTimeout(() => {
                if (window.handleNewIssue) {
                  window.handleNewIssue();
                }
              }, 100);
            } else if (isProjectsPage && window.handleNewProject) {
              window.handleNewProject();
            }
          }}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full overflow-y-auto">
            {isIssuesPage ? 
              cloneElement(children, { onNewIssueRef: handleNewIssue }) : 
              children
            }
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
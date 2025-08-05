import React, { useEffect, useState } from "react";
import CreateIssueModal from "@/components/organisms/CreateIssueModal";
import { toast } from "react-toastify";
import { issueService } from "@/services/api/issueService";
import SearchBar from "@/components/molecules/SearchBar";
import IssuesTable from "@/components/organisms/IssuesTable";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
function Issues({ onNewIssueRef }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError("Failed to load issues. Please try again.");
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleNewIssue = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateIssue = async (issueData) => {
    try {
      await issueService.create(issueData);
      await loadIssues();
      toast.success("Issue created successfully!");
    } catch (error) {
      toast.error("Failed to create issue");
      throw error;
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedIssue(null);
    setIsModalOpen(false);
  };
// Expose handleNewIssue to parent Layout component
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.handleNewIssue = handleNewIssue;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.handleNewIssue;
      }
    };
  }, []);
const filteredIssues = issues.filter(issue =>
    issue?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue?.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue?.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <p className="text-gray-600 mt-1">Track and manage all your team's issues</p>
          </div>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <p className="text-gray-600 mt-1">Track and manage all your team's issues</p>
          </div>
          <Error message={error} onRetry={loadIssues} />
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <p className="text-gray-600 mt-1">Track and manage all your team's issues</p>
          </div>
<Empty 
            title="No Issues Yet"
            description="Get started by creating your first issue."
            actionLabel="Create Issue"
            onAction={handleNewIssue}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600 mt-1">Track and manage all your team's issues</p>
        </div>

        <div className="mb-6">
          <div className="max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search issues by title, assignee, or project..."
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredIssues.length} of {issues.length} issues
            </p>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <Empty 
            title="No Matching Issues"
            description={`No issues found matching "${searchTerm}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <IssuesTable 
            issues={filteredIssues} 
            onIssueClick={handleIssueClick}
          />
        )}

<IssueDetailModal
          issue={selectedIssue}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
        
        <CreateIssueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateIssue}
        />
      </div>
    </div>
  );
};

export default Issues;
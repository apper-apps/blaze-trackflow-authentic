import React, { useState, useEffect } from "react";
import IssuesTable from "@/components/organisms/IssuesTable";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { issueService } from "@/services/api/issueService";
import { toast } from "react-toastify";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.project.toLowerCase().includes(searchTerm.toLowerCase())
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
            onAction={() => toast.info("New issue creation coming soon!")}
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
      </div>
    </div>
  );
};

export default Issues;
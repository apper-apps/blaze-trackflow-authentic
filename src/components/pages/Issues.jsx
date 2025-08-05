import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { issueService } from "@/services/api/issueService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import CreateIssueModal from "@/components/organisms/CreateIssueModal";
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
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [assigneeFilters, setAssigneeFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);

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
    console.log('Issues: handleNewIssue function called directly');
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
      console.log('Issues: Exposing handleNewIssue to window');
      window.handleNewIssue = () => {
        console.log('Issues: handleNewIssue called from window');
        try {
          handleNewIssue();
        } catch (error) {
          console.error('Issues: Error in handleNewIssue:', error);
          // Fallback - directly set modal state
          setIsCreateModalOpen(true);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        console.log('Issues: Cleaning up window.handleNewIssue');
        delete window.handleNewIssue;
      }
    };
  }, []);

  // Get unique values for filters
  const uniqueStatuses = [...new Set(issues.map(issue => issue.status))];
  const uniquePriorities = [...new Set(issues.map(issue => issue.priority))];
  const uniqueAssignees = [...new Set(issues.map(issue => issue.assignee).filter(Boolean))];
  const uniqueTypes = [...new Set(issues.map(issue => issue.type).filter(Boolean))];

  // Filter functions
  const toggleStatusFilter = (status) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const togglePriorityFilter = (priority) => {
    setPriorityFilters(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleAssigneeFilter = (assignee) => {
    setAssigneeFilters(prev => 
      prev.includes(assignee) 
        ? prev.filter(a => a !== assignee)
        : [...prev, assignee]
    );
  };

  const toggleTypeFilter = (type) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
    setAssigneeFilters([]);
    setTypeFilters([]);
    setSearchTerm("");
  };

  const filteredIssues = issues.filter(issue => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      issue?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue?.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue?.project?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(issue.status);
    
    // Priority filter
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(issue.priority);
    
    // Assignee filter
    const matchesAssignee = assigneeFilters.length === 0 || assigneeFilters.includes(issue.assignee);
    
    // Type filter
    const matchesType = typeFilters.length === 0 || typeFilters.includes(issue.type);

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesType;
  });

const hasActiveFilters = statusFilters.length > 0 || priorityFilters.length > 0 || 
    assigneeFilters.length > 0 || typeFilters.length > 0 || searchTerm.length > 0;
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
              placeholder="Search issues by title, description, assignee, or project..."
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Status:</span>
                {uniqueStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      statusFilters.includes(status)
                        ? 'bg-primary-100 text-primary-800 ring-2 ring-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    {statusFilters.includes(status) && (
                      <ApperIcon name="X" size={12} className="ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Priority Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Priority:</span>
                {uniquePriorities.map(priority => (
                  <button
                    key={priority}
                    onClick={() => togglePriorityFilter(priority)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      priorityFilters.includes(priority)
                        ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    {priorityFilters.includes(priority) && (
                      <ApperIcon name="X" size={12} className="ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Assignee Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Assignee:</span>
                {uniqueAssignees.map(assignee => (
                  <button
                    key={assignee}
                    onClick={() => toggleAssigneeFilter(assignee)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      assigneeFilters.includes(assignee)
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {assignee}
                    {assigneeFilters.includes(assignee) && (
                      <ApperIcon name="X" size={12} className="ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Type:</span>
                {uniqueTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      typeFilters.includes(type)
                        ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                    {typeFilters.includes(type) && (
                      <ApperIcon name="X" size={12} className="ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <ApperIcon name="X" size={12} className="mr-1" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredIssues.length} of {issues.length} issues
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  Filtered
                </span>
              )}
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
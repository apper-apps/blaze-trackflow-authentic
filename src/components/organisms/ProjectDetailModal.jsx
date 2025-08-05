import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import IssuesTable from "@/components/organisms/IssuesTable";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";
import ApperIcon from "@/components/ApperIcon";
import { issueService } from "@/services/api/issueService";

const ProjectDetailModal = ({ project, onClose, onEdit, onDelete }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadProjectIssues();
  }, [project.Id]);

  const loadProjectIssues = async () => {
    try {
      setLoading(true);
      const allIssues = await issueService.getAll();
      const projectIssues = allIssues.filter(issue => issue.projectId === project.Id);
      setIssues(projectIssues);
    } catch (error) {
      console.error('Failed to load project issues:', error);
      toast.error('Failed to load project issues');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueStats = () => {
    return {
      total: issues.length,
      open: issues.filter(issue => issue.status === 'Open').length,
      inProgress: issues.filter(issue => issue.status === 'In Progress').length,
      resolved: issues.filter(issue => issue.status === 'Resolved').length,
      closed: issues.filter(issue => issue.status === 'Closed').length
    };
  };

  const getPriorityStats = () => {
    return {
      critical: issues.filter(issue => issue.priority === 'Critical').length,
      high: issues.filter(issue => issue.priority === 'High').length,
      medium: issues.filter(issue => issue.priority === 'Medium').length,
      low: issues.filter(issue => issue.priority === 'Low').length
    };
  };

  const handleEditProject = async (projectData) => {
    try {
      await onEdit(project.Id, projectData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to edit project:', error);
    }
  };

  const stats = getIssueStats();
  const priorityStats = getPriorityStats();

  const tabs = [
    { id: "overview", label: "Overview", icon: "BarChart3" },
    { id: "issues", label: "Issues", icon: "Bug" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Folder" size={24} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
              <Badge variant="secondary" className={`mt-1 ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(true)}
              className="gap-2"
            >
              <ApperIcon name="Edit2" size={16} />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(project.Id)}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} />
              Delete
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Issue Status Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Issue Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Issues</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Open</span>
                      <span className="font-medium text-blue-600">{stats.open}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-600">In Progress</span>
                      <span className="font-medium text-yellow-600">{stats.inProgress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Resolved</span>
                      <span className="font-medium text-green-600">{stats.resolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Closed</span>
                      <span className="font-medium text-gray-600">{stats.closed}</span>
                    </div>
                  </div>
                </div>

                {/* Priority Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Priority Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Critical</span>
                      <span className="font-medium text-red-600">{priorityStats.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-orange-600">High</span>
                      <span className="font-medium text-orange-600">{priorityStats.high}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-600">Medium</span>
                      <span className="font-medium text-yellow-600">{priorityStats.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Low</span>
                      <span className="font-medium text-green-600">{priorityStats.low}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "issues" && (
            <div>
              {loading ? (
                <Loading />
              ) : (
                <IssuesTable 
                  issues={issues} 
                  onIssueUpdate={loadProjectIssues}
                  showProjectFilter={false}
                />
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <CreateProjectModal
            project={project}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditProject}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetailModal;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";
import { issueService } from "@/services/api/issueService";

const IssueDetailModal = ({ issue, isOpen, onClose, onIssueUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        status: issue.status || "open",
        priority: issue.priority || "medium",
        assignee: issue.assignee || "",
        dueDate: issue.dueDate || "",
        labels: issue.labels || []
      });
    }
  }, [issue]);

  if (!issue) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const formatDateInput = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLabelChange = (labels) => {
    const labelArray = labels.split(",").map(l => l.trim()).filter(l => l);
    handleFieldChange("labels", labelArray);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedIssue = await issueService.update(issue.Id, formData);
      toast.success("Issue updated successfully!");
      setIsEditing(false);
      if (onIssueUpdate) {
        onIssueUpdate(updatedIssue);
      }
    } catch (error) {
      toast.error("Failed to update issue: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: issue.title || "",
      description: issue.description || "",
      status: issue.status || "open",
      priority: issue.priority || "medium",
      assignee: issue.assignee || "",
      dueDate: issue.dueDate || "",
      labels: issue.labels || []
    });
    setIsEditing(false);
  };

  const assigneeOptions = [
    { value: "Sarah Johnson", label: "Sarah Johnson" },
    { value: "Mike Chen", label: "Mike Chen" },
    { value: "Emily Rodriguez", label: "Emily Rodriguez" },
    { value: "David Kim", label: "David Kim" },
    { value: "Lisa Park", label: "Lisa Park" },
    { value: "John Anderson", label: "John Anderson" },
    { value: "Alex Thompson", label: "Alex Thompson" },
    { value: "Rachel Green", label: "Rachel Green" },
    { value: "Tom Wilson", label: "Tom Wilson" },
    { value: "Maria Garcia", label: "Maria Garcia" },
    { value: "Chris Lee", label: "Chris Lee" },
    { value: "Kevin Brown", label: "Kevin Brown" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 modal-backdrop"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Issue #{issue.Id}
                  </h2>
                  {!isEditing && <StatusBadge status={issue.status} />}
                  {!isEditing && <PriorityBadge priority={issue.priority} />}
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <ApperIcon name="Edit" size={16} />
                      Edit
                    </Button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>

              {/* Content - Two Column Layout */}
              <div className="flex overflow-hidden max-h-[calc(90vh-180px)]">
                {/* Main Content - 70% */}
                <div className="flex-1 p-6 overflow-y-auto" style={{ flexBasis: '70%' }}>
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.title}
                          onChange={(e) => handleFieldChange("title", e.target.value)}
                          className="text-lg font-medium"
                          placeholder="Issue title"
                        />
                      ) : (
                        <h3 className="text-lg font-medium text-gray-900">
                          {issue.title}
                        </h3>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      {isEditing ? (
                        <Textarea
                          value={formData.description}
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                          rows={8}
                          placeholder="Describe the issue in detail..."
                          className="resize-none"
                        />
                      ) : (
                        <div className="bg-gray-50 rounded-md p-4">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {issue.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Comments Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Comments
                      </h4>
                      <div className="space-y-4">
                        {/* Comment Input */}
                        <div className="border rounded-lg p-4">
                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                            className="mb-3"
                          />
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              disabled={!newComment.trim()}
                              onClick={() => {
                                toast.info("Comment functionality coming soon!");
                                setNewComment("");
                              }}
                            >
                              Add Comment
                            </Button>
                          </div>
                        </div>
                        
                        {/* Placeholder for existing comments */}
                        <div className="text-center py-8 text-gray-500">
                          <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - 30% */}
                <div className="border-l border-gray-200 bg-gray-50 overflow-y-auto" style={{ flexBasis: '30%' }}>
                  <div className="p-6 space-y-6">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <Select
                          value={formData.status}
                          onChange={(e) => handleFieldChange("status", e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </Select>
                      ) : (
                        <StatusBadge status={issue.status} />
                      )}
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      {isEditing ? (
                        <Select
                          value={formData.priority}
                          onChange={(e) => handleFieldChange("priority", e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </Select>
                      ) : (
                        <PriorityBadge priority={issue.priority} />
                      )}
                    </div>

                    {/* Assignee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee
                      </label>
                      {isEditing ? (
                        <Select
                          value={formData.assignee}
                          onChange={(e) => handleFieldChange("assignee", e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {assigneeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {issue.assignee?.charAt(0) || "?"}
                          </div>
                          <span className="text-gray-900">{issue.assignee || "Unassigned"}</span>
                        </div>
                      )}
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={formData.dueDate ? formatDateInput(formData.dueDate) : ""}
                          onChange={(e) => handleFieldChange("dueDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                        />
                      ) : (
                        <span className="text-gray-600">
                          {issue.dueDate ? formatDate(issue.dueDate) : "Not set"}
                        </span>
                      )}
                    </div>

                    {/* Labels */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Labels
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.labels?.join(", ") || ""}
                          onChange={(e) => handleLabelChange(e.target.value)}
                          placeholder="frontend, urgent, mobile"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {issue.labels?.length > 0 ? (
                            issue.labels.map((label, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                              >
                                {label}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No labels</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Project */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project
                      </label>
                      <span className="text-gray-900">{issue.project}</span>
                    </div>

                    {/* Timestamps */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Created
                        </label>
                        <span className="text-sm text-gray-600">
                          {formatDate(issue.createdDate)}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Updated
                        </label>
                        <span className="text-sm text-gray-600">
                          {formatDate(issue.updatedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Save" size={16} />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={onClose}>
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailModal;
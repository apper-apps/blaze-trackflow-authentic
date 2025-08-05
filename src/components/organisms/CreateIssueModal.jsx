import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";

const CreateIssueModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Bug",
    priority: "medium",
    status: "open",
    assignee: "",
    project: "",
    labels: "",
    dueDate: "",
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    { value: "Bug", label: "Bug" },
    { value: "Feature Request", label: "Feature Request" },
    { value: "Task", label: "Task" },
    { value: "Improvement", label: "Improvement" }
  ];

  const priorities = [
    { value: "critical", label: "Critical", color: "text-red-600 bg-red-50" },
    { value: "high", label: "High", color: "text-orange-600 bg-orange-50" },
    { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50" },
    { value: "low", label: "Low", color: "text-green-600 bg-green-50" }
  ];

  const statuses = [
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" }
  ];

  const teamMembers = [
    "Sarah Johnson",
    "Mike Chen",
    "Emily Rodriguez",
    "David Kim",
    "Lisa Park",
    "John Anderson",
    "Alex Thompson",
    "Rachel Green",
    "Tom Wilson",
    "Maria Garcia",
    "Chris Lee",
    "Kevin Brown"
  ];

  const projects = [
    "Authentication System",
    "Analytics Dashboard",
    "User Interface",
    "Backend Infrastructure",
    "Notification System",
    "File Management",
    "Issue Tracking",
    "User Management",
    "Real-time Features",
    "API Infrastructure",
    "User Experience"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required";
    }
    
    if (!formData.project) {
      newErrors.project = "Project is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const issueData = {
        ...formData,
        labels: formData.labels.split(',').map(label => label.trim()).filter(Boolean)
      };
      
      await onSubmit(issueData);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "Bug",
        priority: "medium",
        status: "open",
        assignee: "",
        project: "",
        labels: "",
        dueDate: "",
        attachments: []
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        type: "Bug",
        priority: "medium",
        status: "open",
        assignee: "",
        project: "",
        labels: "",
        dueDate: "",
        attachments: []
      });
      setErrors({});
      onClose();
    }
  };

  const getPriorityColor = (priority) => {
    const found = priorities.find(p => p.value === priority);
    return found ? found.color : "text-gray-600 bg-gray-50";
  };

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
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Issue
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter issue title"
                      className={errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the issue in detail"
                      rows={4}
                      className={errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Issue Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Type
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                      >
                        {issueTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <Select
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className={`${getPriorityColor(formData.priority)} font-medium`}
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Assignee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignee <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.assignee}
                        onChange={(e) => handleInputChange("assignee", e.target.value)}
                        className={errors.assignee ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                      >
                        <option value="">Select assignee</option>
                        {teamMembers.map(member => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </Select>
                      {errors.assignee && (
                        <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
                      )}
                    </div>

                    {/* Project */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.project}
                        onChange={(e) => handleInputChange("project", e.target.value)}
                        className={errors.project ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                      >
                        <option value="">Select project</option>
                        {projects.map(project => (
                          <option key={project} value={project}>
                            {project}
                          </option>
                        ))}
                      </Select>
                      {errors.project && (
                        <p className="mt-1 text-sm text-red-600">{errors.project}</p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Labels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Labels/Tags
                    </label>
                    <Input
                      value={formData.labels}
                      onChange={(e) => handleInputChange("labels", e.target.value)}
                      placeholder="Enter labels separated by commas (e.g., bug, frontend, urgent)"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Separate multiple labels with commas
                    </p>
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <ApperIcon name="Upload" size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop files here, or <span className="text-primary-600 font-medium">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} />
                      Create Issue
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateIssueModal;
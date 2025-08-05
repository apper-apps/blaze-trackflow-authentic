import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CreateProjectModal = ({ onClose, onSubmit, project = null }) => {
  const isEditing = !!project;
const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Active",
    teamMembers: Array.isArray(project?.teamMembers) ? project?.teamMembers : []
  });
  const [newMember, setNewMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

const statusOptions = [
    "Active",
    "In Progress", 
    "Planning",
    "On Hold",
    "Completed",
    "Archived"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
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
      await onSubmit(formData);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const addTeamMember = () => {
    const trimmedMember = newMember.trim();
    if (trimmedMember && !formData.teamMembers.some(member => member.toLowerCase() === trimmedMember.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, trimmedMember]
      }));
      setNewMember("");
    }
  };

const removeTeamMember = (memberToRemove) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== memberToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTeamMember();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter project name"
                error={errors.name}
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the project goals and scope"
                rows={4}
                error={errors.description}
              />
            </div>

            {/* Project Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
<Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Members
              </label>
              
              {/* Add Member Input */}
              <div className="flex gap-2 mb-3">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter team member name"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTeamMember}
                  variant="outline"
                  disabled={!newMember.trim()}
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </div>

              {/* Team Members List */}
{formData.teamMembers.length > 0 && (
                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div
                      key={`${member}-${index}`}
                      className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                          {member.split(' ').map(n => n[0] || '').join('').slice(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{member}</span>
                          <span className="text-xs text-gray-500">Team Member</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member)}
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
                        title="Remove team member"
                      >
                        <ApperIcon name="X" size={16} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              {isEditing ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
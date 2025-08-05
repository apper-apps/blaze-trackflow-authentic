import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";

const IssueDetailModal = ({ issue, isOpen, onClose }) => {
  if (!issue) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
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
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Issue #{issue.Id}
                  </h2>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {issue.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Assignee</h4>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {issue.assignee.charAt(0)}
                        </div>
                        <span className="text-gray-900">{issue.assignee}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Project</h4>
                      <span className="text-gray-900">{issue.project}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Created Date</h4>
                      <span className="text-gray-600">{formatDate(issue.createdDate)}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h4>
                      <span className="text-gray-600">{formatDate(issue.updatedDate)}</span>
                    </div>
                  </div>

                  {/* Status History */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Status History</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-600">
                          Issue was marked as <StatusBadge status={issue.status} /> on {formatDate(issue.updatedDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-600">
                          Issue was created on {formatDate(issue.createdDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button className="gap-2">
                  <ApperIcon name="Edit" size={16} />
                  Edit Issue
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailModal;
import React from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'status_change':
        return 'GitBranch';
      case 'assignee_change':
        return 'User';
      case 'priority_change':
        return 'AlertTriangle';
      case 'label_change':
        return 'Tag';
      case 'due_date_change':
        return 'Calendar';
      default:
        return 'Activity';
    }
  };

  const formatContent = (content) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>');
  };

  return (
    <div className="flex space-x-3">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={getActivityIcon(activity.type)} size={14} className="text-gray-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{activity.authorName}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdDate), { addSuffix: true })}
                </span>
              </div>
              <div 
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatContent(activity.content) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
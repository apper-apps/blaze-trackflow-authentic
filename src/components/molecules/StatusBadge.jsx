import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: {
      variant: "open",
      icon: "Circle",
      label: "Open"
    },
    "in-progress": {
      variant: "inProgress",
      icon: "Clock",
      label: "In Progress"
    },
    resolved: {
      variant: "resolved",
      icon: "CheckCircle",
      label: "Resolved"
    },
    closed: {
      variant: "closed",
      icon: "XCircle",
      label: "Closed"
    },
    "not-resolved": {
      variant: "open",
      icon: "AlertCircle",
      label: "Not Resolved"
    }
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <Badge variant={config.variant} className="gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
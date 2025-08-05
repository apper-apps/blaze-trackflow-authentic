import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    critical: {
      variant: "critical",
      icon: "Flame",
      label: "Critical"
    },
    high: {
      variant: "high",
      icon: "AlertTriangle",
      label: "High"
    },
    medium: {
      variant: "medium",
      icon: "Minus",
      label: "Medium"
    },
    low: {
      variant: "low",
      icon: "ChevronDown",
      label: "Low"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge variant={config.variant} className="gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
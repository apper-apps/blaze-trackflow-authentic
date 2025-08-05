import React from "react";
import Error from "@/components/ui/Error";
// Initialize ApperClient for issue operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const issueService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee" } },
          { field: { Name: "createdDate" } },
          { field: { Name: "updatedDate" } },
          { field: { Name: "project" } },
          { field: { Name: "labels" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "projectId" } }
        ],
        orderBy: [{ fieldName: "createdDate", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("issue", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching issues:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee" } },
          { field: { Name: "createdDate" } },
          { field: { Name: "updatedDate" } },
          { field: { Name: "project" } },
          { field: { Name: "labels" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "projectId" } }
        ]
      };

      const response = await apperClient.getRecordById("issue", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(issueData) {
    try {
      const params = {
        records: [{
          Name: issueData.title,
          title: issueData.title,
          description: issueData.description,
          type: issueData.type || "Bug",
          status: issueData.status || "open",
          priority: issueData.priority || "medium",
          assignee: issueData.assignee || "",
          project: issueData.project || "",
          labels: Array.isArray(issueData.labels) ? issueData.labels.join(',') : "",
          dueDate: issueData.dueDate || null,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          projectId: issueData.projectId ? parseInt(issueData.projectId) : null
        }]
      };

      const response = await apperClient.createRecord("issue", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create issue");
        }

        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating issue:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.title && { Name: updateData.title, title: updateData.title }),
          ...(updateData.description && { description: updateData.description }),
          ...(updateData.type && { type: updateData.type }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.priority && { priority: updateData.priority }),
          ...(updateData.assignee !== undefined && { assignee: updateData.assignee }),
          ...(updateData.project !== undefined && { project: updateData.project }),
          ...(updateData.labels !== undefined && { 
            labels: Array.isArray(updateData.labels) ? updateData.labels.join(',') : updateData.labels 
          }),
          ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate }),
          ...(updateData.projectId !== undefined && { projectId: updateData.projectId ? parseInt(updateData.projectId) : null }),
          updatedDate: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("issue", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update issue");
        }

        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating issue:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("issue", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete issue");
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting issue:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  // Dashboard Analytics Methods
  async getMetrics() {
    try {
      const allIssues = await this.getAll();
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const totalIssues = allIssues.length;
      const openIssues = allIssues.filter(issue => 
        issue.status === 'open' || issue.status === 'in-progress'
      ).length;
      
      // Resolved this week
      const resolvedThisWeek = allIssues.filter(issue => {
        if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
        const resolvedDate = new Date(issue.updatedDate || issue.createdDate);
        return resolvedDate >= weekAgo;
      }).length;

      // Resolved last week for comparison
      const resolvedLastWeek = allIssues.filter(issue => {
        if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
        const resolvedDate = new Date(issue.updatedDate || issue.createdDate);
        return resolvedDate >= twoWeeksAgo && resolvedDate < weekAgo;
      }).length;

      // Open issues change
      const openThisWeek = allIssues.filter(issue => {
        const createdDate = new Date(issue.createdDate);
        return createdDate >= weekAgo && (issue.status === 'open' || issue.status === 'in-progress');
      }).length;

      const openLastWeek = allIssues.filter(issue => {
        const createdDate = new Date(issue.createdDate);
        return createdDate >= twoWeeksAgo && createdDate < weekAgo && 
               (issue.status === 'open' || issue.status === 'in-progress');
      }).length;

      // Average resolution time
      const resolvedIssues = allIssues.filter(issue => 
        issue.status === 'resolved' || issue.status === 'closed'
      );
      const avgResolutionTime = resolvedIssues.length > 0 
        ? Math.round(resolvedIssues.reduce((acc, issue) => {
            const created = new Date(issue.createdDate);
            const resolved = new Date(issue.updatedDate || issue.createdDate);
            return acc + (resolved - created) / (1000 * 60 * 60 * 24);
          }, 0) / resolvedIssues.length)
        : 0;

      // Previous period average for comparison
      const previousPeriodResolved = resolvedIssues.filter(issue => {
        const resolvedDate = new Date(issue.updatedDate || issue.createdDate);
        return resolvedDate < weekAgo;
      });
      
      const prevAvgResolutionTime = previousPeriodResolved.length > 0
        ? Math.round(previousPeriodResolved.reduce((acc, issue) => {
            const created = new Date(issue.createdDate);
            const resolved = new Date(issue.updatedDate || issue.createdDate);
            return acc + (resolved - created) / (1000 * 60 * 60 * 24);
          }, 0) / previousPeriodResolved.length)
        : avgResolutionTime;

      return {
        totalIssues,
        openIssues,
        resolvedThisWeek,
        avgResolutionTime,
        openChange: openThisWeek - openLastWeek,
        resolvedChange: resolvedLastWeek > 0 ? 
          Math.round(((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek) * 100) : 0,
        resolutionTimeChange: prevAvgResolutionTime > 0 ? 
          Math.round(((avgResolutionTime - prevAvgResolutionTime) / prevAvgResolutionTime) * 100) : 0
      };
    } catch (error) {
      console.error("Error fetching metrics:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getStatusBreakdown() {
    try {
      const allIssues = await this.getAll();
      const statusCounts = allIssues.reduce((acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1;
        return acc;
      }, {});

      const statusLabels = {
        'open': 'Open',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed'
      };

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        label: statusLabels[status] || status,
        count
      }));
    } catch (error) {
      console.error("Error fetching status breakdown:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getPriorityDistribution() {
    try {
      const allIssues = await this.getAll();
      const priorityCounts = allIssues.reduce((acc, issue) => {
        acc[issue.priority] = (acc[issue.priority] || 0) + 1;
        return acc;
      }, {});

      const priorityLabels = {
        'critical': 'Critical',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
      };

      const priorityOrder = ['critical', 'high', 'medium', 'low'];
      
      return priorityOrder.map(priority => ({
        priority,
        label: priorityLabels[priority],
        count: priorityCounts[priority] || 0
      }));
    } catch (error) {
      console.error("Error fetching priority distribution:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getResolutionTrends() {
    try {
      const allIssues = await this.getAll();
      const now = new Date();

      const trends = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const resolvedOnDate = allIssues.filter(issue => {
          if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
          const resolvedDate = new Date(issue.updatedDate || issue.createdDate);
          return resolvedDate.toISOString().split('T')[0] === dateStr;
        }).length;

        trends.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: resolvedOnDate
        });
      }

      return trends;
    } catch (error) {
      console.error("Error fetching resolution trends:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getAssigneeWorkload() {
    try {
      const allIssues = await this.getAll();
      const openIssues = allIssues.filter(issue => 
        issue.status === 'open' || issue.status === 'in-progress'
      );
      
      const workload = openIssues.reduce((acc, issue) => {
        const assignee = issue.assignee || 'Unassigned';
        acc[assignee] = (acc[assignee] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(workload)
        .map(([assignee, count]) => ({ assignee, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 assignees
    } catch (error) {
      console.error("Error fetching assignee workload:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getOverdueIssues() {
    try {
      const allIssues = await this.getAll();
      const now = new Date();

      return allIssues
        .filter(issue => {
          if (issue.status === 'resolved' || issue.status === 'closed') return false;
          if (!issue.dueDate) return false;
          
          const dueDate = new Date(issue.dueDate);
          return dueDate < now;
        })
        .map(issue => ({
          ...issue,
          overdueDays: Math.ceil((now - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => b.overdueDays - a.overdueDays);
    } catch (error) {
      console.error("Error fetching overdue issues:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getRecentActivity() {
    try {
      const allIssues = await this.getAll();
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      const activities = [];

      // Recent issues created
      const recentIssues = allIssues
        .filter(issue => new Date(issue.createdDate) >= threeDaysAgo)
        .slice(0, 5);

      recentIssues.forEach(issue => {
        const createdDate = new Date(issue.createdDate);
        const timeAgo = this.getTimeAgo(createdDate);
        activities.push({
          type: 'created',
          description: `New issue "${issue.title}" was created`,
          timeAgo,
          timestamp: createdDate
        });
      });

      // Recent resolutions
      const recentResolutions = allIssues
        .filter(issue => {
          if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
          const updatedDate = new Date(issue.updatedDate || issue.createdDate);
          return updatedDate >= threeDaysAgo;
        })
        .slice(0, 5);

      recentResolutions.forEach(issue => {
        const resolvedDate = new Date(issue.updatedDate || issue.createdDate);
        const timeAgo = this.getTimeAgo(resolvedDate);
        activities.push({
          type: 'resolved',
          description: `Issue "${issue.title}" was resolved`,
          timeAgo,
          timestamp: resolvedDate
        });
      });

      // Sort by timestamp descending and limit to 10
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
    } catch (error) {
      console.error("Error fetching recent activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
};
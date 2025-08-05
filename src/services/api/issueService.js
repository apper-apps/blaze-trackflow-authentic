import issuesData from "@/services/mockData/issues.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const issueService = {
  async getAll() {
    await delay(300);
    return [...issuesData];
  },

  // Dashboard Analytics Methods
  async getMetrics() {
    await delay(200);
    const issues = [...issuesData];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const totalIssues = issues.length;
    const openIssues = issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress').length;
    
    // Resolved this week
    const resolvedThisWeek = issues.filter(issue => {
      if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
      const resolvedDate = new Date(issue.updatedAt || issue.createdAt);
      return resolvedDate >= weekAgo;
    }).length;

    // Resolved last week for comparison
    const resolvedLastWeek = issues.filter(issue => {
      if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
      const resolvedDate = new Date(issue.updatedAt || issue.createdAt);
      return resolvedDate >= twoWeeksAgo && resolvedDate < weekAgo;
    }).length;

    // Open issues change
    const openThisWeek = issues.filter(issue => {
      const createdDate = new Date(issue.createdAt);
      return createdDate >= weekAgo && (issue.status === 'open' || issue.status === 'in-progress');
    }).length;

    const openLastWeek = issues.filter(issue => {
      const createdDate = new Date(issue.createdAt);
      return createdDate >= twoWeeksAgo && createdDate < weekAgo && (issue.status === 'open' || issue.status === 'in-progress');
    }).length;

    // Average resolution time
    const resolvedIssues = issues.filter(issue => issue.status === 'resolved' || issue.status === 'closed');
    const avgResolutionTime = resolvedIssues.length > 0 
      ? Math.round(resolvedIssues.reduce((acc, issue) => {
          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.updatedAt || issue.createdAt);
          return acc + (resolved - created) / (1000 * 60 * 60 * 24);
        }, 0) / resolvedIssues.length)
      : 0;

    // Previous period average for comparison
    const previousPeriodResolved = resolvedIssues.filter(issue => {
      const resolvedDate = new Date(issue.updatedAt || issue.createdAt);
      return resolvedDate < weekAgo;
    });
    
    const prevAvgResolutionTime = previousPeriodResolved.length > 0
      ? Math.round(previousPeriodResolved.reduce((acc, issue) => {
          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.updatedAt || issue.createdAt);
          return acc + (resolved - created) / (1000 * 60 * 60 * 24);
        }, 0) / previousPeriodResolved.length)
      : avgResolutionTime;

    return {
      totalIssues,
      openIssues,
      resolvedThisWeek,
      avgResolutionTime,
      openChange: openThisWeek - openLastWeek,
      resolvedChange: resolvedLastWeek > 0 ? Math.round(((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek) * 100) : 0,
      resolutionTimeChange: prevAvgResolutionTime > 0 ? Math.round(((avgResolutionTime - prevAvgResolutionTime) / prevAvgResolutionTime) * 100) : 0
    };
  },

  async getStatusBreakdown() {
    await delay(200);
    const issues = [...issuesData];
    const statusCounts = issues.reduce((acc, issue) => {
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
  },

  async getPriorityDistribution() {
    await delay(200);
    const issues = [...issuesData];
    const priorityCounts = issues.reduce((acc, issue) => {
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
  },

  async getResolutionTrends() {
    await delay(200);
    const issues = [...issuesData];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const resolvedOnDate = issues.filter(issue => {
        if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
        const resolvedDate = new Date(issue.updatedAt || issue.createdAt);
        return resolvedDate.toISOString().split('T')[0] === dateStr;
      }).length;

      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: resolvedOnDate
      });
    }

    return trends;
  },

  async getAssigneeWorkload() {
    await delay(200);
    const issues = [...issuesData];
    const openIssues = issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress');
    
    const workload = openIssues.reduce((acc, issue) => {
      const assignee = issue.assignee || 'Unassigned';
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(workload)
      .map(([assignee, count]) => ({ assignee, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 assignees
  },

  async getOverdueIssues() {
    await delay(200);
    const issues = [...issuesData];
    const now = new Date();

    return issues
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
  },

  async getRecentActivity() {
    await delay(200);
    const issues = [...issuesData];
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const activities = [];

    // Recent issues created
    const recentIssues = issues
      .filter(issue => new Date(issue.createdAt) >= threeDaysAgo)
      .slice(0, 5);

    recentIssues.forEach(issue => {
      const createdDate = new Date(issue.createdAt);
      const timeAgo = this.getTimeAgo(createdDate);
      activities.push({
        type: 'created',
        description: `New issue "${issue.title}" was created`,
        timeAgo,
        timestamp: createdDate
      });
    });

    // Recent resolutions
    const recentResolutions = issues
      .filter(issue => {
        if (issue.status !== 'resolved' && issue.status !== 'closed') return false;
        const updatedDate = new Date(issue.updatedAt || issue.createdAt);
        return updatedDate >= threeDaysAgo;
      })
      .slice(0, 5);

    recentResolutions.forEach(issue => {
      const resolvedDate = new Date(issue.updatedAt || issue.createdAt);
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
  },

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  },

  async getById(id) {
    await delay(200);
    const issue = issuesData.find(item => item.Id === parseInt(id));
    if (!issue) {
      throw new Error(`Issue with Id ${id} not found`);
    }
    return { ...issue };
  },

async create(issueData) {
    await delay(400);
    const maxId = Math.max(...issuesData.map(item => item.Id), 0);
    const newIssue = {
      Id: maxId + 1,
      title: issueData.title,
      description: issueData.description,
      type: issueData.type || "Bug",
      status: issueData.status || "open",
      priority: issueData.priority || "medium",
      assignee: issueData.assignee,
      project: issueData.project,
      labels: issueData.labels || [],
      dueDate: issueData.dueDate || null,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    issuesData.push(newIssue);
    return { ...newIssue };
  },

async update(id, updateData) {
    await delay(300);
    const index = issuesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Issue with Id ${id} not found`);
    }
    
    const oldIssue = { ...issuesData[index] };
    issuesData[index] = {
      ...issuesData[index],
      ...updateData,
      updatedDate: new Date().toISOString()
    };
    
    return { 
      ...issuesData[index], 
      _previousValues: oldIssue // Include previous values for activity tracking
    };
  },

  async delete(id) {
    await delay(250);
    const index = issuesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Issue with Id ${id} not found`);
    }
    const deletedIssue = { ...issuesData[index] };
    issuesData.splice(index, 1);
    return deletedIssue;
  }
};
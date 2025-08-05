import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, isAfter, parseISO, subDays } from "date-fns";
import Chart from "react-apexcharts";
import { issueService } from "@/services/api/issueService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ActivityItem from "@/components/molecules/ActivityItem";
import Layout from "@/components/organisms/Layout";
import Issues from "@/components/pages/Issues";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    statusBreakdown: [],
    priorityDistribution: [],
    resolutionTrends: [],
    assigneeWorkload: [],
    overdueIssues: [],
    recentActivity: []
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        metrics,
        statusBreakdown,
        priorityDistribution,
        resolutionTrends,
        assigneeWorkload,
        overdueIssues,
        recentActivity
      ] = await Promise.all([
        issueService.getMetrics(),
        issueService.getStatusBreakdown(),
        issueService.getPriorityDistribution(),
        issueService.getResolutionTrends(),
        issueService.getAssigneeWorkload(),
        issueService.getOverdueIssues(),
        issueService.getRecentActivity()
      ]);

      setDashboardData({
        metrics,
        statusBreakdown,
        priorityDistribution,
        resolutionTrends,
        assigneeWorkload,
        overdueIssues,
        recentActivity
      });
      setLastUpdated(new Date());
} catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    toast.info("Refreshing dashboard data...");
    loadDashboardData();
  };

  const handleCreateIssue = () => {
    navigate("/issues");
    setTimeout(() => {
      if (window.handleNewIssue) {
        window.handleNewIssue();
      }
    }, 100);
  };

  const handleViewAllIssues = () => {
    navigate("/issues");
  };

  const handleMetricClick = (filter) => {
    navigate(`/issues?filter=${filter}`);
  };

  const handleChartClick = (filter, value) => {
    navigate(`/issues?${filter}=${value}`);
  };

  const MetricCard = ({ title, value, change, changeType, icon, onClick, color = "primary" }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-full flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3 py-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        activity.type === 'created' ? 'bg-blue-100' :
        activity.type === 'resolved' ? 'bg-green-100' :
        activity.type === 'status_change' ? 'bg-yellow-100' : 'bg-gray-100'
      }`}>
        <ApperIcon 
          name={
            activity.type === 'created' ? 'Plus' :
            activity.type === 'resolved' ? 'CheckCircle' :
            activity.type === 'status_change' ? 'RefreshCw' : 'Activity'
          } 
          size={16} 
          className={
            activity.type === 'created' ? 'text-blue-600' :
            activity.type === 'resolved' ? 'text-green-600' :
            activity.type === 'status_change' ? 'text-yellow-600' : 'text-gray-600'
          }
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.timeAgo}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

const statusChartOptions = {
    chart: {
      type: 'donut',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const status = dashboardData.statusBreakdown[config.dataPointIndex]?.status;
          if (status) {
            handleChartClick('status', status);
          }
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        }
      }
    }]
  };

  const priorityChartOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const priority = dashboardData.priorityDistribution[config.dataPointIndex]?.priority;
          if (priority) {
            handleChartClick('priority', priority);
          }
        }
      }
    },
    xaxis: {
      categories: dashboardData.priorityDistribution.map(item => item.label)
    },
    colors: ['#EF4444', '#F59E0B', '#3B82F6', '#6B7280'],
    plotOptions: {
      bar: {
        horizontal: false
      }
    }
  };

  const trendsChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: dashboardData.resolutionTrends.map(item => item.date)
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#8B5CF6'],
    grid: {
      borderColor: '#E5E7EB'
    }
  };

  const workloadChartOptions = {
    chart: {
      type: 'bar',
      horizontal: true
    },
    xaxis: {
      categories: dashboardData.assigneeWorkload.map(item => item.assignee || 'Unassigned')
    },
    colors: ['#A78BFA']
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your team's progress and performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Issues"
            value={dashboardData.metrics.totalIssues || 0}
            icon="FileText"
            onClick={() => handleMetricClick('all')}
          />
          <MetricCard
            title="Open Issues"
            value={dashboardData.metrics.openIssues || 0}
            change={`${dashboardData.metrics.openChange || 0} this week`}
            changeType={dashboardData.metrics.openChange > 0 ? 'negative' : 'positive'}
            icon="Circle"
            color="blue"
            onClick={() => handleMetricClick('open')}
          />
          <MetricCard
            title="Resolved This Week"
            value={dashboardData.metrics.resolvedThisWeek || 0}
            change={`${dashboardData.metrics.resolvedChange || 0}% vs last week`}
            changeType={dashboardData.metrics.resolvedChange > 0 ? 'positive' : 'negative'}
            icon="CheckCircle"
            color="green"
            onClick={() => handleMetricClick('resolved')}
          />
          <MetricCard
            title="Avg Resolution Time"
            value={`${dashboardData.metrics.avgResolutionTime || 0}d`}
            change={`${dashboardData.metrics.resolutionTimeChange || 0}% improvement`}
            changeType={dashboardData.metrics.resolutionTimeChange < 0 ? 'positive' : 'negative'}
            icon="Clock"
            color="purple"
            onClick={() => handleMetricClick('resolved')}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Status Breakdown</h3>
              <ApperIcon name="PieChart" size={20} className="text-gray-400" />
            </div>
            <div className="h-64">
              <Chart
                options={statusChartOptions}
                series={dashboardData.statusBreakdown.map(item => item.count)}
                type="donut"
                height={250}
              />
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
              <ApperIcon name="BarChart3" size={20} className="text-gray-400" />
            </div>
            <div className="h-64">
              <Chart
                options={priorityChartOptions}
                series={[{
                  name: 'Issues',
                  data: dashboardData.priorityDistribution.map(item => item.count)
                }]}
                type="bar"
                height={250}
              />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Resolution Trends */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resolution Trends (30 Days)</h3>
              <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
            </div>
            <div className="h-64">
              <Chart
                options={trendsChartOptions}
                series={[{
                  name: 'Resolved Issues',
                  data: dashboardData.resolutionTrends.map(item => item.count)
                }]}
                type="line"
                height={250}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <ApperIcon name="Activity" size={20} className="text-gray-400" />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignee Workload */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignee Workload</h3>
              <ApperIcon name="Users" size={20} className="text-gray-400" />
            </div>
            <div className="h-64">
              {dashboardData.assigneeWorkload.length > 0 ? (
                <Chart
                  options={workloadChartOptions}
                  series={[{
                    name: 'Open Issues',
                    data: dashboardData.assigneeWorkload.map(item => item.count)
                  }]}
                  type="bar"
                  height={250}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="Users" size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No workload data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overdue Issues & Quick Actions */}
          <div className="space-y-6">
            {/* Overdue Issues */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overdue Issues</h3>
                <ApperIcon name="AlertTriangle" size={20} className="text-red-500" />
              </div>
              <div className="space-y-3">
                {dashboardData.overdueIssues.length > 0 ? (
                  dashboardData.overdueIssues.slice(0, 3).map((issue) => (
                    <div 
                      key={issue.Id} 
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => navigate(`/issues?id=${issue.Id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <PriorityBadge priority={issue.priority} />
                          <span className="text-xs text-red-600">
                            {issue.overdueDays} days overdue
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <ApperIcon name="CheckCircle" size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No overdue issues</p>
                  </div>
                )}
                {dashboardData.overdueIssues.length > 3 && (
                  <button
                    onClick={() => handleMetricClick('overdue')}
                    className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium mt-2"
                  >
                    View all {dashboardData.overdueIssues.length} overdue issues
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCreateIssue}
                  className="w-full"
                  size="sm"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Create Issue
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewAllIssues}
                  className="w-full"
                  size="sm"
                >
                  <ApperIcon name="List" size={16} className="mr-2" />
                  View All Issues
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
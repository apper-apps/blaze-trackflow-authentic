import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";
import ProjectDetailModal from "@/components/organisms/ProjectDetailModal";
import { projectService } from "@/services/api/projectService";
import { issueService } from "@/services/api/issueService";

const Projects = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    loadProjects();
    loadIssues();
    
    // Set up global handler for new project button
    window.handleNewProject = () => setShowCreateModal(true);
    
    return () => {
      delete window.handleNewProject;
    };
  }, []);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.Id === parseInt(id));
      if (project) {
        setSelectedProject(project);
        setShowDetailModal(true);
      } else if (projects.length > 0) {
        // Project not found, redirect to projects list
        navigate('/projects');
        toast.error('Project not found');
      }
    }
  }, [id, projects, navigate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async () => {
    try {
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
    }
  };

  const getProjectIssueStats = (projectId) => {
    const projectIssues = issues.filter(issue => issue.projectId === projectId);
    return {
      total: projectIssues.length,
      open: projectIssues.filter(issue => issue.status === 'Open').length,
      inProgress: projectIssues.filter(issue => issue.status === 'In Progress').length,
      resolved: projectIssues.filter(issue => issue.status === 'Resolved').length,
      closed: projectIssues.filter(issue => issue.status === 'Closed').length
    };
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowCreateModal(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleEditProject = async (projectId, projectData) => {
    try {
      const updatedProject = await projectService.update(projectId, projectData);
      setProjects(prev => prev.map(p => p.Id === projectId ? updatedProject : p));
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.Id !== projectId));
      toast.success('Project deleted successfully');
      
      if (selectedProject?.Id === projectId) {
        setShowDetailModal(false);
        setSelectedProject(null);
        navigate('/projects');
      }
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.Id}`);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProject(null);
    navigate('/projects');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Organize and manage your projects</p>
        </div>

        {projects.length === 0 ? (
          <Empty
            icon="Folder"
            title="No projects yet"
            description="Create your first project to start organizing your issues."
            action={
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <ApperIcon name="Plus" size={16} />
                Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const stats = getProjectIssueStats(project.Id);
              return (
                <div
                  key={project.Id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {project.name}
                      </h3>
                      <Badge variant="secondary" className={`mt-2 ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Folder" size={20} className="text-primary-600" />
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Issue Stats */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Issues</span>
                      <span className="font-medium text-gray-900">{stats.total}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Open {stats.open}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        In Progress {stats.inProgress}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Resolved {stats.resolved}
                      </span>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                            title={member}
                          >
                            {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                      {project.teamMembers.length > 0 && (
                        <span className="ml-3 text-xs text-gray-500">
                          {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateProject}
          />
        )}

        {showDetailModal && selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={handleCloseDetail}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
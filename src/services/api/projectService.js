import projectsData from '@/services/mockData/projects.json';

import projectsData from '@/services/mockData/projects.json';

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
    this.nextId = Math.max(...this.projects.map(p => p.Id), 0) + 1;
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.projects]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = this.projects.find(p => p.Id === parseInt(id));
        if (project) {
          resolve({ ...project });
        } else {
          reject(new Error('Project not found'));
        }
      }, 200);
    });
  }

  async create(projectData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject = {
          ...projectData,
          Id: this.nextId++,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.projects.push(newProject);
        resolve({ ...newProject });
      }, 500);
    });
  }

  async update(id, projectData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.projects.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          const updatedProject = {
            ...this.projects[index],
            ...projectData,
            Id: parseInt(id),
            updatedAt: new Date().toISOString()
          };
          this.projects[index] = updatedProject;
          resolve({ ...updatedProject });
        } else {
          reject(new Error('Project not found'));
        }
      }, 500);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.projects.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          this.projects.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Project not found'));
        }
      }, 300);
    });
  }

  async getProjectMembers(projectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = this.projects.find(p => p.Id === parseInt(projectId));
        if (project) {
          resolve([...project.teamMembers]);
        } else {
          reject(new Error('Project not found'));
        }
      }, 200);
    });
  }
}

export const projectService = new ProjectService();
// Initialize ApperClient for project operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const projectService = {
async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "memberCount" } },
          { field: { Name: "issueCount" } },
          { field: { Name: "teamMembers" } }
        ],
        orderBy: [{ fieldName: "createdAt", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(project => ({
        ...project,
        name: project.Name
      }));
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "memberCount" } },
          { field: { Name: "issueCount" } },
          { field: { Name: "teamMembers" } }
        ]
      };

      const response = await apperClient.getRecordById("project", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const project = response.data;
      return {
        ...project,
        name: project.Name
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

async create(projectData) {
    try {
      const params = {
        records: [{
          Name: projectData.name,
          description: projectData.description || "",
          status: projectData.status || "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          memberCount: projectData.memberCount || 0,
          issueCount: projectData.issueCount || 0,
          teamMembers: Array.isArray(projectData.teamMembers) ? projectData.teamMembers.join(',') : projectData.teamMembers || ""
        }]
      };

      const response = await apperClient.createRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create project");
        }

        const project = response.results[0].data;
        return {
          ...project,
          name: project.Name
        };
      }
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

async update(id, projectData) {
    try {
const params = {
        records: [{
          Id: parseInt(id),
          ...(projectData.name && { Name: projectData.name }),
          ...(projectData.description !== undefined && { description: projectData.description }),
          ...(projectData.status && { status: projectData.status }),
          ...(projectData.memberCount !== undefined && { memberCount: parseInt(projectData.memberCount) }),
          ...(projectData.issueCount !== undefined && { issueCount: parseInt(projectData.issueCount) }),
          ...(projectData.teamMembers !== undefined && { 
            teamMembers: Array.isArray(projectData.teamMembers) ? projectData.teamMembers.join(',') : projectData.teamMembers || ""
          }),
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update project");
        }

        const project = response.results[0].data;
        return {
          ...project,
          name: project.Name
        };
      }
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("project", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete project");
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error.message);
      throw error;
    }
}
};
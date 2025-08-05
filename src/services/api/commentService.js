// Initialize ApperClient for comment operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const commentService = {
  async getByIssueId(issueId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "issueId" } },
          { field: { Name: "content" } },
          { field: { Name: "authorName" } },
          { field: { Name: "authorAvatar" } },
          { field: { Name: "createdDate" } },
          { field: { Name: "updatedDate" } },
          { field: { Name: "parentId" } },
          { field: { Name: "mentions" } }
        ],
        where: [
          {
            FieldName: "issueId",
            Operator: "EqualTo",
            Values: [parseInt(issueId)]
          }
        ],
        orderBy: [{ fieldName: "createdDate", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments by issue ID:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(commentData) {
    try {
      const params = {
        records: [{
          Name: `Comment on Issue ${commentData.issueId}`,
          issueId: parseInt(commentData.issueId),
          content: commentData.content,
          authorName: commentData.authorName || "Current User",
          authorAvatar: commentData.authorAvatar || "CU",
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          parentId: commentData.parentId ? parseInt(commentData.parentId) : null,
          mentions: Array.isArray(commentData.mentions) ? commentData.mentions.join(',') : ""
        }]
      };

      const response = await apperClient.createRecord("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create comment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create comment");
        }

        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.content && { content: updateData.content }),
          ...(updateData.mentions !== undefined && { 
            mentions: Array.isArray(updateData.mentions) ? updateData.mentions.join(',') : updateData.mentions 
          }),
          updatedDate: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update comment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update comment");
        }

        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("app_Comment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete comment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete comment");
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getActivitiesByIssueId(issueId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "issueId" } },
          { field: { Name: "type" } },
          { field: { Name: "content" } },
          { field: { Name: "authorName" } },
          { field: { Name: "authorAvatar" } },
          { field: { Name: "createdDate" } },
          { field: { Name: "fieldChanged" } },
          { field: { Name: "oldValue" } },
          { field: { Name: "newValue" } }
        ],
        where: [
          {
            FieldName: "issueId",
            Operator: "EqualTo",
            Values: [parseInt(issueId)]
          }
        ],
        orderBy: [{ fieldName: "createdDate", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("app_Activity", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by issue ID:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async createActivity(activityData) {
    try {
      const params = {
        records: [{
          Name: `Activity for Issue ${activityData.issueId}`,
          issueId: parseInt(activityData.issueId),
          type: activityData.type,
          content: activityData.content,
          authorName: activityData.authorName || "System",
          authorAvatar: activityData.authorAvatar || "SY",
          createdDate: new Date().toISOString(),
          fieldChanged: activityData.fieldChanged || "",
          oldValue: activityData.oldValue || "",
          newValue: activityData.newValue || ""
        }]
      };

      const response = await apperClient.createRecord("app_Activity", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create activity");
        }

        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};
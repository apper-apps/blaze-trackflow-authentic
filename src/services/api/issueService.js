import issuesData from "@/services/mockData/issues.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const issueService = {
  async getAll() {
    await delay(300);
    return [...issuesData];
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
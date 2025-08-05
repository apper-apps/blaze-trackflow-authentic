import commentsData from "@/services/mockData/comments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for comments if file doesn't exist
let mockComments = [
  {
    Id: 1,
    issueId: 1,
    content: "I've reproduced this issue on mobile Safari. The dropdown menu doesn't appear when tapped.",
    authorName: "Sarah Johnson",
    authorAvatar: "SJ",
    createdDate: "2024-01-15T14:30:00Z",
    updatedDate: "2024-01-15T14:30:00Z",
    parentId: null,
    mentions: []
  },
  {
    Id: 2,
    issueId: 1,
    content: "Thanks @Sarah Johnson for testing. Can you check if this happens on other mobile browsers too?",
    authorName: "Mike Chen",
    authorAvatar: "MC",
    createdDate: "2024-01-15T15:45:00Z",
    updatedDate: "2024-01-15T15:45:00Z",
    parentId: 1,
    mentions: ["Sarah Johnson"]
  }
];

// Mock data for activities
let mockActivities = [
  {
    Id: 1,
    issueId: 1,
    type: "status_change",
    content: "changed status from **Open** to **In Progress**",
    authorName: "Mike Chen",
    authorAvatar: "MC",
    createdDate: "2024-01-15T09:15:00Z",
    fieldChanged: "status",
    oldValue: "open",
    newValue: "in-progress"
  },
  {
    Id: 2,
    issueId: 1,
    type: "assignee_change",
    content: "assigned **Sarah Johnson** to this issue",
    authorName: "David Kim",
    authorAvatar: "DK",
    createdDate: "2024-01-15T10:30:00Z",
    fieldChanged: "assignee",
    oldValue: "",
    newValue: "Sarah Johnson"
  }
];

// Use actual data if available, fallback to mock
const commentsDataSource = typeof commentsData !== 'undefined' ? commentsData : mockComments;

export const commentService = {
  async getByIssueId(issueId) {
    await delay(200);
    return commentsDataSource.filter(comment => comment.issueId === parseInt(issueId));
  },

  async create(commentData) {
    await delay(300);
    const maxId = Math.max(...commentsDataSource.map(item => item.Id), 0);
    const newComment = {
      Id: maxId + 1,
      issueId: parseInt(commentData.issueId),
      content: commentData.content,
      authorName: commentData.authorName || "Current User",
      authorAvatar: commentData.authorAvatar || "CU",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      parentId: commentData.parentId || null,
      mentions: commentData.mentions || []
    };
    commentsDataSource.push(newComment);
    return { ...newComment };
  },

  async update(id, updateData) {
    await delay(250);
    const index = commentsDataSource.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Comment with Id ${id} not found`);
    }
    commentsDataSource[index] = {
      ...commentsDataSource[index],
      ...updateData,
      updatedDate: new Date().toISOString()
    };
    return { ...commentsDataSource[index] };
  },

  async delete(id) {
    await delay(200);
    const index = commentsDataSource.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Comment with Id ${id} not found`);
    }
    const deletedComment = { ...commentsDataSource[index] };
    commentsDataSource.splice(index, 1);
    return deletedComment;
  },

  async getActivitiesByIssueId(issueId) {
    await delay(150);
    return mockActivities.filter(activity => activity.issueId === parseInt(issueId));
  },

  async createActivity(activityData) {
    await delay(100);
    const maxId = Math.max(...mockActivities.map(item => item.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      issueId: parseInt(activityData.issueId),
      type: activityData.type,
      content: activityData.content,
      authorName: activityData.authorName || "System",
      authorAvatar: activityData.authorAvatar || "SY",
      createdDate: new Date().toISOString(),
      fieldChanged: activityData.fieldChanged,
      oldValue: activityData.oldValue,
      newValue: activityData.newValue
    };
    mockActivities.push(newActivity);
    return { ...newActivity };
  }
};
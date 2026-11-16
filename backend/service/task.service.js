import Task from "../model/Task.js";
import { getUserProjects } from "./project.service.js";

const getUserProjectIds = async (userId) => {
  const projects = await getUserProjects(userId);
  return projects.map((project) => project._id);
};

// Check whether the user has access to a project
const checkProjectAccess = async (userId, projectId) => {
  const projectIds = await getUserProjectIds(userId);

  const hasAccess = projectIds.some(
    (id) => id.toString() === projectId.toString()
  );

  if (!hasAccess) {
    throw new Error("Project not found or access denied.");
  }
  return true;
};

//Getting all the project tasks

export const getProjectTasks = async (userId) => {
  const projectIds = await getUserProjectIds(userId);
  return await Task.find({ projectId: { $in: projectIds } })
    .populate("assigneeId", "name email")
    .sort({ createdAt: -1 });
};

//Get all task for a specific project
export const getTasksByProject = async (userId, projectId) => {
  await checkProjectAccess(userId, projectId);

  return Task.find({ projectId })
    .populate("assigneeId", "name email")
    .sort({ createdAt: -1 });
};

//getting the tasks only assigned to the user
export const getMyTasks = async (userId) => {
  const projectIds = await getUserProjectIds(userId);
  return await Task.find({
    projectId: { $in: projectIds },
    assigneeId: userId
  })
    .populate("assigneeId", "name email")
    .populate("projectId", "name")
    .sort({ createdAt: -1 });
};
//getting the total tasks count of the projects
export const getTaskCount = async (userId) => {
  const projectIds = await getUserProjectIds(userId);
  return await Task.countDocuments({ projectId: { $in: projectIds } });
};

// Count only tasks assigned to the current user
export const getMyTaskCount = async (userId) => {
  const projectIds = await getUserProjectIds(userId);

  return Task.countDocuments({
    projectId: { $in: projectIds },
    assigneeId: userId
  });
};

// Create a task inside a project
export const createProjectTask = async (userId, projectId, taskData) => {
  await checkProjectAccess(userId, projectId);
  const { title, description, assigneeId, status, priority, dueDate } =
    taskData;

  const task = await Task.create({
    title,
    description,
    projectId,
    assigneeId: assigneeId || null,
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null
  });

  return await Task.findById(task._id).populate("assigneeId", "name email");
};

//update the task description
export const updateProjectTask = async (taskId, taskData, userId) => {
  const task = await Task.findById(taskId);

  const TASK_STATUSES = ["todo", "in_progress", "review", "done"];

  const TASK_PRIORITIES = ["low", "medium", "high", "urgent"];
  if (!task) {
    throw new Error("Task not found.");
  }

  //checking whether the user has the access to the Task Project
  await checkProjectAccess(userId, task.projectId);

  if (
    taskData.status !== undefined &&
    !TASK_STATUSES.includes(taskData.status)
  ) {
    throw new Error("Invalid task status.");
  }

  if (
    taskData.priority !== undefined &&
    !TASK_PRIORITIES.includes(taskData.priority)
  ) {
    throw new Error("Invalid task priority.");
  }

  //validating the dueDate
  if (taskData.dueDate !== undefined && taskData.dueDate !== null) {
    const date = new Date(taskData.dueDate);
    if (isNaN(data.getTime())) {
      throw new Error("Invalid due date.");
    }

    taskData.dueDate = date;
  }

  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "assigneeId",
    "dueDate"
  ];

  allowedFields.forEach((field) => {
    if (taskData[field] !== undefined) {
      task[field] = taskData[field];
    }
  });

  await task.save();

  return await Task.findById(taskId)
    .populate("assigneeId", "name email")
    .populate("projectId", "name");
};

// Delete a task from a project
export const deleteProjectTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  // Check whether the user has access to the task's project
  await checkProjectAccess(userId, task.projectId);

  await Task.findByIdAndDelete(taskId);

  return {
    message: "Task deleted successfully."
  };
};

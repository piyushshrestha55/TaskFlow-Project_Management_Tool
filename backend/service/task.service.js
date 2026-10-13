import Task from "../model/Task.js";
import { getUserProjects } from "./project.service.js";

const getUserProjectIds = async (userId) => {
  const projects = await getUserProjects(userId);
  return projects.map((project) => project._id);
};

//Getting all the project tasks

export const getProjectTasks = async (userId) => {
  const projectIds = await getUserProjectIds(userId);
  return await Task.find({ projectId: { $in: projectIds } });
};

//getting the tasks only assigned to the user
export const getMyTasks = async (userId) => {
  const projectIds = await getUserProjectIds(userId);
  return await Task.find({
    projectId: { $in: projectIds },
    assigneeId: userId
  });
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

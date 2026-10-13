import { getUserTeamCount, getUserTeamMemberCount } from "./team.service.js";

import { getUserProjectCount } from "./project.service.js";

import { getTaskCount, getMyTaskCount, getMyTasks } from "./task.service.js";

export const getDashboardStats = async (userId) => {
  const [teams, teamMembers, projects, tasks, myTasksCount, myTasks] =
    await Promise.all([
      getUserTeamCount(userId),
      getUserTeamMemberCount(userId),
      getUserProjectCount(userId),
      getTaskCount(userId),
      getMyTaskCount(userId),
      getMyTasks(userId)
    ]);

  return {
    teams,
    teamMembers,
    projects,
    tasks,
    myTasksCount,
    myTasks
  };
};

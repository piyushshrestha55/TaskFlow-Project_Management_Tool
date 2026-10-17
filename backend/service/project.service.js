import Project from "../model/Project.js";
import Team from "../model/Team.js";

const getUserProjectFilter = async (userId) => {
  const teams = await Team.find({
    "members.userId": userId
  }).select("_id");

  const teamIds = teams.map((team) => team._id);

  return {
    $or: [
      { ownerId: userId },
      { "members.userId": userId },
      { teamId: { $in: teamIds } }
    ]
  };
};

export const getUserProjects = async (userId) => {
  const filter = await getUserProjectFilter(userId);
  return Project.find(filter);
};

export const getUserProjectCount = async (userId) => {
  const filter = await getUserProjectFilter(userId);
  return Project.countDocuments(filter);
};

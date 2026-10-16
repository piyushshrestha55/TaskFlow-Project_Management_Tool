import Team from "../model/Team.js";
import Project from "../model/Project.js";

// Reusable filter for teams accessible to a user
const getUserTeamFilter = (userId) => ({
  $or: [{ createdBy: userId }, { "members.user": userId }]
});

// gets all the teams that the user is involved in
export const getUserTeams = async (userId) => {
  return await Team.find(getUserTeamFilter(userId));
};

// Counts all the teams accessible to the user
export const getUserTeamCount = async (userId) => {
  return await Team.countDocuments(getUserTeamFilter(userId));
};

// gets all the team members of the user
export const getUserTeamMemberCount = async (userId) => {
  const result = await Team.aggregate([
    { $match: getUserTeamFilter(userId) },
    {
      $project: {
        memberCount: { $size: "$members" }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$memberCount" }
      }
    }
  ]);
  return result[0]?.total ?? 0;
};

//Counts all the projects associated with the teams accessible to the user
export const getUserTeamProjectCount = async (userId) => {
  const teams = await Team.find(getUserTeamFilter(userId)).select("_id");
  const teamIds = teams.map((team) => team._id);
  return Project.countDocuments({
    teamId: { $in: teamIds }
  });
};

//creating a team
export const createMyTeam = async (userId, name, description) => {
  const member = {
    userId,
    role: "admin"
  };

  const team = await Team.create({
    name,
    description,
    createdBy: userId,
    members: [member]
  });

  return team;
};

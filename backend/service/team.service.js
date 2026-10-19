import Team from "../model/Team.js";
import Project from "../model/Project.js";

// Reusable filter for teams accessible to a user
const getUserTeamFilter = (userId) => ({
  $or: [{ createdBy: userId }, { "members.userId": userId }]
});

// gets all the teams that the user is involved in
export const getUserTeams = async (userId) => {
  return await Team.find(getUserTeamFilter(userId))
    .populate("members.userId", "name email")
    .populate("createdBy", "name email");
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

//add Team members
export const addMembersToTeam = async (teamId, memberId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error("Team not found.");
  }

  // Checking if the user is already a member
  const alreadyMember = team.members.some(
    (member) => member.userId.toString() === memberId.toString()
  );

  if (alreadyMember) {
    throw new Error("User is already a member of this team.");
  }

  // Add the new member
  team.members.push({
    userId: memberId,
    role: "member"
  });

  // Save changes to MongoDB
  await team.save();

  return team;
};

// delete the team members
export const removeMemberFromTeam = async (teamId, memberId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error("Team not found.");
  }

  // Finds the member
  const memberExists = team.members.some(
    (member) => member.userId.toString() === memberId.toString()
  );

  if (!memberExists) {
    throw new Error("Member not found in the team.");
  }

  // Prevent removing the team creator
  if (team.createdBy.toString() === memberId.toString()) {
    throw new Error("Cannot remove the team creator.");
  }

  // Remove the member
  team.members = team.members.filter(
    (member) => member.userId.toString() !== memberId.toString()
  );

  await team.save();

  return team;
};

// updates the members role in the team
export const updatingMemberRoleFromTeam = async (teamId, memberId, role) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found.");
  }
  if (!role) {
    throw new Error("Role is not assigned.");
  }
  // Validate allowed roles
  const allowedRoles = ["admin", "member"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role.");
  }
  //checking if the members exits or not
  const member = team.members.find(
    (member) => member.userId.toString() === memberId.toString()
  );

  if (!member) {
    throw new Error("Member is not found in the team.");
  }

  // Prevent changing the creator's role
  if (team.createdBy.toString() === memberId.toString()) {
    throw new Error("Cannot change the team creator's role.");
  }

  // Update the member's role
  member.role = role;

  await team.save();
  return team;
};

import Team from "../model/Team.js";
import Project from "../model/Project.js";
import { User } from "../model/User.js";
import { deleteTeamProject } from "./project.service.js";
import {
  addTeamMemberToProject,
  removeTeamMemberFromProject
} from "./projectMembership.service.js";
// Reusable filter for teams accessible to a user
const getUserTeamFilter = (userId) => ({
  $or: [{ createdBy: userId }, { "members.userId": userId }]
});

const getPopulatedTeam = async (teamId) => {
  return Team.findById(teamId)
    .populate("members.userId", "name email username avatar")
    .populate("createdBy", "name email");
};
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
    {
      $match: getUserTeamFilter(userId)
    },
    {
      $unwind: "$members"
    },
    {
      $group: {
        _id: "$members.userId"
      }
    },
    {
      $count: "total"
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

  // Verify that the registered user exists.
  const userExists = await User.exists({ _id: memberId });

  if (!userExists) {
    throw new Error("Registered user not found.");
  }

  // Prevent duplicate memberships.
  const alreadyMember = team.members.some(
    (member) => String(member.userId) === String(memberId)
  );

  if (alreadyMember) {
    throw new Error("User is already a member of this team.");
  }

  team.members.push({
    userId: memberId,
    role: "member"
  });

  await team.save();
  await addTeamMemberToProject(team._id, memberId);

  // Return populated member details.
  return await getPopulatedTeam(team._id);
};

// delete the team members
export const removeMemberFromTeam = async (teamId, memberId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error("Team not found.");
  }

  if (String(team.createdBy) === String(memberId)) {
    throw new Error("Cannot remove the team creator.");
  }

  const memberExists = team.members.some(
    (member) => String(member.userId) === String(memberId)
  );

  if (!memberExists) {
    throw new Error("Member not found in the team.");
  }

  team.members = team.members.filter(
    (member) => String(member.userId) !== String(memberId)
  );

  await team.save();
  await removeTeamMemberFromProject(team._id, memberId);
  return await getPopulatedTeam(team._id);
};

// updates the members role in the team
export const updatingMemberRoleFromTeam = async (teamId, memberId, role) => {
  const allowedRoles = ["admin", "member"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role.");
  }

  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error("Team not found.");
  }

  // Prevent changing the creators role.
  if (String(team.createdBy) === String(memberId)) {
    throw new Error("Cannot change the team creator's role.");
  }

  // Find the existing membership.
  const memberExists = team.members.some(
    (member) => String(member.userId) === String(memberId)
  );

  if (!memberExists) {
    throw new Error("Member is not found in the team.");
  }

  // Update the existing member, never push a new one.
  await Team.updateOne(
    {
      _id: teamId,
      "members.userId": memberId
    },
    {
      $set: {
        "members.$.role": role
      }
    }
  );

  return await getPopulatedTeam(teamId);
};

// deleting the team
export const deleteTeamService = async (teamId, userId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    const error = new Error("Team not found.");
    error.statusCode = 404;
    throw error;
  }

  // Only the team owner can delete the team.
  if (String(team.createdBy) !== String(userId)) {
    const error = new Error("You are not authorized to delete this team.");
    error.statusCode = 403;
    throw error;
  }
  // Delete associated project if it exists
  const project = await Project.findOne({ teamId: team._id });

  if (project) {
    await deleteTeamProject(project._id, userId);
  }
  await Team.findByIdAndDelete(teamId);

  return {
    message: "Team deleted successfully.",
    teamId: String(teamId)
  };
};

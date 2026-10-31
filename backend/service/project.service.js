import Project from "../model/Project.js";
import Team from "../model/Team.js";

// Reusable filter for projects accessible to a user
const getUserProjectFilter = async (userId) => {
  const teams = await Team.find({
    $or: [{ createdBy: userId }, { "members.userId": userId }]
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

// Get all projects accessible to a user
export const getUserProjects = async (userId) => {
  const filter = await getUserProjectFilter(userId);
  return Project.find(filter)
    .populate("ownerId", "name email username avatar")
    .populate("members.userId", "name email username avatar")
    .populate("teamId", "name");
};

// Count all projects accessible to a user
export const getUserProjectCount = async (userId) => {
  const filter = await getUserProjectFilter(userId);
  return Project.countDocuments(filter);
};

// Create a project associated with a team
export const createTeamProject = async (
  name,
  description,
  status,
  team,
  userId
) => {
  if (!team) {
    throw new Error("Team not found.");
  }

  // Only team creator can create a project
  if (String(team.createdBy) !== String(userId)) {
    throw new Error("You don't have the authority to create a project.");
  }

  // Prevent multiple projects for the same team
  const existingProject = await Project.findOne({
    teamId: team._id
  });

  if (existingProject) {
    throw new Error("Project already exists.");
  }

  // Assign project roles
  const projectMembers = team.members.map((member) => ({
    userId: member.userId,
    role:
      String(member.userId) === String(team.createdBy) ? "manager" : "viewer"
  }));

  const project = await Project.create({
    name,
    description,
    status,
    ownerId: team.createdBy,
    teamId: team._id,
    members: projectMembers
  });

  return project;
};

// Delete a team project
export const deleteTeamProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  // Only project owner can delete the project
  if (String(userId) !== String(project.ownerId)) {
    throw new Error("You are not authorized to delete this project.");
  }

  await Project.findByIdAndDelete(projectId);

  return {
    message: "Project deleted successfully.",
    projectId: String(projectId)
  };
};

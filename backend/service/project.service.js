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
  userId,
  startDate,
  dueDate
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
    members: projectMembers,
    startDate: startDate,
    dueDate: dueDate
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
const getPopulatedProject = async (projectId) => {
  return Project.findById(projectId)
    .populate("members.userId", "name email username avatar")
    .populate("ownerId", "name email");
};

// updating the role of the member in a project
export const updateProjectMemberRole = async (memberId, projectId, role) => {
  const allowedRoles = ["manager", "member", "viewer"];
  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role.");
  }
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Team not found.");
  }

  //to prevent the owners role to change
  if (String(project.ownerId) === String(memberId)) {
    throw new Error("Cannot change the project owners role.");
  }
  //finding the member
  const memberExists = project.members.some(
    (member) => String(member.userId) === String(memberId)
  );

  if (!memberExists) {
    throw new Error("Member is not found in the project.");
  }
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
  return await getPopulatedProject(projectId);
};

//updates the project status
export const updateProjectStatus = async (projectId, status) => {
  const acceptedStatus = ["planning", "active", "completed", "archived"];
  if (!acceptedStatus.includes(status)) {
    throw new Error("Invalid Status.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  await Project.updateOne(
    {
      _id: projectId
    },
    {
      $set: {
        status: status
      }
    }
  );

  return await getPopulatedProject(projectId);
};

// Updates the project start date
export const updateProjectStartDate = async (projectId, startDate) => {
  if (!startDate || isNaN(Date.parse(startDate))) {
    throw new Error("Invalid start date.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  // Prevent start date from being later than due date
  if (project.dueDate && new Date(startDate) > new Date(project.dueDate)) {
    throw new Error("Start date cannot be after the due date.");
  }

  await Project.updateOne(
    { _id: projectId },
    {
      $set: {
        startDate: new Date(startDate)
      }
    }
  );

  return await getPopulatedProject(projectId);
};

//updates project due date
export const updateProjectDueDate = async (projectId, dueDate) => {
  if (!dueDate || isNaN(Date.parse(dueDate))) {
    throw new Error("Invalid due date.");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  //Preventing due date from being forward than start date
  if (project.startDate && new Date(dueDate) < new Date(project.startDate)) {
    throw new Error("Due date cannot be earlier than the start date.");
  }

  await Project.updateOne(
    {
      _id: projectId
    },
    {
      $set: {
        dueDate: new Date(dueDate)
      }
    }
  );
  return await getPopulatedProject(projectId);
};

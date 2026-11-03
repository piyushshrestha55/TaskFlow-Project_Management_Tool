import Team from "../../model/Team.js";
import {
  getUserProjects,
  createTeamProject,
  deleteTeamProject,
  updateProjectDueDate,
  updateProjectMemberRole,
  updateProjectStartDate,
  updateProjectStatus
} from "../../service/project.service.js";
import { handleProjectError } from "../../utils/projectErrorHandler.js";
import validateProject from "../../validator/project.validator.js";
const loadProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await getUserProjects(userId);

    return res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to fetch projects.");
  }
};
const createProject = async (req, res) => {
  try {
    const { name, description, teamId, status, startDate, dueDate } = req.body;

    // Validate project data
    const error = validateProject(name, description, teamId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    // Find team
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found."
      });
    }

    // Create project through service
    const project = await createTeamProject(
      name,
      description,
      status,
      team,
      req.user.id,
      startDate,
      dueDate
    );

    return res.status(201).json({
      success: true,
      message: "Project was successfully created.",
      project
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to create project.");
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID."
      });
    }
    const result = await deleteTeamProject(projectId, userId);
    return res.status(200).json({
      success: true,
      message: result.message,
      projectId: result.projectId
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to delete Project");
  }
};
//update the member role
const updateMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    if (
      !projectId ||
      !/^[0-9a-fA-F]{24}$/.test(projectId) ||
      !memberId ||
      !/^[0-9a-fA-F]{24}$/.test(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or member ID."
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required."
      });
    }

    const project = await updateProjectMemberRole(memberId, projectId, role);

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully.",
      project
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to update member role.");
  }
};

// update the project status
const updateStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID."
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Project status is required."
      });
    }

    const project = await updateProjectStatus(projectId, status);

    return res.status(200).json({
      success: true,
      message: "Project status updated successfully.",
      project
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to update project status.");
  }
};

//update the project start date
const updateStartDate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { startDate } = req.body;

    if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID."
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required."
      });
    }

    const project = await updateProjectStartDate(projectId, startDate);

    return res.status(200).json({
      success: true,
      message: "Project start date updated successfully.",
      project
    });
  } catch (error) {
    return handleProjectError(
      res,
      error,
      "Failed to update project start date."
    );
  }
};

//update the project due date
const updateDueDate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dueDate } = req.body;

    if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID."
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required."
      });
    }

    const project = await updateProjectDueDate(projectId, dueDate);

    return res.status(200).json({
      success: true,
      message: "Project due date updated successfully.",
      project
    });
  } catch (error) {
    return handleProjectError(res, error, "Failed to update project due date.");
  }
};
export {
  createProject,
  loadProject,
  deleteProject,
  updateMemberRole,
  updateStatus,
  updateStartDate,
  updateDueDate
};

import Team from "../../model/Team.js";
import {
  getUserProjects,
  createTeamProject,
  deleteTeamProject
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
export { createProject, loadProject, deleteProject };

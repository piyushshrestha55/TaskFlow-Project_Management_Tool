import Project from "../../model/Project.js";
import { getUserProjects } from "../../service/project.service.js";
const loadProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await getUserProjects(userId);

    return res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.log("Failed to load projects.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams"
    });
  }
};
const createProject = async (req, res) => {
  try {
    const { name, description, teamId, members, status } = req.body;
    const error = validateProject(name, description, teamId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }
    const project = await Project.create();
    return res.status(201).json({
      success: true,
      message: "Project was successfully created"
    });
  } catch (err) {
    console.error("Create project error", err);
    return res.status(500).json({
      success: false,
      message: "Internal Sever Error"
    });
  }
};

export { createProject, loadProject };

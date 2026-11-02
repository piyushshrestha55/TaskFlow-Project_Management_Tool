import Project from "../model/Project.js";

export const isManager = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!"
      });
    }
    if (project.ownerId.toString() === userId.toString()) {
      return next();
    }
    const member = project.members.find(
      (member) => member.userId.toString() === userId.toString()
    );
    if (!member || member.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Managers only."
      });
    }
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

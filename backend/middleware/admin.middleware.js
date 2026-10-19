import Team from "../model/Team.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found."
      });
    }

    const member = team.members.find(
      (member) => member.userId.toString() === userId.toString()
    );
    if (!member || member.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only."
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

import Team from "../../model/Team.js";
import { createMyTeam, getUserTeams } from "../../service/team.service.js";
const createTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team Name is required"
      });
    }
    const team = await createMyTeam(userId, name, description);
    return res.status(201).json({ success: true, team });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create a team" });
  }
};

const loadMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await getUserTeams(userId);
    return res.status(200).json({
      success: true,
      teams
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams"
    });
  }
};

export { createTeam, loadMyTeam };

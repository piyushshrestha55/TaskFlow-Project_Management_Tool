import Team from "../../model/Team.js";
import { getUserTeams } from "../../service/team.service.js";
const createTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Team Name and Description is required"
      });
    }
    const team = await Team.create({
      name: name,
      description: description,
      createdBy: userId,
      members: [userId]
    });
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

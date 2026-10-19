import Team from "../../model/Team.js";
import mongoose from "mongoose";
import {
  addMembersToTeam,
  createMyTeam,
  getUserTeams,
  removeMemberFromTeam
} from "../../service/team.service.js";
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
const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const { teamId } = req.params;
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member Id is required"
      });
    }
    if (
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID or member ID."
      });
    }
    const team = await addMembersToTeam(teamId, memberId);

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
      team
    });
  } catch (error) {}
};

export const removeMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required."
      });
    }

    if (
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID or member ID."
      });
    }

    const team = await removeMemberFromTeam(teamId, memberId);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully.",
      team
    });
  } catch (error) {
    if (error.message === "Team not found.") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Member not found in this team.") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Cannot remove the team creator.") {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    console.error("Error removing team member:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

export { createTeam, loadMyTeam, addMember, removeMember };

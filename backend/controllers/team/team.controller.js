import Team from "../../model/Team.js";
import mongoose from "mongoose";
import {
  addMembersToTeam,
  createMyTeam,
  getUserTeams,
  removeMemberFromTeam,
  updatingMemberRoleFromTeam
} from "../../service/team.service.js";
import { handleTeamError } from "../../utils/teamError.js";
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
  } catch (error) {
    return handleTeamError(res, error, "Failed to add team member.");
  }
};

const removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;

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
    return handleTeamError(res, error, "Failed to remove team member.");
  }
};
// update the role of members in team
const updateMemberRole = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required."
      });
    }

    // Validating the MongoDB IDs
    if (
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID or member ID."
      });
    }

    // Calling the service
    const team = await updatingMemberRoleFromTeam(teamId, memberId, role);

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully.",
      team
    });
  } catch (error) {
    return handleTeamError(res, error, "Failed to update member role.");
  }
};

export { createTeam, loadMyTeam, addMember, removeMember, updateMemberRole };

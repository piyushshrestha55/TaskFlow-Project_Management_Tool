export const teamErrorStatus = {
  // 404 - Not Found
  "Team not found.": 404,
  "Member not found in the team.": 404,
  "Member is not found in the team.": 404,

  // 403 - Forbidden
  "Cannot remove the team creator.": 403,
  "Cannot change the team creator's role.": 403,

  // 400 - Bad Request
  "Invalid role.": 400,
  "Role is not assigned": 400,
  "Role is not assigned.": 400,

  // 409 - Conflict
  "User is already a member of this team.": 409
};
export const handleTeamError = (res, error, fallbackMessage) => {
  const status = teamErrorStatus[error.message];

  if (status) {
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }

  console.error("Team operation error:", error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage || "Internal server error."
  });
};

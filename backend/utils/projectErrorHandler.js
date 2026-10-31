export const projectErrorStatus = {
  // 404 - Not Found
  "Project not found.": 404,
  "Team not found.": 404,
  "Member not found in the project.": 404,
  "User not found in the project.": 404,

  // 403 - Forbidden
  "You don't have the authority to create a project.": 403,
  "You are not authorized to access this project.": 403,
  "You are not authorized to update this project.": 403,
  "You are not authorized to delete this project.": 403,
  "Cannot remove the project owner.": 403,
  "Cannot change the project owner's role.": 403,

  // 400 - Bad Request
  "Invalid role.": 400,
  "Invalid project status.": 400,
  "Project name is required.": 400,
  "Role is not assigned.": 400,
  "Invalid team ID.": 400,
  "Invalid project ID.": 400,

  // 409 - Conflict
  "User is already a member of this project.": 409,
  "Project already exists.": 409
};

export const handleProjectError = (
  res,
  error,
  fallbackMessage = "Internal server error."
) => {
  const message =
    typeof error?.message === "string" ? error.message.trim() : "";

  const status = projectErrorStatus[message];

  if (status) {
    return res.status(status).json({
      success: false,
      message
    });
  }

  console.error("Project operation error:", error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage
  });
};

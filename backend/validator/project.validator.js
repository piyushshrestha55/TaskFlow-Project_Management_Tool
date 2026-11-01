export default function validateProject(name, description, teamId) {
  // Validate project name
  if (typeof name !== "string" || !name.trim()) {
    return "Project name is required";
  }

  if (name.trim().length > 100) {
    return "Project name cannot exceed 100 characters";
  }

  // Validate description
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return "Description must be a string";
  }

  if (typeof description === "string" && description.trim().length > 1000) {
    return "Description cannot exceed 1000 characters";
  }

  // Validate team ID
  if (!teamId) {
    return "Team ID is required";
  }

  if (typeof teamId !== "string" || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
    return "Invalid team ID";
  }

  return null;
}

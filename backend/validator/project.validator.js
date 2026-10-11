export default function validateProject(name, description, teamId) {
  if (!name || !name.trim()) {
    return "Project name is required";
  }

  if (name.trim().length > 100) {
    return "Project name cannot exceed 100 characters";
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return "Description must be a string";
  }

  if (description && description.trim().length > 1000) {
    return "Description cannot exceed 1000 characters";
  }

  if (
    teamId !== undefined &&
    teamId !== null &&
    !/^[0-9a-fA-F]{24}$/.test(teamId)
  ) {
    return "Invalid team ID";
  }

  return null;
}

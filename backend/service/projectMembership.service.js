// Adding a member to the project
export const addTeamMemberToProject = async (teamId, userId) => {
  const project = await Project.findOne({ teamId });
  if (!project) {
    return null;
  }

  await Project.updateOne(
    {
      _id: project._id,
      "member.userId": { $ne: userId }
    },
    {
      $push: {
        members: {
          userId,
          role: "viewer"
        }
      }
    }
  );
  return project;
};

// Removing the member
export const removeTeamMemberFromProject = async (teamId, userId) => {
  return Project.findOneAndUpdate(
    { teamId },
    {
      $pull: {
        members: { userId }
      }
    },
    { new: true }
  );
};

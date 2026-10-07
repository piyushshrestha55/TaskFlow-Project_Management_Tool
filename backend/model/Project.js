import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["member", "viewer"],
      default: "member"
    }
  },
  {
    _id: false
  }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },

    members: {
      type: [projectMemberSchema],
      default: []
    },

    status: {
      type: String,
      enum: ["planning", "active", "completed", "archived"],
      default: "planning"
    },

    startDate: {
      type: Date,
      default: null
    },

    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;

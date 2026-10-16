import mongoose from "mongoose";
const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member"
    }
  },
  { _id: false }
);
const teamSchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [teamMemberSchema]
  },
  {
    timestamps: true
  }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;

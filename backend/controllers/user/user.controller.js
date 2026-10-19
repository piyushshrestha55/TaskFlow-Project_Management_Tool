import { User } from "../../model/User.js";

export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.find({
      email: normalizedEmail
    }).select("name username email avatar");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No registered user found with this email"
      });
    }
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      user
    });
  } catch (error) {
    console.error("Error searching user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

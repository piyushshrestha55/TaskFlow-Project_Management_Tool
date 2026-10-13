import { getDashboardStats } from "../../service/dashboard.service.js";

export const loadDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardStats = await getDashboardStats(userId);
    return res.status(200).json({
      success: true,
      dashboardStats
    });
  } catch (error) {
    console.log("Error Loading Dashboard Items", error);
    return res.status(500).json({
      success: false,
      message: "Error Loading the Dashboard Items"
    });
  }
};

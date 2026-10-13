import { getProjectTasks } from "../../service/task.service.js";

const loadTasks = async (req, res) => {
  try {
    const userId = req.user.id; //getting the id through the jwt token

    //extracting all the tasks of the projects
    const tasks = await getProjectTasks();

    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks."
    });
  }
};
export { loadTasks };

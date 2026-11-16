import {
  createProjectTask,
  getMyTasks,
  getProjectTasks,
  updateProjectTask
} from "../../service/task.service.js";

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

// get the task of specific project
const loadTasksByProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const tasks = await getTasksByProject(userId, projectId);
    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Failed to load project tasks:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch the project tasks."
    });
  }
};

// load your tasks
const loadMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await getMyTasks(userId);
    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Failed to load my tasks:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch the your tasks."
    });
  }
};

// create a task in a project
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const taskData = req.body;
    const task = await createProjectTask(userId, projectId, taskData);
    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task
    });
  } catch (error) {
    console.error("Failed to create a task:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task."
    });
  }
};

// update the task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const taskData = req.body;

    const task = await updateProjectTask(taskId, taskData, userId);
    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task
    });
  } catch (error) {
    console.error("Failed to update task:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task."
    });
  }
};

//delete a task
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const result = await deleteProjectTask(taskId, userId);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Failed to delete task:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task."
    });
  }
};
export { loadTasks, loadMyTasks, createTask, updateTask, loadTasksByProject };

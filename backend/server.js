import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import teamRouter from "./routes/team.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import tasksRouter from "./routes/task.routes.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/team", teamRouter);
app.use("/project", projectRouter);
app.use("/tasks", tasksRouter);
app.use("/dashboard", dashboardRouter);

app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world" });
});

app.listen(port, async () => {
  await connectDB();
  console.log(`The app is listening at the port ${port}`);
});

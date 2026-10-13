import React from "react";
import { useLoaderData } from "react-router";
const Task = () => {
  const data = useLoaderData();
  console.log("Data:", data);
  return <div>Task</div>;
};

export default Task;

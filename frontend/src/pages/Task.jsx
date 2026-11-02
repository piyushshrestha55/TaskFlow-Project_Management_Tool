import UserTemplate from "@/components/UserTemplate";
import React from "react";
import { useLoaderData } from "react-router";
const Task = () => {
  const data = useLoaderData();
  console.log("Data:", data);
  return (
    <div className="min-h-screen">
      <UserTemplate title={"Task Management"} />
    </div>
  );
};

export default Task;

import UserTemplate from "@/components/UserTemplate";
import React from "react";
import { useLoaderData } from "react-router";
const Projects = () => {
  const data = useLoaderData();
  console.log("Data:", data);
  return (
    <div className="min-h-screen">
      <UserTemplate title={"Manage Projects"} />
    </div>
  );
};

export default Projects;

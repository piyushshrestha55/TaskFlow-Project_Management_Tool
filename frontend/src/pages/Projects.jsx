import React from "react";
import { useLoaderData } from "react-router";
const Projects = () => {
  const data = useLoaderData();
  console.log("Data:", data);
  return <div>Projects</div>;
};

export default Projects;

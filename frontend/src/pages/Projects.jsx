import UserTemplate from "@/components/UserTemplate";
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import CreateBtnTemplate from "@/components/createBtnTemplate";
import CreateProject from "@/components/Projects/CreateProject";

const Projects = () => {
  const data = useLoaderData();
  const [showForm, setShowForm] = useState(false);
  console.log("Data:", data);
  return (
    <div className="min-h-screen">
      <UserTemplate title={"Manage Projects"} />
      <div className="w-full min-h-screen bg-gray-100 px-10 py-6">
        <CreateBtnTemplate
          description={
            "Create and manage organizational projects, track project details, and keep project information organized."
          }
          showForm={showForm}
          setShowForm={setShowForm}
        />
        {showForm && (
          <CreateProject
            onProjectCreated={(newProject) => {
              // Add the new project to your projects state.
              setProjects((prev) => [...prev, newProject]);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;

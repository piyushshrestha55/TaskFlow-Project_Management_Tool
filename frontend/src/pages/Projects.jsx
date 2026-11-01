import UserTemplate from "@/components/UserTemplate";
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import CreateBtnTemplate from "@/components/createBtnTemplate";
import CreateProject from "@/components/Projects/CreateProject";

const Projects = () => {
  const data = useLoaderData();
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState(data.projects ?? []);
  console.log("Data:", data);
  const [successMessage, setSuccessMessage] = useState("");

  const onProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);

    setSuccessMessage("Project created successfully!");

    setShowForm(false);
    setSuccessMessage("");
  };
  return (
    <div className="min-h-full">
      <UserTemplate title={"Manage Projects"} />
      <div className="w-full min-h-full bg-gray-100 px-10 py-6">
        <CreateBtnTemplate
          description={
            "Create and manage organizational projects, track project details, and keep project information organized."
          }
          showForm={showForm}
          setShowForm={setShowForm}
        />
        {showForm && (
          <CreateProject
            onProjectCreated={onProjectCreated}
            onCancel={() => {
              setShowForm(false);
              setSuccessMessage("");
            }}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;

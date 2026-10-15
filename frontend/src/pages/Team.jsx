import UserTemplate from "@/components/UserTemplate";
import React from "react";
import { useLoaderData } from "react-router";
const Team = () => {
  const data = useLoaderData();
  console.log(`The data is`, data);
  return (
    <div className="min-h-screen">
      <UserTemplate title={"Team Management"} />
    </div>
  );
};

export default Team;

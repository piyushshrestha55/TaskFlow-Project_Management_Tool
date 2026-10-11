import React from "react";
import { useLoaderData } from "react-router";
const Team = () => {
  const data = useLoaderData();
  console.log(`The data is ${data}`);
  return <div>Team</div>;
};

export default Team;

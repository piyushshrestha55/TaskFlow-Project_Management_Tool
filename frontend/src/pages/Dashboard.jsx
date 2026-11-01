import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLoaderData } from "react-router";
import UserTemplate from "@/components/UserTemplate";
const Dashboard = () => {
  const data = useLoaderData();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);
  console.log("Data:", data);
  return (
    <div className="min-h-full">
      <UserTemplate title={"Dashboard"} />
    </div>
  );
};

export default Dashboard;

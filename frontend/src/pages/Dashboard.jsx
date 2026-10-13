import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLoaderData } from "react-router";
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
    <div className="min-h-screen">
      <div className="h-[125vh]">Hello, {user?.name || "User"}</div>
      {/* <h1>Hello, {user?.name || "User"}</h1>
      <p>Username: {user?.username || "Not found"}</p>
      <p>Email: {user?.email || "Not found"}</p> */}
    </div>
  );
};

export default Dashboard;

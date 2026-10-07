import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
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

  return (
    <div className="min-h-screen">
      <div className="h-[125vh]">Hello, {user?.name || "User"}</div>
    </div>
  );
};

export default Dashboard;

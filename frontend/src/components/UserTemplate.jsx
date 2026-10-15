import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
const UserTemplate = ({ title }) => {
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
    <div className="w-full px-6  flex justify-between  border-b-2 items-center  border-gray-300">
      <span className="font-semibold text-xl">{title}</span>
      <div className="border-l-2 border-gray-300  text-sm w-[14%] py-3 pl-2 flex gap-3 items-center">
        <img
          src={user?.avatar ? user.avatar : "/avatar.jpg"}
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover border-2"
        />
        <span className="flex flex-col gap-1  items-center justify-center">
          <span className="font-semibold">{user?.name}</span>
          <span className="text-gray-500">@{user?.username}</span>
        </span>
      </div>
    </div>
  );
};

export default UserTemplate;

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
    <div className="w-full px-3 sm:px-4 md:px-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 border-b-2 border-gray-300">
      {/* Page title */}
      <span className="font-semibold text-lg sm:text-xl min-w-0 truncate">
        {title}
      </span>

      {/* User profile */}
      <div className="flex items-center gap-2 sm:gap-3 border-l-2 border-gray-300 pl-3 py-2 sm:py-3 shrink-0 max-w-[65%] sm:max-w-none">
        <img
          src={user?.avatar || "/avatar.jpg"}
          alt="User avatar"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 shrink-0"
        />

        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-sm truncate">
            {user?.name || "User"}
          </span>

          <span className="text-gray-500 text-xs sm:text-sm truncate">
            @{user?.username || "username"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserTemplate;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
const UserTemplate = ({ title }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };
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
    <div className="w-full min-h-16 px-3 sm:px-4 md:px-6 flex justify-between items-center gap-2 border-b-2 border-gray-300 bg-white">
      {/* Page title */}

      <h1 className="font-semibold text-base sm:text-xl min-w-0 truncate">
        {title}
      </h1>

      {/* User profile */}
      <div className="relative flex items-center gap-2 border-l-2 border-gray-300 pl-3 py-2">
        {/* Profile trigger */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2"
        >
          <img
            src={user?.avatar || "/avatar.jpg"}
            alt="User avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />

          <div className="hidden sm:flex flex-col items-start">
            <span className="font-semibold text-sm">
              {user?.name || "User"}
            </span>
            <span className="text-gray-500 text-xs">
              @{user?.username || "username"}
            </span>
          </div>

          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border rounded-md z-60 p-2">
            <div className="px-3 py-2 border-b">
              <p className="font-semibold text-sm">{user?.name || "User"}</p>
              <p className="text-gray-500 text-xs">
                @{user?.username || "username"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-red-500 hover:bg-red-50 rounded-md"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTemplate;

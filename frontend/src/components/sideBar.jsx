import React from "react";
import { motion } from "motion/react";
import { NavLink, useNavigate } from "react-router";
import { FolderKanban, LayoutDashboard, ListCheck, Users } from "lucide-react";
import { Button } from "./ui/button";

const SideBar = () => {
  const navigate = useNavigate();

  const sideBarItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Tasks", path: "/tasks", icon: ListCheck },
    { name: "Team", path: "/team", icon: Users }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <motion.aside
      className="
      fixed bottom-0 left-0 z-50
    w-full h-16
    bg-white border-t border-gray-300
    flex flex-row items-center justify-around

    sm:sticky sm:top-0
    sm:h-screen sm:w-[15%]
    sm:flex-col sm:justify-start
    sm:border-t-0 sm:border-r-2
      "
    >
      {/* Logo - Desktop only */}
      <div className="hidden md:flex w-full text-xl font-semibold justify-center py-5 cursor-pointer">
        Task<span className="font-bold text-orange-500">Flow</span>
      </div>

      {/* Navigation */}
      <div
        className="
         w-full flex flex-row items-center justify-around
  sm:flex-col sm:items-stretch
  sm:gap-2 sm:px-2 sm:pt-3
  sm:border-t-2 sm:border-gray-300
      "
      >
        {sideBarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-sm
    sm:flex-row sm:justify-start sm:gap-2 sm:py-1
    ${isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`
              }
            >
              <Icon size={20} />
              <span className="text-xs md:text-base">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div
        className="
  hidden sm:flex
  w-full
  justify-center
  border-t-2 border-gray-300
  p-2
  mt-auto
"
      >
        <Button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5"
        >
          Log Out
        </Button>
      </div>
    </motion.aside>
  );
};

export default SideBar;

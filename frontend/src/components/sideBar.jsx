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
        sticky top-0
        h-screen
        w-[15%]
        shrink-0
        border-r-2 border-gray-300
        hidden sm:flex sm:flex-col
      "
    >
      <div className="w-full text-lg font-semibold sm:text-xl flex justify-center items-center sm:py-3 cursor-pointer py-1">
        Task<span className="font-bold text-orange-500">Flow</span>
      </div>

      <div className="flex-1 flex flex-col gap-5 px-2 pt-3 border-t-2 border-gray-300">
        {sideBarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-orange-500 text-white rounded-sm px-1 py-1"
                  : "flex items-center gap-2 hover:bg-gray-200  hover:rounded-sm px-1 py-1 "
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="border-t-2 border-gray-300 p-3 flex justify-center ">
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

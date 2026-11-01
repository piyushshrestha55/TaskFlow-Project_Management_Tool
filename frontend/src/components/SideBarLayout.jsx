import React from "react";
import SideBar from "./sideBar";
import { Outlet } from "react-router";

const SideBarLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col-reverse sm:flex-row relative ">
      <SideBar />
      <main className="flex-1 min-w-0 pb-16 sm:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBarLayout;

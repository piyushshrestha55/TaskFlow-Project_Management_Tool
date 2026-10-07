import React from "react";
import SideBar from "./sideBar";
import { Outlet } from "react-router";

const SideBarLayout = () => {
  return (
    <div className="min-h-screen w-screen flex relative">
      <SideBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBarLayout;

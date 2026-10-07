import React from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";

const MainLayout = () => {
  return (
    <div className="mx-4 min-h-screen sm:mx-6 md:mx-10 lg:mx-16 xl:mx-20">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;

import React from "react";
import { NavLink } from "react-router";

const NavBar = () => {
  return (
    <nav className="my-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 shadow-lg shadow-orange-100 sm:px-6 md:px-10 lg:px-16">
      <div>
        <NavLink to="/" className="text-lg font-semibold sm:text-xl">
          Task<span className="font-bold text-orange-500">Flow</span>
        </NavLink>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NavLink
          to="/login"
          className="rounded-lg bg-orange-400 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-500 sm:px-4
          hover:-translate-y-0.5"
        >
          Log In
        </NavLink>

        <NavLink
          to="/signup"
          className="rounded-lg bg-orange-400 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-500 sm:px-4
          hover:-translate-y-0.5"
        >
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

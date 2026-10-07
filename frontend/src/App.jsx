import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { authMiddleware } from "./middleware/authMiddleware.js";
import MainLayout from "./components/MainLayout";
import SideBarLayout from "./components/SideBarLayout";
import Task from "./pages/Task";
import Projects from "./pages/Projects";
import Team from "./pages/Team";

const routes = [
  {
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "login",
        Component: LogIn
      },
      {
        path: "signup",
        Component: SignUp
      }
    ]
  },

  {
    middleware: [authMiddleware],
    Component: SideBarLayout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard
      },
      {
        path: "tasks",
        Component: Task
      },
      {
        path: "projects",
        Component: Projects
      },
      {
        path: "team",
        Component: Team
      }
    ]
  }
];

const router = createBrowserRouter(routes, {
  future: {
    v8_middleware: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;

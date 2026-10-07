import { redirect } from "react-router";

export async function authMiddleware() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/login");
  }

  return null;
}

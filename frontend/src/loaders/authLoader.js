import { redirect } from "react-router";
import api from "../api/axios.js";

export function createAuthLoader(endpoint) {
  return async function loader() {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        throw redirect("/login");
      }

      throw error;
    }
  };
}

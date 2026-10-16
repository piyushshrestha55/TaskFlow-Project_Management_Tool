import api from "../api/axios.js";

export function createAuthLoader(endpoint) {
  return async function loader() {
    const response = await api.get(endpoint);
    return response.data;
  };
}

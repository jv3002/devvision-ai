const API_URL = "http://localhost:3000/api";

export const getProjects = async () => {
  const res = await fetch(`${API_URL}/projects`);
  return res.json();
};
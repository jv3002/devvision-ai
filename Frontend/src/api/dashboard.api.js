const API_URL = "http://localhost:3000/api";

export const getDashboard = async (projectId) => {
  const res = await fetch(`${API_URL}/dashboard/${projectId}`);
  return res.json();
};
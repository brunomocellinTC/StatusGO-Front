export async function fetchStatus() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const res = await fetch(`${apiUrl}/check`);
  return res.json();
}
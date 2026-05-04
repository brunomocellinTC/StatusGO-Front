export async function fetchStatus() {
  const res = await fetch("http://localhost:3001/check");
  return res.json();
}
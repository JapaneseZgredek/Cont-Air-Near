export const fetchShips = async () => {
  const response = await fetch('http://localhost:8000/api/ships');
  if (!response.ok) {
    throw new Error('Failed to fetch ships');
  }
  return response.json();
};

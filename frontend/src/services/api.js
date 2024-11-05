export const fetchShips = async () => {
  const response = await fetch('http://localhost:8000/api/ships');
  if (!response.ok) {
    throw new Error('Failed to fetch ships');
  }
  return response.json();
};

export const createShip = async (ship) => {
  const response = await fetch('http://localhost:8000/api/ships', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ship),
  });
  if (!response.ok) {
    throw new Error('Failed to create ship');
  }
  return response.json();
}

export const deleteShip = async (id) => {
  const response = await fetch(`http://localhost:8000/api/ships/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete ship');
  }
};

export const updateShip = async (ship) => {
  const response = await fetch(`http://localhost:8000/api/ships/${ship.id_ship}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ship),
  });
  return response.json();
};
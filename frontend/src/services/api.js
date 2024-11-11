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


// Operation table related

export const fetchOperations = async() => {
  const response = await fetch(`http://localhost:8000/api/operations/`);

  if(!response.ok){
    throw new Error('Failed to fetch operations')
  }
  return response.json();
};

export const createOperation = async(operation) => {
  const response = await fetch(`http://localhost:8000/api/operations/`, {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify(operation),
  });
  if (!response.ok) {
    throw new Error('Failed to create operation');
  }
  return response.json();
};

export const deleteOperation = async (id_operation) => {
  const response = await fetch(`http://localhost:8000/api/operations/${id_operation}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to create operation');
  }
};

export const updateOperation = async(operation) => {
  const response = await fetch(`http://localhost:8000/api/operations/${operation.id_operation}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(operation),
  });
  return response.json();
};

// Ports table related

export const fetchPorts = async () => {
  const response = await fetch('http://localhost:8000/api/ports');
  if (!response.ok) {
    throw new Error('Failed to fetch ports');
  }
  return response.json();
};

export const createPort = async (port) => {
  const response = await fetch('http://localhost:8000/api/ports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(port),
  });
  if (!response.ok) {
    throw new Error('Failed to create port');
  }
  return response.json();
};

export const deletePort = async (id_port) => {
  const response = await fetch(`http://localhost:8000/api/ports/${id_port}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete port');
  }
};

export const updatePort = async (port) => {
  const response = await fetch(`http://localhost:8000/api/ports/${port.id_port}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(port),
  });
  if (!response.ok) {
    throw new Error('Failed to update port');
  }
  return response.json();
};

// Products table related

export const fetchProducts = async () => {
  const response = await fetch('http://localhost:8000/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product) => {
  const response = await fetch('http://localhost:8000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
};

export const deleteProduct = async (id_product) => {
  const response = await fetch(`http://localhost:8000/api/products/${id_product}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

export const updateProduct = async (product) => {
  const response = await fetch(`http://localhost:8000/api/products/${product.id_product}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
};

export const fetchOrders = async () => {
  const response = await fetch('http://localhost:8000/api/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const createOrder = async (order) => {
  const response = await fetch('http://localhost:8000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
};

export const deleteOrder = async (id_order) => {
  const response = await fetch(`http://localhost:8000/api/orders/${id_order}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
};

export const updateOrder = async (order) => {
  const response = await fetch(`http://localhost:8000/api/orders/${order.id_order}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
};

export const fetchOrderById = async (id_order) => {
  const response = await fetch(`http://localhost:8000/api/orders/${id_order}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  return response.json();
};

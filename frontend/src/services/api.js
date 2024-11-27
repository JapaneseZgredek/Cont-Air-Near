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
export async function fetchOperationsByPort(portId) {
  const response = await fetch(`http://localhost:8000/api/operations/port/${portId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch operations for port ${portId}`);
  }
  return await response.json()
}

export async function fetchOperationsByShip(shipId) {
  const response = await fetch(`http://localhost:8000/api/operations/ship/${shipId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch operations for ship ${shipId}`);
  }
  return await response.json();
}
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

//Orders table related

export const fetchOrders = async () => {
  const response = await fetch('http://localhost:8000/api/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const fetchOrdersByPort = async (port_id) => {
  const response = await fetch(`http://localhost:8000/api/orders/port/${port_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch orders for port with id: ${port_id}`)
  }
  return response.json();
}

export const fetchOrdersByClient = async (client_id) => {
  const response = await fetch(`http://localhost:8000/api/orders/client/${client_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch orders for client with id: ${client_id}`)
  }
  return response.json();
}

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

export const fetchOrderHistories = async () => {
  const response = await fetch('http://localhost:8000/api/order_histories');
  if (!response.ok) {
    throw new Error('Failed to fetch order histories');
  }
  return response.json();
};

export const createOrderHistory = async (orderHistory) => {
  const response = await fetch('http://localhost:8000/api/order_histories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderHistory),
  });
  if (!response.ok) {
    throw new Error('Failed to create order history');
  }
  return response.json();
};

export const deleteOrderHistory = async (id_history) => {
  const response = await fetch(`http://localhost:8000/api/order_histories/${id_history}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order history');
  }
};

export const updateOrderHistory = async (orderHistory) => {
  const response = await fetch(`http://localhost:8000/api/order_histories/${orderHistory.id_history}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderHistory),
  });
  if (!response.ok) {
    throw new Error('Failed to update order history');
  }
  return response.json();
};

export const fetchOrderHistoryById = async (id_history) => {
  const response = await fetch(`http://localhost:8000/api/order_histories/${id_history}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order history details');
  }
  return response.json();
};

// Orders_products table related

export const fetchOrders_products = async () => {
  const response = await fetch('http://localhost:8000/api/orders_products');
  if (!response.ok) {
    throw new Error('Failed to fetch orders_products');
  }
  return response.json();
};

export const createOrder_product = async (order_product) => {
  const response = await fetch('http://localhost:8000/api/orders_products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order_product),
  });
  if (!response.ok) {
    throw new Error('Failed to create order_product');
  }
  return response.json();
};

export const deleteOrder_product = async (id_order, id_product) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/${id_order}_${id_product}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order_product');
  }
};

export const updateOrder_product = async (order_product) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/${order_product.id_order}_${order_product.id_product}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order_product),
  });
  if (!response.ok) {
    throw new Error('Failed to update order_product');
  }
  return response.json();
};

export const fetchOrders_productsByOrder = async (order_id) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/order/${order_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for order id: ${order_id}`)
  }
  return response.json();
};

export const fetchOrders_productsByProduct = async (product_id) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/product/${product_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for product id: ${product_id}`)
  }
  return response.json();
};

export const fetchClients = async () => {
  const response = await fetch('http://localhost:8000/api/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
};

export const createClient = async (client) => {
  const response = await fetch('http://localhost:8000/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  return response.json();
}

export const deleteClient = async (id) => {
  const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete client');
  }
};

export const updateClient = async (client) => {
  const response = await fetch(`http://localhost:8000/api/clients/${client.id_client}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  return response.json();
};
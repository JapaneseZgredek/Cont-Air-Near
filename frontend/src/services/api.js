import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
  }
  return token;
};

const authHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};


export const fetchShips = async () => {
  const response = await fetch(`${API_URL}/api/ships`);
  if (!response.ok) {
    throw new Error('Failed to fetch ships');
  }
  return response.json();
};

export const createShip = async (ship) => {
  const response = await fetch(`${API_URL}/api/ships`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(ship),
  });
  if (!response.ok) {
    throw new Error('Failed to create ship');
  }
  return response.json();
};

export const deleteShip = async (id) => {
  const response = await fetch(`${API_URL}/api/ships/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete ship');
  }
};

export const updateShip = async (ship) => {
  const response = await fetch(`${API_URL}/api/ships/${ship.id_ship}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(ship),
  });
  if (!response.ok) {
    throw new Error('Failed to update ship');
  }
  return response.json();
};




// Operation table related
export async function fetchOperationsByPort(portId) {
  const response = await fetch(`${API_URL}/api/operations/port/${portId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch operations for port ${portId}`);
  }
  return await response.json()
}

export const fetchOperations = async () => {
  return await fetchProtectedData(`/api/operations/`);
};


export async function fetchOperationsByShip(shipId) {
  const response = await fetch(`${API_URL}/api/operations/ship/${shipId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch operations for ship ${shipId}`);
  }
  return await response.json();
}

export const createOperation = async (operation) => {
  return await fetchProtectedData(`/api/operations/`, {
    method: 'POST',
    body: JSON.stringify(operation),
  });
};



export const deleteOperation = async (id_operation) => {
  return await fetchProtectedData(`/api/operations/${id_operation}`, {
    method: 'DELETE',
  });
};

export const updateOperation = async (operation) => {
  return await fetchProtectedData(`/api/operations/${operation.id_operation}`, {
    method: 'PUT',
    body: JSON.stringify(operation),
  });
};




// Ports table related

export const fetchPorts = async () => {
  return await fetchProtectedData(`/api/ports`);
};


export const createPort = async (port) => {
  return await fetchProtectedData(`/api/ports`, {
    method: 'POST',
    body: JSON.stringify(port),
  });
};


export const deletePort = async (id_port) => {
  return await fetchProtectedData(`/api/ports/${id_port}`, {
    method: 'DELETE',
  });
};

export const updatePort = async (port) => {
  return await fetchProtectedData(`/api/ports/${port.id_port}`, {
    method: 'PUT',
    body: JSON.stringify(port),
  });
};

// Products table related

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(`${API_URL}/api/products`, {
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
  const response = await fetch(`${API_URL}/api/products/${id_product}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

export const updateProduct = async (product) => {
  const response = await fetch(`${API_URL}/api/products/${product.id_product}`, {
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
  const response = await fetch(`${API_URL}/api/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const fetchOrdersByPort = async (port_id) => {
  const response = await fetch(`${API_URL}/api/orders/port/${port_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch orders for port with id: ${port_id}`)
  }
  return response.json();
}

export const fetchOrdersByClient = async (client_id) => {
  const response = await fetch(`${API_URL}/api/orders/client/${client_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch orders for client with id: ${client_id}`)
  }
  return response.json();
}

export const createOrder = async (order) => {
  const response = await fetch(`${API_URL}/api/orders`, {
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
  const response = await fetch(`${API_URL}/api/orders/${id_order}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
};

export const updateOrder = async (order) => {
  const response = await fetch(`${API_URL}/api/orders/${order.id_order}`, {
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
  const response = await fetch(`${API_URL}/api/orders/${id_order}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  return response.json();
};

export const fetchOrderHistories = async () => {
  const response = await fetch(`${API_URL}/api/order_histories`);
  if (!response.ok) {
    throw new Error('Failed to fetch order histories');
  }
  return response.json();
};

export const createOrderHistory = async (orderHistory) => {
  const response = await fetch(`${API_URL}/api/order_histories`, {
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
  const response = await fetch(`${API_URL}/api/order_histories/${id_history}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order history');
  }
};

export const updateOrderHistory = async (orderHistory) => {
  const response = await fetch(`${API_URL}/api/order_histories/${orderHistory.id_history}`, {
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
  const response = await fetch(`${API_URL}/api/order_histories/${id_history}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order history details');
  }
  return response.json();
};

// Orders_products table related

export const fetchOrders_products = async () => {
  const response = await fetch(`${API_URL}/api/orders_products`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders_products');
  }
  return response.json();
};

export const createOrder_product = async (order_product) => {
  const response = await fetch(`${API_URL}/api/orders_products`, {
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
  const response = await fetch(`${API_URL}/api/orders_products/${id_order}_${id_product}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order_product');
  }
};

export const updateOrder_product = async (order_product) => {
  const response = await fetch(`${API_URL}/api/orders_products/${order_product.id_order}_${order_product.id_product}`, {
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
  const response = await fetch(`${API_URL}/api/orders_products/order/${order_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for order id: ${order_id}`)
  }
  return response.json();
};

export const fetchOrders_productsByProduct = async (product_id) => {
  const response = await fetch(`${API_URL}/api/orders_products/product/${product_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for product id: ${product_id}`)
  }
  return response.json();
};

export const fetchClients = async () => {
  const response = await fetch(`${API_URL}/api/clients`);
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
};

export const createClient = async (client) => {
  const response = await fetch(`${API_URL}/api/clients`, {
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
  const response = await fetch(`${API_URL}/api/clients/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete client');
  }
};

export const updateClient = async (client) => {
  const response = await fetch(`${API_URL}/api/clients/${client.id_client}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  return response.json();
};


// Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  return await response.json();
};

// Register
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  return await response.json();
};

export const fetchProtectedData = async (endpoint, options = {}) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication token not found");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(`Error fetching ${endpoint}:`, error);
        throw new Error(error.detail || "Failed to fetch protected data");
    }

    return response.json();
};






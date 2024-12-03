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
  return await fetchProtectedData(`/api/ships/`);
};

export const createShip = async (ship) => {
    return await fetchProtectedData(`/api/ships`, {
    method: 'POST',
    body: JSON.stringify(ship),
  });
};

export const deleteShip = async (id) => {
  return await fetchProtectedData(`/api/ships/${id}`, {
    method: 'DELETE',
  });
};

export const updateShip = async (ship) => {
  return await fetchProtectedData(`/api/ships/${ship.id_ship}`, {
    method: 'PUT',
    body: JSON.stringify(ship)
  });
};

// Operation table related
export async function fetchOperationsByPort(portId) {
    return await fetchProtectedData(`/api/operations/port/${portId}`);
}

export const fetchOperations = async () => {
  return await fetchProtectedData(`/api/operations/`);
};


export async function fetchOperationsByShip(shipId) {
  return await fetchProtectedData(`/api/operations/ship/${shipId}`);
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
// Guest Table product
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product) => {
  return await fetchProtectedData(`/api/products`, {
    method: 'POST',
    body: JSON.stringify(product)
  });
};

export const deleteProduct = async (id_product) => {
    return await fetchProtectedData(`/api/products/${id_product}`, {
    method: 'DELETE',
  });
};

export const updateProduct = async (product) => {
    return await fetchProtectedData(`/api/products/${product.id_product}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
};

//Orders table related

export const fetchOrders = async () => {
  return await fetchProtectedData(`/api/orders`);
};

export const fetchOrdersByPort = async (port_id) => {
    return await fetchProtectedData(`/api/orders/port/${port_id}`);
}


export const fetchOrdersByClient = async (client_id) => {
    return await fetchProtectedData(`/api/orders/client/${client_id}`);
}


export const createOrder = async (order) => {
  return await fetchProtectedData(`/api/orders`, {
    method: 'POST',
    body: JSON.stringify(order),
  });
};

export const deleteOrder = async (id_order) => {
  return await fetchProtectedData(`/api/orders/${id_order}`, {
    method: 'DELETE',
  });
};

export const updateOrder = async (order) => {
  return await fetchProtectedData(`/api/orders/${order.id_order}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  });
};

export const fetchOrderById = async (id_order) => {
  return await fetchProtectedData(`/api/orders/${id_order}`);
};

export const fetchOrderHistories = async () => {
  return await fetchProtectedData(`/api/order_histories`);
};

export const createOrderHistory = async (orderHistory) => {
  return await fetchProtectedData(`/api/order_histories`, {
    method: 'POST',
    body: JSON.stringify(orderHistory),
  });
};

export const deleteOrderHistory = async (id_history) => {
  return await fetchProtectedData(`/api/order_histories/${id_history}`, {
    method: 'DELETE',
  });
};

export const updateOrderHistory = async (orderHistory) => {
    return await fetchProtectedData(`/api/order_histories/${orderHistory.id_history}`, {
    method: 'PUT',
    body: JSON.stringify(orderHistory),
  });
};

export const fetchOrderHistoryById = async (id_history) => {
  return await fetchProtectedData(`/api/order_histories/${id_history}`);
};

// Orders_products table related

export const fetchOrders_products = async () => {
  return await fetchProtectedData(`/api/orders_products`);
};

export const fetchOrders_productsByOrder = async (order_id) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/order/${order_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for order id: ${order_id}`)
  }
  return response.json();
}

export const fetchOrders_productsByProduct = async (product_id) => {
  const response = await fetch(`http://localhost:8000/api/orders_products/product/${product_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order_products for product id: ${product_id}`)
  }
  return response.json();
}

export const createOrder_product = async (order_product) => {
  return await fetchProtectedData(`/api/orders_products`, {
    method: 'POST',
    body: JSON.stringify(order_product),
  });
};

export const deleteOrder_product = async (id_order, id_product) => {
  return await fetchProtectedData(`/api/orders_products/${id_order}_${id_product}`, {
    method: 'DELETE',
  });
};

export const updateOrder_product = async (order_product) => {
    return await fetchProtectedData(`/api/orders_products/${order_product.id_order}_${order_product.id_product}`, {
    method: 'PUT',
    body: JSON.stringify(order_product),
  });
};

export const fetchOrders_productsByOrder = async (order_id) => {
  return await fetchProtectedData(`/api/orders_products/order/${order_id}`);
};

export const fetchOrders_productsByProduct = async (product_id) => {
    return await fetchProtectedData(`/api/orders_products/product/${product_id}`);
};

export const fetchClients = async () => {
  return await fetchProtectedData(`/api/clients`);
};

export const createClient = async (client) => {
  return await fetchProtectedData(`/api/clients`, {
    method: 'POST',
    body: JSON.stringify(client),
  });
};

export const deleteClient = async (id) => {
    return await fetchProtectedData(`/api/clients/${id}`, {
    method: 'DELETE',
  });
};

export const updateClient = async (client) => {
  return await fetchProtectedData(`/api/clients/${client.id_client}`, {
    method: 'PUT',
    body: JSON.stringify(client),
  });
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






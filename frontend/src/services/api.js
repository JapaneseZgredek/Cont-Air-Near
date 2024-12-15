import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return token;
};

//use to debug if you need
const authHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchShips = async () => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/ships/`);
};

export const createShip = async (ship) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        console.log("Making POST request to /api/ships with payload:", ship);
        const response = await axios.post(`${API_URL}/api/ships`, ship, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/ships:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createShip:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create ship");
    }
};

export const deleteShip = async (ship_id) => {
    try {
        await verifyRoles(['EMPLOYEE','ADMIN']);
        return await fetchProtectedData(`/api/ships/${ship_id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updateShip = async (ship) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        console.log("Making PUT request to /api/ships with payload:", ship);
        const response = await axios.put(`${API_URL}/api/ships/${ship.id_ship}`, ship, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/ships:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updateShip:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update ship");
    }
};

// Operation table related
export async function fetchOperationsByPort(portId) {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/operations/port/${portId}`);
}

export async function fetchOperationsByShip(shipId) {
  await verifyRoles(['EMPLOYEE', 'ADMIN']);
  return await fetchProtectedData(`/api/operations/ship/${shipId}`);
}

// export const fetchOperations = async () => {
//   await verifyRoles(['EMPLOYEE', 'ADMIN']);
//   return await fetchProtectedData(`/api/operations/`);
// };

export const fetchOperations = async () => {
  await verifyRoles(['EMPLOYEE', 'ADMIN']);
  return await fetchProtectedData(`/api/operations/`);
};

// export const createOperation = async (operation) => {
//   await verifyRoles(['EMPLOYEE', 'ADMIN']);
//   return await fetchProtectedData(`/api/operations`, {
//     method: 'POST',
//     // body: JSON.stringify(operation),
//   });
// };

export const createOperation = async (operation) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log("Making POST request to /api/operations with payload:", operation);
        const response = await axios.post(`${API_URL}/api/operations`, operation, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/operations:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createOperation:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create operation");
    }
};


export const deleteOperation = async (id_operation) => {
  await verifyRoles(['EMPLOYEE', 'ADMIN']);
  return await fetchProtectedData(`/api/operations/${id_operation}`, {
    method: 'DELETE',
  });
};

export const updateOperation = async (operation) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log("Making PUT request to /api/operations with payload:", operation);
        const response = await axios.put(`${API_URL}/api/operations/${operation.id_operation}`, operation, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/operations:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updateOperation:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update operation");
    }
};




// Ports table related

export const fetchPorts = async () => {
  await verifyRoles(['CLIENT','EMPLOYEE', 'ADMIN']);
  return await fetchProtectedData(`/api/ports`);
};

export const createPort = async (port) => {
    await verifyRoles(['ADMIN']);
    try {
        console.log("Making POST request to /api/ports with payload:", port);
        const response = await axios.post(`${API_URL}/api/ports`, port, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/ports:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createPort:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create port");
    }
};


export const deletePort = async (id_port) => {
    try {
        await verifyRoles(['ADMIN']);
        return await fetchProtectedData(`/api/ports/${id_port}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updatePort = async (port) => {
    await verifyRoles(['ADMIN']);
    try {
        console.log("Making PUT request to /api/ports with payload:", port);
        const response = await axios.put(`${API_URL}/api/ports/${port.id_port}`, port, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/ports:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updatePort:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update port");
    }
};

// Products table related

export async function fetchProductsByPort(portId) {
  await verifyRoles(['EMPLOYEE', 'ADMIN']); //CLIENT?
  return await fetchProtectedData(`api/products/port/${portId}`);
}

// Guest Table product do not add auth

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

export const fetchOrderHistoriesByOrder = async (orderId) => {
  const response = await fetch(`http://localhost:8000/api/order_histories/order/${orderId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch order histories for order id: ${orderId}`);
  }
  return response.json();
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

export const fetchOrders_productsByOrder_zapas = async (order_id) => {
  return await fetchProtectedData(`/api/orders_products/order/${order_id}`);
};

export const fetchOrders_productsByProduct_zapas = async (product_id) => {
    return await fetchProtectedData(`/api/orders_products/product/${product_id}`);
};

export const fetchClients = async () => {
    try {
        await verifyRoles(['ADMIN']);
        return await fetchProtectedData(`/api/clients`);
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const createClient = async (client) => {
    await verifyRoles(['ADMIN']);
    try {
        console.log("Making POST request to /api/clients with payload:", client);
        const response = await axios.post(`${API_URL}/api/clients`, client, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/clients:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createClient:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create client");
    }
};


export const deleteClient = async (id_client) => {
    try {
        await verifyRoles(['ADMIN']); // Explicitly define roles
        return await fetchProtectedData(`/api/clients/${id_client}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updateClient = async (client) => {
    await verifyRoles(['ADMIN']);
    try {
        console.log("Making PUT request to /api/clients with payload:", client);
        const response = await axios.put(`${API_URL}/api/clients/${client.id_client}`, client, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/clients:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updateClient:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update client");
    }
};

// Login

export const loginClient = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/clients/login`, credentials);
  const { access_token, role } = response.data;
  localStorage.setItem('token', access_token);
  localStorage.setItem('role', role);
  return response.data;
};
// Register
export const registerClient = async (clientData) => {
  const response = await axios.post(`${API_URL}/api/clients`, clientData);
  return response.data;
};

// Role Verification

// export const verifyRole = async (requiredRole) => {
//   const token = getAuthToken();
//   if (!token) {
//     throw new Error('Authentication token not found');
//   }
//
//   try {
//     const response = await axios.get(`${API_URL}/api/users/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//
//     const { role } = response.data; // Assuming role is returned by the API
//     if (role !== requiredRole) {
//         throw new Error(`Insufficient permissions. Required role: ${requiredRole}`);
//     }
//
//     return true;
//   } catch (error) {
//     console.error('Role verification failed:', error);
//     throw error;
//   }
// };

// export const fetchCurrentClient = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     console.error("Authentication token not found in localStorage.");
//     throw new Error("Authentication required. Please log in.");
//   }
//
//   try {
//     const response = await axios.get(`${API_URL}/api/clients/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log("Client details fetched:", response.data);
//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 404) {
//       console.warn("/api/clients/me endpoint not found. Falling back to localStorage.");
//       const role = localStorage.getItem('role');
//       if (!role) {
//         throw new Error("Role information is missing. Please log in.");
//       }
//       return { role };
//     }
//     console.error("Error fetching current client details:", error.message);
//     throw error;
//   }
// };

export const fetchCurrentClient = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await axios.get(`${API_URL}/api/clients/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current client details:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyRoles = async (requiredRoles) => {
  try {
    const currentClient = await fetchCurrentClient();
    const { role } = currentClient;

    if (!role) {
      throw new Error("Client role is undefined. Please check the backend or localStorage.");
    }

    console.log(`Client role: ${role}, Required roles: ${requiredRoles.join(', ')}`); // Debug
    if (!requiredRoles.includes(role)) {
      throw new Error(
        `Access denied. Client role: ${role}, Required: ${requiredRoles.join(', ')}`
      );
    }
    return true;
  } catch (error) {
    console.error("Role verification failed:", error.message);

    throw error;
  }
};




// const fetchProtectedData = async (endpoint, options = {}) => {
//   const token = getAuthToken();
//   const response = await axios(`${API_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   });
//
//   return response.data;
// };

const fetchProtectedData = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // Token retrieval logic
  if (!token) {
    console.error("Authentication token not found in localStorage");
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await axios(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response.data; // Return parsed JSON data
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      console.error(`Error fetching ${endpoint}:`, error.response.data);
      if (error.response.status === 404) {
        throw new Error("Endpoint not found. Please check the API URL.");
      } else if (error.response.status === 403) {
        throw new Error("Access denied. Insufficient permissions.");
      } else if (error.response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else {
        throw new Error(
          error.response.data.detail || "An error occurred while fetching data."
        );
      }
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
      throw new Error("Unable to reach the server. Please check your network.");
    } else {
      console.error("Error during request setup:", error.message);
      throw new Error(error.message || "Unexpected error occurred.");
    }
  }
};









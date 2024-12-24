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

export const fetchShipDetails = async (ship_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/ships/${ship_id}/details`);
}
export const fetchShips = async () => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/ships/`);
};

export const createShip = async (ship) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
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
        await verifyRoles(['EMPLOYEE', 'ADMIN']);
        return await fetchProtectedData(`/api/ships/${ship_id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updateShip = async (ship) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
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

export const fetchShipImage = async (id_ship) => {
    const response = await fetch(`${API_URL}/api/ships/image/${id_ship}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ship image');
    }
    // response converted to Blob object
    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };
  
  export const uploadShipImage = async (id_ship, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/api/ships/image/${id_ship}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to upload ship '+id_ship+' image');
    }
    const data = await response.json();
    return data;
  };

// Operation table related
export async function fetchOperationsByPort(portId) {
    await verifyRoles(['EMPLOYEE', 'ADMIN', 'CLIENT']);
    return await fetchProtectedData(`/api/operations/port/${portId}`);
}

export async function fetchOperationsByShip(shipId) {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/operations/ship/${shipId}`);
}

export const fetchOperations = async () => {
  await verifyRoles(['EMPLOYEE', 'ADMIN']);
  return await fetchProtectedData(`/api/operations/`);
};

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
  await verifyRoles(['CLIENT','EMPLOYEE','ADMIN']);
  return await fetchProtectedData(`/api/ports`);
};

export const createPort = async (port) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
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
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        return await fetchProtectedData(`/api/ports/${id_port}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updatePort = async (port) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
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

export const fetchPortDetails = async (id_port) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN', 'CLIENT']);
    return await fetchProtectedData(`/api/ports/${id_port}/details`);
};

// Products table related

export async function fetchProductsByPort(portId) {
  await verifyRoles(['EMPLOYEE', 'ADMIN', 'CLIENT']);
  return await fetchProtectedData(`/api/products/port/${portId}`);
}

// Guest Table product do not add auth

export const fetchProductDetails = async (id_product) => {
    await verifyRoles(['CLIENT', 'EMPLOYEE','ADMIN']);
    return await fetchProtectedData(`/api/products/${id_product}/details`);
};

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        console.log("Making POST request to /api/products with payload:", product);
        const response = await axios.post(`${API_URL}/api/products`, product, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/products:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createProduct:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create product");
    }
};

export const deleteProduct = async (id_product) => {
    try {
        await verifyRoles(['EMPLOYEE','ADMIN']);
        return await fetchProtectedData(`/api/products/${id_product}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updateProduct = async (product) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        console.log("Making PUT request to /api/products with payload:", product);
        const response = await axios.put(`${API_URL}/api/products/${product.id_product}`, product, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/products:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updateProduct:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update ship");
    }
};

export const fetchProductImage = async (id_product) => {
  const response = await fetch(`${API_URL}/api/products/image/${id_product}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product image');
  }
  // response converted to Blob object
  const imageBlob = await response.blob();
  const imageUrl = URL.createObjectURL(imageBlob);
  return imageUrl;
};

export const uploadProductImage = async (id_product, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/api/products/image/${id_product}`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to upload product '+id_product+' image');
  }
  const data = await response.json();
  return data;
};

//Orders table related

export const fetchOrders = async () => {
    try {
        const currentClient = await fetchCurrentClient();

        if (currentClient.role === 'CLIENT') {
            return await fetchOrdersByClient(currentClient.id_client);
        }

        await verifyRoles(['EMPLOYEE', 'ADMIN']);
        return await fetchProtectedData(`/api/orders`);
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


//DODAĆ, ŻE CLIENT MOŻE SAM ZFETCHOWAĆ SWÓJ ORDER w podobny sposób jak
//fetchOrderById
//verify roles
//napisac metode podobna do fetch current client tylko taką co fetchuje po id jego produkty i dorobić backend + front

export const fetchOrderDetails = async (order_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN', 'CLIENT']);
    return await fetchProtectedData(`/api/orders/${order_id}`);
};

export const fetchOrdersByPort = async (port_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN', 'CLIENT']);
    return await fetchProtectedData(`/api/orders/port/${port_id}`);
}


export const fetchOrdersByClient = async (client_id) => {
    await verifyRoles(['CLIENT', 'EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/orders/client/${client_id}`);
}

export const fetchOrdersForOwner = async (client_id) => {
    await verifyRoles(['CLIENT']);
    return await fetchProtectedData(`/api/orders/client/${client_id}`);
}


export const createOrder = async (order) => {
    await verifyRoles(['CLIENT','EMPLOYEE','ADMIN']);
    try {
        console.log("Making POST request to /api/orders with payload:", order);
        const response = await axios.post(`${API_URL}/api/orders`, order, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/orders:", response.data);
        return await response.data;
    } catch (error) {
        console.error("Error in createOrder:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create order");
    }
};

export const deleteOrder = async (id_order) => {
    try {
        await verifyRoles(['EMPLOYEE','ADMIN']);
        return await fetchProtectedData(`/api/orders/${id_order}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Role verification failed:", error.message);
        throw error;
    }
};

export const updateOrder = async (order) => {
    await verifyRoles(['EMPLOYEE','ADMIN']);
    try {
        console.log("Making PUT request to /api/orders with payload:", order);
        const response = await axios.put(`${API_URL}/api/orders/${order.id_order}`, order, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/orders:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updateOrder:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to update order");
    }
};

// Orders_products table related

export const fetchOrders_products = async () => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    return await fetchProtectedData(`/api/orders_products`);
};

export const fetchOrders_productsByOrder = async (order_id) => {
    await verifyRoles(['CLIENT', 'EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making GET request to /api/orders_products/order/${order_id}`);
        const response = await axios.get(`${API_URL}/api/orders_products/order/${order_id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from /api/orders_products/order/${order_id}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders_products for order id ${order_id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to fetch orders_products for order id: ${order_id}`);
    }
};

export const fetchOrders_productsByProduct = async (product_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making GET request to /api/orders_products/product/${product_id}`);
        const response = await axios.get(`${API_URL}/api/orders_products/product/${product_id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from /api/orders_products/product/${product_id}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders_products for product id ${product_id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to fetch orders_products for product id: ${product_id}`);
    }
};


export const createOrder_product = async (order_product) => {
    await verifyRoles(['CLIENT', 'EMPLOYEE', 'ADMIN']);
    try {
        console.log("Making POST request to /api/orders_products with payload:", order_product);
        const response = await axios.post(`${API_URL}/api/orders_products`, order_product, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Response from /api/orders_products:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in createOrder_product:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to create order_product");
    }
};

export const deleteOrder_product = async (id_order, id_product) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making DELETE request to /api/orders_products/${id_order}_${id_product}`);
        const response = await axios.delete(`${API_URL}/api/orders_products/${id_order}_${id_product}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from DELETE /api/orders_products/${id_order}_${id_product}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in deleteOrder_product for ${id_order}_${id_product}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to delete order_product with ID ${id_order}_${id_product}`);
    }
};


export const updateOrder_product = async (order_product) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making PUT request to /api/orders_products/${order_product.id_order}_${order_product.id_product} with payload:`, order_product);
        const response = await axios.put(`${API_URL}/api/orders_products/${order_product.id_order}_${order_product.id_product}`, order_product, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from PUT /api/orders_products/${order_product.id_order}_${order_product.id_product}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in updateOrder_product for ${order_product.id_order}_${order_product.id_product}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to update order_product with ID ${order_product.id_order}_${order_product.id_product}`);
    }
};

export const fetchOrders_productsByOrder_zapas = async (order_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making GET request to /api/orders_products/order/${order_id}`);
        const response = await axios.get(`${API_URL}/api/orders_products/order/${order_id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from /api/orders_products/order/${order_id}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in fetchOrders_productsByOrder_zapas for order_id ${order_id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to fetch orders_products for order ID ${order_id}`);
    }
};

export const fetchOrders_productsByProduct_zapas = async (product_id) => {
    await verifyRoles(['EMPLOYEE', 'ADMIN']);
    try {
        console.log(`Making GET request to /api/orders_products/product/${product_id}`);
        const response = await axios.get(`${API_URL}/api/orders_products/product/${product_id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Response from /api/orders_products/product/${product_id}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in fetchOrders_productsByProduct_zapas for product_id ${product_id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Failed to fetch orders_products for product ID ${product_id}`);
    }
};

export const fetchExcludedProducts = async () => {
  await verifyRoles(['CLIENT','EMPLOYEE','ADMIN'])
  try {
    console.log("Making GET request to /api/products/exclude");
    const response = await axios.get(`${API_URL}/api/products/exclude`, {
      headers: authHeaders(),
    });
    console.log("Response from /api/products/exclude:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchExcludedProducts:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch excluded products");
  }
};

export const fetchClientDetails = async (clientId) => {
    await verifyRoles(['CLIENT', 'EMPLOYEE' ,'ADMIN']);
    return await fetchProtectedData(`/api/clients/${clientId}/details`);
};

export const fetchClients = async () => {
    try {
        await verifyRoles(['CLIENT', 'EMPLOYEE' ,'ADMIN']);
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

export const updateUserOwnData = async (user) => {
    await verifyRoles(['ADMIN','EMPLOYEE','CLIENT']);
    const userLoggedIn = await fetchCurrentClient();
    if(user.id_client != userLoggedIn.id_client){
        console.error("Error in updateUserOwnData: cannot modify data of a user other than the logged-in one");
        throw new Error("Failed to update user data - cannot modify data of a user other than the logged-in one");
    } else {
        try {
            console.log("Making PUT request to /api/clients with payload:", user);
            const response = await axios.put(`${API_URL}/api/clients/${user.id_client}`, user, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("Response from /api/clients:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error in updateUserOwnData:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to update user data");
        }
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









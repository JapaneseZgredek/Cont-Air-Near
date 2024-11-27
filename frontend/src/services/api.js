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

export const fetchOperations = async () => {
  return await fetchProtectedData('/api/operations/');
};



export const createOperation = async (operation) => {
  return await fetchProtectedData('/api/operations/', {
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
  return await fetchProtectedData('/api/ports');
};


export const createPort = async (port) => {
  return await fetchProtectedData('/api/ports', {
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

export const fetchOrders = async () => {
  const response = await fetch('${API_URL}/api/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const createOrder = async (order) => {
  const response = await fetch('${API_URL}/api/orders', {
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


// export const registerUser = async (user) => {
//   try {
//     const response = await axios.post(`${API_URL}/api/users`, user);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.detail || 'Registration failed');
//   }
// };
//
// export const loginUser = async (credentials) => {
//     try {
//         const response = await axios.post('http://localhost:8000/api/users/login', credentials, {
//             headers: { 'Content-Type': 'application/json' },
//         });
//         return response.data; //tutaj zwracany jest token JWT, który potem dla usera nie bedzie widoczny tak jak jest teraz (to jest po debug)
//     } catch (error) {
//         throw new Error(error.response?.data?.detail || 'Login failed');
//     }
// };



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

// export const fetchProtectedData = async (endpoint) => {
//   const token = getAuthToken();
//   const response = await fetch(`${API_URL}${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });
//
//   if (!response.ok) {
//     throw new Error('Failed to fetch protected data');
//   }
//
//   return await response.json();
// };

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






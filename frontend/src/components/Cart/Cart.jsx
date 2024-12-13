import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = 'http://localhost:8000';

const Cart = () => {
  const [orderId, setOrderId] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/cart/${orderId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeCartItem = async (idProduct) => {
    try {
      await axios.delete(`${apiUrl}/cart/${orderId}/${idProduct}`);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [orderId]);

  return (
    <div>
      <h2>Your Cart</h2>
      <div>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id_product}>
                Product ID: {item.id_product} | Quantity: {item.quantity}
                <button onClick={() => removeCartItem(item.id_product)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
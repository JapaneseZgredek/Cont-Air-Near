import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createOrder_product, fetchOrders, fetchProducts } from "../../services/api";

const Order_productAdd = ({ onAdd }) => {
  const [show, setShow] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Load Orders and Products
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders.");
      }
    };

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      }
    };

    loadOrders();
    loadProducts();
  }, []);

  // Validate input fields
  const validateInputs = () => {
    if (!idOrder) return "Please select an order.";
    if (!idProduct) return "Please select a product.";
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0)
      return "Quantity must be a valid positive number.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const orderProductData = {
      id_order: parseInt(idOrder),
      id_product: parseInt(idProduct),
      quantity: parseInt(quantity),
    };

    try {
      const newOrderProduct = await createOrder_product(orderProductData);
      onAdd(newOrderProduct);
      handleClose();
    } catch (err) {
      setError("Failed to create order product.");
    }
  };

  // Reset form state and close modal
  const handleClose = () => {
    setShow(false);
    setIdOrder("");
    setIdProduct("");
    setQuantity("");
    setError(null);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Add Order Product
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Order Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Form onSubmit={handleSubmit}>
            {/* Order Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Order</Form.Label>
              <Form.Control
                as="select"
                required
                value={idOrder}
                onChange={(e) => setIdOrder(e.target.value)}
              >
                <option value="">Select Order</option>
                {orders.map((order) => (
                  <option key={order.id_order} value={order.id_order}>
                    {order.id_order}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Product Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                required
                value={idProduct}
                onChange={(e) => setIdProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id_product} value={product.id_product}>
                    {product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Quantity Input */}
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Add Order Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Order_productAdd;

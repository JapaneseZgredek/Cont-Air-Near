import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

const CartBadge = ({ orderId }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/cart/${orderId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [orderId]);

  return (
    <LinkContainer to="/cart">
      <Nav.Link>
        <i className="fas fa-shopping-cart"></i> Cart{' '}
        {cartItems.length > 0 && <Badge bg="success">{cartItems.length}</Badge>}
      </Nav.Link>
    </LinkContainer>
  );
};

const NavbarComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const orderId = 1;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Navbar Brand */}
        <LinkContainer to="/">
          <Navbar.Brand>Cont-Air-Near</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Public Links */}
            <LinkContainer to="/products">
              <Nav.Link>Products</Nav.Link>
            </LinkContainer>

            {/* Cart Component */}
            <CartBadge orderId={orderId} />

            {/* Conditional Links Based on Authentication */}
            {isLoggedIn ? (
              <>
                {/* Protected Links */}
                <LinkContainer to="/ships">
                  <Nav.Link>Ships</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/order_products">
                  <Nav.Link>Order_products</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/order_histories">
                  <Nav.Link>OrderHistory</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/operations">
                  <Nav.Link>Operations</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/ports">
                  <Nav.Link>Ports</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <Nav.Link>Orders</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/clients">
                  <Nav.Link>Clients</Nav.Link>
                </LinkContainer>

                {/* Logout Link */}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                {/* Login and Register Links */}
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
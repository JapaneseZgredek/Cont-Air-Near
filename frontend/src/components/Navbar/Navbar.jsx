import React, { useEffect, useContext, useState } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RoleContext } from '../../contexts/RoleContext';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const { role, handleLogout } = useContext(RoleContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration > 0) {
        const timeout = setTimeout(() => {
          handleLogout();
          alert('Session expired, you have been logged out.');
          window.location.reload(); // Refresh page after auto-logout
        }, timeUntilExpiration);

        return () => clearTimeout(timeout); // Cleanup timeout
      } else {
        handleLogout();
        window.location.reload(); // Refresh page immediately if token already expired
      }
    }
  }, [handleLogout]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const getLinksForRole = () => {
    if (!role) {
      return (
        <>
          <LinkContainer to="/login">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
        </>
      );
    }

    const roleLinks = {
      ADMIN: [
        { path: '/products', label: 'Products' },
        { path: '/ships', label: 'Ships' },
        { path: '/operations', label: 'Operations' },
        { path: '/ports', label: 'Ports' },
        { path: '/orders', label: 'Orders' },
        { path: '/clients', label: 'Clients' },
        { path: '/user_panel', label: 'User Panel' },
        { path: '/cart', label: <FaShoppingCart /> },
      ],
      EMPLOYEE: [
        { path: '/ships', label: 'Ships' },
        { path: '/operations', label: 'Operations' },
        { path: '/ports', label: 'Ports' },
        { path: '/orders', label: 'Orders' },
        { path: '/products', label: 'Products' },
        { path: '/user_panel', label: 'User Panel' },
        { path: '/cart', label: <FaShoppingCart /> },
      ],
      CLIENT: [
        { path: '/ports', label: 'Ports' },
        { path: '/orders', label: 'Orders' },
        { path: '/products', label: 'Products' },
        { path: '/user_panel', label: 'User Panel' },
        { path: '/cart', label: <FaShoppingCart /> },
      ],
    };

    return roleLinks[role]?.map((link) => (
      <LinkContainer key={link.path} to={link.path}>
        <Nav.Link>{link.label}</Nav.Link>
      </LinkContainer>
    ));
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>Cont-Air-Near</BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {getLinksForRole()}
            {role && (
              <Nav.Link onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavbarComponent;

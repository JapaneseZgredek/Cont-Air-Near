import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RoleContext } from '../../contexts/RoleContext';

const NavbarComponent = () => {
  const { role, handleLogout } = useContext(RoleContext);

  const getLinksForRole = () => {
    if (!role) {
      return (
        <>
          <LinkContainer to="/products">
            <Nav.Link>Products</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/login">
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/register">
            <Nav.Link>Register</Nav.Link>
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
          { path: '/order_products', label: 'Order Products' },
          { path: '/clients', label: 'Clients' },
      ],
      EMPLOYEE: [
          // { path: '/ships', label: 'Ships' },
          { path: '/operations', label: 'Operations' },
          { path: '/ports', label: 'Ports' },
          { path: '/orders', label: 'Orders' },
          { path: '/order_products', label: 'Order Products' },
          { path: '/products', label: 'Products' },
      ],
      CLIENT: [
          { path: '/ports', label: 'Ports' },
          { path: '/orders', label: 'Orders' },
          { path: '/products', label: 'Products' },
      ],
    };

    return roleLinks[role].map((link) => (
      <LinkContainer key={link.path} to={link.path}>
        <Nav.Link>{link.label}</Nav.Link>
      </LinkContainer>
    ));
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>Cont-Air-Near</BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {getLinksForRole()}
            {role && (
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
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

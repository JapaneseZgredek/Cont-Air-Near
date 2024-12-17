import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RoleContext } from '../../contexts/RoleContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon from react-icons
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const { role, handleLogout } = useContext(RoleContext);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout(); // Wywołanie funkcji wylogowania
    navigate('/login'); // Przeniesienie na stronę logowania
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
        { path: '/order_products', label: 'Order Products' },
        { path: '/clients', label: 'Clients' },
        { path: '/cart', label: <FaShoppingCart /> }, // Replaced Cart text with cart icon
      ],
      EMPLOYEE: [
        { path: '/ships', label: 'Ships' },
        { path: '/operations', label: 'Operations' },
        { path: '/ports', label: 'Ports' },
        { path: '/orders', label: 'Orders' },
        { path: '/cart', label: <FaShoppingCart /> }, // Replaced Cart text with cart icon
      ],
      CLIENT: [
        { path: '/ports', label: 'Ports' },
        { path: '/orders', label: 'Orders' },
        { path: '/products', label: 'Products' },
        { path: '/cart', label: <FaShoppingCart /> }, // Replaced Cart text with cart icon
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

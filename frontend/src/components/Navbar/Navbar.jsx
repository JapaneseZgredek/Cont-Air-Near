import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavbarComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check for JWT token on initial render
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
    }, []);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove JWT token
        setIsLoggedIn(false);
        window.location.href = '/'; // Redirect to home page
    };

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
                        <LinkContainer to="/ships">
                            <Nav.Link>Ships</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/products">
                            <Nav.Link>Products</Nav.Link>
                        </LinkContainer>

                        {/* Conditional Links Based on Authentication */}
                        {isLoggedIn ? (
                            <>
                                {/* Protected Links */}
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

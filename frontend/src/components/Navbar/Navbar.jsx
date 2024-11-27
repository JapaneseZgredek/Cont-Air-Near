import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavbarComponent = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>Cont-Air-Near</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <LinkContainer to="/ships">
                            <Nav.Link>Ships</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/operations">
                            <Nav.Link>Operations</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/ports">
                            <Nav.Link>Ports</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/products">
                            <Nav.Link>Products</Nav.Link>
                        </LinkContainer>
			            <LinkContainer to="/clients">
                            <Nav.Link>Clients</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/orders">
                            <Nav.Link>Orders</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/order_histories">
                            <Nav.Link>OrderHistory</Nav.Link>
                        </LinkContainer>
                        {/* Add the Home Button Later */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;

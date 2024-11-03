import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const NavbarComponent = () => {
    return (
<Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand>Cont-Air-Near</Navbar.Brand>
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
                    {/*    Add the Home Button Later*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
};

export default NavbarComponent;
import React from 'react';
import { Navbar, Container } from 'react-bootstrap'

const NavbarComponent = () => {
    return (
        <Navbar bg="dark" variant="dark" className="mb-4">
            <Container>
                <Navbar.Brand>Cont-Air-Near</Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
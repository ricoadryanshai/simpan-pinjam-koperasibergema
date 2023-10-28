// eslint-disable-next-line no-unused-vars
import React from "react";
import "../styles/index.css";
import { Container, Navbar, NavbarText } from "react-bootstrap";

export default function Footer() {
  return (
    <>
      <Navbar className="footer" bg="dark" variant="dark">
        <Container className="d-flex justify-content-center">
          <NavbarText>
            © {new Date().getFullYear()} Copyright: Koperasi Bergema
          </NavbarText>
        </Container>
      </Navbar>
    </>
  );
}

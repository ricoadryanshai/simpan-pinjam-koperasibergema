/* eslint-disable no-unused-vars */
import React from "react";
import {
  Navbar,
  Container,
  Nav,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Navbar
        expand="lg"
        variant="dark"
        fixed="top"
        style={{ backgroundColor: "#a11010" }}
      >
        <Container fluid>
          <Navbar.Brand href="/">
            <img alt="Logo Gansel" src="/kpgansel/logo-gansel.png" width="50" />{" "}
            <span style={{ fontWeight: "700", textTransform: "uppercase" }}>
              Gandaria Selatan
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />

          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="end"
            style={{ backgroundColor: "#a11010", color: "white" }}
          >
            <Offcanvas.Header
              closeButton
              closeVariant="white"
              className="border-bottom"
            >
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                <img
                  alt="Logo Gansel"
                  src="/kpgansel/logo-gansel.png"
                  width="50"
                />{" "}
                <span style={{ fontWeight: "700", textTransform: "uppercase" }}>
                  Gandaria Selatan
                </span>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={NavLink} to="/">
                  Beranda
                </Nav.Link>
                <Nav.Link as={NavLink} to="/anggota">
                  Anggota
                </Nav.Link>
                <Nav.Link as={NavLink} to="/simpanan">
                  Simpanan
                </Nav.Link>
                <Nav.Link as={NavLink} to="/pinjaman">
                  Pinjaman
                </Nav.Link>
                <Nav.Link as={NavLink} to="/transaksi">
                  Transaksi Kas
                </Nav.Link>
                <Nav.Link as={NavLink} to="/laporan">
                  Laporan
                </Nav.Link>
                <NavDropdown
                  title="Master Data"
                  id="offcanvasNavbarDropdown-expand-lg"
                >
                  <NavDropdown.Item as={NavLink} to={"/pengaturan/simpan"}>
                    Pengaturan Simpan
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

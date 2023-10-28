/* eslint-disable no-unused-vars */
import React from "react";
import { Navbar, Container, Nav, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/header.modules.css";

export default function Header() {
  return (
    <>
      <Navbar expand="lg" variant="dark" className="custom-red">
        <Container fluid>
          <Navbar.Brand href="/">
            <img alt="" src="/koperasi-indonesia.png" width="30" height="30" />{" "}
            <span className="bold-700 upcase">Koperasi Bergema</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />

          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                <img
                  alt=""
                  src="/koperasi-indonesia.png"
                  width="30"
                  height="30"
                />{" "}
                <span className="bold-700 upcase">Koperasi Bergema</span>
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
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

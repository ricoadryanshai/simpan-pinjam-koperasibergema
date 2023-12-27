// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navbar, NavbarText } from "react-bootstrap";

export default function Footer() {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="bottom">
        <NavbarText className="flex-grow-1 text-center no-print">
          <span className="px-3">
            © 2023 Copyright: Koperasi Bergema - Gandaria Selatan
          </span>
        </NavbarText>
      </Navbar>
    </>
  );
}

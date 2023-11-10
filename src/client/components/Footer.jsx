// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navbar, NavbarText } from "react-bootstrap";

export default function Footer() {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="bottom">
        <NavbarText className="flex-grow-1 text-center">
          © {new Date().getFullYear()} Copyright: Koperasi Bergema
        </NavbarText>
      </Navbar>
    </>
  );
}

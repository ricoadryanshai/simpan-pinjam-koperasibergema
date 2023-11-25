// eslint-disable-next-line no-unused-vars
import React from "react";
import { Container } from "react-bootstrap";
import { BerandaSummaryCard } from "../components/BerandaSummaryCard";

export default function Beranda() {
  return (
    <>
      <Container fluid>
        <div className="d-flex flex-gap-1 custom-width">
          <BerandaSummaryCard />
        </div>
      </Container>
    </>
  );
}

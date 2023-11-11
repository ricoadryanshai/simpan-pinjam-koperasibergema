// eslint-disable-next-line no-unused-vars
import React from "react";
import { Container } from "react-bootstrap";
import { BerandaSummaryCard } from "../client/components/BerandaSummaryCard";

export default function Beranda() {
  return (
    <>
      <Container
        fluid
        style={{
          marginTop: "6rem",
          marginBottom: "6rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <BerandaSummaryCard />
      </Container>
    </>
  );
}

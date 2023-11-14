// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TransaksiKas from "../client/components/TransaksiKas";

export default function Transaksi() {
  return (
    <>
      <Container fluid style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <Row>
          <Col />
          <Col sm={7}>
            <TransaksiKas />
          </Col>
          <Col />
        </Row>
      </Container>
    </>
  );
}

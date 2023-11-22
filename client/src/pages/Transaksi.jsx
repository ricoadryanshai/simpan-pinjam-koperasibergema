// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TransaksiKas from "../components/TransaksiKas";

export default function Transaksi() {
  return (
    <>
      <Container fluid className="my-5">
        <Row className="pt-5">
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

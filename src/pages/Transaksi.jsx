// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TransaksiKas from "../client/components/TransaksiKas";
import { getTransaksi } from "../client/utils/api";

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    getTransaksi().then((res) => {
      setTransaksi(res);
    });
  }, []);
  return (
    <>
      <Container fluid style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <Row>
          <Col />
          <Col sm={7}>
            <TransaksiKas dataTransaksi={transaksi} />
          </Col>
          <Col />
        </Row>
      </Container>
    </>
  );
}

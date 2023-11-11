// eslint-disable-next-line no-unused-vars
import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import TransaksiTable from "../client/components/TransaksiTable";
import TransaksiKas from "../client/components/TransaksiKas";

export default function Transaksi() {
  return (
    <>
      <Tabs
        defaultActiveKey="key-1"
        className="mb-3"
        fill
        style={{ marginTop: "6rem" }}
      >
        <Tab eventKey="key-1" title="Data Transaksi Kas">
          <Container fluid style={{ marginBottom: "6rem" }}>
            <TransaksiTable />
          </Container>
        </Tab>
        <Tab eventKey="key-2" title="Transaksi Kas">
          <Container fluid style={{ marginBottom: "6rem" }}>
            <Row>
              <Col />
              <Col>
                <TransaksiKas />
              </Col>
              <Col />
            </Row>
          </Container>
        </Tab>
      </Tabs>
    </>
  );
}

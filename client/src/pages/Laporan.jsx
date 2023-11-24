// eslint-disable-next-line no-unused-vars
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { LaporanSHU } from "../components/LaporanSHU";
import { LaporanSimpanan } from "../components/LaporanSimpanan";
import { LaporanPinjaman } from "../components/LaporanPinjaman";
import { Container } from "react-bootstrap";

export default function Laporan() {
  return (
    <>
      <Tabs defaultActiveKey="key-1" className="mb-3 no-print" fill>
        <Tab eventKey="key-1" title="Laporan Simpanan">
          <Container fluid>
            <LaporanSimpanan />
          </Container>
        </Tab>
        <Tab eventKey="key-2" title="Laporan Pinjaman">
          <Container fluid>
            <LaporanPinjaman />
          </Container>
        </Tab>
        <Tab eventKey="key-3" title="Laporan SHU">
          <Container fluid>
            <LaporanSHU />
          </Container>
        </Tab>
      </Tabs>
    </>
  );
}

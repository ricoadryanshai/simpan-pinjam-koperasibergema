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
      <Container fluid className="custom-width px-0">
        <Tabs defaultActiveKey="key-1" className="no-print" fill>
          <Tab
            eventKey="key-1"
            title="Laporan Simpanan"
            className="border rounded-bottom"
          >
            <Container fluid>
              <LaporanSimpanan />
            </Container>
          </Tab>
          <Tab
            eventKey="key-2"
            title="Laporan Pinjaman"
            className="border rounded-bottom"
          >
            <Container fluid>
              <LaporanPinjaman />
            </Container>
          </Tab>
          <Tab
            eventKey="key-3"
            title="Laporan SHU"
            className="border rounded-bottom"
          >
            <Container fluid>
              <LaporanSHU />
            </Container>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

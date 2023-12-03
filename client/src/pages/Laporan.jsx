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
      <Container fluid>
        <Tabs defaultActiveKey="key-1" className="no-print" fill>
          <Tab
            eventKey="key-1"
            title="Laporan Pembagian SHU"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSHU />
            </Container>
          </Tab>
          <Tab
            eventKey="key-2"
            title="Laporan Simpanan"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSimpanan />
            </Container>
          </Tab>
          <Tab
            eventKey="key-3"
            title="Laporan Angsuran"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanPinjaman />
            </Container>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

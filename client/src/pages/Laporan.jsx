import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { LaporanPinjaman } from "../components/LaporanPinjaman";
import { Container } from "react-bootstrap";
import LaporanKas from "../components/LaporanKas";
import LaporanSimpanan from "../components/LaporanSimpanan";
import { LaporanSHU } from "../components/LaporanSHU";

export default function Laporan() {
  return (
    <>
      <Container fluid>
        <Tabs defaultActiveKey="key-1" className="no-print" fill>
          <Tab
            eventKey="key-1"
            title="Laporan Angsuran"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanPinjaman />
            </Container>
          </Tab>
          <Tab
            eventKey="key-2"
            title="Laporan Transaksi Kas"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanKas />
            </Container>
          </Tab>
          <Tab
            eventKey="key-3"
            title="Laporan Pembagian SHU"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSHU />
            </Container>
          </Tab>
          <Tab
            eventKey="key-4"
            title="Laporan Simpanan"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSimpanan />
            </Container>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

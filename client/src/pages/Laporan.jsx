// eslint-disable-next-line no-unused-vars
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { LaporanSHU } from "../components/LaporanSHU";
import { LaporanSimpanan } from "../components/LaporanSimpanan";

export default function Laporan() {
  return (
    <>
      <Tabs
        defaultActiveKey="key-1"
        className="mb-3 no-print"
        fill
        style={{ marginTop: "6rem" }}
      >
        <Tab eventKey="key-1" title="Laporan Simpanan">
          <LaporanSimpanan />
        </Tab>
        <Tab eventKey="key-2" title="Laporan Pinjaman"></Tab>
        <Tab eventKey="key-3" title="Laporan SHU">
          <LaporanSHU />
        </Tab>
      </Tabs>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
import React from "react";
import { Tab, Tabs } from "react-bootstrap";

export default function Laporan() {
  return (
    <>
      <Tabs defaultActiveKey="key-1" className="mb-3" fill>
        <Tab eventKey="key-1" title="Laporan Simpanan"></Tab>
        <Tab eventKey="key-2" title="Laporan Pinjaman"></Tab>
        <Tab eventKey="key-3" title="Laporan SHU"></Tab>
      </Tabs>
    </>
  );
}

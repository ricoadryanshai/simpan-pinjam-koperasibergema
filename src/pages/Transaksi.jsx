// eslint-disable-next-line no-unused-vars
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import TransaksiMasuk from "../client/components/TransaksiMasuk";
import TransaksiKeluar from "../client/components/TransaksiKeluar";
import TransaksiTable from "../client/components/TransaksiTable";

export default function Transaksi() {
  return (
    <>
      <Tabs
        defaultActiveKey="key-1"
        className="mb-3"
        fill
        style={{ marginTop: "6rem" }}
      >
        <Tab eventKey="key-1" title="Data Transaksi">
          <TransaksiTable />
        </Tab>
        <Tab eventKey="key-2" title="Transaksi Keluar">
          <TransaksiMasuk />
        </Tab>
        <Tab eventKey="key-3" title="Transaksi Keluar">
          <TransaksiKeluar />
        </Tab>
      </Tabs>
    </>
  );
}

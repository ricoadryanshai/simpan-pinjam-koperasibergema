// eslint-disable-next-line no-unused-vars
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import TransaksiMasuk from "../client/components/TransaksiMasuk";
import TransaksiKeluar from "../client/components/TransaksiKeluar";

export default function Transaksi() {
  return (
    <>
      <Tabs defaultActiveKey="key-1" className="mb-3" fill>
        <Tab eventKey="key-1" title="Transaksi Masuk">
          <TransaksiMasuk />
        </Tab>
        <Tab eventKey="key-2" title="Transaksi Keluar">
          <TransaksiKeluar />
        </Tab>
      </Tabs>
    </>
  );
}

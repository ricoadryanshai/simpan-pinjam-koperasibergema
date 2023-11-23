// eslint-disable-next-line no-unused-vars
import React from "react";
import AnggotaTable from "../components/AnggotaTable";
import FormTambahAnggota from "../components/FormTambahAnggota";
import { Tab, Tabs, Container } from "react-bootstrap";

export default function Anggota() {
  return (
    <>
      <Tabs defaultActiveKey="key-1" className="mb-3" fill>
        <Tab eventKey="key-1" title="Data Anggota">
          <Container fluid>
            <AnggotaTable />
          </Container>
        </Tab>
        <Tab eventKey="key-2" title="Penambahan Anggota">
          <FormTambahAnggota />
        </Tab>
      </Tabs>
    </>
  );
}

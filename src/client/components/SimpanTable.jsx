// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { getSimpanAnggota, getSimpanAnggotaById } from "../utils/api";
import SimpanDetailModal from "./SimpanDetailModal";
import SimpanTambahModal from "./SimpanTambahModal";
import SimpanAmbilModal from "./SimpanAmbilModal";

export default function SimpanTable() {
  const [simpananData, setSimpananData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showAmbilModal, setShowAmbilModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleTambahClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowTambahModal(true);
  };

  const handleDetailClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowDetailModal(true);

    getSimpanAnggotaById(rowData.kodeAnggota)
      .then((data) => {
        setModalData(data);
      })
      .catch((error) => {
        console.error("Error fetching detailed data:", error);
      });
  };

  const handleAmbilClick = (rowData) => {
    setSelectedRowData(rowData);
    setShowAmbilModal(true);
  };

  const fetchData = async () => {
    const fetchedData = await getSimpanAnggota();
    setSimpananData(fetchedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container fluid style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <Row>
          <Col />
          <Col sm={7}>
            <Card>
              <Card.Header>
                <Card.Title className="fw-bold text-uppercase mt-2">
                  Data Simpanan Anggota
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table hover borderless responsive size="sm">
                  <thead>
                    <tr className="text-center align-middle fs-7">
                      <th>No.</th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Kode Anggota
                      </th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Nama
                      </th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Saldo
                      </th>
                      <th colSpan={3}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simpananData.map((simpan, index) => (
                      <tr
                        style={{ borderBlockStart: "solid 1px lightgray" }}
                        className="align-middle"
                        key={index}
                      >
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td style={{ borderInline: "solid 1px lightgray" }}>
                          {simpan.kodeAnggota}
                        </td>
                        <td>{simpan.nama}</td>
                        <td
                          style={{
                            textAlign: "end",
                            borderInline: "solid 1px lightgray",
                          }}
                        >
                          {formatRupiah(simpan.totalSaldo)}
                        </td>
                        <td>
                          <Button
                            variant="secondary"
                            onClick={() => handleDetailClick(simpan)}
                          >
                            Detail
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="success"
                            onClick={() => handleTambahClick(simpan)}
                          >
                            Simpan
                          </Button>
                        </td>
                        <td>
                          {simpan.totalSaldo > 0 ? (
                            <Button
                              variant="primary"
                              onClick={() => handleAmbilClick(simpan)}
                            >
                              Ambil
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col />
        </Row>
      </Container>

      <SimpanDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        rowData={selectedRowData}
        modalData={modalData}
        updateModalData={setModalData}
        clearModalData={() => setModalData([])}
      />

      <SimpanTambahModal
        show={showTambahModal}
        onClose={() => setShowTambahModal(false)}
        rowData={selectedRowData}
        clearModalData={() => setModalData([])}
        fetchData={fetchData}
      />

      <SimpanAmbilModal
        show={showAmbilModal}
        onClose={() => setShowAmbilModal(false)}
        rowData={selectedRowData}
        clearModalData={() => setModalData([])}
        fetchData={fetchData}
      />
    </>
  );

  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp. 0,00";
    }

    // Format angka dengan koma sebagai pemisah ribuan dan dua digit desimal
    const formattedAngka = angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });

    return formattedAngka;
  }
}

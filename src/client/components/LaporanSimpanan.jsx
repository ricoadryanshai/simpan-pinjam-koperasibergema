// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { getLapSimpanan } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "../styles/index.css";

export const LaporanSimpanan = () => {
  const [lapSimpanan, setLapSimpanan] = useState([]);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const getLaporan = async () => {
      const response = await getLapSimpanan();
      setLapSimpanan(response);
    };
    getLaporan();
  }, []);
  return (
    <>
      <Container fluid style={{ marginBottom: "6rem" }} className="margin-top">
        <Row>
          <Col />
          <Col sm={10}>
            <Card>
              <Card.Header>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Card.Title
                    style={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Laporan Keuangan Gandaria Selatan -{" "}
                    {new Date().getFullYear()}
                  </Card.Title>
                  <div>
                    <FontAwesomeIcon
                      icon={faPrint}
                      onClick={handlePrint} // Tambahkan event handler untuk cetak
                      style={{ cursor: "pointer" }}
                      className="no-print"
                    />
                    {/* <ExcelFile
                      element={
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          style={{ cursor: "pointer" }}
                          className="no-print"
                        />
                      }
                    >
                      <ExcelSheet data={lapSimpanan} name="Laporan Simpanan">
                        <ExcelColumn label="No." value="no" />
                        <ExcelColumn label="Kode Anggota" value="kodeAnggota" />
                        <ExcelColumn label="Nama" value="nama" />
                        <ExcelColumn
                          label="Total Simpanan"
                          value="totalSaldo"
                        />
                      </ExcelSheet>
                    </ExcelFile> */}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table borderless responsive>
                  <thead>
                    <tr className="text-center align-middle fs-7">
                      <th>No.</th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Kode Anggota
                      </th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Nama
                      </th>
                      <th>Total Simpanan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lapSimpanan.map((laporan, index) => (
                      <tr
                        style={{ borderBlockStart: "solid 1px lightgray" }}
                        className="align-middle"
                        key={index}
                      >
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td style={{ borderInline: "solid 1px lightgray" }}>
                          {laporan.kodeAnggota}
                        </td>
                        <td
                          style={{
                            borderInline: "solid 1px lightgray",
                          }}
                        >
                          {laporan.nama}
                        </td>
                        <td style={{ textAlign: "end" }}>
                          {formatRupiah(laporan.totalSaldo)}
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
};

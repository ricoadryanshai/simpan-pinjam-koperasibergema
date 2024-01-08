/* eslint-disable react/prop-types */
import React from "react";
import { Table, Row, Col, Container } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";

export const SimpanPrintOut = ({ rowData, componentReference, modalData }) => {
  const kodeRowData = rowData ? rowData.kodeAnggota : "";
  const namaRowData = rowData ? rowData.nama : "";
  const tanggalRowData = rowData ? rowData.tanggalDaftar : "";
  const saldoRowData = rowData ? rowData.totalSaldo : "";

  return (
    <div className="no-display print-only" ref={componentReference}>
      <Container fluid className="p-3">
        <Row className="border-bottom border-2 mb-1">
          <Col sm={2} className="fw-bold">
            <Row className="mb-3">Kode Anggota</Row>
            <Row className="mb-3">Nama Anggota</Row>
          </Col>
          <Col>
            <Row className="mb-3">{kodeRowData}</Row>
            <Row className="mb-3">{namaRowData}</Row>
          </Col>
          <Col sm={2} className="fw-bold">
            <Row className="mb-3">Tanggal Daftar</Row>
            <Row className="mb-3">Total Saldo</Row>
          </Col>
          <Col>
            <Row className="mb-3">{formatDate(tanggalRowData)}</Row>
            <Row className="mb-3">{formatRupiah(saldoRowData)}</Row>
          </Col>
        </Row>
      </Container>
      <Table hover responsive size="sm">
        <thead className="table-info">
          <tr>
            <th className="text-center align-middle">No.</th>
            <th>Tanggal Transaksi</th>
            <th>Jenis Transaksi</th>
            <th>Nominal</th>
          </tr>
        </thead>
        <tbody>
          {modalData.map((transaction, index) => (
            <tr key={index}>
              <td className="text-center align-middle">{index + 1}</td>
              <td>{formatDate(transaction.tanggalSimpan)}</td>
              <td>{transaction.jenisSimpan}</td>
              <td
                style={{
                  color:
                    transaction.jenisSimpan === "Ambil Simpanan"
                      ? "red"
                      : "green",
                }}
              >
                {formatRupiah(transaction.saldo)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

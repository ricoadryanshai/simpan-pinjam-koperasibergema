/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";

export const PinjamDetailModal = (props) => {
  const { show, onHide, selectedRow } = props;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="text-uppercase fw-bold">
        Detail Pinjaman dan Pembayaran {selectedRow ? selectedRow.nama : ""}
      </Modal.Header>
      <Modal.Body>
        <Container className="mb-3">
          <Row>
            <Col sm={3}>
              <Row>Kode Anggota</Row>
              <Row>Nama Anggota</Row>
              <Row>Tanggal Daftar</Row>
              <Row>Sisa Tagihan</Row>
            </Col>
            <Col>
              <Row>{selectedRow ? selectedRow.kodeAnggota : ""}</Row>
              <Row>{selectedRow ? selectedRow.nama : ""}</Row>
              <Row>
                {formatDate(selectedRow ? selectedRow.tanggalDaftar : "")}
              </Row>
              <Row>
                {selectedRow ? formatRupiah(selectedRow.sisaHutang) : ""}
              </Row>
            </Col>
            <Col />
          </Row>
        </Container>
        <Table>
          <thead>
            <tr>
              <td>No.</td>
              <td>Tanggal Transaksi</td>
              <td>Jenis Transaksi</td>
              <td>Angsuran</td>
              <td>Nominal</td>
            </tr>
          </thead>
          <tbody></tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

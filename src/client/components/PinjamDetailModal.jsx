/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { getPinjamByKodeAnggota } from "../utils/api";

export const PinjamDetailModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const [pinjamDetail, setPinjamDetail] = React.useState([]);

  const kodeAnggota =
    selectedRow && selectedRow.kodeAnggota ? selectedRow.kodeAnggota : "";

  React.useEffect(() => {
    const fetchPinjamData = async (kodeAnggota) => {
      try {
        const data = await getPinjamByKodeAnggota(kodeAnggota);
        setPinjamDetail(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPinjamDetail([]);
      }
    };
    fetchPinjamData(kodeAnggota);
  }, [kodeAnggota]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      keyboard={false}
    >
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
        <Table hover responsive size="sm">
          <thead className="table-light">
            <tr className="text-center table-info">
              <td>No.</td>
              <td>Tanggal Transaksi</td>
              <td>Jenis Transaksi</td>
              <td>Angsuran</td>
              <td>Nominal</td>
            </tr>
          </thead>
          <tbody>
            {pinjamDetail.map((detail, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>
                  {formatDate(
                    detail.tanggalTransaksi ? detail.tanggalTransaksi : ""
                  )}
                </td>
                <td>{detail.jenisTransaksi ? detail.jenisTransaksi : ""}</td>
                <td>{detail.angsuran ? detail.angsuran : ""}</td>
                <td className="text-end">
                  {formatRupiah(
                    detail.nominalTransaksi ? detail.nominalTransaksi : ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

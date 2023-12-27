/* eslint-disable react/prop-types */
import React from "react";
import { Container, Table, Row, Col } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";

export const PinjamPrintOut = ({
  componentReference,
  selectedRow,
  fetchData,
}) => {
  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const tanggalDaftar = selectedRow?.tanggalDaftar || "";
  const jumlahHutang = selectedRow?.jumlahHutang || "";
  const jumlahBayar = selectedRow?.jumlahBayar || "";
  const sisaHutang = jumlahHutang - jumlahBayar;

  return (
    <div className="no-display print-only" ref={componentReference}>
      <Container fluid className="p-3">
        <Row className="border-bottom border-2 mb-1">
          <Col sm={2} className="fw-bold">
            {kodeAnggota.indexOf("GSP") === -1 ? (
              <Row className="mb-3">Kode Nasabah</Row>
            ) : (
              <Row className="mb-3" />
            )}
            <Row className="mb-3">Nama Nasabah</Row>
          </Col>
          <Col>
            {kodeAnggota.indexOf("GSP") === -1 ? (
              <Row className="mb-3">{kodeAnggota}</Row>
            ) : (
              <Row className="mb-3" />
            )}

            <Row className="mb-3">{nama}</Row>
          </Col>
          <Col sm={2} className="fw-bold">
            <Row className="mb-3">Tanggal Daftar</Row>
            <Row className="mb-3">Sisa Tagihan</Row>
          </Col>
          <Col>
            <Row className="mb-3">{formatDate(tanggalDaftar)}</Row>
            <Row className="mb-3">{formatRupiah(sisaHutang)}</Row>
          </Col>
        </Row>
      </Container>
      <Table hover responsive size="sm">
        <thead className="table-light">
          <tr className="align-middle table-info">
            <th className="text-center">No.</th>
            <th>Tanggal Transaksi</th>
            <th>Jenis Transaksi</th>
            <th>Angsuran</th>
            <th>Angsuran Pokok</th>
            <th>Angsuran Jasa</th>
            <th>Total Angsuran</th>
          </tr>
        </thead>
        <tbody>
          {fetchData.map((detail, index) => (
            <tr className="align-middle" key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{formatDate(detail.tanggalTransaksi)}</td>
              <td>{detail.jenisTransaksi}</td>
              <td className="text-center">{detail.angsuran}</td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatRupiah(detail.angsuranPokok)}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatRupiah(detail.angsuranJasa)}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatRupiah(detail.angsuranPerBulan)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

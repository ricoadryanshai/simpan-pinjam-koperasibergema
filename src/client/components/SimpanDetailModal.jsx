/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { deleteSimpanan } from "../utils/handle";

export default function SimpanDetailModal(props) {
  const { show, onClose, rowData, modalData, updateModalData, clearModalData } =
    props;

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [headerData, setHeaderData] = React.useState({
    kodeAnggota: "",
    nama: "",
    tanggalDaftar: "",
    totalSaldo: "",
  });

  const handleClose = () => {
    onClose();
    clearModalData();
  };

  const handleDelete = (transactionToDelete) => {
    deleteSimpanan(
      rowData.kodeAnggota,
      transactionToDelete.id,
      modalData,
      setHeaderData,
      updateModalData,
      setIsDeleting,
      formatRupiah,
      headerData
    );
  };

  React.useEffect(() => {
    if (rowData) {
      const { kodeAnggota, nama, tanggalDaftar, totalSaldo } = rowData;
      setHeaderData({
        kodeAnggota,
        nama,
        tanggalDaftar: formatDate(tanggalDaftar),
        totalSaldo: formatRupiah(totalSaldo),
      });
    }
  }, [rowData]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase fw-bold">
            Detail Simpanan {rowData ? rowData.nama : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="mb-3">
            <Row>
              <Col sm={3}>
                <Row>Kode Anggota</Row>
                <Row>Nama Anggota</Row>
                <Row>Tanggal Daftar</Row>
                <Row>Total Saldo</Row>
              </Col>
              <Col>
                <Row>{rowData ? rowData.kodeAnggota : ""}</Row>
                <Row>{rowData ? rowData.nama : ""}</Row>
                <Row>{formatDate(rowData ? rowData.tanggalDaftar : "")}</Row>
                <Row>{rowData ? formatRupiah(rowData.totalSaldo) : ""}</Row>
              </Col>
              <Col />
            </Row>
          </Container>
          <Table hover borderless responsive size="sm">
            <thead>
              <tr className="text-center align-middle fs-7">
                <th>No.</th>
                <th style={{ borderInline: "solid 1px lightgray" }}>
                  Tanggal Transaksi
                </th>
                <th>Jenis Transaksi</th>
                <th style={{ borderInline: "solid 1px lightgray" }}>Nominal</th>
                <th>Bukti Transfer</th>
                <th style={{ borderInlineStart: "solid 1px lightgray" }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((transaction, index) => (
                <tr
                  style={{ borderBlockStart: "solid 1px lightgray" }}
                  className="align-middle"
                  key={index}
                >
                  <td className="text-center">{index + 1}</td>
                  <td style={{ borderInline: "solid 1px lightgray" }}>
                    {transaction.tanggalSimpan}
                  </td>
                  <td>{transaction.jenisSimpan}</td>
                  <td
                    style={{
                      textAlign: "end",
                      borderInline: "solid 1px lightgray",
                      color:
                        transaction.jenisSimpan === "Ambil Simpanan"
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {formatRupiah(transaction.saldo)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {transaction.uploadFile ? (
                      <img
                        src={`src/server/uploads/simpanan/${transaction.uploadFile}`}
                        alt="Bukti Transfer"
                        style={{ maxWidth: "50px", cursor: "pointer" }}
                      />
                    ) : (
                      <span>Tidak ada bukti transfer</span>
                    )}
                  </td>
                  <td style={{ borderInlineStart: "solid 1px lightgray" }}>
                    <Button
                      variant="link"
                      disabled={isDeleting}
                      onClick={() => handleDelete(transaction)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

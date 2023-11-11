/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Table } from "react-bootstrap";
import { deleteSimpan } from "../utils/api";

export default function SimpanDetailModal(props) {
  const { show, onClose, rowData, modalData, updateModalData, clearModalData } =
    props;

  const [isDeleting, setIsDeleting] = useState(false);
  const [headerData, setHeaderData] = useState({
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
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    deleteSimpan(rowData.kodeAnggota, transactionToDelete.id)
      .then(() => {
        const updatedData = modalData.filter(
          (transaction) => transaction !== transactionToDelete
        );

        // Hitung total saldo yang baru setelah penghapusan
        const newTotalSaldo = updatedData.reduce((total, transaction) => {
          return (
            total +
            (transaction.jenisSimpan === "Ambil Simpanan"
              ? -transaction.saldo
              : transaction.saldo)
          );
        }, 0);

        // Perbarui data header
        setHeaderData({
          ...headerData,
          totalSaldo: formatRupiah(newTotalSaldo),
        });

        updateModalData(updatedData);

        setIsDeleting(false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        setIsDeleting(false);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-GB",
      options
    );
    return formattedDate;
  };

  useEffect(() => {
    // Set data header saat modal ditampilkan atau rowData berubah
    if (rowData) {
      setHeaderData({
        kodeAnggota: rowData.kodeAnggota,
        nama: rowData.nama,
        tanggalDaftar: formatDate(rowData.tanggalDaftar),
        totalSaldo: formatRupiah(rowData.totalSaldo),
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
          <Col>
            <Table responsive size="sm">
              <tr>
                <th>Kode Anggota</th>
                <td>{rowData ? rowData.kodeAnggota : ""}</td>
              </tr>
              <tr>
                <th>Nama Anggota</th>
                <td>{rowData ? rowData.nama : ""}</td>
              </tr>
              <tr>
                <th>Tanggal Daftar</th>
                <td>{formatDate(rowData ? rowData.tanggalDaftar : "")}</td>
              </tr>
              <tr>
                <th>Total Saldo</th>
                <td>{rowData ? formatRupiah(rowData.totalSaldo) : ""}</td>
              </tr>
            </Table>
          </Col>
        </Modal.Header>
        <Modal.Body>
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
                    {transaction.uploadFile && (
                      <img
                        src={`src/server/uploads/simpanan/${transaction.uploadFile}`}
                        alt="Bukti Transfer"
                        style={{ maxWidth: "50px", cursor: "pointer" }}
                      />
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

  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp 0,00";
    }

    const formattedAngka = angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });

    return formattedAngka;
  }
}

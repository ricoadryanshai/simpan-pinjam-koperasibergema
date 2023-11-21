/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { tambahSimpan } from "../utils/api";
import { formatNumber } from "../utils/format";

export default function SimpanAmbilModal(props) {
  const { show, onClose, rowData, clearModalData, fetchData } = props;

  const [inputNominal, setInputNominal] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (event) => {
    // Hapus karakter selain angka dan tanda minus (untuk nilai negatif)
    const formattedValue = event.target.value.replace(/[^0-9-]/g, "");

    // Update state dengan angka yang telah diformat
    setInputNominal(formattedValue);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClose = () => {
    onClose();
    clearModalData();
    fetchData();
    setInputNominal("");
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    try {
      // Validasi inputNominal
      if (inputNominal === "" || isNaN(inputNominal) || inputNominal < 0) {
        alert("Invalid inputNominal");
        console.error("Invalid inputNominal");
        return;
      }

      // Validasi inputNominal tidak lebih besar dari totalSaldo
      if (inputNominal > rowData.totalSaldo) {
        alert("Jumlah ambil anda melebihi saldo anda");
        console.error("InputNominal is greater than totalSaldo");
        return;
      }

      const response = await tambahSimpan(
        rowData.kodeAnggota,
        document.getElementById("inputTanggalTransaksi").value,
        document.getElementById("formPlaintextJenisSimpanan").value,
        inputNominal,
        selectedFile
      );
      console.log(response);

      onClose();
      fetchData();
      setInputNominal("");
      setSelectedFile(null);
      clearModalData();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Ambil Simpanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formPlaintextKodeAnggota"
            >
              <Form.Label column sm="4">
                Kode Anggota
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={rowData ? rowData.kodeAnggota : ""}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="formPlaintextNama">
              <Form.Label column sm="4">
                Nama
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={rowData ? rowData.nama : ""}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formPlaintextTotalSaldo"
            >
              <Form.Label column sm="4">
                Total Saldo
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={formatRupiah(rowData ? rowData.totalSaldo : "")}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formPlaintextJenisSimpanan"
            >
              <Form.Label column sm="4">
                Jenis Transaksi
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  disabled
                  defaultValue="Ambil Simpanan"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="inputNominal">
              <Form.Label column sm="4">
                Nominal
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={formatNumber(inputNominal)}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="inputTanggalTransaksi"
            >
              <Form.Label column sm="4">
                Tanggal Transaksi
              </Form.Label>
              <Col>
                <Form.Control type="date" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formFile" className="mb-2">
              <Form.Label column sm="4">
                Bukti Transfer
              </Form.Label>
              <Col>
                <Form.Control
                  type="file"
                  name="uploadFile"
                  onChange={handleFileChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp 0,00";
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

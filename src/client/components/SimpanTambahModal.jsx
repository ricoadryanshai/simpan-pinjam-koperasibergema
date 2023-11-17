/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { tambahSimpan } from "../utils/api";
import { formatNumber } from "../utils/format";

export default function SimpanTambahModal(props) {
  const { show, onClose, rowData, clearModalData, fetchData } = props;

  const [Dropdown, setDropdown] = useState("");
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

  const handleSubmit = async () => {
    try {
      const response = await tambahSimpan(
        rowData.kodeAnggota,
        document.getElementById("inputTanggalTransaksi").value,
        Dropdown,
        inputNominal,
        selectedFile
      );
      console.log(response);

      onClose();
      fetchData();
      setDropdown("");
      setInputNominal("");
      setSelectedFile(null);
      clearModalData();
    } catch (error) {
      console.error("Error posting data:", error);
      // Handle error, e.g., show an error message.
    }
  };

  const handleClose = () => {
    onClose();
    fetchData();
    setDropdown("");
    setInputNominal("");
    setSelectedFile(null);
    clearModalData();
  };

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    setDropdown(selectedOption);

    switch (selectedOption) {
      case "Simpanan Pokok":
        setInputNominal("300000");
        break;
      case "Simpanan Wajib":
        setInputNominal("250000");
        break;
      default:
        setInputNominal("");
        break;
    }
  };

  const isInputNominalReadOnly =
    Dropdown === "Simpanan Pokok" || Dropdown === "Simpanan Wajib";

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Simpanan</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              as={Row}
              className="mb-3"
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
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextNama">
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
              className="mb-3"
              controlId="formPlaintextJenisSimpanan"
            >
              <Form.Label column sm="4">
                Jenis Transaksi
              </Form.Label>
              <Col>
                <Form.Select
                  aria-label="Default select example"
                  value={Dropdown}
                  onChange={handleDropdownChange}
                >
                  <option>Pilih Jenis Simpanan</option>
                  <option value="Simpanan Pokok">Pokok</option>
                  <option value="Simpanan Wajib">Wajib</option>
                  <option value="Simpanan Sukarela">Sukarela</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="inputNominal">
              <Form.Label column sm="4">
                Nominal
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={formatNumber(inputNominal)}
                  onChange={handleInputChange}
                  disabled={isInputNominalReadOnly}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="inputTanggalTransaksi"
            >
              <Form.Label column sm="4">
                Tanggal Transaksi
              </Form.Label>
              <Col>
                <Form.Control type="date" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formFile" className="mb-3">
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
}

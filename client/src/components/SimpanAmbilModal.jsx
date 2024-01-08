/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { tambahSimpan } from "../utils/api";
import { formatNumber, formatRupiah } from "../utils/format";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

export default function SimpanAmbilModal(props) {
  const { show, onClose, rowData, clearModalData, fetchData } = props;

  const [inputNominal, setInputNominal] = React.useState("");

  const handleInputChange = (event) => {
    // Hapus karakter selain angka dan tanda minus (untuk nilai negatif)
    const formattedValue = event.target.value.replace(/[^0-9-]/g, "");

    // Update state dengan angka yang telah diformat
    setInputNominal(formattedValue);
  };

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  const handleClose = () => {
    onClose();
    clearModalData();
    fetchData();
    setInputNominal("");
  };

  const handleSubmit = async () => {
    try {
      // Validasi inputNominal
      if (inputNominal === "" || isNaN(inputNominal) || inputNominal < 0) {
        alert("Invalid inputNominal");
        console.error("Invalid inputNominal");
        return;
      }

      // Validasi inputNominal tidak lebih besar dari bisaAmbil
      if (inputNominal > rowData.bisaAmbil) {
        alert("Jumlah ambil anda melebihi saldo anda");
        console.error("InputNominal is greater than bisaAmbil");
        return;
      }

      await tambahSimpan(
        rowData.kodeAnggota,
        document.getElementById("inputTanggalTransaksi").value ||
          `${year}-${month}-${date}`,
        document.getElementById("formPlaintextJenisSimpanan").value ||
          "Ambil Simpanan",
        inputNominal || 0
      );

      onClose();
      fetchData();
      setInputNominal("");
      clearModalData();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const yourFormRef = React.useRef(null);

  React.useEffect(() => {
    yourFormRef.current && yourFormRef.current.focus();
  }, [show]);
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
          <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
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
                  defaultValue={formatRupiah(rowData?.bisaAmbil || 0)}
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

/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { formatNumber, formatRupiah } from "../utils/format";
import { handleInputChange } from "../utils/handle";
import { PinjamProsesModal } from "./PinjamProsesModal";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

export const PinjamTambahModal = (props) => {
  const { show, onHide, selectedRow, setShowPinjam, saldoKas } = props;

  const [selectedDate, setSelectedDate] = React.useState("");
  const [inputNominalPinjam, setInputNominalPinjam] = React.useState("");
  const [inputNominalAngsuran, setInputNominalAngsuran] = React.useState("");
  const [modalProses, setModalProses] = React.useState(false);
  const [savedData, setSavedData] = React.useState(null);

  const handleInputPinjam = (event) => {
    handleInputChange(event, setInputNominalPinjam);
  };

  const handleInputAngsuran = (event) => {
    const value = event.target.value;
    const formattedValue = value.replace(/[^0-9]/g, "");

    if (parseInt(formattedValue, 10) > 12) {
      setInputNominalAngsuran("0");
    } else {
      setInputNominalAngsuran(formattedValue);
    }
  };

  const handleModalShow = (modalType) => {
    if (!inputNominalPinjam && !inputNominalAngsuran) {
      alert("Nominal pinjam dan Angsuran tidak boleh kosong.");
      document.getElementById("formNominalTransaksi").focus();
      return;
    }

    if (!inputNominalPinjam) {
      alert("Nominal pinjam tidak boleh kosong.");
      document.getElementById("formNominalTransaksi").focus();
      return;
    }

    if (!inputNominalAngsuran) {
      alert("Angsuran tidak boleh kosong.");
      document.getElementById("formAngsuran").focus();
      return;
    }

    if (inputNominalPinjam > saldoKas.saldoKas) {
      alert(
        `Jumlah pinjaman melebihi saldo koperasi saat ini: ${formatRupiah(
          saldoKas.saldoKas
        )}`
      );
      document.getElementById("formNominalTransaksi").focus();
      return;
    }

    if (inputNominalAngsuran === 0) {
      return 1;
    }

    const newProsesPinjam = {
      kodeAnggota: kodeAnggota,
      jenisTransaksi: "Pinjam",
      nama: nama,
      nominalTransaksi: inputNominalPinjam,
      angsuran: inputNominalAngsuran,
      tanggalTransaksi: selectedDate || `${year}-${month}-${date}`,
    };

    switch (modalType) {
      case "proses":
        setSavedData(newProsesPinjam);
        onHide();
        setModalProses(true);
        break;
      default:
        break;
    }
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "proses":
        setModalProses(false);
        setShowPinjam(true);
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setInputNominalPinjam("");
    setInputNominalAngsuran("");
    setSelectedDate("");
  };

  const kodeAnggota = selectedRow?.kodeAnggota || "GS.";
  const nama = selectedRow?.nama || "-";

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleModalShow("proses");
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
        onHide={() => {
          onHide();
          resetForm();
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Form Data Pinjaman
          </Modal.Title>
        </Modal.Header>
        <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
          <Modal.Body>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formPlaintextKodeAnggota"
            >
              <Form.Label column sm="4">
                Kode Anggota
              </Form.Label>
              <Col>
                <Form.Control plaintext readOnly value={kodeAnggota} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="formPlaintextNama">
              <Form.Label column sm="4">
                Nama
              </Form.Label>
              <Col>
                <Form.Control plaintext readOnly defaultValue={nama} />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formPlaintextJenisTransaksi"
            >
              <Form.Label column sm="4">
                Jenis Transaksi
              </Form.Label>
              <Col>
                <Form.Control plaintext readOnly value="Pinjam" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="saldoKas">
              <Form.Label column sm="4">
                Saldo Kas
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  disabled
                  defaultValue={formatRupiah(saldoKas.saldoKas)}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formTanggalTransaksi"
            >
              <Form.Label column sm="4">
                Tanggal Transaksi
              </Form.Label>
              <Col>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-2"
              controlId="formNominalTransaksi"
            >
              <Form.Label column sm="4">
                Nominal Pinjam
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={formatNumber(inputNominalPinjam)}
                  onChange={(e) => handleInputPinjam(e)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2" controlId="formAngsuran">
              <Form.Label column sm="4">
                Angsuran
              </Form.Label>
              <Col sm={2}>
                <Form.Control
                  type="number"
                  value={formatNumber(inputNominalAngsuran)}
                  onChange={handleInputAngsuran}
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                onHide();
                resetForm();
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => handleModalShow("proses")}>
              Proses
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <PinjamProsesModal
        show={modalProses}
        onHide={() => handleModalClose("proses")}
        savedData={savedData}
        closeAllModal={() => {
          onHide();
          setModalProses(false);
          resetForm();
        }}
      />
    </>
  );
};

/* eslint-disable react/prop-types */
import React from "react";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import {
  getKeanggotaan,
  getPengaturan,
  tambahAnggota,
  tambahSimpan,
} from "../utils/api";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

export default function AnggotaTambahModal({ show, onHide, anggotaData }) {
  const [inputNoHp, setInputNoHp] = React.useState("");
  const [dropdown, setDropdown] = React.useState("");
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [fetchPengaturan, setFetchPengaturan] = React.useState([]);

  const handleInputChange = (event) => {
    const value = event.target?.value;
    const formattedValue = value.replace(/[^0-9]/g, "");

    setInputNoHp(formattedValue);
  };

  const handleSubmit = async () => {
    const kodeAnggota = document.getElementById("kodeAnggota").value;
    const nama = document.getElementById("nama").value;
    const jenisAnggota = dropdown || "Anggota";
    const jenKel = document.getElementById("jenKel").value || "Pria";
    const tempatLahir = document.getElementById("tempatLahir").value || `-`;
    const tanggalLahir =
      document.getElementById("tanggalLahir").value ||
      `${year}-${month}-${date}`;
    const alamat = document.getElementById("alamat").value || "-";
    const noHP = inputNoHp || 0;

    const kodeAnggotaArray = anggotaData.map((item) => item.kodeAnggota);

    if (!kodeAnggota && !nama) {
      alert("Kode Anggota dan Nama wajib di isi.");
      document.getElementById("kodeAnggota").focus();
      return;
    }

    if (!kodeAnggota) {
      alert("Kode Anggota tidak boleh kosong.");
      document.getElementById("kodeAnggota").focus();
      return;
    }

    if (!nama) {
      alert("Nama tidak boleh kosong.");
      document.getElementById("nama").focus();
      return;
    }

    if (kodeAnggotaArray.includes(kodeAnggota)) {
      alert("Kode Anggota sudah ada, silahkan masukkan kode lain.");
      document.getElementById("kodeAnggota").focus();
      return;
    }

    try {
      const inputData = {
        kodeAnggota: kodeAnggota,
        nama: nama,
        jenisAnggota: jenisAnggota,
        jenKel: jenKel,
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
        alamat: alamat,
        noHP: noHP,
      };

      await tambahAnggota(inputData);

      try {
        await tambahSimpan(
          kodeAnggota,
          `${year}-${month}-${date}`,
          "Simpanan Pokok",
          fetchPengaturan.length > 0
            ? fetchPengaturan[0]?.simpananPokok || 0
            : 0
        );

        setInputNoHp("");
        setDropdown("");
        onHide();
      } catch (error) {
        console.log("Handle submit simpanan error: ", error);
      }
    } catch (error) {
      console.log("Handle submit anggota error: ", error);
    }
  };

  const handleCloseModal = () => {
    setDropdown("");
    setInputNoHp("");
    onHide();
  };

  React.useEffect(() => {
    const keanggotaan = async () => {
      try {
        setKeanggotaan(await getKeanggotaan());
      } catch (error) {
        console.log(
          "Error fetching jenis anggota from tbl_keanggotaan: ",
          error
        );
      }
    };
    const fecthedData = async () => {
      try {
        const data = await getPengaturan();
        setFetchPengaturan(data);
      } catch (error) {
        console.log("Error fetching pengaturan: ", error);
      }
    };
    keanggotaan();
    fecthedData();
  }, [show]);

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
        onHide={() => handleCloseModal()}
        backdrop="static"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Tambah Nasabah
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
            <Form.Group as={Row} className="mb-3" controlId="kodeAnggota">
              <Col sm={4}>
                <Form.Label>Kode Anggota</Form.Label>
              </Col>
              <Col>
                <Form.Control type="text" name="kodeAnggota" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="nama">
              <Col sm={4}>
                <Form.Label>Nama</Form.Label>
              </Col>
              <Col>
                <Form.Control type="text" name="nama" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Keanggotaan</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={dropdown}
                  onChange={(e) => setDropdown(e.target.value)}
                >
                  <option value={""} disabled>
                    Pilih Keanggotaan
                  </option>
                  {keanggotaan.map((anggota) => (
                    <option key={anggota.id} value={anggota.jenisSHU}>
                      {anggota.jenisSHU}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Jenis Kelamin</Form.Label>
              </Col>
              <Col className="d-flex flex-gap-1">
                <Form.Check
                  type="radio"
                  label="Pria"
                  name="jenKel"
                  id="jenKel"
                  value="Pria"
                  required
                />
                <Form.Check
                  type="radio"
                  label="Wanita"
                  name="jenKel"
                  id="jenKel"
                  value="Wanita"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Tempat Lahir</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="tempatLahir"
                  id="tempatLahir"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Tanggal Lahir</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="date"
                  name="tanggalLahir"
                  id="tanggalLahir"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Alamat</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  as="textarea"
                  name="alamat"
                  id="alamat"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>No. Telp</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="noHP"
                  id="noHp"
                  value={inputNoHp}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>
            Tambah
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

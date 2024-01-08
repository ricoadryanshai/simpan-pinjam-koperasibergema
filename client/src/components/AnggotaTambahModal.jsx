/* eslint-disable react/prop-types */
import React from "react";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import { getKeanggotaan, tambahAnggota } from "../utils/api";

export default function AnggotaTambahModal(props) {
  const { show, onHide } = props;

  const [inputNoHp, setInputNoHp] = React.useState("");
  const [dropdown, setDropdown] = React.useState("");
  const [keanggotaan, setKeanggotaan] = React.useState([]);

  const handleInputChange = (event) => {
    const value = event.target?.value;
    const formattedValue = value.replace(/[^0-9]/g, "");

    setInputNoHp(formattedValue);
  };

  const handleSubmit = async () => {
    const inputData = {
      kodeAnggota: document.getElementById("kodeAnggota")?.value || "",
      nama: document.getElementById("nama")?.value || "",
      jenisAnggota: dropdown || "",
      jenKel: document.getElementById("jenKel")?.value || "",
      tempatLahir: document.getElementById("tempatLahir")?.value || "",
      tanggalLahir: document.getElementById("tanggalLahir")?.value || "",
      alamat: document.getElementById("alamat")?.value || "",
      noHP: inputNoHp || "",
    };

    try {
      if (inputData) {
        await tambahAnggota(inputData);
        setInputNoHp("");
        setDropdown("");
        onHide();
      }
    } catch (error) {
      console.log("Handle submit erro: ", error);
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
    keanggotaan();
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => handleCloseModal()}
        backdrop="static"
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Tambah Nasabah
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Kode Anggota</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="kodeAnggota"
                  id="kodeAnggota"
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Nama</Form.Label>
              </Col>
              <Col>
                <Form.Control type="text" name="nama" id="nama" required />
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
                    <option key={anggota.id} value={anggota.jenisAnggota}>
                      {anggota.jenisAnggota}
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
                <Form.Label>No. Mobile Phone</Form.Label>
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

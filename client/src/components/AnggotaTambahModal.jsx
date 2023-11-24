/* eslint-disable react/prop-types */
import React from "react";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import { tambahAnggota } from "../utils/api";

export default function AnggotaTambahModal(props) {
  const { show, onHide } = props;

  const [inputNoHp, setInputNoHp] = React.useState("");

  const handleInputChange = (event) => {
    const value = event.target?.value;
    const formattedValue = value.replace(/[^0-9]/g, "");

    setInputNoHp(formattedValue);
  };

  const handleSubmit = async () => {
    const inputData = {
      kodeAnggota: document.getElementById("kodeAnggota")?.value || "",
      nama: document.getElementById("nama")?.value || "",
      jenKel: document.getElementById("jenKel")?.value || "",
      tempatLahir: document.getElementById("tempatLahir")?.value || "",
      tanggalLahir: document.getElementById("tanggalLahir")?.value || "",
      alamat: document.getElementById("alamat")?.value || "",
      noHP: inputNoHp || "",
    };

    try {
      if (inputData) {
        await tambahAnggota(inputData);
        onHide();
        console.log(inputData);
      }
    } catch (error) {
      console.log("Handle submit erro: ", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Tambah Anggota
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
          <Button variant="secondary" onClick={onHide}>
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

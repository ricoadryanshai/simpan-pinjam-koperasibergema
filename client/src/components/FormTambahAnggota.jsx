/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { tambahAnggota } from "../utils/api";

export default function AnggotaTambahModal(props) {
  const { show, onHide } = props;

  const nilaiawalAnggota = {
    kodeAnggota: "",
    nama: "",
    jenKel: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    noHP: "",
  };

  const handleResetClick = () => {
    setAnggota(nilaiawalAnggota);
    setValidated(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnggota({ ...anggota, [name]: value });

    // Validate and update the 'noHP' field to allow only numeric input
    if (name === "noHP") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setAnggota({ ...anggota, [name]: numericValue });
    } else {
      setAnggota({ ...anggota, [name]: value });
    }
  };

  const handleProcessClick = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    // If the form is valid, you can submit the data to the server.
    if (form.checkValidity()) {
      // Send the form data to the server
      tambahAnggota(anggota)
        .then((response) => {
          console.log("Data submitted:", response);

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Tambah Anggota
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group className="mb-2" controlId="kodeAnggota">
              <Form.Label>Kode Anggota</Form.Label>
              <Form.Control
                type="text"
                name="kodeAnggota"
                value={anggota.kodeAnggota}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan kode anggota terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="nama">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={anggota.nama}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan nama anggota terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="jenKel">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Check
                type="radio"
                label="Pria"
                name="jenKel"
                value="Pria"
                checked={anggota.jenKel === "Pria"}
                onChange={handleInputChange}
                required
              />
              <Form.Check
                type="radio"
                label="Wanita"
                name="jenKel"
                value="Wanita"
                checked={anggota.jenKel === "Wanita"}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Silahkan pilih jenis kelamin terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="tempatLahir">
              <Form.Label>Tempat Lahir</Form.Label>
              <Form.Control
                type="text"
                name="tempatLahir"
                value={anggota.tempatLahir}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan tempat lahir terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="tanggalLahir">
              <Form.Label column sm="2">
                Tanggal Lahir
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="tanggalLahir"
                  value={anggota.tanggalLahir}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan tanggal lahir anggota terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="alamat">
              <Form.Label column sm="2">
                Alamat
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alamat"
                value={anggota.alamat}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan alamat anggota terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="noHP">
              <Form.Label column sm="2">
                No. Mobile Phone
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="noHP"
                  value={anggota.noHP}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan nomor hp anggota terlebih dahulu.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleResetClick}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleProcessClick}
            className="ms-2"
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

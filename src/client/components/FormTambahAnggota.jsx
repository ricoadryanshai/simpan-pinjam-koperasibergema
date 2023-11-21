// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { tambahAnggota } from "../utils/api";

export default function FormTambahAnggota() {
  const nilaiawalAnggota = {
    kodeAnggota: "",
    nama: "",
    jenKel: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    noHP: "",
  };
  const [anggota, setAnggota] = useState(nilaiawalAnggota);

  const [validated, setValidated] = useState(false);

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
      <Container fluid as={Row} style={{ marginBottom: "6rem" }}>
        <Col />
        <Col sm={6}>
          <Card>
            <Card.Header>
              <Card.Title className="fw-bold text-uppercase align-bottom mt-2">
                Tambah Anggota
              </Card.Title>
            </Card.Header>
            <Card.Body>
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
                <Card.Footer className="text-end">
                  <Button variant="secondary" onClick={handleResetClick}>
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleProcessClick}
                    className="ms-2"
                  >
                    Proses
                  </Button>
                </Card.Footer>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col />
      </Container>
    </>
  );
}

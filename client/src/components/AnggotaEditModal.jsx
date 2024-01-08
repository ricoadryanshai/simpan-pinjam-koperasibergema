/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { editAnggota } from "../utils/api";

export default function AnggotaEditModal(props) {
  const { show, onHide, selectedRow } = props;
  const { kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP } =
    selectedRow;

  const [noHpData, setNoHp] = React.useState("");

  React.useEffect(() => {
    if (selectedRow && noHP) {
      setNoHp(noHP);
    }
  }, [selectedRow, noHP]);

  const handleInputChange = (e) => {
    const formattedValue = e.target.value.replace(/[^0-9]/g, "");
    setNoHp(formattedValue);
  };

  const handleSave = async (id) => {
    try {
      const updatedData = {
        kodeAnggota: document.getElementById("kodeAnggota")?.value || "",
        nama: document.getElementById("nama")?.value || "",
        jenKel:
          document.querySelector('input[name="jenKel"]:checked')?.value || "",
        tempatLahir: document.getElementById("tempatLahir")?.value || "",
        tanggalLahir: document.getElementById("tanggalLahir")?.value || "",
        alamat: document.getElementById("alamat")?.value || "",
        noHP: document.getElementById("noHP")?.value || "",
      };

      await editAnggota(id, updatedData);
      onHide();
    } catch (error) {
      console.log("Error updating data anggota: ", error);
    }
  };
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase fw-bold">
            Edit Data {nama}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="my-0">Kode Anggota</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="kodeAnggota"
                  id="kodeAnggota"
                  plaintext={kodeAnggota}
                  defaultValue={kodeAnggota}
                  disabled
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label>Nama</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="nama"
                  id="nama"
                  defaultValue={nama}
                  required
                />
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
                  defaultChecked={jenKel === "Pria"}
                  required
                />
                <Form.Check
                  type="radio"
                  label="Wanita"
                  name="jenKel"
                  id="jenKel"
                  value="Wanita"
                  defaultChecked={jenKel === "Wanita"}
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
                  defaultValue={tempatLahir}
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
                  defaultValue={tanggalLahir}
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
                  defaultValue={alamat}
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
                  id="noHP"
                  value={noHpData}
                  onChange={(e) => handleInputChange(e)}
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
          <Button
            variant="primary"
            onClick={() => handleSave(selectedRow?.id || "")}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

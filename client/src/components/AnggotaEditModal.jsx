/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { editAnggota } from "../utils/api";

export default function AnggotaEditModal(props) {
  const { show, onHide, selectedRow } = props;

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const jenKel = selectedRow?.jenKel || "";
  const tempatLahir = selectedRow?.tempatLahir || "";
  const tanggalLahir = selectedRow?.tanggalLahir || "";
  const alamat = selectedRow?.alamat || "";
  const noHP = selectedRow?.noHP || "";

  const handleSave = async (id) => {
    try {
      const updatedData = {
        kodeAnggota: document.getElementById("kodeAnggota")?.value || "",
        nama: document.getElementById("nama")?.value || "",
        jenKel: document.getElementById("jenKel")?.value || "",
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
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">Nama</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="nama"
                  id="nama"
                  defaultValue={nama}
                  required
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">Jenis Kelamin</Form.Label>
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
                  className=""
                />
                <Form.Check
                  type="radio"
                  label="Wanita"
                  name="jenKel"
                  id="jenKel"
                  value="Wanita"
                  defaultChecked={jenKel === "Wanita"}
                  required
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">Tempat Lahir</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="tempatLahir"
                  id="tempatLahir"
                  defaultValue={tempatLahir}
                  required
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">Tanggal Lahir</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="date"
                  name="tanggalLahir"
                  id="tanggalLahir"
                  defaultValue={tanggalLahir}
                  required
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">Alamat</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  as="textarea"
                  name="alamat"
                  id="alamat"
                  defaultValue={alamat}
                  required
                  className=""
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={4}>
                <Form.Label className="">No. Mobile Phone</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="noHP"
                  id="noHP"
                  value={noHP}
                  onChange={() => event.target?.value.replace(/[^0-9]/g, "")}
                  required
                  className=""
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

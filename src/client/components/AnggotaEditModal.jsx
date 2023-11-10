/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { editAnggota } from "../utils/api";

export default function AnggotaEditModal({ item, closeModal, fetchData }) {
  const [editedData, setEditedData] = useState(item);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await editAnggota(item.id, editedData);
      console.log("Record updated successfully:", response.data);
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Kode Anggota</Form.Label>
            <Form.Control
              type="text"
              name="kodeAnggota"
              value={editedData.kodeAnggota}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Silahkan masukkan kode anggota terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              name="nama"
              value={editedData.nama}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Silahkan masukkan nama anggota terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label>Jenis Kelamin</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                label="Pria"
                name="jenKel"
                value="Pria"
                checked={editedData.jenKel === "Pria"}
                onChange={handleInputChange}
                required
              />
            </Col>
            <Col>
              <Form.Check
                type="radio"
                label="Wanita"
                name="jenKel"
                value="Wanita"
                checked={editedData.jenKel === "Wanita"}
                onChange={handleInputChange}
                required
              />
            </Col>
            <Form.Control.Feedback type="invalid">
              Silahkan pilih jenis kelamin terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tempat Lahir</Form.Label>
            <Form.Control
              type="text"
              name="tempatLahir"
              value={editedData.tempatLahir}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Silahkan masukkan tempat lahir terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tanggal Lahir</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                name="tanggalLahir"
                value={editedData.tanggalLahir}
                onChange={handleInputChange}
                required
              />
              <InputGroup.Text id="basic-addon1">dd/mm/yyyy</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                Silahkan masukkan tanggal lahir anggota terlebih dahulu.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Alamat</Form.Label>
            <Form.Control
              as="textarea"
              name="alamat"
              value={editedData.alamat}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Silahkan masukkan alamat anggota terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>No. Mobile Phone</Form.Label>
            <Form.Control
              type="text"
              name="noHP"
              value={editedData.noHP}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Silahkan masukkan nomor hp anggota terlebih dahulu.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Simpan
            </Button>
          </Modal.Footer>
        </Form.Group>
      </Form>
    </>
  );
}

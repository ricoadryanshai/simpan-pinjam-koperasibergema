import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { editSHU } from "../utils/api";

const PengaturanSHUModalEdit = ({ show, onHide, record }) => {
  const handleEditClick = async () => {
    const jenisSHU = document.getElementById("jenisSHU").value;
    const persentaseSHU = document.getElementById("persentaseSHU").value;

    const objectData = {
      jenisSHU: jenisSHU,
      persentaseSHU: persentaseSHU,
    };

    try {
      await editSHU(objectData, record.id);
      onHide();
    } catch (error) {
      console.log("Update Error From Client-side:", error);
    }
  };
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Ubah Jenis Anggota
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} controlId="jenisSHU" className="mb-3">
            <Form.Label as={Col}>Nama Jenis</Form.Label>
            <Col>
              <Form.Control type="text" defaultValue={record.jenisSHU} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="persentaseSHU">
            <Form.Label as={Col}>Persentase SHU</Form.Label>
            <Col>
              <Form.Control type="number" defaultValue={record.persentaseSHU} />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onHide()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleEditClick()}>
            Ubah
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PengaturanSHUModalEdit;

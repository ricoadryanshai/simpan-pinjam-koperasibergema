/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { formatDate } from "../utils/format";

export default function AnggotaDetailModal(props) {
  const { show, onHide, selectedRow } = props;

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const jenKel = selectedRow?.jenKel || "";
  const tempatLahir = selectedRow?.tempatLahir || "";
  const tanggalLahir = selectedRow?.tanggalLahir || "";
  const alamat = selectedRow?.alamat || "";
  const noHP = selectedRow?.noHP || "";
  const tanggalDaftar = selectedRow?.tanggalDaftar || "";
  return (
    <Modal
      show={show}
      onHide={() => onHide()}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase fw-bold">
          Detail Data {nama}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Kode Anggota
          </Col>
          <Col>{kodeAnggota}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Nama
          </Col>
          <Col>{nama}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Jenis Kelamin
          </Col>
          <Col>{jenKel}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Tempat Lahir
          </Col>
          <Col>{tempatLahir}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Tanggal Lahir
          </Col>
          <Col>{formatDate(tanggalLahir)}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Alamat
          </Col>
          <Col>{alamat}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            No. HP
          </Col>
          <Col>{noHP}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="fw-bold">
            Tanggal Daftar
          </Col>
          <Col>{formatDate(tanggalDaftar)}</Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

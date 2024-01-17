import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { postSHU } from "../utils/api";

const PengaturanSHUModalTambah = ({ show, onHide, shuAnggota }) => {
  const handleSubmitClick = async () => {
    const jenisSHU = document.getElementById("jenisSHU").value;
    const persentase = document.getElementById("persentaseSHU").value;

    if (!jenisSHU && !persentase) {
      alert("Form tidak boleh ada yang kosong.");
      return;
    }

    if (!jenisSHU) {
      alert("Nama jenis tidak boleh kosong.");
      document.getElementById("jenisSHU").focus();
      return;
    }

    if (!persentase) {
      alert("Persentase SHU tidak boleh kosong.");
      document.getElementById("persentaseSHU").focus();
      return;
    }

    const jenisSHUArray = shuAnggota.map((item) => item.jenisSHU);

    if (jenisSHUArray.includes(jenisSHU)) {
      alert("Nama jenis sudah ada, silahkan masukkan nama lain.");
      document.getElementById("jenisSHU").focus();
      return;
    }

    try {
      const submitData = {
        jenisSHU: jenisSHU,
        persentaseSHU: persentase || 0,
      };
      await postSHU(submitData);
      onHide();
    } catch (error) {
      console.log("Error submitting jenis anggota:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitClick();
    }
  };

  const yourFormRef = React.useRef(null);

  React.useEffect(() => {
    if (show) {
      yourFormRef.current && yourFormRef.current.focus();
    }
  }, [show]);
  return (
    <>
      <Modal show={show} onHide={onHide} scrollable backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Tambah Jenis Anggota
          </Modal.Title>
        </Modal.Header>
        <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
          <Modal.Body>
            <Form.Group as={Row} className="mb-3" controlId="jenisSHU">
              <Form.Label as={Col}>Nama Jenis</Form.Label>
              <Col>
                <Form.Control type="text" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="persentaseSHU">
              <Form.Label as={Col}>Persentase SHU</Form.Label>
              <Col>
                <Form.Control type="number" />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => onHide()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSubmitClick()}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default PengaturanSHUModalTambah;

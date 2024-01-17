/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { editAnggota, getKeanggotaan } from "../utils/api";

export default function AnggotaEditModal(props) {
  const { show, onHide, selectedRow } = props;
  const {
    kodeAnggota,
    nama,
    jenisAnggota,
    jenKel,
    tempatLahir,
    tanggalLahir,
    alamat,
    noHP,
  } = selectedRow;

  const [noHpData, setNoHp] = React.useState("");
  const [dropdown, setDropdown] = React.useState("");
  const [keanggotaan, setKeanggotaan] = React.useState([]);

  React.useEffect(() => {
    if (selectedRow && noHP) {
      setNoHp(noHP);
    }
  }, [selectedRow, noHP]);

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
    setDropdown(jenisAnggota);
  }, [show, jenisAnggota]);

  const handleInputChange = (e) => {
    const formattedValue = e.target.value.replace(/[^0-9]/g, "");
    setNoHp(formattedValue);
  };

  const handleSave = async (id) => {
    try {
      const updatedData = {
        kodeAnggota: document.getElementById("kodeAnggota")?.value || "",
        nama: document.getElementById("nama")?.value || "",
        jenisAnggota: dropdown || "",
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const yourFormRef = React.useRef(null);

  React.useEffect(() => {
    yourFormRef.current && yourFormRef.current.focus();
  }, [show]);
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase fw-bold">
            Edit Data {nama}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
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
                    <option key={anggota.id} value={anggota.namaKeanggotaan}>
                      {anggota.namaKeanggotaan}
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
                <Form.Label>No. Telp</Form.Label>
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

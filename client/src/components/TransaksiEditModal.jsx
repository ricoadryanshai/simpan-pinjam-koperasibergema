/* eslint-disable react/prop-types */
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { editTransaksi } from "../utils/api";
import { handleInputChange } from "../utils/handle";
import { formatNumber, formatRupiah } from "../utils/format";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

export const TransaksiEditModal = (props) => {
  const { show, onHide, selectedRow, saldoKas } = props;

  const [input, setInput] = React.useState("");

  const handleSubmitClick = async (id) => {
    const updatedData = {
      jenisTransaksi: document.getElementById("jenisTransaksi").value,
      tanggalTransaksi:
        document.getElementById("tanggalTransaksi").value ||
        `${year}-${month}-${date}`,
      nominalTransaksi: input || 0,
      keterangan: document.getElementById("keterangan").value || "-",
    };

    try {
      await editTransaksi(id, updatedData);
      onHide();
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const handleInput = (event) => {
    handleInputChange(event, setInput);
  };

  const id = selectedRow?.id || "";
  const jenisTransaksi = selectedRow?.jenisTransaksi || "";
  const tanggalTransaksi = selectedRow?.tanggalTransaksi || "";
  const nominalTransaksi = selectedRow?.nominalTransaksi || "";
  const keterangan = selectedRow?.keterangan || "";

  React.useEffect(() => {
    setInput(nominalTransaksi);
  }, [show, nominalTransaksi]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitClick();
    }
  };

  const yourFormRef = React.useRef(null);

  React.useEffect(() => {
    yourFormRef.current && yourFormRef.current.focus();
  }, [show]);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase fw-bold">
          Ubah Transaksi
        </Modal.Title>
      </Modal.Header>
      <Form ref={yourFormRef} onKeyDown={handleKeyPress}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Tanggal Transaksi</Form.Label>
            <Form.Control
              type="date"
              placeholder="Pilih Tanggal"
              name="tanggalTransaksi"
              id="tanggalTransaksi"
              defaultValue={tanggalTransaksi}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Jenis Transaksi</Form.Label>
            <Form.Select
              name="jenisTransaksi"
              id="jenisTransaksi"
              defaultValue={jenisTransaksi}
              disabled
            >
              <option disabled>Pilih Jenis Transaksi</option>
              <option value={"Transaksi Masuk"}>Transaksi Masuk</option>
              <option value={"Transaksi Keluar"}>Transaksi Keluar</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Saldo Kas</Form.Label>
            <Form.Control
              type="text"
              disabled
              defaultValue={formatRupiah(saldoKas.saldoKas)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Nominal Transaksi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan Nominal"
              name="nominalTransaksi"
              id="nominalTransaksi"
              value={formatNumber(input)}
              onChange={handleInput}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Keterangan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Masukkan Keterangan"
              name="keterangan"
              id="keterangan"
              defaultValue={keterangan}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmitClick(id);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

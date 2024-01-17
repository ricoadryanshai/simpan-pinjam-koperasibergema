/* eslint-disable react/prop-types */
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getKas, tambahTransaksi } from "../utils/api";
import { formatNumber, formatRupiah } from "../utils/format";
import { handleInputChange } from "../utils/handle";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

export const TransaksiTambahModal = (props) => {
  const { show, onHide } = props;

  const [input, setInput] = React.useState("");
  const [saldoKas, setSaldoKas] = React.useState({});

  const handleSubmitClick = async () => {
    const newTransaki = {
      jenisTransaksi: document.getElementById("jenisTransaksi").value,
      tanggalTransaksi:
        document.getElementById("tanggalTransaksi").value ||
        `${year}-${month}-${date}`,
      nominalTransaksi: input || 0,
      keterangan: document.getElementById("keterangan").value || "-",
    };

    try {
      await tambahTransaksi(newTransaki);
      console.log("Successfully submiting data.");
      onHide();
      setInput("");
    } catch (error) {
      console.log("Error submiting data transaksi: ", error);
    }
  };

  const handleInput = (event) => {
    handleInputChange(event, setInput);
  };

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

  React.useEffect(() => {
    if (show) {
      const fetchSaldoKas = async () => {
        try {
          const data = await getKas();
          setSaldoKas(data);
        } catch (error) {
          console.log("Error fetching saldo kas: ", error);
        }
      };
      fetchSaldoKas();
    }
  }, [show]);
  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setInput("");
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase fw-bold">
          Transaksi Kas
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
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Jenis Transaksi</Form.Label>
            <Form.Select name="jenisTransaksi" id="jenisTransaksi">
              <option disabled>Pilih Jenis Transaksi</option>
              <option>Transaksi Masuk</option>
              <option>Transaksi Keluar</option>
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
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onHide();
              setInput("");
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmitClick()}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

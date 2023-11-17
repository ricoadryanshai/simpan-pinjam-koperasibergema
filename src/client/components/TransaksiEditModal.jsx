/* eslint-disable react/prop-types */
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { editTransaksi } from "../utils/api";

export const TransaksiEditModal = (props) => {
  const { show, onHide, selectedTransaction } = props;

  const [formValues, setFormValues] = React.useState(selectedTransaction);

  const resetForm = () => {
    setFormValues({
      nominal: "",
      tanggalTransaksi: "",
      jenisTransaksi: "Pilih Jenis Transaksi",
      keterangan: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleNominalChange = (event) => {
    // Hapus karakter selain angka dan tanda minus (untuk nilai negatif)
    const formattedValue = event.target.value.replace(/[^0-9-]/g, "");

    // Update state dengan angka yang telah diformat
    setFormValues((prevValues) => ({
      ...prevValues,
      nominal: formattedValue,
    }));
  };

  const handleSubmitChange = async () => {
    try {
      const response = await editTransaksi(selectedTransaction.id, formValues);
      // Reset formulir setelah berhasil mengubah data
      console.log("Record updated successfully:", response.data);
      resetForm();
      onHide(); // Sembunyikan modal setelah berhasil mengubah data
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const formatNumber = (number) => {
    // Memformat angka dengan pemisahan desimal setiap 3 digit
    return new Intl.NumberFormat("id-ID").format(number);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase fw-bold">
          Ubah Transaksi
        </Modal.Title>
      </Modal.Header>
      <Form onClick={handleSubmitChange}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Tanggal Transaksi</Form.Label>
            <Form.Control
              type="date"
              placeholder="Pilih Tanggal"
              name="tanggalTransaksi"
              value={formValues.tanggalTransaksi}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Jenis Transaksi</Form.Label>
            <Form.Select
              name="jenisTransaksi"
              value={formValues.jenisTransaksi}
              onChange={handleInputChange}
            >
              <option disabled>Pilih Jenis Transaksi</option>
              <option>Transaksi Masuk</option>
              <option>Transaksi Keluar</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Nominal Transaksi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan Nominal"
              name="nominal"
              value={formatNumber(formValues.nominal)}
              onChange={handleNominalChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Keterangan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Masukkan Keterangan"
              name="keterangan"
              value={formValues.keterangan}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onHide();
              resetForm();
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

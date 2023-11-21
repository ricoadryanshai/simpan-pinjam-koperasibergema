/* eslint-disable react/prop-types */
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { tambahTransaksi } from "../utils/api";
import { formatNumber } from "../utils/format";

export const TransaksiTambahModal = (props) => {
  const { show, onHide } = props;

  const [formValues, setFormValues] = React.useState({
    tanggalTransaksi: "",
    jenisTransaksi: "Pilih Jenis Transaksi",
    nominal: "",
    keterangan: "",
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validasi formulir sebelum mengirim permintaan ke server
      if (
        formValues.jenisTransaksi === "Pilih Jenis Transaksi" ||
        formValues.tanggalTransaksi === "" ||
        formValues.nominal === ""
      ) {
        console.error("Harap lengkapi semua field yang diperlukan");
        return;
      }

      // Ubah format tanggal menjadi "yyyy/mm/dd"
      const formattedDate = formValues.tanggalTransaksi.split("-").join("/");

      // Kirim permintaan untuk menambahkan transaksi
      const response = await tambahTransaksi({
        jenisTransaksi: formValues.jenisTransaksi,
        tanggalTransaksi: formattedDate,
        nominalTransaksi: parseFloat(
          formValues.nominal.replace(/[^0-9.-]/g, "")
        ), // Hilangkan karakter selain angka, titik, dan minus
        keterangan: formValues.keterangan,
      });

      console.log(response); // Output respons dari server

      // Reset formulir setelah berhasil menambahkan data
      resetForm();
      onHide(); // Sembunyikan modal setelah berhasil menambahkan data
    } catch (error) {
      console.error("Error submitting data:", error.message);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        resetForm();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase fw-bold">
          Transaksi Kas
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
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

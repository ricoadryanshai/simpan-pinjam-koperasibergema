import React from "react";
import { Modal, Button } from "react-bootstrap";

const PengaturanSHUModalDelete = ({ show, onHide, record, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(record.id);
      onHide();
    } catch (error) {
      console.log("Error deleting data transaksi: ", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header className="bg-danger text-white">
          Apakah Anda Yakin?
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menyembunyikan jenis{" "}
          <strong>{record.jenisSHU}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PengaturanSHUModalDelete;

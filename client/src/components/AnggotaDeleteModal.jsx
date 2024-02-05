import React from "react";
import { Modal, Button } from "react-bootstrap";

const AnggotaDeleteModal = ({ show, onHide, selectedRow, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(selectedRow.id);
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
          Apakah Anda yakin ingin menghapus data{" "}
          <strong>{selectedRow.nama}</strong>?
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

export default AnggotaDeleteModal;

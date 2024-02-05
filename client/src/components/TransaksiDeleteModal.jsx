import React from "react";
import { Modal, Button } from "react-bootstrap";

const TransaksiDeleteModal = ({ show, onHide, selectedRow, onDelete }) => {
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
          <Modal.Title>Apakah Anda Yakin?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Menghapus transaksi kas <strong>{selectedRow.keterangan}</strong>.
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

export default TransaksiDeleteModal;

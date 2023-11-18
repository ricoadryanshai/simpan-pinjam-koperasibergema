// eslint-disable-next-line no-unused-vars
import React from "react";
import { Modal } from "react-bootstrap";

export const PinjamBayarModal = (props) => {
  const { show, onHide, selectedRow } = props;

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
      </Modal>
    </>
  );
};

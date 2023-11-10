/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Modal } from "react-bootstrap";

export const PinjamDetailModal = (props) => {
  const { show, onHide } = props;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>Detail</Modal.Header>
    </Modal>
  );
};

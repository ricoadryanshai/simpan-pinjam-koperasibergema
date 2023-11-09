// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { deleteAnggota, getAnggota } from "../utils/api";
import { Button, Card, Container, Modal } from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";

function AnggotaTable() {
  const [anggotaData, setAnggotaData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-GB",
      options
    );
    return formattedDate;
  };

  const handleEditClick = (anggota) => {
    setSelectedItem(anggota);
    setShowEditModal(true);
  };

  const handlerDelete = async (id) => {
    try {
      await deleteAnggota(id);

      setAnggotaData(await getAnggota());
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const fetchData = async () => {
    setAnggotaData(await getAnggota());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container fluid style={{ marginBottom: "6rem" }}>
        <Card>
          <Card.Header>
            <Card.Title className="fw-bold text-uppercase mt-2">
              Data Anggota
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table hover borderless responsive size="sm">
              <thead>
                <tr className="text-center align-middle fs-7">
                  <th>No.</th>
                  <th style={{ borderInline: "solid 1px lightgray" }}>
                    Kode Anggota
                  </th>
                  <th>Nama</th>
                  <th style={{ borderInline: "solid 1px lightgray" }}>
                    Jenis Kelamin
                  </th>
                  <th>Tempat Lahir</th>
                  <th style={{ borderInline: "solid 1px lightgray" }}>
                    Tanggal Lahir
                  </th>
                  <th>Alamat</th>
                  <th style={{ borderInline: "solid 1px lightgray" }}>
                    No. HP
                  </th>
                  <th>Tanggal Daftar</th>
                  <th
                    style={{ borderInlineStart: "solid 1px lightgray" }}
                    colSpan={2}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {anggotaData.map((anggota, index) => (
                  <tr
                    style={{ borderBlockStart: "solid 1px lightgray" }}
                    key={anggota.id}
                    className="align-middle"
                  >
                    <td className="text-center align-middle">{index + 1}</td>
                    <td style={{ borderInline: "solid 1px lightgray" }}>
                      {anggota.kodeAnggota}
                    </td>
                    <td>{anggota.nama}</td>
                    <td style={{ borderInline: "solid 1px lightgray" }}>
                      {anggota.jenKel}
                    </td>
                    <td>{anggota.tempatLahir}</td>
                    <td style={{ borderInline: "solid 1px lightgray" }}>
                      {formatDate(anggota.tanggalLahir)}
                    </td>
                    <td>{anggota.alamat}</td>
                    <td style={{ borderInline: "solid 1px lightgray" }}>
                      {anggota.noHP}
                    </td>
                    <td>{formatDate(anggota.tanggalDaftar)}</td>
                    <td style={{ borderInlineStart: "solid 1px lightgray" }}>
                      <Button
                        variant="warning"
                        size="md"
                        onClick={() => {
                          handleEditClick(anggota);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => handlerDelete(anggota.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Data Anggota</Modal.Title>
        </Modal.Header>
        {selectedItem && (
          <AnggotaEditModal
            item={selectedItem}
            closeModal={() => setShowEditModal(false)}
            fetchData={fetchData}
          />
        )}
      </Modal>
    </>
  );
}

export default AnggotaTable;

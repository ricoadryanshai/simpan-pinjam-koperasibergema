// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Button, Card, Container, Modal, Row, Col } from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { Pagination } from "react-bootstrap";
import { formatDate } from "../utils/format";
import { fetchAnggota } from "../utils/fetch";
import { handleEditFunction } from "../utils/handleEdit";
import { handleDeleteFunction } from "../utils/handleDelete";

function AnggotaTable() {
  const [anggotaData, setAnggotaData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditClick = (anggota) => {
    handleEditFunction(anggota, setSelectedItem, setShowEditModal);
  };

  const handlerDelete = async (id) => {
    await handleDeleteFunction(id, setAnggotaData);
  };

  //Search //
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const members = await fetchAnggota();
      if (members) {
        setAnggotaData(members);
      }
    };

    fetchData();
  }, []);

  const highlightSearchText = (text, search) => {
    if (text && search) {
      const lowerText = text.toLowerCase();
      const lowerSearch = search.toLowerCase();
      const startIndex = lowerText.indexOf(lowerSearch);

      if (startIndex !== -1) {
        const endIndex = startIndex + lowerSearch.length;
        return (
          <span>
            {text.substring(0, startIndex)}
            <mark>{text.substring(startIndex, endIndex)}</mark>
            {text.substring(endIndex)}
          </span>
        );
      }
    }

    return text;
  };

  // Pagination //
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; // Ganti dengan jumlah item per halaman

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <>
      <Container fluid style={{ marginBottom: "6rem" }}>
        <Card>
          <Card.Header>
            <Card.Title className="fw-bold text-uppercase mt-2">
              <Row>
                <Col>Data Anggota</Col>
                <Col>
                  <div className="search-bar-container">
                    <div className="input-wrapper">
                      <FaSearch id="search-icon" />
                      <input
                        placeholder="Type to Search..."
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
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
                {anggotaData
                  .filter((anggota) => {
                    const inputString = input.toString().toLowerCase(); // Konversi input ke huruf kecil

                    return (
                      anggota.kodeAnggota.toLowerCase().includes(inputString) ||
                      anggota.nama.toLowerCase().includes(inputString) ||
                      (anggota.tempatLahir &&
                        anggota.tempatLahir
                          .toLowerCase()
                          .includes(inputString)) ||
                      (anggota.tanggalLahir &&
                        anggota.tanggalLahir
                          .toLowerCase()
                          .includes(inputString)) ||
                      anggota.alamat.toLowerCase().includes(inputString) ||
                      anggota.noHP.toLowerCase().includes(inputString) ||
                      (anggota.tanggalDaftar &&
                        anggota.tanggalDaftar
                          .toLowerCase()
                          .includes(inputString))
                    );
                  })
                  .map((anggota, index) => (
                    <tr
                      style={{ borderBlockStart: "solid 1px lightgray" }}
                      key={anggota.id}
                      className="align-middle"
                    >
                      <td className="text-center align-middle">{index + 1}</td>
                      <td style={{ borderInline: "solid 1px lightgray" }}>
                        {highlightSearchText(anggota.kodeAnggota)}
                      </td>
                      <td>{highlightSearchText(anggota.nama)}</td>
                      <td style={{ borderInline: "solid 1px lightgray" }}>
                        {anggota.jenKel}
                      </td>
                      <td>{highlightSearchText(anggota.tempatLahir)}</td>
                      <td style={{ borderInline: "solid 1px lightgray" }}>
                        {formatDate(anggota.tanggalLahir)}
                      </td>
                      <td>{highlightSearchText(anggota.alamat)}</td>
                      <td style={{ borderInline: "solid 1px lightgray" }}>
                        {highlightSearchText(anggota.noHP)}
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
        <Pagination className="justify-content-center">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={activePage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          {Array.from({
            length: Math.ceil(anggotaData.length / itemsPerPage),
          }).map((item, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={
              activePage === Math.ceil(anggotaData.length / itemsPerPage)
            }
          />
          <Pagination.Last
            onClick={() =>
              handlePageChange(Math.ceil(anggotaData.length / itemsPerPage))
            }
            disabled={
              activePage === Math.ceil(anggotaData.length / itemsPerPage)
            }
          />
        </Pagination>
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
            fetchData={fetchAnggota}
          />
        )}
      </Modal>
    </>
  );
}

export default AnggotaTable;

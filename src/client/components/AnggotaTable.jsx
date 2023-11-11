// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { deleteAnggota, getAnggota } from "../utils/api";
import { Button, Card, Container, Modal, Row, Col } from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { Pagination } from "react-bootstrap";

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

  //Search //
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  //     set search query to empty string
  // eslint-disable-next-line no-unused-vars
  const [q, setQ] = useState("");
  //     set search parameters
  //     we only what to search countries by capital and name
  //     this list can be longer if you want
  // just add it to this array
  // eslint-disable-next-line no-unused-vars
  const [searchParam] = useState([
    "kodeAnggota",
    "nama",
    "tempatLahir",
    "tanggalLahir",
    "alamat",
    "noHP",
    "tanggalDaftar",
  ]);

  const fetchData = async () => {
    setAnggotaData(await getAnggota());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination //
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; // Ganti dengan jumlah item per halaman

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // const startIndex = (activePage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  // const anggotaHalaman = anggotaData.slice(startIndex, endIndex);

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
                    // Convert the input to a string, as the properties may not be strings
                    const inputString = input.toString();

                    return (
                      anggota.kodeAnggota.includes(inputString) ||
                      anggota.nama.includes(inputString) ||
                      (anggota.tempatLahir &&
                        anggota.tempatLahir.includes(inputString)) ||
                      (anggota.tanggalLahir &&
                        anggota.tanggalLahir.includes(inputString)) ||
                      anggota.alamat.includes(inputString) ||
                      anggota.noHP.includes(inputString) ||
                      (anggota.tanggalDaftar &&
                        anggota.tanggalDaftar.includes(inputString))
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

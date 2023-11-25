import React from "react";
import Table from "react-bootstrap/Table";
import { Button, Card, Container, Row, Col, Pagination } from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { deleteAnggota, getAnggota } from "../utils/api";
import AnggotaTambahModal from "./AnggotaTambahModal";
import AnggotaDetailModal from "./AnggotaDetailModal";

const ITEMS_PER_PAGE = 10;

export default function AnggotaTable() {
  const [anggotaData, setAnggotaData] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([]);

  const fetchData = async () => {
    try {
      const data = await getAnggota();
      if (data) {
        setAnggotaData(data);
      }
    } catch (error) {
      console.log("error fetching data Anggota: ", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleModalShow = (modalType, map) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(true);
        break;
      case "edit":
        setShowEdit(true);
        setSelectedRow(map);
        break;
      case "detail":
        setShowDetail(true);
        setSelectedRow(map);
        break;
      default:
        break;
    }
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(false);
        fetchData();
        break;
      case "detail":
        setShowDetail(false);
        fetchData();
        break;
      case "edit":
        setShowEdit(false);
        fetchData();
        break;
      default:
        break;
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteAnggota(id);
      await fetchData();
      console.log("Data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

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

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(anggotaData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(anggotaData.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = anggotaData.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-border-box">
          <Container fluid>
            <Card.Title className="fw-bold text-uppercase my-2">
              Data Anggota
            </Card.Title>

            <hr className="my-2" />
            <Row className="mb-2">
              <Col>
                <Button
                  className="no-print"
                  onClick={() => handleModalShow("tambah")}
                >
                  Tambah Transaksi
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    size="lg"
                    className="mx-1"
                  />
                </Button>
              </Col>
              <Col>
                <div className="search-bar-container">
                  <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                      placeholder="Ketika untuk mencari data..."
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Table hover responsive size="sm">
              <thead className="table-light">
                <tr className="text-center align-middle table-info">
                  <th>No.</th>
                  <th>Kode Anggota</th>
                  <th>Nama</th>
                  <th colSpan={3}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries
                  .filter((anggota) => {
                    const inputString = input.toString().toLowerCase();

                    return (
                      (anggota.kodeAnggota &&
                        anggota.kodeAnggota
                          .toLowerCase()
                          .includes(inputString)) ||
                      (anggota.nama &&
                        anggota.nama.toLowerCase().includes(inputString)) ||
                      (anggota.jenKel &&
                        anggota.jenKel.toLowerCase().includes(inputString)) ||
                      (anggota.tanggalTransaksi &&
                        anggota.tanggalTransaksi
                          .toLowerCase()
                          .includes(inputString)) ||
                      (anggota.tempatLahir &&
                        anggota.tempatLahir
                          .toLowerCase()
                          .includes(inputString)) ||
                      (anggota.tanggalLahir &&
                        anggota.tanggalLahir
                          .toLowerCase()
                          .includes(inputString)) ||
                      (anggota.alamat &&
                        anggota.alamat.toLowerCase().includes(inputString)) ||
                      (anggota.noHP &&
                        anggota.noHP.toLowerCase().includes(inputString)) ||
                      (anggota.tanggalDaftar &&
                        anggota.tanggalDaftar
                          .toLowerCase()
                          .includes(inputString))
                    );
                  })
                  .map((anggota, index) => (
                    <tr key={anggota.id} className="align-middle text-center">
                      <td>{startIndex + index}</td>
                      <td>{highlightSearchText(anggota.kodeAnggota)}</td>
                      <td className="text-start">
                        {highlightSearchText(anggota.nama)}
                      </td>

                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => handleModalShow("detail", anggota)}
                        >
                          Detail
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleModalShow("edit", anggota)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteClick(anggota.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Container>
        </Card>
      </div>
      <Pagination className="mt-2 justify-content-center">
        <Pagination.First onClick={goToFirstPage} />
        <Pagination.Prev onClick={goToPrevPage} />
        {[...Array(Math.ceil(anggotaData.length / ITEMS_PER_PAGE))].map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next onClick={goToNextPage} />
        <Pagination.Last onClick={goToLastPage} />
      </Pagination>

      <AnggotaTambahModal
        show={showTambah}
        onHide={() => handleModalClose("tambah")}
        selectedRow={selectedRow}
      />

      <AnggotaDetailModal
        show={showDetail}
        onHide={() => handleModalClose("detail")}
        selectedRow={selectedRow}
      />

      <AnggotaEditModal
        show={showEdit}
        onHide={() => handleModalClose("edit")}
        selectedRow={selectedRow}
      />
    </>
  );
}

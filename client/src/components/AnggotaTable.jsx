import React from "react";
import Table from "react-bootstrap/Table";
import { Button, Card, Container, Row, Col, Pagination } from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { deleteAnggota, getAnggota } from "../utils/api";
import AnggotaTambahModal from "./AnggotaTambahModal";
import AnggotaDetailModal from "./AnggotaDetailModal";

const ITEMS_PER_PAGE = 10;

export default function AnggotaTable() {
  const [anggotaData, setAnggotaData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [activePage, setActivePage] = React.useState(1);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([]);
  const [sortConfig /* setSortConfig */] = React.useState({
    key: "nama",
    direction: "asc",
  });

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
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const customSort = (a, b) => {
    const kodeAnggotaA = a.kodeAnggota;
    const kodeAnggotaB = b.kodeAnggota;

    return kodeAnggotaA.localeCompare(kodeAnggotaB);
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...anggotaData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => customSort(a, b));
    }
    return sortableData;
  }, [anggotaData, sortConfig]);

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();

    // Lakukan filtering pada seluruh dataset (simpananData)
    const filteredResult = sortedData.filter((simpan) => {
      const kodeAnggota = simpan.kodeAnggota.toLowerCase();
      const nama = simpan.nama.toLowerCase();

      return kodeAnggota.includes(inputValue) || nama.includes(inputValue);
    });

    // Update state filteredData dengan hasil pencarian
    setFilteredData(filteredResult);

    // Set activePage kembali ke halaman pertama setelah melakukan pencarian
    setActivePage(1);
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

  React.useEffect(() => {
    if (sortedData.length > 0) {
      setFilteredData(sortedData);
    }
  }, [sortedData]);
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-border-box">
          <Container fluid>
            <Card.Title className="fw-bold text-uppercase my-2">
              Data Nasabah
            </Card.Title>

            <hr className="my-2" />
            <Row className="mb-2">
              <Col>
                <Button
                  className="no-print"
                  onClick={() => handleModalShow("tambah")}
                >
                  Tambah Nasabah
                  <FontAwesomeIcon icon={faSquarePlus} className="ms-1" />
                </Button>
              </Col>
              <Col>
                <div className="search-bar-container">
                  <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                      placeholder="Ketik untuk mencari data..."
                      onChange={handleInputChange}
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
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((anggota, index) => (
                  <tr key={anggota.id} className="align-middle text-center">
                    <td>{startIndex + index}</td>
                    <td>{highlightSearchText(anggota.kodeAnggota)}</td>
                    <td className="text-start">
                      {highlightSearchText(anggota.nama)}
                    </td>

                    <td className="d-flex justify-content-center flex-gap-1">
                      <Button
                        variant="secondary"
                        onClick={() => handleModalShow("detail", anggota)}
                      >
                        <FontAwesomeIcon icon={faCircleInfo} className="me-1" />
                        Detail
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => handleModalShow("edit", anggota)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="me-1"
                        />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(anggota.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="me-1" />
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
        anggotaData={anggotaData}
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

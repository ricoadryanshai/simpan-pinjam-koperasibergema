import React from "react";
import Table from "react-bootstrap/Table";
import {
  Button,
  Card,
  Container,
  Modal,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
import AnggotaEditModal from "./AnggotaEditModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { formatDate } from "../utils/format";
import { fetchAnggota } from "../utils/fetch";
import { deleteMembers, handleEdit } from "../utils/handle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import AnggotaTambahModal from "./FormTambahAnggota";

const ITEMS_PER_PAGE = 10;

export default function AnggotaTable() {
  const [anggotaData, setAnggotaData] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const fetchData = async () => {
    const members = await fetchAnggota();
    if (members) {
      setAnggotaData(members);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (anggota) => {
    handleEdit(anggota, setSelectedItem, setShowEditModal);
  };

  const handleDeleteWrapper = async (id) => {
    await deleteMembers(id, setAnggotaData);
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

  const renderHeaderWithTooltip = (text, tooltipText, maxLength) => {
    const renderedText =
      text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${text}`}>{tooltipText}</Tooltip>}
      >
        <th
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {renderedText}
        </th>
      </OverlayTrigger>
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = anggotaData.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-container-child">
          <Container fluid>
            <Card.Title className="fw-bold text-uppercase my-2">
              Data Anggota
            </Card.Title>

            <hr className="my-2" />
            <Row className="mb-2">
              <Col>
                <Button
                  className="no-print"
                  onClick={() => setShowTambah(true)}
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
                  {renderHeaderWithTooltip(
                    "Kode Anggota",
                    "Kode untuk setiap anggota",
                    10
                  )}
                  {renderHeaderWithTooltip("Nama", "Nama lengkap anggota", 15)}
                  {renderHeaderWithTooltip(
                    "Jenis Kelamin",
                    "Jenis kelamin anggota",
                    12
                  )}
                  {renderHeaderWithTooltip(
                    "Tempat Lahir",
                    "Tempat lahir anggota",
                    15
                  )}
                  {renderHeaderWithTooltip(
                    "Tanggal Lahir",
                    "Tanggal lahir anggota",
                    15
                  )}
                  {renderHeaderWithTooltip(
                    "Alamat",
                    "Alamat lengkap anggota",
                    20
                  )}
                  {renderHeaderWithTooltip(
                    "No. HP",
                    "Nomor telepon anggota",
                    10
                  )}
                  {renderHeaderWithTooltip(
                    "Tanggal Daftar",
                    "Tanggal bergabung anggota",
                    15
                  )}
                  <th colSpan={2}>Aksi</th>
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
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              <div style={{ maxWidth: "300px" }}>
                                {anggota.nama}
                              </div>
                            </Tooltip>
                          }
                        >
                          <span>
                            {highlightSearchText(
                              anggota.nama.length > 12
                                ? anggota.nama.substring(0, 12) + "..."
                                : anggota.nama
                            )}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>{anggota.jenKel}</td>
                      <td>{highlightSearchText(anggota.tempatLahir)}</td>
                      <td>{formatDate(anggota.tanggalLahir)}</td>
                      <td className="text-start">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              <div style={{ maxWidth: "300px" }}>
                                {anggota.alamat}
                              </div>
                            </Tooltip>
                          }
                        >
                          <span>
                            {highlightSearchText(
                              anggota.alamat.length > 20
                                ? anggota.alamat.substring(0, 20) + "..."
                                : anggota.alamat
                            )}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>{highlightSearchText(anggota.noHP)}</td>
                      <td>{formatDate(anggota.tanggalDaftar)}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="md"
                          onClick={() => handleEditClick(anggota)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="md"
                          onClick={() => handleDeleteWrapper(anggota.id)}
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
        {showEditModal && selectedItem && (
          <AnggotaEditModal
            item={selectedItem}
            closeModal={() => setShowEditModal(false)}
            fetchData={fetchAnggota}
          />
        )}
      </Modal>

      <AnggotaTambahModal show={showTambah} onHide={setShowTambah(false)} />
    </>
  );
}

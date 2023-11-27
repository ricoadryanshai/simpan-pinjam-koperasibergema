import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { getSimpanAnggotaById } from "../utils/api";
import SimpanDetailModal from "./SimpanDetailModal";
import SimpanTambahModal from "./SimpanTambahModal";
import SimpanAmbilModal from "./SimpanAmbilModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { fetchSimpanan } from "../utils/fetch";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMoneyBillTransfer,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

export default function SimpanTable() {
  const [simpananData, setSimpananData] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [showTambahModal, setShowTambahModal] = React.useState(false);
  const [showAmbilModal, setShowAmbilModal] = React.useState(false);
  const [modalData, setModalData] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const fetchData = async () => {
    await fetchSimpanan(setSimpananData);
  };

  const handleModal = (rowData, setShowModal) => {
    setSelectedRowData(rowData);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleDetailClick = (rowData) => {
    handleModal(rowData, setShowDetailModal);

    getSimpanAnggotaById(rowData.kodeAnggota)
      .then((data) => {
        setModalData(data);
      })
      .catch((error) => {
        console.error("Error fetching detailed data:", error);
      });
  };

  const handleTambahClick = (rowData) => {
    handleModal(rowData, setShowTambahModal);
  };

  const handleAmbilClick = (rowData) => {
    handleModal(rowData, setShowAmbilModal);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(simpananData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(simpananData.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = simpananData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-border-box">
          <Container className="py-2">
            <Card.Title className="fw-bold text-uppercase mb-2">
              <span>Data Simpanan Anggota</span>
            </Card.Title>
            <hr className="mt-2 mb-2" />
            <Row className="mb-2">
              <Col />
              <Col>
                <div className="search-bar-container">
                  <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                      placeholder="Ketika untuk mencari data..."
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Table hover responsive size="sm">
              <thead className="table-info">
                <tr className="text-center align-middle">
                  <th>No.</th>
                  <th>Kode Anggota</th>
                  <th>Nama</th>
                  <th>Saldo</th>
                  <th colSpan={3}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries
                  .filter((simpan) => {
                    const inputString = input.toString().toLowerCase();
                    return (
                      (simpan.kodeAnggota &&
                        simpan.kodeAnggota
                          .toLowerCase()
                          .includes(inputString)) ||
                      (simpan.nama &&
                        simpan.nama.toLowerCase().includes(inputString))
                    );
                  })
                  .sort((a, b) => {
                    const saldoA = a.totalSaldo;
                    const saldoB = b.totalSaldo;

                    // Urutan jika totalSaldo lebih dari 0, dari kecil ke besar totalSaldo
                    if (saldoA > 0 && saldoB > 0) {
                      return a.kodeAnggota.localeCompare(b.kodeAnggota);
                    }

                    // Urutan jika totalSaldo lebih dari 0 harus diurutkan terlebih dahulu
                    if (saldoA > 0 && saldoB <= 0) {
                      return -1;
                    }

                    // Urutan jika totalSaldo lebih dari 0 harus diurutkan terlebih dahulu
                    if (saldoA <= 0 && saldoB > 0) {
                      return 1;
                    }

                    // Jika kedua nilai totalSaldo sama-sama 0, maka urutkan berdasarkan kode anggota
                    if (saldoA === 0 && saldoB === 0) {
                      return a.kodeAnggota.localeCompare(b.kodeAnggota);
                    }

                    // Jika salah satu dari nilai totalSaldo adalah 0, urutkan yang 0 terlebih dahulu
                    return saldoA - saldoB;
                  })
                  .map((simpan, index) => (
                    <tr className="text-center align-middle" key={index}>
                      <td>{index + startIndex}</td>
                      <td>{simpan.kodeAnggota}</td>
                      <td className="text-start">{simpan.nama}</td>
                      <td className="text-start">
                        {formatRupiah(simpan.totalSaldo)}
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => handleDetailClick(simpan)}
                        >
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="me-1"
                          />
                          Detail
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => handleTambahClick(simpan)}
                        >
                          <FontAwesomeIcon
                            icon={faPiggyBank}
                            className="me-1"
                          />
                          Simpan
                        </Button>
                      </td>
                      <td>
                        {simpan.totalSaldo > 0 ? (
                          <Button
                            variant="primary"
                            onClick={() => handleAmbilClick(simpan)}
                          >
                            <FontAwesomeIcon
                              icon={faMoneyBillTransfer}
                              className="me-1"
                            />
                            Ambil
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Container>
        </Card>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <Pagination>
          <Pagination.First onClick={goToFirstPage} />
          <Pagination.Prev onClick={goToPrevPage} />
          {[...Array(Math.ceil(simpananData.length / ITEMS_PER_PAGE))].map(
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
      </div>

      <SimpanDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        rowData={selectedRowData}
        modalData={modalData}
        updateModalData={setModalData}
        clearModalData={() => setModalData([])}
      />

      <SimpanTambahModal
        show={showTambahModal}
        onClose={() => setShowTambahModal(false)}
        rowData={selectedRowData}
        clearModalData={() => setModalData([])}
        fetchData={fetchData}
      />

      <SimpanAmbilModal
        show={showAmbilModal}
        onClose={() => setShowAmbilModal(false)}
        rowData={selectedRowData}
        clearModalData={() => setModalData([])}
        fetchData={fetchData}
      />
    </>
  );
}

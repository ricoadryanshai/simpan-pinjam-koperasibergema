import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Table,
  Stack,
} from "react-bootstrap";
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
import { getKas } from "../utils/api";

const ITEMS_PER_PAGE = 10;

export default function SimpanTable() {
  const [simpananData, setSimpananData] = React.useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [showTambahModal, setShowTambahModal] = React.useState(false);
  const [showAmbilModal, setShowAmbilModal] = React.useState(false);
  const [modalData, setModalData] = React.useState([]);
  const [activePage, setActivePage] = React.useState(1);
  const [filteredData, setFilteredData] = React.useState([]);
  const [sortConfig /* setSortConfig */] = React.useState({
    key: "nama",
    direction: "asc",
  });
  const [saldoKas, setSaldoKas] = React.useState({});

  const fetchData = async () => {
    await fetchSimpanan(setSimpananData);
  };

  const fetchSaldoKas = async () => {
    try {
      const data = await getKas();
      setSaldoKas(data);
    } catch (error) {
      console.log("Fetching Saldo Kas Error From Client-side:", error);
    }
  };

  const handleModal = (rowData, setShowModal) => {
    setSelectedRowData(rowData);
    setShowModal(true);
  };

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

  const handleDetailClick = async (rowData) => {
    handleModal(rowData, setShowDetailModal);
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
    setActivePage(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
    );
  };

  const customSort = (a, b) => {
    const saldoA = a.totalSaldo;
    const saldoB = b.totalSaldo;

    if (saldoA > 0 && saldoB > 0) {
      return a.kodeAnggota.localeCompare(b.kodeAnggota);
    }

    if (saldoA > 0 && saldoB <= 0) {
      return -1;
    }

    if (saldoA <= 0 && saldoB > 0) {
      return 1;
    }

    if (saldoA === 0 && saldoB === 0) {
      return a.kodeAnggota.localeCompare(b.kodeAnggota);
    }

    return saldoA - saldoB;
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...simpananData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => customSort(a, b));
    }
    return sortableData;
  }, [simpananData, sortConfig]);

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;

  React.useEffect(() => {
    fetchSaldoKas();
    fetchData();
  }, []);

  React.useEffect(() => {
    if (sortedData.length > 0) {
      setFilteredData(sortedData);
    }
  }, [sortedData]);
  return (
    <>
      <Stack className="justify-content-center align-items-center" gap={3}>
        <Card className="custom-width-card">
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
                      placeholder="Ketik untuk mencari data..."
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
                {currentEntries.map((simpan, index) => {
                  let bg = "";

                  if (simpan.status === "Tidak Aktif") {
                    bg = "table-warning";
                  }
                  return (
                    <tr
                      className={`text-center align-middle ${bg}`}
                      key={index}
                    >
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
                          onClick={() =>
                            simpan.status === "Tidak Aktif"
                              ? alert(
                                  "Nasabah sudah tidak aktif, maka tidak bisa melakukan penyimpanan."
                                )
                              : handleTambahClick(simpan)
                          }
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
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </Card>

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
      </Stack>

      <SimpanDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        rowData={selectedRowData}
        modalData={modalData}
        updateModalData={setModalData}
        clearModalData={() => setModalData([])}
        fetchData={() => fetchData()}
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
        saldoKas={saldoKas}
        fetchSaldoKas={() => fetchSaldoKas()}
      />
    </>
  );
}

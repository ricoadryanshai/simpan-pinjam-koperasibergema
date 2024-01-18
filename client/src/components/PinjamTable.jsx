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
import { PinjamDetailModal } from "./PinjamDetailModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { formatRupiah } from "../utils/format";
import { PinjamTambahModal } from "./PinjamTambahModal";
import { PinjamBayarModal } from "./PinjamBayarModal";
import { getKas, getPinjamAnggota } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLandmark,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

export default function PinjamTable() {
  const [pinjamData, setPinjamData] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showPinjam, setShowPinjam] = React.useState(false);
  const [showBayar, setShowBayar] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [activePage, setActivePage] = React.useState(1);
  const [filteredData, setFilteredData] = React.useState([]);
  const [sortConfig /* setSortConfig */] = React.useState({
    key: "nama",
    direction: "asc",
  });
  const [saldoKas, setSaldoKas] = React.useState({});

  const fetchedData = async () => {
    try {
      setPinjamData(await getPinjamAnggota());
    } catch (error) {
      console.log("Error fetching data pinjam :", error);
    }
  };

  const fetchSaldoKas = async () => {
    try {
      const data = await getKas();
      setSaldoKas(data);
    } catch (error) {
      console.log("Error fetching saldo kas: ", error);
    }
  };

  const handleModalShow = async (modalType, pinjam) => {
    switch (modalType) {
      case "detail":
        setShowDetail(true);
        setSelectedRow(pinjam);
        break;
      case "pinjam":
        setShowPinjam(true);
        setSelectedRow(pinjam);
        break;
      case "bayar":
        setShowBayar(true);
        setSelectedRow(pinjam);
        break;
      default:
        break;
    }
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "detail":
        setShowDetail(false);
        fetchedData();
        fetchSaldoKas();
        break;
      case "pinjam":
        setShowPinjam(false);
        fetchedData();
        fetchSaldoKas();
        break;
      case "bayar":
        setShowBayar(false);
        fetchedData();
        fetchSaldoKas();
        break;
      default:
        break;
    }
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

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();

    const filteredResult = sortedData.filter((pinjam) => {
      const kodeAnggota = pinjam.kodeAnggota.toLowerCase();
      const nama = pinjam.nama.toLowerCase();

      return kodeAnggota.includes(inputValue) || nama.includes(inputValue);
    });

    // Update state filteredData dengan hasil pencarian
    setFilteredData(filteredResult);

    // Set activePage kembali ke halaman pertama setelah melakukan pencarian
    setActivePage(1);
  };

  const customSort = (data, sortConfig) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const debtA = a.jumlahHutang - a.jumlahBayar;
      const debtB = b.jumlahHutang - b.jumlahBayar;

      if (debtA > 0 && debtB > 0) {
        return sortConfig.direction === "asc"
          ? a.kodeAnggota.localeCompare(b.kodeAnggota)
          : b.kodeAnggota.localeCompare(a.kodeAnggota);
      }

      if (debtA > 0 && debtB <= 0) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (debtA <= 0 && debtB > 0) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      if (debtA === 0 && debtB === 0) {
        return sortConfig.direction === "asc"
          ? a.kodeAnggota.localeCompare(b.kodeAnggota)
          : b.kodeAnggota.localeCompare(a.kodeAnggota);
      }

      return sortConfig.direction === "asc" ? debtA - debtB : debtB - debtA;
    });
    return sortedData;
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return customSort(pinjamData, sortConfig);
    }
    return [...pinjamData]; // Jika tidak ada konfigurasi pengurutan, kembalikan data asli
  }, [pinjamData, sortConfig]);

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;

  React.useEffect(() => {
    fetchedData();
  }, []);

  React.useEffect(() => {
    if (sortedData.length > 0) {
      setFilteredData(sortedData);
    }
  }, [sortedData]);

  React.useEffect(() => {
    fetchSaldoKas();
  }, []);
  return (
    <>
      <Stack className="justify-content-center align-items-center" gap={3}>
        <Card className="custom-width-card">
          <Container className="py-2">
            <Card.Title className="fw-bold text-uppercase mb-2">
              Data Pinjaman Anggota
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
                <tr className="text-center align-middle fs-7">
                  <th>No.</th>
                  <th>Kode Anggota</th>
                  <th>Nama</th>
                  <th>Sisa Tagihan</th>
                  <th colSpan={2}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((pinjam, index) => {
                  let bg = "";

                  if (pinjam.status === "Tidak Aktif") {
                    bg = "table-warning";
                  }
                  return (
                    <tr
                      key={index}
                      className={`text-center align-middle ${bg}`}
                    >
                      <td>{index + startIndex}</td>
                      <td>{pinjam.kodeAnggota}</td>
                      <td className="text-start">{pinjam.nama}</td>
                      <td className="text-start">
                        {formatRupiah(pinjam.jumlahHutang - pinjam.jumlahBayar)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="secondary"
                          onClick={() => handleModalShow("detail", pinjam)}
                        >
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="me-1"
                          />
                          Detail
                        </Button>
                      </td>
                      <td className="text-center">
                        {pinjam.jumlahHutang - pinjam.jumlahBayar <= 0 ? (
                          <Button
                            variant="warning"
                            onClick={() =>
                              pinjam.status === "Tidak Aktif"
                                ? alert(
                                    "Nasabah sudah tidak aktif, maka tidak bisa melakukan pinjaman."
                                  )
                                : handleModalShow("pinjam", pinjam)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faLandmark}
                              className="me-1"
                            />
                            Pinjam
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={() => handleModalShow("bayar", pinjam)}
                          >
                            <FontAwesomeIcon
                              icon={faMoneyBill}
                              className="me-1"
                            />
                            Bayar
                          </Button>
                        )}
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
          {[...Array(Math.ceil(pinjamData.length / ITEMS_PER_PAGE))].map(
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

      <PinjamDetailModal
        show={showDetail}
        onHide={() => handleModalClose("detail")}
        selectedRow={selectedRow}
      />
      <PinjamTambahModal
        show={showPinjam}
        onHide={() => handleModalClose("pinjam")}
        selectedRow={selectedRow}
        setShowPinjam={setShowPinjam}
        saldoKas={saldoKas}
      />
      <PinjamBayarModal
        show={showBayar}
        onHide={() => handleModalClose("bayar")}
        selectedRow={selectedRow}
      />
    </>
  );
}

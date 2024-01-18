import React from "react";
import {
  Button,
  Card,
  Container,
  Table,
  Pagination,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import { TransaksiTambahModal } from "./TransaksiTambahModal";
import { TransaksiEditModal } from "./TransaksiEditModal";
import { formatDate, formatRupiah } from "../utils/format";
import { deleteTransaksi, getKas, getTransaksi } from "../utils/api";

const ITEMS_PER_PAGE = 10;

export default function TransaksiKas() {
  const [transaksi, setTransaksi] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState({});
  const [activePage, setActivePage] = React.useState(1);
  const [filteredData, setFilteredData] = React.useState([]);
  const [sortConfig /* setSortConfig */] = React.useState({
    key: "nama",
    direction: "asc",
  });
  const [saldoKas, setSaldoKas] = React.useState({});

  const fetchedData = async () => {
    try {
      const data = await getTransaksi();
      setTransaksi(data);
    } catch (error) {
      console.log("Error fetching data transaksi: ", error);
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

  const handleModalShow = (modalType, transaksi) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(true);
        break;
      case "edit":
        setShowEdit(true);
        setSelectedRow(transaksi);
        break;
      default:
        break;
    }
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(false);
        fetchedData();
        fetchSaldoKas();
        break;
      case "edit":
        setShowEdit(false);
        fetchedData();
        fetchSaldoKas();
        break;
      default:
        break;
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteTransaksi(id);
      fetchedData();
      fetchSaldoKas();
    } catch (error) {
      console.log("Error deleting data transaksi: ", error);
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

    const filteredResult = transaksi.filter((transaksi) => {
      const tanggalTransaksi = transaksi.tanggalTransaksi.toLowerCase();
      const jenisTransaksi = transaksi.jenisTransaksi.toLowerCase();
      const keterangan = transaksi.keterangan.toLowerCase();
      const nominalTransaksi = transaksi.nominalTransaksi.toLowerCase();

      return (
        tanggalTransaksi.includes(inputValue) ||
        jenisTransaksi.includes(inputValue) ||
        keterangan.includes(inputValue) ||
        nominalTransaksi.includes(inputValue)
      );
    });

    // Update state filteredData dengan hasil pencarian
    setFilteredData(filteredResult);

    // Set activePage kembali ke halaman pertama setelah melakukan pencarian
    setActivePage(1);
  };

  const customSort = (data, sortConfig) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.tanggalTransaksi);
      const dateB = new Date(b.tanggalTransaksi);

      const createdAtA = new Date(a.createdAt);
      const createdAtB = new Date(b.createdAt);

      if (dateA.getTime() !== dateB.getTime()) {
        return sortConfig.direction === "asc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortConfig.direction === "asc"
          ? createdAtB - createdAtA
          : createdAtA - createdAtB;
      }
    });
    return sortedData;
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return customSort(transaksi, sortConfig);
    }
    return [...transaksi];
  }, [transaksi, sortConfig]);

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
          <Container className="pt-2 pb-2">
            <Card.Title className="text-uppercase fw-bold pb-2 border-bottom">
              Penggunaan Uang Kas
            </Card.Title>
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
                      placeholder="Ketik untuk mencari data..."
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Table hover responsive size="sm">
              <thead className="table-light">
                <tr className="text-center table-info">
                  <th>No.</th>
                  <th>Tanggal Transaksi</th>
                  <th>Jenis Transaksi</th>
                  <th>Uraian</th>
                  <th>Nominal Transaksi</th>
                  <th colSpan={2} className="no-print">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((transaksi, index) => (
                  <tr className="text-center align-middle" key={index}>
                    <td>{index + startIndex}</td>
                    <td>{formatDate(transaksi.tanggalTransaksi)}</td>
                    <td>{transaksi.jenisTransaksi}</td>
                    <td className="text-start">{transaksi.keterangan}</td>
                    <td className="text-start">
                      {formatRupiah(parseFloat(transaksi.nominalTransaksi))}
                    </td>
                    <td className="no-print">
                      <Button
                        variant="warning"
                        onClick={() => handleModalShow("edit", transaksi)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="mx-1"
                        />
                        Edit
                      </Button>
                    </td>
                    <td className="no-print">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(transaksi.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="mx-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </Card>

        <Pagination>
          <Pagination.First onClick={goToFirstPage} />
          <Pagination.Prev onClick={goToPrevPage} />
          {[...Array(Math.ceil(transaksi.length / ITEMS_PER_PAGE))].map(
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

      <TransaksiTambahModal
        show={showTambah}
        onHide={() => handleModalClose("tambah")}
        saldoKas={saldoKas}
      />

      <TransaksiEditModal
        show={showEdit}
        onHide={() => handleModalClose("edit")}
        selectedRow={selectedRow}
        saldoKas={saldoKas}
      />
    </>
  );
}

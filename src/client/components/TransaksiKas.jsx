/* eslint-disable no-unused-vars */
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
import { TransaksiTambahModal } from "./TransaksiTambahModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import { TransaksiEditModal } from "./TransaksiEditModal";
import { fetchTransaksi } from "../utils/fetch";
import { formatDate, formatRupiah } from "../utils/format";
import { deleteTransaction } from "../utils/handle";

const ITEMS_PER_PAGE = 10;

export default function TransaksiKas() {
  const [transaksi, setTransaksi] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const handleDeleteWrapper = async (id) => {
    await deleteTransaction(id, setTransaksi);
  };

  const handleEdit = (transaksi) => {
    handleEdit(transaksi, setSelectedItem, setShowEdit);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const transactions = await fetchTransaksi();
      if (transactions) {
        setTransaksi(transactions);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(transaksi.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(transaksi.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = transaksi.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <>
      <Card>
        <Container className="pt-2 pb-2">
          <Card.Title className="text-uppercase fw-bold mb-2">
            Data Transaksi Kas
          </Card.Title>
          <hr className="mt-2 mb-2" />
          <Row className="mb-2">
            <Col>
              <Button className="no-print" onClick={() => setShowTambah(true)}>
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
                    onChange={(e) => setInput(e.target.value)}
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
              {currentEntries
                .filter((transaksi) => {
                  const inputString = input.toString().toLowerCase();
                  return (
                    (transaksi.tanggalTransaksi &&
                      transaksi.tanggalTransaksi
                        .toLowerCase()
                        .includes(inputString)) ||
                    (transaksi.jenisTransaksi &&
                      transaksi.jenisTransaksi
                        .toLowerCase()
                        .includes(inputString)) ||
                    (transaksi.keterangan &&
                      transaksi.keterangan
                        .toLowerCase()
                        .includes(inputString)) ||
                    (transaksi.nominalTransaksi &&
                      transaksi.nominalTransaksi
                        .toLowerCase()
                        .includes(inputString))
                  );
                })
                .map((transaksi, index) => (
                  <tr className="text-center align-middle" key={index}>
                    <td>{index + startIndex}</td>
                    <td>{formatDate(transaksi.tanggalTransaksi)}</td>
                    <td>{transaksi.jenisTransaksi}</td>
                    <td>{transaksi.keterangan}</td>
                    <td className="text-end">
                      {formatRupiah(parseFloat(transaksi.nominalTransaksi))}
                    </td>
                    <td className="no-print">
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(transaksi)}
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
                        onClick={() => handleDeleteWrapper(transaksi.id)}
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
      <div className="d-flex justify-content-center mt-2">
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
      </div>

      <TransaksiTambahModal
        show={showTambah}
        onHide={() => setShowTambah(false)}
      />

      {selectedItem && (
        <TransaksiEditModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          selectedTransaction={selectedItem}
        />
      )}
    </>
  );
}

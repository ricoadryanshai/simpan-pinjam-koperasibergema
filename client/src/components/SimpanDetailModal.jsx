/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Pagination, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { deleteSimpanan } from "../utils/handle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import { IMG_SERVER_PORT } from "../utils/server_port";

const ITEMS_PER_PAGE = 10;

export default function SimpanDetailModal(props) {
  const { show, onClose, rowData, modalData, updateModalData, clearModalData } =
    props;

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [headerData, setHeaderData] = React.useState({
    kodeAnggota: "",
    nama: "",
    tanggalDaftar: "",
    totalSaldo: "",
  });
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const handleClose = () => {
    onClose();
    clearModalData();
  };

  const handleDelete = (transactionToDelete) => {
    deleteSimpanan(
      rowData.kodeAnggota,
      transactionToDelete.id,
      modalData,
      setHeaderData,
      updateModalData,
      setIsDeleting,
      formatRupiah,
      headerData
    );
  };

  React.useEffect(() => {
    if (rowData) {
      const { kodeAnggota, nama, tanggalDaftar, totalSaldo } = rowData;
      setHeaderData({
        kodeAnggota,
        nama,
        tanggalDaftar: formatDate(tanggalDaftar),
        totalSaldo: formatRupiah(totalSaldo),
      });
    }
  }, [rowData]);

  const kodeRowData = rowData ? rowData.kodeAnggota : "";
  const namaRowData = rowData ? rowData.nama : "";
  const tanggalRowData = rowData ? rowData.tanggalDaftar : "";
  const saldoRowData = rowData ? rowData.totalSaldo : "";

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(modalData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(modalData.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = modalData.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase fw-bold">
            Detail Simpanan {namaRowData}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col sm={3} className="fw-bold">
                <Row>Kode Anggota</Row>
                <Row>Nama Anggota</Row>
                <Row>Tanggal Daftar</Row>
                <Row>Total Saldo</Row>
              </Col>
              <Col>
                <Row>{kodeRowData}</Row>
                <Row>{namaRowData}</Row>
                <Row>{formatDate(tanggalRowData)}</Row>
                <Row>{formatRupiah(saldoRowData)}</Row>
              </Col>
              <Col />
            </Row>
          </Container>
          <hr className="mt-2 mb-2" />
          <Row className="mb-2">
            <Col />
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
          <Table hover responsive size="sm">
            <thead className="table-info">
              <tr className="text-center align-middle fs-7">
                <th>No.</th>
                <th>Tanggal Transaksi</th>
                <th>Jenis Transaksi</th>
                <th>Nominal</th>
                <th>Bukti Transfer</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries
                .filter((transaction) => {
                  const inputString = input.toString().toLowerCase();
                  return (
                    (transaction.tanggalSimpan &&
                      transaction.tanggalSimpan
                        .toLowerCase()
                        .includes(inputString)) ||
                    (transaction.jenisSimpan &&
                      transaction.jenisSimpan
                        .toLowerCase()
                        .includes(inputString))
                  );
                })
                .map((transaction, index) => (
                  <tr className="text-center align-middle" key={index}>
                    <td>{index + startIndex}</td>
                    <td>{formatDate(transaction.tanggalSimpan)}</td>
                    <td>{transaction.jenisSimpan}</td>
                    <td
                      style={{
                        textAlign: "start",
                        color:
                          transaction.jenisSimpan === "Ambil Simpanan"
                            ? "red"
                            : "green",
                      }}
                    >
                      {formatRupiah(transaction.saldo)}
                    </td>
                    <td>
                      {transaction.uploadFile ? (
                        <img
                          src={`${IMG_SERVER_PORT}/${transaction.uploadFile}`}
                          alt="Bukti Transfer"
                          style={{ maxWidth: "50px", cursor: "pointer" }}
                        />
                      ) : (
                        <span>Tidak ada bukti transfer</span>
                      )}
                    </td>
                    <td>
                      <FontAwesomeIcon
                        onClick={() => handleDelete(transaction)}
                        disabled={isDeleting}
                        icon={faTrashCan}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First onClick={goToFirstPage} />
              <Pagination.Prev onClick={goToPrevPage} />
              {[...Array(Math.ceil(modalData.length / ITEMS_PER_PAGE))].map(
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
        </Modal.Body>
      </Modal>
    </>
  );
}

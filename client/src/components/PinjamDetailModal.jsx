/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Pagination, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { getPinjamByKodeAnggota } from "../utils/api";
import { FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

export const PinjamDetailModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const [fetchData, setFetchData] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const tanggalDaftar = selectedRow?.tanggalDaftar || "";
  const jumlahHutang = selectedRow?.jumlahHutang || "";
  const jumlahBayar = selectedRow?.jumlahBayar || "";
  const sisaHutang = jumlahHutang - jumlahBayar;

  const fetchedData = async (kodeAnggota) => {
    setFetchData(await getPinjamByKodeAnggota(kodeAnggota));
  };

  // const handleDelete = async (kodeAnggota, id) => {
  //   try {
  //     await deletePinjamByKodeAnggota(kodeAnggota, id);
  //     fetchedData();
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //   }
  // };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(fetchData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(fetchData.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = fetchData.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;

  React.useEffect(() => {
    fetchedData(kodeAnggota);
  }, [show, kodeAnggota]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      backdrop="static"
      keyboard={false}
      scrollable={true}
    >
      <Modal.Header closeButton className="text-uppercase fw-bold">
        Detail Pinjaman dan Pembayaran {nama}
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col sm={3} className="fw-bold">
              <Row>Kode Anggota</Row>
              <Row>Nama Anggota</Row>
              <Row>Tanggal Daftar</Row>
              <Row>Sisa Tagihan</Row>
            </Col>
            <Col>
              <Row>{kodeAnggota}</Row>
              <Row>{nama}</Row>
              <Row>{formatDate(tanggalDaftar)}</Row>
              <Row>{formatRupiah(sisaHutang)}</Row>
            </Col>
            <Col />
          </Row>
        </Container>
        <hr className="my-2" />
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
          <thead className="table-light">
            <tr className="text-center table-info">
              <th>No.</th>
              <th>Tanggal Transaksi</th>
              <th>Jenis Transaksi</th>
              <th>Angsuran</th>
              <th className="text-start">Angsuran Pokok</th>
              <th className="text-start">Angsuran Jasa</th>
              <th className="text-start">Total Angsuran</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries
              .filter((pinjam) => {
                const inputString = input.toString().toLowerCase();
                return (
                  (pinjam.tanggalTransaksi &&
                    pinjam.tanggalTransaksi
                      .toLowerCase()
                      .includes(inputString)) ||
                  (pinjam.jenisTransaksi &&
                    pinjam.jenisTransaksi.toLowerCase().includes(inputString))
                );
              })
              .map((detail, index) => (
                <tr key={detail.id} className="text-center">
                  <td>{index + startIndex}</td>
                  <td>{formatDate(detail.tanggalTransaksi)}</td>
                  <td>{detail.jenisTransaksi}</td>
                  <td>{detail.angsuran}</td>
                  <td
                    style={{
                      color:
                        detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                      textAlign: "start",
                    }}
                  >
                    {formatRupiah(detail.angsuranPokok)}
                  </td>
                  <td
                    style={{
                      color:
                        detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                      textAlign: "start",
                    }}
                  >
                    {formatRupiah(detail.angsuranJasa)}
                  </td>
                  <td
                    style={{
                      color:
                        detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                      textAlign: "start",
                    }}
                  >
                    {formatRupiah(detail.angsuranPerBulan)}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-2">
          <Pagination>
            <Pagination.First onClick={goToFirstPage} />
            <Pagination.Prev onClick={goToPrevPage} />
            {[...Array(Math.ceil(fetchData.length / ITEMS_PER_PAGE))].map(
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
  );
};

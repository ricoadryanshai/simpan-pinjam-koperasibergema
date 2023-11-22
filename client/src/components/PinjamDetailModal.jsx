/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Pagination, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import {
  deletePinjamByKodeAnggota,
  getPinjamByKodeAnggota,
} from "../utils/api";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

export const PinjamDetailModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const [pinjamDetail, setPinjamDetail] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const tanggalDaftar = selectedRow?.tanggalDaftar || "";
  const sisaHutang = selectedRow?.sisaHutang || "";

  const fetchPinjamData = async (kodeAnggota) => {
    try {
      const data = await getPinjamByKodeAnggota(kodeAnggota);

      if (Array.isArray(data) && data.length > 0) {
        setPinjamDetail(data);
      } else {
        setPinjamDetail(null); // Set pinjamDetail ke null jika data tidak ditemukan
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPinjamDetail(null); // Set pinjamDetail ke null jika terjadi error fetching data
    }
  };

  React.useEffect(() => {
    if (show) {
      fetchPinjamData(selectedRow?.kodeAnggota);
    }
  }, [show, selectedRow]);

  const handleDelete = async (kodeAnggota, id) => {
    try {
      await deletePinjamByKodeAnggota(id);
      await fetchPinjamData(kodeAnggota);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error deleting data:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(pinjamDetail.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(pinjamDetail.length / ITEMS_PER_PAGE))
    );
  };

  let currentEntries = [];

  if (pinjamDetail !== null) {
    const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
    const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;

    // Pastikan pinjamDetail memiliki nilai array sebelum melakukan slice
    if (Array.isArray(pinjamDetail)) {
      currentEntries = pinjamDetail.slice(indexOfFirstEntry, indexOfLastEntry);
    }
  }

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      keyboard={false}
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
              <th>Nominal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length === 0 || pinjamDetail === null ? (
              <>
                {currentEntries.length === 0 ? (
                  <tr className="text-center">Data tidak ditemukan</tr>
                ) : (
                  <tr>Array kosong</tr>
                )}
              </>
            ) : (
              <>
                {currentEntries
                  .filter((pinjam) => {
                    const inputString = input.toString().toLowerCase();
                    return (
                      (pinjam.tanggalTransaksi &&
                        pinjam.tanggalTransaksi
                          .toLowerCase()
                          .includes(inputString)) ||
                      (pinjam.jenisTransaksi &&
                        pinjam.jenisTransaksi
                          .toLowerCase()
                          .includes(inputString))
                    );
                  })
                  .map((detail, index) => (
                    <tr key={detail.id} className="text-center">
                      <td>{index + startIndex}</td>
                      <td>
                        {formatDate(
                          detail && detail.tanggalTransaksi
                            ? detail.tanggalTransaksi
                            : ""
                        )}
                      </td>
                      <td>
                        {detail && detail.jenisTransaksi
                          ? detail.jenisTransaksi
                          : ""}
                      </td>
                      <td>
                        {detail && detail.angsuran ? detail.angsuran : ""}
                      </td>
                      <td
                        className="text-start"
                        style={{
                          color:
                            detail.jenisTransaksi === "Pinjam"
                              ? "red"
                              : "green",
                        }}
                      >
                        {formatRupiah(
                          detail && detail.nominalTransaksi
                            ? detail.nominalTransaksi
                            : ""
                        )}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            handleDelete(detail.kodeAnggota, detail.id);
                            console.log(detail.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-2">
          <Pagination>
            <Pagination.First onClick={goToFirstPage} />
            <Pagination.Prev onClick={goToPrevPage} />
            {[
              ...Array(Math.ceil((pinjamDetail?.length || 0) / ITEMS_PER_PAGE)),
            ].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === activePage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={goToNextPage} />
            <Pagination.Last onClick={goToLastPage} />
          </Pagination>
        </div>
      </Modal.Body>
    </Modal>
  );
};

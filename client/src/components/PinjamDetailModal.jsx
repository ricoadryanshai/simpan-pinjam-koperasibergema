/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { getPinjamByKodeAnggota } from "../utils/api";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { PinjamPrintOut } from "./PinjamPrintOut";

export const PinjamDetailModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const [fetchData, setFetchData] = React.useState([]);
  const [input, setInput] = React.useState("");

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

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  React.useEffect(() => {
    fetchedData(kodeAnggota);
  }, [show, kodeAnggota]);
  return (
    <>
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
              <Col className="d-flex flex-row-reverse align-items-end">
                <FontAwesomeIcon
                  icon={faPrint}
                  onClick={handlePrint}
                  className="custom-icon-pointer flex-shrink-1"
                />
              </Col>
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
              {fetchData
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
                  <tr key={index} className="text-center">
                    <td>{index + 1}</td>
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
        </Modal.Body>
      </Modal>

      <PinjamPrintOut
        selectedRow={selectedRow}
        fetchData={fetchData}
        componentReference={componentRef}
      />
    </>
  );
};

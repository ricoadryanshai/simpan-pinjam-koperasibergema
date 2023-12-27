import React from "react";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { FaSearch } from "react-icons/fa";
import { IMG_SERVER_PORT } from "../utils/server_port";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { SimpanPrintOut } from "./SimpanPrintOut";

export default function SimpanDetailModal(props) {
  const { show, onClose, rowData, modalData, clearModalData } = props;

  const [, /* headerData */ setHeaderData] = React.useState({
    kodeAnggota: "",
    nama: "",
    tanggalDaftar: "",
    totalSaldo: "",
  });
  const [input, setInput] = React.useState("");

  const handleClose = () => {
    onClose();
    clearModalData();
  };

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        scrollable={true}
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
              <Col className="d-flex flex-row-reverse align-items-end flex-gap-1">
                <FontAwesomeIcon
                  icon={faFileExport}
                  className="custom-icon-pointer"
                />
                <FontAwesomeIcon
                  icon={faPrint}
                  onClick={handlePrint}
                  className="custom-icon-pointer"
                />
              </Col>
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
              </tr>
            </thead>
            <tbody>
              {modalData
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
                    <td>{index + 1}</td>
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
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <SimpanPrintOut
        rowData={rowData}
        componentReference={componentRef}
        modalData={modalData}
      />
    </>
  );
}

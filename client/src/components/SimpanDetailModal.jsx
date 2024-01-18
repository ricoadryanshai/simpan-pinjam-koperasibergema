import React from "react";
import { Col, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import { SimpanPrintOut } from "./SimpanPrintOut";
import SimpanExport from "./SimpanExport";
import { getSimpanAnggotaById } from "../utils/api";

export default function SimpanDetailModal(props) {
  const { show, onClose, rowData, clearModalData, fetchData } = props;

  const [, /* headerData */ setHeaderData] = React.useState({
    kodeAnggota: "",
    nama: "",
    tanggalDaftar: "",
    totalSaldo: "",
  });
  const [input, setInput] = React.useState("");
  const [modalData, setModalData] = React.useState([]);

  const fetchDetailData = async () => {
    try {
      const data = await getSimpanAnggotaById(rowData.kodeAnggota);
      setModalData(data);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    }
  };
  const handleClose = () => {
    onClose();
    clearModalData();
    fetchData();
  };

  // const handleDeleteClick = async (id) => {
  //   try {
  //     await deleteSimpan(rowData.kodeAnggota, id);
  //     fetchDetailData();
  //   } catch (error) {
  //     console.log("Deleting Error From Client-side:", error);
  //   }
  // };

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

  React.useEffect(() => {
    if (show) {
      fetchDetailData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const kodeRowData = rowData?.kodeAnggota || "-";
  const namaRowData = rowData?.nama || "-";
  const tanggalRowData = rowData?.tanggalDaftar || "-";
  const saldoRowData = rowData?.totalSaldo || 0;
  const saldoPenarikan = rowData?.bisaAmbil || 0;

  const tableRef = React.useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Simpanan_${kodeRowData}_${namaRowData}`,
    sheet: "Tabel Simpanan",
  });
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="lg"
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase fw-bold">
            Detail Simpanan {namaRowData}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="fw-bold">Kode Anggota</Col>
            <Col>{kodeRowData}</Col>
            <Col className="fw-bold">Total Simpanan</Col>
            <Col>{formatRupiah(saldoRowData)}</Col>
          </Row>
          <Row>
            <Col className="fw-bold">Nama Anggota</Col>
            <Col>{namaRowData}</Col>
            <Col className="fw-bold">Saldo Bisa di Ambil</Col>
            <Col>{formatRupiah(saldoPenarikan)}</Col>
          </Row>
          <Row>
            <Col className="fw-bold">Tanggal Bergabung</Col>
            <Col>{formatDate(tanggalRowData)}</Col>
            <Col />
            <Col />
            <Row>
              <Col />
              <Col />
              <Col />
              <Col className="d-flex justify-content-end gap-3">
                <FontAwesomeIcon
                  icon={faFileExport}
                  onClick={onDownload}
                  className="custom-icon-pointer"
                />
                <FontAwesomeIcon
                  icon={faPrint}
                  onClick={handlePrint}
                  className="custom-icon-pointer"
                />
              </Col>
            </Row>
          </Row>
          <hr className="my-2 border-2" />
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
                <th className="text-start">Nominal</th>
                {/* <th>Aksi</th> */}
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
                    {/* <td>
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="mx-1 custom-icon-pointer custom-color"
                        onClick={() => handleDeleteClick(transaction.id)}
                      />
                    </td> */}
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

      <SimpanExport
        tableReference={tableRef}
        modalData={modalData}
        kodeRowData={kodeRowData}
        namaRowData={namaRowData}
        tanggalRowData={tanggalRowData}
        saldoRowData={saldoRowData}
      />
    </>
  );
}

/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { getPengaturan, postPinjam } from "../utils/api";

export const PinjamProsesModal = (props) => {
  const {
    show,
    onHide,
    savedData,
    setShowPinjam,
    setModalProses,
    resetForm,
    fungsiLoad,
  } = props;

  const [fetchPengaturan, setFetchPengaturan] = React.useState([]);

  const kodeAnggota = savedData?.kodeAnggota || "";
  const nama = savedData?.nama || "";
  const tanggalTransaksi = formatDate(savedData?.tanggalTransaksi || "");
  const nominalTransaksi = parseFloat(savedData?.nominalTransaksi || 0);
  const angsuran = parseFloat(savedData?.angsuran || 1);
  const bungaAngsuran =
    fetchPengaturan.length > 0 ? fetchPengaturan[0]?.bungaAngsuran || 0 : 0;

  const biayaAngsuran = nominalTransaksi / angsuran;
  const jasaUang = nominalTransaksi * (bungaAngsuran / 100);
  const totalBayar = biayaAngsuran + jasaUang;

  const fetchedPengaturan = async () => {
    try {
      setFetchPengaturan(await getPengaturan());
    } catch (error) {
      console.log("Error fetching pengaturan: ", error);
    }
  };

  const handleProsesClick = () => {
    postPinjam(savedData)
      .then((result) => {
        console.log("Data berhasil ditambahkan:", result);
        setModalProses(false);
        setShowPinjam(false);
        resetForm();
        fungsiLoad();
      })
      .catch((error) => {
        console.error("Gagal menambahkan data:", error);
        alert("Gagal menambahkan data", error);
      });
  };

  React.useEffect(() => {
    fetchedPengaturan();
  }, [show]);
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Rincian Angsuran Pinjaman
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Row className="mb-1">
                <Col>Kode Anggota</Col>
                <Col>{kodeAnggota}</Col>
              </Row>
              <Row>
                <Col>Nama</Col>
                <Col>{nama}</Col>
              </Row>
            </Col>
            <Col>
              <Row className="mb-1">
                <Col>Tanggal Pinjam</Col>
                <Col>{tanggalTransaksi}</Col>
              </Row>
              <Row className="mb-1">
                <Col>Jumlah Pinjam</Col>
                <Col>{formatRupiah(nominalTransaksi)}</Col>
              </Row>
              <Row>
                <Col>Lama Pinjam</Col>
                <Col>{angsuran} Bulan</Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Table hover responsive size="sm">
              <thead className="table-info">
                <tr>
                  <th className="text-center">No.</th>
                  <th>Angsuran</th>
                  <th>Jasa Uang</th>
                  <th>Total Bayar</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(angsuran)].map((_, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{formatRupiah(biayaAngsuran)}</td>
                    <td>{formatRupiah(jasaUang)}</td>
                    <td>{formatRupiah(totalBayar)}</td>
                  </tr>
                ))}
                <tr className="fw-bold table-light">
                  <td className="text-center">Jumlah</td>
                  <td>{formatRupiah(angsuran * biayaAngsuran)}</td>
                  <td>{formatRupiah(angsuran * jasaUang)}</td>
                  <td>{formatRupiah(angsuran * totalBayar)}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProsesClick}>
            Proses
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

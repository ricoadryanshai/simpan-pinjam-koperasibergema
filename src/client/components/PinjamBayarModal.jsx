/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import {
  getBayarAngsuran,
  getBayarByKodeAnggota,
  postAngsuran,
  updateBayarAngsuran,
  updateLunasAngsuran,
} from "../utils/api";
import { formatDate, formatRupiah } from "../utils/format";

const today = new Date()
  .toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  .split(", ")[0];

export const PinjamBayarModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const [latestPinjam, setLatestPinjam] = React.useState(null);
  const [bayarPinjam, setBayarPinjam] = React.useState([]);

  const fetchLatestPinjam = async (kodeAnggota) => {
    try {
      const data = await getBayarByKodeAnggota(kodeAnggota);
      setLatestPinjam(data);
    } catch (error) {
      console.error("Error fetching latest pinjaman:", error);
      // Handle error fetching data
    }
  };
  React.useEffect(() => {
    if (show && selectedRow?.kodeAnggota) {
      fetchLatestPinjam(selectedRow.kodeAnggota);
    }
  }, [show, selectedRow]);

  const fetchBayarPinjam = async (idPinjam) => {
    try {
      if (idPinjam) {
        const data = await getBayarAngsuran(idPinjam);
        setBayarPinjam(data);
      }
    } catch (error) {
      console.error("Error fetching tagihan bayaran:", error);
    }
  };

  React.useEffect(() => {
    if (latestPinjam?.id) {
      fetchBayarPinjam(latestPinjam.id);
    }
  }, [latestPinjam]);

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";
  const nominalTransaksi = latestPinjam?.nominalTransaksi || "";
  const angsuran = latestPinjam?.angsuran || "";
  const tanggalTransaksi = latestPinjam?.tanggalTransaksi || "";

  const biayaAngsuran = nominalTransaksi / angsuran;
  const jasaUang = nominalTransaksi * 0.02;
  const totalBayar = biayaAngsuran + jasaUang;

  const handleBayarClick = async (id, totalBayar, index) => {
    try {
      const newBayarPinjam = {
        kodeAnggota: selectedRow?.kodeAnggota || "",
        jenisTransaksi: "Bayar",
        nominalTransaksi: totalBayar,
        angsuran: index,
        tanggalTransaksi: today,
      };

      await updateBayarAngsuran(id);
      await fetchBayarPinjam(latestPinjam?.id);
      await postAngsuran(newBayarPinjam);
    } catch (error) {
      console.error("Error updating tanggal bayar:", error);
    }
  };

  const handleLunasClick = async (idPinjam) => {
    try {
      const filteredBayarPinjam = bayarPinjam.filter(
        (bayar) => bayar.tanggalBayar === null || bayar.tanggalBayar === ""
      );

      // Cek isi dari filteredBayarPinjam
      console.log("Filtered Bayar Pinjam: ", filteredBayarPinjam);

      const totalBayarFiltered = filteredBayarPinjam.reduce(
        (total, bayar) => total + parseInt(bayar.totalBayar), // Jumlahkan nilai 'totalBayar', pastikan diubah menjadi tipe angka jika tidak berupa angka
        0 // Nilai awal untuk penghitungan
      );

      // Cek nilai dari totalBayarNullTanggal
      console.log("Total Bayar Null Tanggal: ", totalBayarFiltered);

      const newBayarPinjam = {
        kodeAnggota: selectedRow?.kodeAnggota || "",
        jenisTransaksi: "Bayar",
        nominalTransaksi: totalBayarFiltered,
        angsuran:
          filteredBayarPinjam.length > 1 ? filteredBayarPinjam.length - 1 : 0,
        tanggalTransaksi: today,
      };

      await updateLunasAngsuran(idPinjam);
      await fetchBayarPinjam(latestPinjam?.id);
      await postAngsuran(newBayarPinjam);
    } catch (error) {
      console.error("Error fungsi handleLunasClick: ", error);
    }
  };

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
          <Modal.Title className="text-uppercase fw-bold">
            Bayar Pinjaman {nama}
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
                <Col>{formatDate(tanggalTransaksi)}</Col>
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
          <Table hover responsive size="sm">
            <thead className="table-info">
              <tr>
                <th className="text-center">No.</th>
                <th>Angsuran</th>
                <th>Jasa Uang</th>
                <th>Total Bayar</th>
                <th className="text-center">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody>
              {bayarPinjam.map((bayar, index) => (
                <tr className="align-middle" key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{formatRupiah(bayar.uangAngsuran)}</td>
                  <td>{formatRupiah(bayar.jasaUang)}</td>
                  <td>{formatRupiah(bayar.totalBayar)}</td>
                  <td className="text-center">
                    {bayar.tanggalBayar ? (
                      formatDate(bayar.tanggalBayar)
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleBayarClick(
                              bayar.id,
                              bayar.totalBayar,
                              index + 1
                            )
                          }
                        >
                          Bayar
                        </Button>
                        <Button
                          variant="success"
                          className="ms-2"
                          onClick={() => handleLunasClick(bayar.idPinjam)}
                        >
                          Lunas
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold table-light align-middle">
                <td className="text-center">Jumlah</td>
                <td>{formatRupiah(angsuran * biayaAngsuran)}</td>
                <td>{formatRupiah(angsuran * jasaUang)}</td>
                <td>{formatRupiah(angsuran * totalBayar)}</td>
                <td className="text-center"></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

/* eslint-disable react/prop-types */
import React from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import {
  getBayarAngsuran,
  getBayarByKodeAnggota,
  getPengaturan,
  postAngsuran,
  updateBayarAngsuran,
  updateLunasAngsuran,
} from "../utils/api";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

export const PinjamBayarModal = (props) => {
  const { show, onHide, selectedRow } = props;

  const kodeAnggota = selectedRow?.kodeAnggota || "";
  const nama = selectedRow?.nama || "";

  const [fetchBayar, setFetchBayar] = React.useState([]);

  const fetchedBayar = async (kodeAnggota) => {
    try {
      const data = await getBayarByKodeAnggota(kodeAnggota);
      setFetchBayar(data);
    } catch (error) {
      console.log("Error fetching data bayar: ", error);
    }
  };

  React.useEffect(() => {
    if (show) {
      fetchedBayar(kodeAnggota);
    }
  }, [show, kodeAnggota]);

  const idPinjam = fetchBayar[0]?.id || "";
  const tanggalTransaksi = fetchBayar[0]?.tanggalTransaksi || "";
  const nominalTransaksi = fetchBayar[0]?.angsuranPokok || "";
  const angsuran = fetchBayar[0]?.angsuran || "";

  const [fetchTagihan, setFetchTagihan] = React.useState([]);

  const fetchedTagihan = async (idPinjam) => {
    try {
      const data = await getBayarAngsuran(idPinjam);
      setFetchTagihan(data);
    } catch (error) {
      console.log("Error fetching data tagihan: ", error);
    }
  };

  React.useEffect(() => {
    if (show) {
      if (idPinjam !== "" || idPinjam !== null) {
        fetchedTagihan(idPinjam);
      }
    }
  }, [show, idPinjam]);

  const [pengaturan, setPengaturan] = React.useState([]);

  const fetchedPengaturan = async () => {
    try {
      const data = await getPengaturan();
      setPengaturan(data);
    } catch (error) {
      console.log("Error fetching pengaturan data: ", error);
    }
  };

  React.useEffect(() => {
    if (show) {
      fetchedPengaturan();
    }
  }, [show]);

  const persenAngsuran = pengaturan[0]?.bungaAngsuran || "";
  const angsuranPokok = nominalTransaksi / angsuran;
  const angsuranJasa = nominalTransaksi * (persenAngsuran / 100);
  const angsuranPerBulan = angsuranPokok + angsuranJasa;

  const handleBayarClick = async (tagihan, index) => {
    try {
      const inputTagihan = {
        kodeAnggota: kodeAnggota,
        jenisTransaksi: "Bayar",
        angsuran: index,
        tanggalTransaksi: formattedDate,
        angsuranPokok: tagihan.uangAngsuran,
        angsuranJasa: tagihan.jasaUang,
        angsuranPerBulan: tagihan.totalBayar,
      };

      await updateBayarAngsuran(tagihan.id);
      await postAngsuran(inputTagihan);
      await fetchedTagihan(idPinjam);
    } catch (error) {
      console.log("Error handle pembayaran angsuran: ", error);
    }
  };

  const handleLunasClick = async (tagihan, index) => {
    try {
      const filteredBayarPinjam = fetchTagihan.filter(
        (bayar) => bayar.tanggalBayar === null || bayar.tanggalBayar === ""
      );

      const totalUangAngsuran = filteredBayarPinjam.reduce(
        (total, bayar) => total + parseFloat(bayar.uangAngsuran || 0), // Jumlahkan nilai 'uangAngsuran'
        0 // Nilai awal untuk penghitungan
      );

      const totalJasaUang = filteredBayarPinjam.reduce(
        (total, bayar) => total + parseFloat(bayar.jasaUang || 0), // Jumlahkan nilai 'jasaUang'
        0 // Nilai awal untuk penghitungan
      );
      const totalBayarFiltered = filteredBayarPinjam.reduce(
        (total, bayar) => total + parseFloat(bayar.totalBayar || 0), // Jumlahkan nilai 'totalBayar', pastikan diubah menjadi tipe angka jika tidak berupa angka
        0 // Nilai awal untuk penghitungan
      );

      const inputTagihan = {
        kodeAnggota: kodeAnggota,
        jenisTransaksi: "Bayar",
        angsuran: index,
        tanggalTransaksi: formattedDate,
        angsuranPokok: totalUangAngsuran.toFixed(2),
        angsuranJasa: totalJasaUang.toFixed(2),
        angsuranPerBulan: totalBayarFiltered.toFixed(2),
      };

      await updateLunasAngsuran(tagihan.idPinjam);
      await postAngsuran(inputTagihan);
      await fetchedTagihan(idPinjam);
    } catch (error) {
      console.log("Error handle pelunasan: ", error);
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
        scrollable={true}
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
          <Table hover responsive size="sm">
            <thead className="table-info">
              <tr>
                <th className="text-center">No.</th>
                <th>Angsuran Pokok</th>
                <th>Angsuran Jasa</th>
                <th>Angsuran/Bulan</th>
                <th className="text-center">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody>
              {fetchTagihan.map((tagihan, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td>{formatRupiah(tagihan.uangAngsuran)}</td>
                  <td>{formatRupiah(tagihan.jasaUang)}</td>
                  <td>{formatRupiah(tagihan.totalBayar)}</td>
                  <td className="text-center">
                    {tagihan.tanggalBayar ? (
                      formatDate(tagihan.tanggalBayar)
                    ) : (
                      <>
                        <div className="d-flex flex-gap-1 justify-content-center">
                          <Button
                            variant="primary"
                            onClick={() => handleBayarClick(tagihan, index + 1)}
                          >
                            Bayar
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleLunasClick(tagihan, index + 1)}
                          >
                            Lunas
                          </Button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold table-light align-middle">
                <td className="text-center">Jumlah</td>
                <td>{formatRupiah(angsuran * angsuranPokok)}</td>
                <td>{formatRupiah(angsuran * angsuranJasa)}</td>
                <td>{formatRupiah(angsuran * angsuranPerBulan)}</td>
                <td />
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

import React from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";
import { getPengaturan, postPinjam } from "../utils/api";

export const PinjamProsesModal = (props) => {
  const { show, onHide, savedData, closeAllModal } = props;

  const [fetchPengaturan, setFetchPengaturan] = React.useState([]);

  const kodeAnggota = savedData?.kodeAnggota || "";
  const nama = savedData?.nama || "";
  const tanggalTransaksi = savedData?.tanggalTransaksi || "";
  const nominalTransaksi = parseFloat(savedData?.nominalTransaksi || 0);
  const angsuran = parseFloat(savedData?.angsuran || 1);

  const bungaAngsuran = fetchPengaturan.bungaAngsuran || 0;
  const angsuranPokok = nominalTransaksi / angsuran;
  const angsuranJasa = nominalTransaksi * (bungaAngsuran / 100);
  const angsuranPerBulan = angsuranPokok + angsuranJasa;

  const jumlahAngsuranPokok = angsuran * angsuranPokok;
  const jumlahAngsuranJasa = angsuran * angsuranJasa;
  const jumlahAngsuranPerBulan = angsuran * angsuranPerBulan;

  const fetchedPengaturan = async () => {
    try {
      setFetchPengaturan(await getPengaturan());
    } catch (error) {
      console.log("Error fetching pengaturan: ", error);
    }
  };

  const handleProsesClick = async () => {
    const newPinjam = {
      kodeAnggota: kodeAnggota,
      jenisTransaksi: "Pinjam",
      angsuran: angsuran,
      tanggalTransaksi: tanggalTransaksi,
      angsuranPokok: jumlahAngsuranPokok,
      angsuranJasa: jumlahAngsuranJasa,
      angsuranPerBulan: jumlahAngsuranPerBulan,
    };

    try {
      await postPinjam(newPinjam);
      closeAllModal();
    } catch (error) {
      console.log("Error submiting loan: ", error);
    }
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
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Rincian Angsuran Pinjaman
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="fw-bold">Kode Anggota</Col>
            <Col>{kodeAnggota}</Col>
            <Col className="fw-bold">Tanggal Pinjam</Col>
            <Col>{formatDate(tanggalTransaksi)}</Col>
          </Row>
          <Row>
            <Col className="fw-bold">Nama</Col>
            <Col>{nama}</Col>
            <Col className="fw-bold">Jumlah Pinjam</Col>
            <Col>{formatRupiah(nominalTransaksi)}</Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col className="fw-bold">Lama Pinjam</Col>
            <Col>{angsuran} Bulan</Col>
          </Row>
          <hr className="my-2 border-2" />
          <Row>
            <Table hover responsive size="sm">
              <thead className="table-info">
                <tr>
                  <th className="text-center">No.</th>
                  <th>Angsuran Pokok</th>
                  <th>Angsuran Jasa</th>
                  <th>Angsuran/Bulan</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(angsuran)].map((_, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{formatRupiah(angsuranPokok)}</td>
                    <td>{formatRupiah(angsuranJasa)}</td>
                    <td>{formatRupiah(angsuranPerBulan)}</td>
                  </tr>
                ))}
                <tr className="fw-bold table-light">
                  <td className="text-center">Jumlah</td>
                  <td>{formatRupiah(jumlahAngsuranPokok)}</td>
                  <td>{formatRupiah(jumlahAngsuranJasa)}</td>
                  <td>{formatRupiah(jumlahAngsuranPerBulan)}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleProsesClick()}>
            Pinjam
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

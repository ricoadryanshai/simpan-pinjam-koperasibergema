// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { getPinjamAnggota } from "../utils/api";
import { PinjamDetailModal } from "./PinjamDetailModal";
// import { PinjamTambahModal } from "./PinjamTambahModal";
// import { PinjamBayarModal } from "./PinjamBayarModal";

export default function PinjamTable() {
  const [pinjamData, setPinjamData] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  // const [showPinjam, setShowPinjam] = useState(false);
  // const [showBayar, setShowBayar] = useState(false);

  const handleDetailClick = () => {
    setShowDetail(true);
  };

  useEffect(() => {
    const getPinjam = async () => {
      const respon = await getPinjamAnggota();
      setPinjamData(respon);
    };
    getPinjam();
  }, []);
  return (
    <>
      <Container fluid style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <Row>
          <Col />
          <Col sm={7}>
            <Card>
              <Card.Header>
                <Card.Title className="fw-bold text-uppercase mt-2">
                  Data Pinjaman Anggota
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table hover borderless responsive size="sm">
                  <thead>
                    <tr className="text-center align-middle fs-7">
                      <th>No.</th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Kode Anggota
                      </th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Nama
                      </th>
                      <th style={{ borderInline: "solid 1px lightgray" }}>
                        Pinjaman Perlu Dibayar
                      </th>
                      <th colSpan={3}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pinjamData.map((pinjam, index) => (
                      <tr
                        style={{ borderBlockStart: "solid 1px lightgray" }}
                        className="align-middle"
                        key={index}
                      >
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td style={{ borderInline: "solid 1px lightgray" }}>
                          {pinjam.kodeAnggota}
                        </td>
                        <td>{pinjam.nama}</td>
                        <td
                          style={{
                            textAlign: "end",
                            borderInline: "solid 1px lightgray",
                          }}
                        >
                          {formatRupiah(pinjam.sisaHutang)}
                        </td>
                        <td>
                          <Button
                            variant="secondary"
                            onClick={handleDetailClick}
                          >
                            Detail
                          </Button>
                        </td>
                        <td>
                          <Button variant="warning">Pinjam</Button>
                        </td>
                        <td>
                          {pinjam.sisaHutang > 0 ? (
                            <Button variant="success">Bayar</Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col />
        </Row>
      </Container>

      <PinjamDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
      />
      {/* <PinjamTambahModal /> */}
      {/* <PinjamBayarModal /> */}
    </>
  );

  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp. 0,00";
    }

    // Format angka dengan koma sebagai pemisah ribuan dan dua digit desimal
    const formattedAngka = angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });

    return formattedAngka;
  }
}

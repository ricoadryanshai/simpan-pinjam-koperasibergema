import React from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { PinjamDetailModal } from "./PinjamDetailModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { formatRupiah } from "../utils/format";
import { fetchPinjaman } from "../utils/fetch";
import { PinjamTambahModal } from "./PinjamTambahModal";
import { PinjamBayarModal } from "./PinjamBayarModal";

export default function PinjamTable() {
  const [pinjamData, setPinjamData] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showPinjam, setShowPinjam] = React.useState(false);
  const [showBayar, setShowBayar] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [input, setInput] = React.useState("");

  const handleDetailClick = (pinjam) => {
    setSelectedRow(pinjam);
    setShowDetail(true);
  };

  const handlePinjamClick = (pinjam) => {
    setSelectedRow(pinjam);
    setShowPinjam(true);
  };

  const handleBayarClick = (pinjam) => {
    setSelectedRow(pinjam);
    setShowBayar(true);
  };

  const handleModalClose = (modalType) => {
    setSelectedRow(null);
    switch (modalType) {
      case "detail":
        setShowDetail(false);
        break;
      case "pinjam":
        setShowPinjam(false);
        break;
      case "bayar":
        setShowBayar(false);
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    fetchPinjaman(setPinjamData);
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
                  <Row>
                    <Col>Data Pinjaman Anggota</Col>
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
                    {pinjamData
                      .filter((pinjam) => {
                        const inputString = input.toString().toLowerCase();
                        return (
                          (pinjam.kodeAnggota &&
                            pinjam.kodeAnggota
                              .toLowerCase()
                              .includes(inputString)) ||
                          (pinjam.nama &&
                            pinjam.nama.toLowerCase().includes(inputString))
                        );
                      })
                      .map((pinjam, index) => (
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
                              onClick={() => handleDetailClick(pinjam)}
                            >
                              Detail
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={() => handlePinjamClick(pinjam)}
                            >
                              Pinjam
                            </Button>
                          </td>
                          <td>
                            {pinjam.sisaHutang > 0 ? (
                              <Button
                                variant="success"
                                onClick={() => handleBayarClick(pinjam)}
                              >
                                Bayar
                              </Button>
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
        onHide={() => handleModalClose("detail")}
        selectedRow={selectedRow}
      />
      <PinjamTambahModal
        show={showPinjam}
        onHide={() => handleModalClose("pinjam")}
        selectedRow={selectedRow}
      />
      <PinjamBayarModal
        show={showBayar}
        onHide={() => handleModalClose("bayar")}
        selectedRow={selectedRow}
      />
    </>
  );
}

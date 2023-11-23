import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { PinjamDetailModal } from "./PinjamDetailModal";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import { formatRupiah } from "../utils/format";
import { PinjamTambahModal } from "./PinjamTambahModal";
import { PinjamBayarModal } from "./PinjamBayarModal";
import { getPinjamAnggota } from "../utils/api";

const ITEMS_PER_PAGE = 10;

export default function PinjamTable() {
  const [pinjamData, setPinjamData] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showPinjam, setShowPinjam] = React.useState(false);
  const [showBayar, setShowBayar] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [activePage, setActivePage] = React.useState(1);

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
    switch (modalType) {
      case "detail":
        setShowDetail(false);
        fungsiLoad();
        break;
      case "pinjam":
        setShowPinjam(false);
        fungsiLoad();
        break;
      case "bayar":
        setShowBayar(false);
        fungsiLoad();
        break;
      default:
        break;
    }
  };

  const fungsiLoad = async () => {
    const data = await getPinjamAnggota();
    if (data) {
      setPinjamData(data);
    } else {
      console.log("Error fungsiLoad() di PinjamTable.jsx");
    }
  };

  React.useEffect(() => {
    fungsiLoad();
  }, []);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(Math.ceil(pinjamData.length / ITEMS_PER_PAGE));
  };

  const goToPrevPage = () => {
    setActivePage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setActivePage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(pinjamData.length / ITEMS_PER_PAGE))
    );
  };

  const indexOfLastEntry = activePage * ITEMS_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ITEMS_PER_PAGE;
  const currentEntries = pinjamData.slice(indexOfFirstEntry, indexOfLastEntry);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card>
          <Container className="py-2">
            <Card.Title className="fw-bold text-uppercase mb-2">
              Data Pinjaman Anggota
            </Card.Title>
            <hr className="mt-2 mb-2" />
            <Row className="mb-2">
              <Col />
              <Col>
                <div className="search-bar-container">
                  <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input
                      placeholder="Ketika untuk mencari data..."
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
                  <th>Kode Anggota</th>
                  <th>Nama</th>
                  <th>Sisa Tagihan</th>
                  <th colSpan={2}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries
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
                    <tr key={index} className="text-center align-middle">
                      <td>{index + startIndex}</td>
                      <td>{pinjam.kodeAnggota}</td>
                      <td className="text-start">{pinjam.nama}</td>
                      <td className="text-start">
                        {formatRupiah(pinjam.sisaHutang)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="secondary"
                          onClick={() => handleDetailClick(pinjam)}
                        >
                          Detail
                        </Button>
                      </td>
                      <td className="text-center">
                        {pinjam.sisaHutang <= 0 ? (
                          <Button
                            variant="warning"
                            onClick={() => handlePinjamClick(pinjam)}
                          >
                            Pinjam
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={() => handleBayarClick(pinjam)}
                          >
                            Bayar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Container>
        </Card>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <Pagination>
          <Pagination.First onClick={goToFirstPage} />
          <Pagination.Prev onClick={goToPrevPage} />
          {[...Array(Math.ceil(pinjamData.length / ITEMS_PER_PAGE))].map(
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === activePage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
          <Pagination.Next onClick={goToNextPage} />
          <Pagination.Last onClick={goToLastPage} />
        </Pagination>
      </div>

      <PinjamDetailModal
        show={showDetail}
        onHide={() => handleModalClose("detail")}
        selectedRow={selectedRow}
      />
      <PinjamTambahModal
        show={showPinjam}
        onHide={() => handleModalClose("pinjam")}
        selectedRow={selectedRow}
        setShowPinjam={setShowPinjam}
        setSelectedRow={setSelectedRow}
        fungsiLoad={fungsiLoad}
      />
      <PinjamBayarModal
        show={showBayar}
        onHide={() => handleModalClose("bayar")}
        selectedRow={selectedRow}
      />
    </>
  );
}

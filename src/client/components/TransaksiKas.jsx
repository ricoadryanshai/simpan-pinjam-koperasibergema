import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { TransaksiTambahModal } from "./TransaksiTambahModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { deleteTransaksi } from "../utils/api";
import { TransaksiEditModal } from "./TransaksiEditModal";
import { fetchTransaksi } from "../utils/fetch";
import { formatDate } from "../utils/format";

export default function TransaksiKas() {
  const [transaksi, setTransaksi] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState(null);

  const formatRupiah = (angka) => {
    if (typeof angka !== "number") {
      return "Rp 0,00";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(angka);
  };

  const handleDelete = async (transaksiId) => {
    try {
      await deleteTransaksi(transaksiId);
      // Update state to reflect the changes
      setTransaksi((prevTransaksi) =>
        prevTransaksi.filter((item) => item.id !== transaksiId)
      );
      console.log("Data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error.message);
      // Handle error, e.g., show a notification to the user
    }
  };

  const handleEditClick = (transaksi) => {
    setSelectedTransaction(transaksi);
    setShowEdit(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const transactions = await fetchTransaksi();
      if (transactions) {
        setTransaksi(transactions);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card>
        <Container>
          <h4 className="mt-2 text-uppercase fw-bold">Data Transaksi Kas</h4>
          <hr className="mt-2 mb-2" />
          <Button className="mb-2 no-print" onClick={() => setShowTambah(true)}>
            Tambah Transaksi
            <FontAwesomeIcon
              icon={faSquarePlus}
              size="lg"
              style={{ marginInlineStart: "0.2rem" }}
            />
          </Button>
          <Table hover responsive size="sm">
            <thead className="table-light">
              <tr className="text-center table-info">
                <th>No.</th>
                <th>Tanggal Transaksi</th>
                <th>Jenis Transaksi</th>
                <th>Uraian</th>
                <th>Nominal Transaksi</th>
                <th colSpan={2} className="no-print">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((transaksi, index) => (
                <tr className="text-center align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{formatDate(transaksi.tanggalTransaksi)}</td>
                  <td>{transaksi.jenisTransaksi}</td>
                  <td>{transaksi.keterangan}</td>
                  <td className="text-end">
                    {formatRupiah(parseFloat(transaksi.nominalTransaksi))}
                  </td>
                  <td className="no-print">
                    <Button
                      variant="warning"
                      onClick={() => handleEditClick(transaksi)}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ marginInlineEnd: "0.2rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                  <td className="no-print">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(transaksi.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        style={{ marginInlineEnd: "0.2rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Card>

      <TransaksiTambahModal
        show={showTambah}
        onHide={() => setShowTambah(false)}
      />

      {selectedTransaction && (
        <TransaksiEditModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          selectedTransaction={selectedTransaction}
        />
      )}
    </>
  );
}

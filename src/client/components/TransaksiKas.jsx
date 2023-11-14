import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { TransaksiTambahModal } from "./TransaksiTambahModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { deleteTransaksi, getTransaksi } from "../utils/api";

export default function TransaksiKas() {
  const [transaksi, setTransaksi] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);

  function formatDate(inputDate) {
    if (!inputDate || inputDate.trim() === "") {
      return "";
    }

    // Memisahkan tahun, bulan, dan tanggal dari string input
    const [year, month, day] = inputDate.split("/");

    // Membuat objek Date dengan format yang diterima oleh Date constructor (YYYY, MM, DD)
    const formattedDate = new Date(year, month - 1, day);

    // Mendapatkan tanggal, bulan, dan tahun dengan metode Date
    const dayFormatted = formattedDate.getDate();
    const monthFormatted = formattedDate.getMonth() + 1; // Ingat: bulan dimulai dari 0
    const yearFormatted = formattedDate.getFullYear();

    // Menggabungkan kembali dalam format "dd-mm-yyyy"
    const result = `${dayFormatted < 10 ? "0" : ""}${dayFormatted}/${
      monthFormatted < 10 ? "0" : ""
    }${monthFormatted}/${yearFormatted}`;

    return result;
  }

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

  React.useEffect(() => {
    getTransaksi().then((res) => {
      setTransaksi(res);
    });
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
                    <Button variant="warning">
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
    </>
  );
}

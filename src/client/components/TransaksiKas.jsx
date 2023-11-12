/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";

export default function TransaksiKas(props) {
  const { dataTransaksi } = props;

  return (
    <>
      <Card>
        <Container>
          <h4 className="mt-2 text-uppercase fw-bold">Data Transaksi Kas</h4>
          <hr className="mt-2 mb-2" />
          <Button className="mb-2">Tambah Transaksi</Button>
          <Table hover responsive size="sm">
            <thead className="table-light">
              <tr className="text-center table-info">
                <th>No.</th>
                <th>Tanggal Transaksi</th>
                <th>Jenis Transaksi</th>
                <th>Uraian</th>
                <th>Nominal Transaksi</th>
                <th colSpan={2}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataTransaksi.map((transaksi, index) => (
                <tr className="text-center align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{formatDate(transaksi.tanggalTransaksi)}</td>
                  <td>{transaksi.jenisTransaksi}</td>
                  <td>{transaksi.keterangan}</td>
                  <td className="text-end">
                    {formatRupiah(parseFloat(transaksi.nominalTransaksi))}
                  </td>
                  <td>
                    <Button variant="warning">Edit</Button>
                  </td>
                  <td>
                    <Button variant="danger">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Card>
    </>
  );
  function formatDate(inputDate) {
    // Memisahkan tahun, bulan, dan tanggal dari string input
    const [year, month, day] = inputDate.split("-");

    // Membuat objek Date dengan format yang diterima oleh Date constructor (YYYY, MM, DD)
    const formattedDate = new Date(year, month - 1, day);

    // Mendapatkan tanggal, bulan, dan tahun dengan metode Date
    const dayFormatted = formattedDate.getDate();
    const monthFormatted = formattedDate.getMonth() + 1; // Ingat: bulan dimulai dari 0
    const yearFormatted = formattedDate.getFullYear();

    // Menggabungkan kembali dalam format "dd-mm-yyyy"
    const result = `${dayFormatted < 10 ? "0" : ""}${dayFormatted}-${
      monthFormatted < 10 ? "0" : ""
    }${monthFormatted}-${yearFormatted}`;

    return result;
  }

  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp 0,00";
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

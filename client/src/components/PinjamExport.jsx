import React from "react";
import { formatDate, formatNumber } from "../utils/format";

const PinjamExport = ({
  tableReference,
  fetchData,
  kodeAnggota,
  nama,
  tanggalDaftar,
  sisaHutang,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <td colSpan={2}>{kodeAnggota ? "Kode Anggota" : ""}</td>
          <td>{kodeAnggota ? kodeAnggota : ""}</td>
        </tr>
        <tr>
          <td colSpan={2}>Nama</td>
          <td>{nama}</td>
        </tr>
        <tr>
          <td colSpan={2}>Tanggal Bergabung</td>
          <td>{formatDate(tanggalDaftar)}</td>
        </tr>
        <tr>
          <td colSpan={2}>Tagihan Pinjaman</td>
          <td>{formatNumber(sisaHutang)}</td>
        </tr>
        <tr />
        <tr>
          <th>No.</th>
          <th>Tanggal Transaksi</th>
          <th>Jenis Transaksi</th>
          <th>Angsuran</th>
          <th>Angsuran Pokok</th>
          <th>Angsuran Jasa</th>
          <th>Total Angsuran</th>
        </tr>
      </thead>
      <tbody>
        {fetchData
          .sort(
            (a, b) =>
              new Date(a.tanggalTransaksi) - new Date(b.tanggalTransaksi)
          )
          .map((detail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{detail.tanggalTransaksi}</td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {detail.jenisTransaksi}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {detail.angsuran}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatNumber(detail.angsuranPokok)}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatNumber(detail.angsuranJasa)}
              </td>
              <td
                style={{
                  color: detail.jenisTransaksi === "Pinjam" ? "red" : "green",
                }}
              >
                {formatNumber(detail.angsuranPerBulan)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PinjamExport;

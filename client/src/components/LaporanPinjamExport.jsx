import React from "react";
import { formatNumber } from "../utils/format";

const LaporanPinjamExport = ({
  tableReference,
  lapByYear,
  totalAngsuranPokok,
  totalAngsuranJasa,
  totalJumlahAngsuran,
  selectedYear,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={13}>
            Laporan Angsuran Pinjaman Tahun{" "}
            {selectedYear ? selectedYear - 2 : "..."} SD{" "}
            {selectedYear ? selectedYear : "..."}
          </th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>Tanggal Pinjam</th>
          <th>Jumlah Pinjaman</th>
          <th>Jumlah Angsuran</th>
          <th>Jasa</th>
          <th>Angsuran Pokok</th>
          <th>Angsuran Jasa</th>
          <th>Angsuran/Bulan</th>
          <th>Jumlah Angsuran Pokok</th>
          <th>Jumlah Angsuran Jasa</th>
          <th>Total Angsuran</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {lapByYear.map((laporan, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{laporan.nama}</td>
            <td>{laporan.tanggalTransaksi}</td>
            <td>{formatNumber(laporan.nominalPinjam)}</td>
            <td>{laporan.angsuran}</td>
            <td>{formatNumber(laporan.nominalJasa)}</td>
            <td>{formatNumber(laporan.angsuranPokok)}</td>
            <td>{formatNumber(laporan.angsuranJasa)}</td>
            <td>{formatNumber(laporan.angsuranPerBulan)}</td>
            <th>{formatNumber(laporan.bayarAngsuranPokok)}</th>
            <th>{formatNumber(laporan.bayarAngsuranJasa)}</th>
            <th>{formatNumber(laporan.bayarTagihan)}</th>
            <th
              style={{
                color: laporan.statusPinjaman === "Lunas" ? "green" : "red",
              }}
            >
              {laporan.statusPinjaman}
            </th>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={9}>Jumlah Bayar Angsuran</th>
          <th>{formatNumber(totalAngsuranPokok)}</th>
          <th>{formatNumber(totalAngsuranJasa)}</th>
          <th>{formatNumber(totalJumlahAngsuran)}</th>
        </tr>
      </tfoot>
    </table>
  );
};

export default LaporanPinjamExport;

import React from "react";
import { formatNumber } from "../utils/format";

const LaporanKasExport = ({
  tableReference,
  selectedYear,
  transaksiKas,
  jumlahNominalAllRows,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={4}>
            Laporan Pengeluaran Koperasi Bergema {selectedYear}
          </th>
        </tr>
        <tr>
          <th colSpan={4}>Kelurahan Gandaria Selatan</th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Uraian</th>
          <th>Tanggal Transaksi</th>
          <th>Nominal</th>
        </tr>
      </thead>
      <tbody>
        {transaksiKas.map((kas, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{kas.keterangan}</td>
            <td>{kas.tanggalTransaksi}</td>
            <td>{formatNumber(kas.nominalTransaksi)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={3}>
            Jumlah Pengeluaran Tahun Ini {selectedYear ? selectedYear : "..."}
          </th>
          <th>{formatNumber(jumlahNominalAllRows)}</th>
        </tr>
      </tfoot>
    </table>
  );
};

export default LaporanKasExport;

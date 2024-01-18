import React from "react";
import { formatNumber } from "../utils/format";

const LaporanSHUExport = ({
  tableReference,
  selectedYear,
  lapSHUByYear,
  keanggotaan,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={3}>Laporan Pembagian SHU Tahun {selectedYear}</th>
        </tr>
        <tr>
          <th colSpan={3}>Kelurahan Gandaria Selatan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th colSpan={2}>Pendapatan Angsuran Jasa Tahun Ini</th>
          <td>{formatNumber(lapSHUByYear.pendapatanAngsuran)}</td>
        </tr>
        <tr>
          <th colSpan={2}>Pengeluaran Kas Tahun Ini</th>
          <td>{formatNumber(lapSHUByYear.pengeluaranKas)}</td>
        </tr>
        <tr>
          <th colSpan={2}>Profit Tahun Ini</th>
          <td>{formatNumber(lapSHUByYear.pendapatanJasa)}</td>
        </tr>
        <tr />
        {keanggotaan.map((anggota, index) => (
          <tr key={index}>
            <th>{anggota.jenisSHU}</th>
            <td>{anggota.persentaseSHU}%</td>
            <td>
              {selectedYear
                ? formatNumber(
                    (anggota.persentaseSHU / 100) * lapSHUByYear.pendapatanJasa
                  )
                : formatNumber(0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LaporanSHUExport;

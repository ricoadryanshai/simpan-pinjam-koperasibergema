import React from "react";
import { formatNumber } from "../utils/format";

const LaporanSHUExport = ({
  tableReference,
  lapSHUByYear,
  selectedYear,
  keanggotaan,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={3}>
            Laporan Pembagian SHU Tahun {selectedYear ? selectedYear : "..."}
          </th>
        </tr>
        <tr>
          <th colSpan={3}>Kelurahan Gandaria Selatan</th>
        </tr>
        <tr />
      </thead>
      <tbody>
        <tr>
          <th colSpan={2}>
            Pendapatan Angsuran Jasa Tahun {selectedYear ? selectedYear : "..."}
          </th>
          <td>{formatNumber(lapSHUByYear.totalBayarAngsuranPerTahun)}</td>
        </tr>
        <tr>
          <th colSpan={2}>
            Pendapatan Kebutuhan Kas Tahun {selectedYear ? selectedYear : "..."}
          </th>
          <td>{formatNumber(lapSHUByYear.totalPengeluaranKasPerTahun)}</td>
        </tr>
        <tr />
        {keanggotaan
          .filter((anggota) => anggota.id !== 6)
          .map((anggota, index) => (
            <tr key={index}>
              <th>{anggota.jenisAnggota}</th>
              <td>{anggota.persentaseSHU}%</td>
              <td>
                {selectedYear
                  ? formatNumber(
                      (anggota.persentaseSHU / 100) *
                        (lapSHUByYear.totalBayarAngsuranPerTahun -
                          lapSHUByYear.totalPengeluaranKasPerTahun)
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

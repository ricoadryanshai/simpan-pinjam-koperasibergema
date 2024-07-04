import React from "react";
import { formatNumber } from "../utils/format";

const LaporanSimpananExport = ({
  tableReference,
  lapByYear,
  jumlahSimpananAllRows,
  selectedYear,
  totalSaldoAllRows,
  keanggotaan,
  pendapatan,
  totalSHUSimpanan,
  totalSHUPinjaman,
  jumlahPenarikan,
  jumlahAngsuranAllRows,
  countPengurus,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={12}>Laporan Keuangan Koperasi Bergema</th>
        </tr>
        <tr>
          <th colSpan={12}>Kelurahan Gandaria Selatan</th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Kode Anggota</th>
          <th>Nama</th>
          <th>Simpanan {selectedYear ? selectedYear - 1 : "..."}</th>
          <th>Simpanan Pokok</th>
          <th>Simpanan Wajib</th>
          <th>Simpanan Sukarela</th>
          <th>Jumlah Total</th>
          <th>SHU Simpanan</th>
          <th>SHU Pinjaman</th>
          <th>Penarikan</th>
          <th>Total Simpanan</th>
        </tr>
      </thead>
      <tbody>
        {lapByYear.map((laporan, index) => {
          const jumlahSimpanan =
            laporan.saldoSimpanSebelumnya +
            laporan.simpananPokok +
            laporan.simpananWajib +
            laporan.simpananSukarela;

          let pendapatanJenisKeanggotaan = null;

          const jenisSHU = keanggotaan.find(
            (anggota) => anggota.jenisSHU === laporan.jenisAnggota
          );

          if (jenisSHU) {
            const pembagianSHU =
              pendapatan.pendapatanJasa * (jenisSHU.persentaseSHU / 100);
            pendapatanJenisKeanggotaan = pembagianSHU;
          }

          const persentTiapNasabah = jumlahSimpanan / jumlahSimpananAllRows;
          const persentSHUPinjaman =
            laporan.bayarAngsuranJasa !== 0
              ? laporan.bayarAngsuranJasa / jumlahAngsuranAllRows
              : 0;

          let pendapatanSHUSimpanan;
          if (laporan.jenisAnggota === "Pengurus") {
            pendapatanSHUSimpanan = pendapatanJenisKeanggotaan / countPengurus;
          } else {
            pendapatanSHUSimpanan =
              pendapatanJenisKeanggotaan * persentTiapNasabah;
          }

          const pendapatanSHUPinjaman =
            persentSHUPinjaman * pendapatan.pendapatanPinjam;

          const totalSaldo =
            jumlahSimpanan +
            pendapatanSHUSimpanan +
            pendapatanSHUPinjaman -
            laporan.penarikan;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{laporan.kodeAnggota}</td>
              <td>{laporan.nama}</td>
              <td>{formatNumber(laporan.saldoSimpanSebelumnya)}</td>
              <td>{formatNumber(laporan.simpananPokok)}</td>
              <td>{formatNumber(laporan.simpananWajib)}</td>
              <td>{formatNumber(laporan.simpananSukarela)}</td>
              <td>{formatNumber(jumlahSimpanan)}</td>
              <td>{formatNumber(pendapatanSHUSimpanan)}</td>
              <td>{formatNumber(pendapatanSHUPinjaman)}</td>
              <td>{formatNumber(laporan.penarikan)}</td>
              <td>{formatNumber(totalSaldo)}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={7} className="text-center fw-bold">
            Jumlah Simpanan Tahun {selectedYear ? selectedYear : "..."}
          </th>
          <th>{formatNumber(jumlahSimpananAllRows)}</th>
          <th>{formatNumber(totalSHUSimpanan)}</th>
          <th>{formatNumber(totalSHUPinjaman)}</th>
          <th>{formatNumber(jumlahPenarikan)}</th>
          <th>{formatNumber(totalSaldoAllRows)}</th>
        </tr>
      </tfoot>
    </table>
  );
};

export default LaporanSimpananExport;

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
  kodePinjam,
  totalSHUSimpanan,
  totalSHUPinjaman,
  jumlahPenarikan,
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

          let statusPinjam = "";
          let hasLunasPinjaman = false;

          const matchKodePinjam = kodePinjam.find((pinjam) => {
            if (
              pinjam.kodeAnggota === laporan.kodeAnggota &&
              pinjam.statusPinjaman === "Lunas"
            ) {
              hasLunasPinjaman = true; // Set the flag if a match is found
              return true; // Stop the iteration
            }
            return false; // Continue the iteration
          });

          if (hasLunasPinjaman) {
            statusPinjam = "SHU Pinjam";
          }

          let dapatSHUPinjam = 0; // Initialize with 0

          if (matchKodePinjam && matchKodePinjam.statusPinjaman === "Lunas") {
            const jenisSHUPinjam = keanggotaan.find(
              (anggota) => anggota.jenisSHU === statusPinjam
            );

            if (jenisSHUPinjam) {
              const pembagianSHU =
                pendapatan.pendapatanJasa *
                (jenisSHUPinjam.persentaseSHU / 100);
              dapatSHUPinjam = pembagianSHU;
            }
          }

          const persentTiapNasabah = jumlahSimpanan / jumlahSimpananAllRows;

          const pendapatanSHUSimpanan =
            pendapatanJenisKeanggotaan * persentTiapNasabah;

          const pendapatanSHUPinjaman = dapatSHUPinjam * persentTiapNasabah;

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

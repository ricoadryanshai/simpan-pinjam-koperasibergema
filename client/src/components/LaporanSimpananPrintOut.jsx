/* eslint-disable react/prop-types */
import React from "react";
import { Stack, Card, Table } from "react-bootstrap";
import { formatRupiah } from "../utils/format";

export const LaporanSimpananPrintOut = ({
  componentReference,
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
    <div className="no-display print-only" ref={componentReference}>
      <Stack
        direction="horizontal"
        className="justify-content-center border-bottom border-3 mb-3"
      >
        <Card.Title className="fw-bold text-uppercase text-center py-3">
          Laporan Keuangan Koperasi Bergema <br />
          Kelurahan Gandaria Selatan
        </Card.Title>
      </Stack>
      <Table responsive hover size="sm" className="font-size-small">
        <thead className="table-info align-middle">
          <tr>
            <th className="text-center">No.</th>
            <th className="text-center">Kode Anggota</th>
            <th>Nama</th>
            <th>Simpanan</th>
            <th>SHU</th>
            <th>Penarikan</th>
            <th>Total Saldo </th>
          </tr>
        </thead>
        <tbody className="align-middle">
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

            totalSHUSimpanan += pendapatanSHUSimpanan;
            totalSHUPinjaman += pendapatanSHUPinjaman;

            const totalSaldo =
              jumlahSimpanan +
              pendapatanSHUSimpanan +
              pendapatanSHUPinjaman -
              laporan.penarikan;

            totalSaldoAllRows += totalSaldo;
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{laporan.kodeAnggota}</td>
                <td>{laporan.nama}</td>
                <td>{formatRupiah(jumlahSimpanan)}</td>
                <td>
                  {formatRupiah(pendapatanSHUSimpanan + pendapatanSHUPinjaman)}
                </td>
                <td>{formatRupiah(laporan.penarikan)}</td>
                <td className="fw-bold">{formatRupiah(totalSaldo)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="table-light">
          <tr>
            <td colSpan={3} className="text-center fw-bold">
              Jumlah Simpanan Tahun {selectedYear}
            </td>
            <td className="fw-bold">{formatRupiah(jumlahSimpananAllRows)}</td>
            <td className="fw-bold">
              {formatRupiah(totalSHUSimpanan + totalSHUPinjaman)}
            </td>
            <td className="fw-bold">{formatRupiah(jumlahPenarikan)}</td>
            <td className="fw-bold">{formatRupiah(totalSaldoAllRows)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

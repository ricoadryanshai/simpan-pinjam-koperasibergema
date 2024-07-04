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
  totalSHUSimpanan,
  totalSHUPinjaman,
  jumlahPenarikan,
  jumlahAngsuranAllRows,
  countPengurus,
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
            <th>SHU Simpan</th>
            <th>SHU Pinjam</th>
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

            const persentTiapNasabah = jumlahSimpanan / jumlahSimpananAllRows;
            const persentSHUPinjaman =
              laporan.bayarAngsuranJasa !== 0
                ? laporan.bayarAngsuranJasa / jumlahAngsuranAllRows
                : 0;

            let pendapatanSHUSimpanan;
            if (laporan.jenisAnggota === "Pengurus") {
              pendapatanSHUSimpanan =
                pendapatanJenisKeanggotaan / countPengurus;
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
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{laporan.kodeAnggota}</td>
                <td>{laporan.nama}</td>
                <td>{formatRupiah(jumlahSimpanan)}</td>
                <td>{formatRupiah(pendapatanSHUSimpanan)}</td>
                <td>{formatRupiah(pendapatanSHUPinjaman)}</td>
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
            <td className="fw-bold">{formatRupiah(totalSHUSimpanan)}</td>
            <td className="fw-bold">{formatRupiah(totalSHUPinjaman)}</td>
            <td className="fw-bold">{formatRupiah(jumlahPenarikan)}</td>
            <td className="fw-bold">{formatRupiah(totalSaldoAllRows)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

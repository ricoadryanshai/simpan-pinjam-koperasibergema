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
            <th className="text-center">Nama</th>
            <th>Simpanan</th>
            <th>SHU</th>
            <th>Jumlah Total</th>
            <th>Penarikan</th>
            <th>Total Simpanan</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {lapByYear.map((laporan, index) => {
            const jumlahSimpanan =
              laporan.simpananPokok +
              laporan.simpananWajib +
              laporan.simpananSukarela;
            const sisaHasilUsaha =
              (jumlahSimpanan / jumlahSimpananAllRows) * 160000;
            const jumlahTotal =
              laporan.simpananPokok +
              laporan.simpananWajib +
              laporan.simpananSukarela +
              sisaHasilUsaha;
            const totalSaldo = jumlahTotal - laporan.penarikan;
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{laporan.kodeAnggota}</td>
                <td>{laporan.nama}</td>
                <td>{formatRupiah(jumlahSimpanan)}</td>
                <td>{formatRupiah(sisaHasilUsaha)}</td>
                <td>{formatRupiah(jumlahTotal)}</td>
                <td>{formatRupiah(laporan.penarikan)}</td>
                <td className="fw-bold">{formatRupiah(totalSaldo)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="table-light">
          <tr>
            {selectedYear ? (
              <td colSpan={4} className="text-center fw-bold">
                Jumlah Simpanan Tahun {selectedYear}
              </td>
            ) : (
              <td colSpan={4} className="text-center fw-bold">
                Jumlah Simpanan Tahun ...
              </td>
            )}
            <td />
            <td />
            <td />
            <td className="fw-bold">{formatRupiah(totalSaldoAllRows)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

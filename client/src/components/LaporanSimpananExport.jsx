import React from "react";
import { formatNumber } from "../utils/format";

const LaporanSimpananExport = ({
  tableReference,
  lapByYear,
  jumlahSimpananAllRows,
  selectedYear,
  totalSaldoAllRows,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <th colSpan={10}>Laporan Keuangan Koperasi Bergema</th>
        </tr>
        <tr>
          <th colSpan={10}>Kelurahan Gandaria Selatan</th>
        </tr>
        <tr>
          <th colSpan={10} />
        </tr>
        <tr>
          <th>No.</th>
          <th>Kode Anggota</th>
          <th>Nama</th>
          <th>Simpanan Pokok</th>
          <th>Simpanan Wajib</th>
          <th>Simpanan Sukarela</th>
          <th>SHU</th>
          <th>Jumlah Total</th>
          <th>Penarikan</th>
          <th>Total Simpanan</th>
        </tr>
      </thead>
      <tbody>
        {lapByYear.map((laporan, index) => {
          const jumlahSimpanan =
            laporan.simpananPokok +
            laporan.simpananWajib +
            laporan.simpananSukarela;
          const sisaHasilUsaha =
            (jumlahSimpanan / jumlahSimpananAllRows) * 160000;
          const totalSaldo =
            jumlahSimpanan + sisaHasilUsaha - laporan.penarikan;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{laporan.kodeAnggota}</td>
              <td>{laporan.nama}</td>
              <td>{formatNumber(laporan.simpananPokok)}</td>
              <td>{formatNumber(laporan.simpananWajib)}</td>
              <td>{formatNumber(laporan.simpananSukarela)}</td>
              <td>{formatNumber(sisaHasilUsaha)}</td>
              <td>{formatNumber(sisaHasilUsaha + jumlahSimpanan)}</td>
              <td>{formatNumber(laporan.penarikan)}</td>
              <td className="fw-bold">{formatNumber(totalSaldo)}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={9} className="text-center fw-bold">
            Jumlah Simpanan Tahun {selectedYear ? selectedYear : "..."}
          </th>
          <th>{formatNumber(totalSaldoAllRows)}</th>
        </tr>
      </tfoot>
    </table>
  );
};

export default LaporanSimpananExport;

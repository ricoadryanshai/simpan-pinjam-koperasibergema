import React from "react";
import { Stack, Card, Table } from "react-bootstrap";
import { formatDate, formatRupiah } from "../utils/format";

const LaporanKasPrintOut = ({
  componentReference,
  selectedYear,
  transaksiKas,
  jumlahNominalAllRows,
}) => {
  return (
    <div className="no-display print-only" ref={componentReference}>
      <Stack
        direction="horizontal"
        className="justify-content-center border-bottom border-3 mb-3"
      >
        <Card.Title className="fw-bold text-uppercase text-center py-3">
          Laporan Pengeluaran Koperasi Bergema{" "}
          {selectedYear ? selectedYear : "..."}
          <br />
          Kelurahan Gandaria Selatan
        </Card.Title>
      </Stack>
      <Table responsive hover size="sm" className="font-size-small">
        <thead className="table-info align-middle">
          <tr>
            <th className="text-center">No.</th>
            <th>Uraian</th>
            <th className="text-center">Tanggal Transaksi</th>
            <th>Nominal</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {transaksiKas.map((kas, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{kas.keterangan}</td>
              <td className="text-center">
                {formatDate(kas.tanggalTransaksi)}
              </td>
              <td>{formatRupiah(kas.nominalTransaksi)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-light fw-bold">
          <tr>
            <td colSpan={3} className="text-center">
              Jumlah Pengeluaran Tahun Ini {selectedYear ? selectedYear : "..."}
            </td>
            <td colSpan={3}>{formatRupiah(jumlahNominalAllRows)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default LaporanKasPrintOut;

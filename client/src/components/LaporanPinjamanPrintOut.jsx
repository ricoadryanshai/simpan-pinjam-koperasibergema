/* eslint-disable react/prop-types */
import React from "react";
import { formatRupiah } from "../utils/format";
import { Stack, Card, Table } from "react-bootstrap";

export const LaporanPinjamanPrintOut = ({
  componentRef,
  selectedYear,
  lapByYear,
  totalJumlahAngsuran,
}) => {
  return (
    <div className="no-display print-only" ref={componentRef}>
      <Stack
        direction="horizontal"
        className="justify-content-center border-bottom border-3 mb-3"
      >
        <Card.Title className="fw-bold text-uppercase text-center py-3">
          {selectedYear ? (
            <>
              Laporan Angsuran Pinjaman Tahun {selectedYear - 2} SD{" "}
              {selectedYear}
              <br />
              Kelurahan Gandaria Selatan
            </>
          ) : (
            <>
              Laporan Angsuran Pinjaman Tahun ... SD ...
              <br />
              Kelurahan Gandaria Selatan
            </>
          )}
        </Card.Title>
      </Stack>
      <Table responsive hover size="sm" className="font-size-small">
        <thead className="table-info align-middle">
          <tr>
            <th className="text-center">No.</th>
            <th className="text-center">Nama</th>
            <th className="text-center">Tanggal Pinjam</th>
            <th>Nominal Pinjaman</th>
            <th>Angsuran</th>
            <th>Jasa Didapat</th>
            <th>Sudah Dibayar</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {lapByYear.map((laporan, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{laporan.nama}</td>
              <td className="text-center">{laporan.tanggalTransaksi}</td>
              <td>{formatRupiah(laporan.nominalPinjam)}</td>
              <td>{laporan.angsuran}</td>
              <td>{formatRupiah(laporan.nominalJasa)}</td>
              <td className="fw-bold">{formatRupiah(laporan.bayarTagihan)}</td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: laporan.statusPinjaman === "Lunas" ? "green" : "red",
                }}
              >
                {laporan.statusPinjaman}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-light">
          <tr>
            <td colSpan={6} className="text-center fw-bold">
              Jumlah Bayar Angsuran
            </td>
            <td className="fw-bold">{formatRupiah(totalJumlahAngsuran)}</td>
            <td />
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

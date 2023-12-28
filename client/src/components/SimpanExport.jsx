import React from "react";
import { formatDate, formatNumber, formatRupiah } from "../utils/format";

const SimpanExport = ({
  tableReference,
  modalData,
  kodeRowData,
  namaRowData,
  tanggalRowData,
  saldoRowData,
}) => {
  return (
    <table className="no-display" ref={tableReference}>
      <thead>
        <tr>
          <td colSpan={2}>Kode Anggota</td>
          <td>{kodeRowData}</td>
        </tr>
        <tr>
          <td colSpan={2}>Nama</td>
          <td>{namaRowData}</td>
        </tr>
        <tr>
          <td colSpan={2}>Tanggal Bergabung</td>
          <td>{formatDate(tanggalRowData)}</td>
        </tr>
        <tr>
          <td colSpan={2}>Saldo Simpanan</td>
          <td>{formatNumber(saldoRowData)}</td>
        </tr>
        <tr />
        <tr>
          <th>No.</th>
          <th>Tanggal Transaksi</th>
          <th>Jenis Transaksi</th>
          <th>Nominal</th>
        </tr>
      </thead>
      <tbody>
        {modalData
          .sort((a, b) => new Date(a.tanggalSimpan) - new Date(b.tanggalSimpan))
          .map((transaction, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transaction.tanggalSimpan}</td>
              <td>{transaction.jenisSimpan}</td>
              <td
                style={{
                  color:
                    transaction.jenisSimpan === "Ambil Simpanan"
                      ? "red"
                      : "green",
                }}
              >
                {formatNumber(transaction.saldo)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default SimpanExport;

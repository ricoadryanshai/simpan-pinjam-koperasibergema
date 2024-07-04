import React from "react";
import { Card, Table, Stack, Form, Button } from "react-bootstrap";
import {
  getLapPendapatanByYear,
  getLapSimpanan,
  getLapSimpananByYear,
  getSHU,
  tambahSimpan,
  tambahTransaksi,
} from "../utils/api";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import { LaporanSimpananPrintOut } from "./LaporanSimpananPrintOut";
import LaporanSimpananExport from "./LaporanSimpananExport";

const today = new Date();
const date = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();

const LaporanSimpanan = () => {
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [lapSimpanan, setLapSimpanan] = React.useState([]);
  const [lapByYear, setLapByYear] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);
  const [pendapatan, setPendapatan] = React.useState({});

  const fetchPengaturanPersen = async () => {
    try {
      const data = await getSHU();
      setKeanggotaan(data);
    } catch (error) {
      console.error("Error fetching keanggotaan:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getLapSimpanan();
      setLapSimpanan(data);
    } catch (error) {
      console.error("Error fetching laporan simpanan:", error);
    }
  };

  const fetchDataByYear = async (year) => {
    try {
      const data = await getLapSimpananByYear(year);
      setLapByYear(data);
    } catch (error) {
      console.error("Error fetching laporan simpanan by year:", error);
    }
  };

  const fetchPendapatanByYear = async (year) => {
    try {
      const data = await getLapPendapatanByYear(year);
      setPendapatan(data);
    } catch (error) {
      console.error("Error fetching pendapatan by year:", error);
    }
  };

  React.useEffect(() => {
    fetchPengaturanPersen();
    fetchData();
  }, []);

  React.useEffect(() => {
    if (selectedYear) {
      fetchDataByYear(selectedYear);
      fetchPendapatanByYear(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (lapSimpanan.length > 0) {
      const years = Array.from(
        new Set(lapSimpanan.map((item) => item.tahunSimpan))
      );
      setUniqueYears(years);
    }
  }, [lapSimpanan]);

  let totalSHUSimpanan = 0;
  let totalSHUPinjaman = 0;
  let totalSHUSimpananPengurus = 0;
  let totalSaldoAllRows = 0;
  let totalAmountLunas = 0;

  const jumlahSimpananAllRows = lapByYear.reduce((total, laporan) => {
    return (
      total +
      laporan.saldoSimpanSebelumnya +
      laporan.simpananPokok +
      laporan.simpananWajib +
      laporan.simpananSukarela
    );
  }, 0);

  const jumlahAngsuranAllRows = lapByYear.reduce((total, laporan) => {
    return total + laporan.bayarAngsuranJasa;
  }, 0);

  const getCount = lapByYear.reduce((count, laporan) => {
    return count + (laporan.shuPinjam === "GET" ? 1 : 0);
  }, 0);

  const jumlahPenarikan = lapByYear.reduce((total, laporan) => {
    return total + laporan.penarikan;
  }, 0);

  const countPengurus = lapByYear.filter(
    (laporan) => laporan.jenisAnggota === "Pengurus"
  ).length;

  let jumlahSimpananAnggota = lapByYear
    .filter((laporan) => laporan.jenisAnggota !== "Pengurus")
    .reduce((total, laporan) => {
      const jumlahSimpanan =
        laporan.saldoSimpanSebelumnya +
        laporan.simpananPokok +
        laporan.simpananWajib +
        laporan.simpananSukarela;

      return total + jumlahSimpanan;
    }, 0);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const tableRef = React.useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Laporan_Simpanan_Tahun_${selectedYear || "YYYY"}`,
    sheet: "Laporan Simpanan",
  });

  const handleImportButton = async () => {
    const simpanData = lapByYear
      .map((laporan) => {
        // Calculate total savings for each member
        const jumlahSimpanan =
          laporan.saldoSimpanSebelumnya +
          laporan.simpananPokok +
          laporan.simpananWajib +
          laporan.simpananSukarela;

        // Calculate the savings SHU percentage
        const persentSHUSimpanan =
          jumlahSimpanan !== 0 ? jumlahSimpanan / jumlahSimpananAnggota : 0;

        // Determine SHU income from savings
        let pendapatanSHUSimpanan;
        if (laporan.jenisAnggota === "Pengurus") {
          pendapatanSHUSimpanan = pendapatan.pendapatanPengurus / countPengurus;
        } else {
          pendapatanSHUSimpanan =
            pendapatan.pendapatanAnggota * persentSHUSimpanan;
        }

        return {
          kodeAnggota: laporan.kodeAnggota,
          tanggalSimpan: `${year}-${month}-${date}`,
          jenisSimpan: `SHU Simpanan ${selectedYear}`,
          saldo: pendapatanSHUSimpanan,
          pendapatanSHUSimpanan: pendapatanSHUSimpanan,
        };
      })
      .filter((data) => data.pendapatanSHUSimpanan > 0);

    const pinjamData = lapByYear
      .filter((laporan) => laporan.shuPinjam !== "NOT GET")
      .map((laporan) => {
        // Calculate the loan SHU percentage
        const persentSHUPinjaman =
          laporan.bayarAngsuranJasa !== 0
            ? laporan.bayarAngsuranJasa / jumlahAngsuranAllRows
            : 0;

        // Calculate SHU income from loans
        const pendapatanSHUPinjaman =
          persentSHUPinjaman * pendapatan.pendapatanPinjam;

        return {
          kodeAnggota: laporan.kodeAnggota,
          tanggalSimpan: `${year}-${month}-${date}`,
          jenisSimpan: `SHU Pinjaman ${selectedYear}`,
          saldo: pendapatanSHUPinjaman,
        };
      });

    const transformedSimpanData = {
      kodeAnggota: simpanData.map((data) => data.kodeAnggota),
      tanggalSimpan: simpanData.map((data) => data.tanggalSimpan),
      jenisSimpan: simpanData.map((data) => data.jenisSimpan),
      saldo: simpanData.map((data) => data.saldo),
    };
    const transformedPinjamData = {
      kodeAnggota: pinjamData.map((data) => data.kodeAnggota),
      tanggalSimpan: pinjamData.map((data) => data.tanggalSimpan),
      jenisSimpan: pinjamData.map((data) => data.jenisSimpan),
      saldo: pinjamData.map((data) => data.saldo),
    };

    try {
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Masuk`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanAdministrasi,
        keterangan: `SHU Administrasi ${selectedYear}`,
      });
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Masuk`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanModal,
        keterangan: `SHU Penyerahan Modal ${selectedYear}`,
      });
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Keluar`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanAdministrasi,
        keterangan: `SHU Administrasi ${selectedYear}`,
      });
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Keluar`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanModal,
        keterangan: `SHU Penyerahan Modal ${selectedYear}`,
      });
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Keluar`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: totalAmountLunas,
        keterangan: `Alokasi SHU Pinjaman ${selectedYear} ke nasabah`,
      });
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Keluar`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: totalSHUSimpanan,
        keterangan: `Alokasi SHU Simpanan ${selectedYear} ke nasabah`,
      });

      transformedSimpanData.kodeAnggota.map(async (kodeAnggota, index) => {
        await tambahSimpan({
          kodeAnggota,
          tanggalSimpan: transformedSimpanData.tanggalSimpan[index],
          jenisSimpan: transformedSimpanData.jenisSimpan[index],
          saldo: transformedSimpanData.saldo[index],
        });
      });
      transformedPinjamData.kodeAnggota.map(async (kodeAnggota, index) => {
        await tambahSimpan({
          kodeAnggota,
          tanggalSimpan: transformedPinjamData.tanggalSimpan[index],
          jenisSimpan: transformedPinjamData.jenisSimpan[index],
          saldo: transformedPinjamData.saldo[index],
        });
      });
      alert(`
          Berhasil import SHU:\n
          SHU Pengurus: ${formatRupiah(totalSHUSimpananPengurus)}\n
          SHU Anggota: ${formatRupiah(
            totalSHUSimpanan - totalSHUSimpananPengurus
          )}\n
          SHU Pinjaman: ${formatRupiah(
            totalAmountLunas
          )} (${getCount} Nasabah Dapat)\n
          SHU Administrasi: ${formatRupiah(pendapatan.pendapatanAdministrasi)}\n
          SHU Modal: ${formatRupiah(pendapatan.pendapatanModal)}\n
        `);
    } catch (error) {
      console.error("Error importing SHU:", error);
    }
  };
  return (
    <>
      <Stack gap={3}>
        <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
              Laporan Keuangan Koperasi Bergema <br />
              Kelurahan Gandaria Selatan
            </Card.Title>
          </Stack>
          <Stack direction="horizontal" className="justify-content-end gap-3">
            <FontAwesomeIcon
              icon={faPrint}
              onClick={() => {
                if (selectedYear) {
                  handlePrint();
                } else {
                  alert("Silahkan pilih tahun terlebih dahulu");
                  return;
                }
              }}
              className="custom-icon-pointer"
            />
            <FontAwesomeIcon
              icon={faFileExport}
              onClick={() => {
                if (selectedYear) {
                  onDownload();
                } else {
                  alert("Silahkan pilih tahun terlebih dahulu");
                  return;
                }
              }}
              className="custom-icon-pointer"
            />
          </Stack>
        </Stack>
        <Stack
          direction="horizontal"
          gap={3}
          className="justify-content-between"
        >
          <Button
            variant="warning"
            onClick={() => {
              if (selectedYear) {
                handleImportButton();
              } else {
                alert("Silahkan pilih tahun terlebih dahulu.");
                return;
              }
            }}
            className="fw-bold text-uppercase"
          >
            Import SHU
          </Button>

          <Form className="d-flex justify-content-end">
            <Form.Select
              size="sm"
              style={{ maxWidth: "150px" }}
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value={""} disabled>
                Pilih Tahun
              </option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form>
        </Stack>
        <Table responsive hover size="sm" className="font-size-small">
          <thead className="table-info align-middle">
            <tr>
              <th className="text-center">No.</th>
              <th className="text-center">Kode Anggota</th>
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
          <tbody className="align-middle">
            {lapByYear.map((laporan, index) => {
              // Calculate total savings for each member
              const jumlahSimpanan =
                laporan.saldoSimpanSebelumnya +
                laporan.simpananPokok +
                laporan.simpananWajib +
                laporan.simpananSukarela;

              // Calculate the savings SHU percentage
              const persentSHUSimpanan =
                jumlahSimpanan !== 0
                  ? jumlahSimpanan / jumlahSimpananAnggota
                  : 0;

              // Calculate the loan SHU percentage
              const persentSHUPinjaman =
                laporan.bayarAngsuranJasa !== 0
                  ? laporan.bayarAngsuranJasa / jumlahAngsuranAllRows
                  : 0;

              // Determine SHU income from savings
              let pendapatanSHUSimpanan;
              if (laporan.jenisAnggota === "Pengurus") {
                pendapatanSHUSimpanan =
                  pendapatan.pendapatanPengurus / countPengurus;
              } else {
                pendapatanSHUSimpanan =
                  pendapatan.pendapatanAnggota * persentSHUSimpanan;
              }

              // Calculate SHU income from loans
              const pendapatanSHUPinjaman =
                persentSHUPinjaman * pendapatan.pendapatanPinjam;

              // Accumulate total SHU income
              totalSHUSimpanan += pendapatanSHUSimpanan;
              totalSHUPinjaman += pendapatanSHUPinjaman;

              // Calculate total balance
              let totalSaldo;
              if (laporan.shuPinjam === "GET") {
                totalSaldo =
                  jumlahSimpanan +
                  pendapatanSHUSimpanan +
                  pendapatanSHUPinjaman -
                  laporan.penarikan;
              } else {
                totalSaldo =
                  jumlahSimpanan + pendapatanSHUSimpanan - laporan.penarikan;
              }

              // Accumulate total balance for all rows
              totalSaldoAllRows += totalSaldo;

              // Accumulate SHU income for 'Pengurus' members
              if (laporan.jenisAnggota === "Pengurus") {
                totalSHUSimpananPengurus += pendapatanSHUSimpanan;
              }

              // Determine row background color based on member status
              const bg =
                laporan.status === "Tidak Aktif" ? "table-warning" : "";

              // Determine text color for SHU loan status
              const statusShuPinjam =
                laporan.shuPinjam === "GET" ? "green" : "red";

              // Accumulate total loan SHU amount if status is 'GET'
              totalAmountLunas +=
                laporan.shuPinjam === "GET" ? pendapatanSHUPinjaman : 0;
              return (
                <tr key={index} className={bg}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{laporan.kodeAnggota}</td>
                  <td>{laporan.nama}</td>
                  <td>{formatRupiah(laporan.saldoSimpanSebelumnya)}</td>
                  <td>{formatRupiah(laporan.simpananPokok)}</td>
                  <td>{formatRupiah(laporan.simpananWajib)}</td>
                  <td>{formatRupiah(laporan.simpananSukarela)}</td>
                  <td>{formatRupiah(jumlahSimpanan)}</td>
                  <td>{formatRupiah(pendapatanSHUSimpanan)}</td>
                  <td style={{ color: statusShuPinjam }}>
                    {formatRupiah(pendapatanSHUPinjaman)}
                  </td>
                  <td>{formatRupiah(laporan.penarikan)}</td>
                  <td className="fw-bold">{formatRupiah(totalSaldo)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light fw-bold">
            <tr>
              <td colSpan={7} className="text-center">
                Jumlah Simpanan Tahun {selectedYear ? selectedYear : "..."}
              </td>
              <td>{formatRupiah(jumlahSimpananAllRows)}</td>
              <td>{formatRupiah(totalSHUSimpanan)}</td>
              <td>{formatRupiah(totalSHUPinjaman)}</td>
              <td>{formatRupiah(jumlahPenarikan)}</td>
              <td>{formatRupiah(totalSaldoAllRows)}</td>
            </tr>
          </tfoot>
        </Table>
      </Stack>

      <LaporanSimpananPrintOut
        componentReference={componentRef}
        lapByYear={lapByYear}
        jumlahSimpananAllRows={jumlahSimpananAllRows}
        selectedYear={selectedYear}
        totalSaldoAllRows={totalSaldoAllRows}
        keanggotaan={keanggotaan}
        pendapatan={pendapatan}
        totalSHUSimpanan={totalSHUSimpanan}
        totalSHUPinjaman={totalSHUPinjaman}
        jumlahPenarikan={jumlahPenarikan}
        jumlahAngsuranAllRows={jumlahAngsuranAllRows}
        countPengurus={countPengurus}
      />

      <LaporanSimpananExport
        tableReference={tableRef}
        lapByYear={lapByYear}
        jumlahSimpananAllRows={jumlahSimpananAllRows}
        selectedYear={selectedYear}
        totalSaldoAllRows={totalSaldoAllRows}
        keanggotaan={keanggotaan}
        pendapatan={pendapatan}
        totalSHUSimpanan={totalSHUSimpanan}
        totalSHUPinjaman={totalSHUPinjaman}
        jumlahPenarikan={jumlahPenarikan}
        jumlahAngsuranAllRows={jumlahAngsuranAllRows}
        countPengurus={countPengurus}
      />
    </>
  );
};

export default LaporanSimpanan;

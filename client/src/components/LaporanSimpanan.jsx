import React from "react";
import { Card, Table, Stack, Form, Button } from "react-bootstrap";
import {
  getLapAngsuranByYear,
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
  const [kodePinjam, setKodePinjam] = React.useState([]);

  const fetchPengaturanPersen = async () => {
    try {
      const data = await getSHU();
      setKeanggotaan(data);
    } catch (error) {
      console.error("Fetching Keanggotaan Error From Client-side:", error);
    }
  };

  const fetchedData = async () => {
    try {
      const data = await getLapSimpanan();
      setLapSimpanan(data);
    } catch (error) {
      console.log("Error fetching laporan simpanan: ", error);
    }
  };

  const fetchedDataByYear = async (year) => {
    try {
      const data = await getLapSimpananByYear(year);
      setLapByYear(data);
    } catch (error) {
      console.log("Error fetching laporan simpanan berdasarkan tahun: ", error);
    }
  };

  const fetchPendapatanByYear = async (year) => {
    try {
      const data = await getLapPendapatanByYear(year);
      setPendapatan(data);
    } catch (error) {
      console.error("Fetching Error Pendapatan From useEffect:", error);
    }
  };

  const fetchKodeAnggotaPinjam = async (year) => {
    try {
      const data = await getLapAngsuranByYear(year);
      setKodePinjam(data);
    } catch (error) {
      console.error(
        "Fetching Kode Anggota Table Pinjam Error From Handle-side:",
        error
      );
    }
  };

  React.useEffect(() => {
    fetchPengaturanPersen();
  }, []);

  React.useEffect(() => {
    fetchedData();
  }, []);

  React.useEffect(() => {
    if (selectedYear !== "") {
      fetchedDataByYear(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (selectedYear !== "") {
      fetchPendapatanByYear(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (selectedYear !== "") {
      fetchKodeAnggotaPinjam(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (lapSimpanan.length > 0) {
      // Mendapatkan nilai unik dari properti tahunSimpan
      const uniqueYears = Array.from(
        new Set(lapSimpanan.map((item) => item.tahunSimpan))
      );
      // Mengatur nilai-nilai unik tersebut sebagai pilihan dropdown
      setUniqueYears(uniqueYears);
    }
  }, [lapSimpanan]);

  const jumlahSimpananAllRows = lapByYear.reduce((total, laporan) => {
    const simpanan =
      laporan.saldoSimpanSebelumnya +
      laporan.simpananPokok +
      laporan.simpananWajib +
      laporan.simpananSukarela;
    return total + simpanan;
  }, 0);

  let totalSHUSimpanan = 0;
  let totalSHUSimpananPengurus = 0;
  let totalSHUPinjaman = 0;

  const jumlahPenarikan = lapByYear.reduce((total, laporan) => {
    const penarikan = laporan.penarikan;
    return total + penarikan;
  }, 0);

  const countPengurus = lapByYear.filter(
    (laporan) => laporan.jenisAnggota === "Pengurus"
  ).length;

  let totalSaldoAllRows = 0;

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const tableRef = React.useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Laporan_Simpanan_Tahun_${selectedYear ? selectedYear : "YYYY"}`,
    sheet: "Laporan Simpanan",
  });

  const handleImportButton = async () => {
    const objectData = lapByYear.map((laporan) => {
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
          hasLunasPinjaman = true;
          return true;
        }
        return false;
      });

      if (hasLunasPinjaman) {
        statusPinjam = "SHU Pinjam";
      }

      let dapatSHUPinjam = 0;

      if (matchKodePinjam && matchKodePinjam.statusPinjaman === "Lunas") {
        const jenisSHUPinjam = keanggotaan.find(
          (anggota) => anggota.jenisSHU === statusPinjam
        );
        if (jenisSHUPinjam) {
          const pembagianSHU =
            pendapatan.pendapatanJasa * (jenisSHUPinjam.persentaseSHU / 100);
          dapatSHUPinjam = pembagianSHU;
        }
      }

      const persentTiapNasabah = jumlahSimpanan / jumlahSimpananAllRows;

      let pendapatanSHUSimpanan;
      if (laporan.jenisAnggota === "Pengurus") {
        pendapatanSHUSimpanan = pendapatanJenisKeanggotaan / countPengurus;
      } else {
        pendapatanSHUSimpanan = pendapatanJenisKeanggotaan * persentTiapNasabah;
      }

      const pendapatanSHUPinjaman = dapatSHUPinjam * persentTiapNasabah;

      if (laporan.jenisAnggota === "Pengurus") {
        totalSHUSimpananPengurus += pendapatanSHUSimpanan;
      }
      return {
        kodeAnggota: laporan.kodeAnggota,
        tanggalSimpan: `${year}-${month}-${date}`,
        jenisSimpan: `SHU ${selectedYear}`,
        saldo: pendapatanSHUSimpanan + pendapatanSHUPinjaman,
      };
    });

    const transformedData = {
      kodeAnggota: objectData.map((data) => data.kodeAnggota),
      tanggalSimpan: objectData.map((data) => data.tanggalSimpan),
      jenisSimpan: objectData.map((data) => data.jenisSimpan),
      saldo: objectData.map((data) => data.saldo),
    };

    try {
      // Input Administrasi
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Masuk`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanAdministrasi,
        keterangan: `SHU Administrasi ${selectedYear}`,
      });

      // Input Modal
      await tambahTransaksi({
        jenisTransaksi: `Transaksi Masuk`,
        tanggalTransaksi: `${year}-${month}-${date}`,
        nominalTransaksi: pendapatan.pendapatanModal,
        keterangan: `SHU Penyerahan Modal ${selectedYear}`,
      });

      transformedData.kodeAnggota.map(async (kodeAnggota, index) => {
        await tambahSimpan({
          kodeAnggota,
          tanggalSimpan: transformedData.tanggalSimpan[index],
          jenisSimpan: transformedData.jenisSimpan[index],
          saldo: transformedData.saldo[index],
        });
      });

      alert(`
        Berhasil import SHU:\n
        SHU Pengurus: ${formatRupiah(totalSHUSimpananPengurus)}\n
        SHU Simpanan: ${formatRupiah(totalSHUSimpanan)}\n
        SHU Pinjaman: ${formatRupiah(totalSHUPinjaman)}\n
        SHU Administrasi: ${formatRupiah(pendapatan.pendapatanAdministrasi)}\n
        SHU Modal: ${formatRupiah(pendapatan.pendapatanModal)}\n
      `);
    } catch (error) {
      console.error("Import SHU Error From Client-side:", error);
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
                  hasLunasPinjaman = true;
                  return true;
                }
                return false;
              });

              if (hasLunasPinjaman) {
                statusPinjam = "SHU Pinjam";
              }

              let dapatSHUPinjam = 0;

              if (
                matchKodePinjam &&
                matchKodePinjam.statusPinjaman === "Lunas"
              ) {
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

              let pendapatanSHUSimpanan;
              if (laporan.jenisAnggota === "Pengurus") {
                pendapatanSHUSimpanan =
                  pendapatanJenisKeanggotaan / countPengurus;
              } else {
                pendapatanSHUSimpanan =
                  pendapatanJenisKeanggotaan * persentTiapNasabah;
              }

              const pendapatanSHUPinjaman = dapatSHUPinjam * persentTiapNasabah;

              totalSHUSimpanan += pendapatanSHUSimpanan;
              totalSHUPinjaman += pendapatanSHUPinjaman;

              const totalSaldo =
                jumlahSimpanan +
                pendapatanSHUSimpanan +
                pendapatanSHUPinjaman -
                laporan.penarikan;
              totalSaldoAllRows += totalSaldo;

              const bg =
                laporan.status === "Tidak Aktif" ? "table-warning" : "";

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
                  <td>{formatRupiah(pendapatanSHUPinjaman)}</td>
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
        kodePinjam={kodePinjam}
        totalSHUSimpanan={totalSHUSimpanan}
        totalSHUPinjaman={totalSHUPinjaman}
        jumlahPenarikan={jumlahPenarikan}
      />

      <LaporanSimpananExport
        tableReference={tableRef}
        lapByYear={lapByYear}
        jumlahSimpananAllRows={jumlahSimpananAllRows}
        selectedYear={selectedYear}
        totalSaldoAllRows={totalSaldoAllRows}
        keanggotaan={keanggotaan}
        pendapatan={pendapatan}
        kodePinjam={kodePinjam}
        totalSHUSimpanan={totalSHUSimpanan}
        totalSHUPinjaman={totalSHUPinjaman}
        jumlahPenarikan={jumlahPenarikan}
      />
    </>
  );
};

export default LaporanSimpanan;

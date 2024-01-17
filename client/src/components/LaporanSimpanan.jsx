import React from "react";
import { Card, Table, Stack, Form, Button } from "react-bootstrap";
import { getLapSimpanan, getLapSimpananByYear, getSHU } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import { LaporanSimpananPrintOut } from "./LaporanSimpananPrintOut";
import LaporanSimpananExport from "./LaporanSimpananExport";

const LaporanSimpanan = () => {
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [lapSimpanan, setLapSimpanan] = React.useState([]);
  const [lapByYear, setLapByYear] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

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
      laporan.simpananPokok + laporan.simpananWajib + laporan.simpananSukarela;
    return total + simpanan;
  }, 0);

  /* const totalSHU =
  objectSHU?.bagianInvestor ||
  null + objectSHU?.bagianAdministrasi ||
  null + objectSHU?.bagianPengurus ||
  null; */

  const jumlahPenarikan = lapByYear.reduce((total, laporan) => {
    const penarikan = laporan.penarikan;
    return total + penarikan;
  }, 0);

  const totalSaldoAllRows = lapByYear.reduce(() => {
    const saldo = jumlahSimpananAllRows /* + totalSHU */ - jumlahPenarikan;
    return saldo;
  }, 0);

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
    try {
      console.log(lapByYear);
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
              onClick={handlePrint}
              className="custom-icon-pointer"
            />
            <FontAwesomeIcon
              icon={faFileExport}
              onClick={onDownload}
              className="custom-icon-pointer"
            />
          </Stack>
        </Stack>
        <Stack
          direction="horizontal"
          gap={3}
          className="justify-content-between"
        >
          <Button variant="warning" onClick={() => handleImportButton()}>
            Import SHU Ke Saldo Anggota
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
              <th className="text-center">Jenis Anggota</th>
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
                laporan.simpananPokok +
                laporan.simpananWajib +
                laporan.simpananSukarela;

              let sisaHasilUsaha = laporan.jenisAnggota;

              const totalSaldo =
                jumlahSimpanan + sisaHasilUsaha - laporan.penarikan;
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{laporan.kodeAnggota}</td>
                  <td>{laporan.nama}</td>
                  <td className="text-center">{laporan.jenisAnggota}</td>
                  <td>{formatRupiah(laporan.simpananPokok)}</td>
                  <td>{formatRupiah(laporan.simpananWajib)}</td>
                  <td>{formatRupiah(laporan.simpananSukarela)}</td>
                  <td>{formatRupiah(jumlahSimpanan)}</td>
                  <td>{formatRupiah(sisaHasilUsaha)}</td>
                  <td>{formatRupiah(sisaHasilUsaha)}</td>
                  <td>{formatRupiah(laporan.penarikan)}</td>
                  <td className="fw-bold">{formatRupiah(totalSaldo)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td colSpan={7} className="text-center fw-bold">
                Jumlah Simpanan Tahun {selectedYear ? selectedYear : "..."}
              </td>
              <td className="fw-bold">{formatRupiah(jumlahSimpananAllRows)}</td>
              <td className="fw-bold">{formatRupiah(/* totalSHU */)}</td>
              <td className="fw-bold">{formatRupiah(/* totalSHU */)}</td>
              <td className="fw-bold">{formatRupiah(jumlahPenarikan)}</td>
              <td className="fw-bold">{formatRupiah(totalSaldoAllRows)}</td>
            </tr>
          </tfoot>
        </Table>
      </Stack>

      {/* <LaporanSimpananPrintOut
        componentReference={componentRef}
        lapByYear={lapByYear}
        jumlahSimpananAllRows={jumlahSimpananAllRows}
        selectedYear={selectedYear}
        totalSaldoAllRows={totalSaldoAllRows}
      />

      <LaporanSimpananExport
        tableReference={tableRef}
        lapByYear={lapByYear}
        jumlahSimpananAllRows={jumlahSimpananAllRows}
        selectedYear={selectedYear}
        totalSaldoAllRows={totalSaldoAllRows}
      /> */}
    </>
  );
};

export default LaporanSimpanan;

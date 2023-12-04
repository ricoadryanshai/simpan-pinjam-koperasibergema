import React from "react";
import { Card, Table, Stack, Form } from "react-bootstrap";
import { getLapSimpanan, getLapSimpananByYear } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";

export const LaporanSimpanan = () => {
  const [lapSimpanan, setLapSimpanan] = React.useState([]);
  const [lapByYear, setLapByYear] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
    if (selectedYear !== "") {
      fetchedDataByYear(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    fetchedData();
  }, []);

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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const totalSaldoAllRows = lapByYear.reduce((total, laporan) => {
    const saldo =
      laporan.simpananPokok +
      laporan.simpananWajib +
      laporan.simpananSukarela -
      laporan.penarikan;
    return total + saldo;
  }, 0);
  const jumlahSimpananAllRows = lapByYear.reduce((total, laporan) => {
    const simpanan =
      laporan.simpananPokok + laporan.simpananWajib + laporan.simpananSukarela;
    return total + simpanan;
  }, 0);
  return (
    <>
      <Stack gap={3} ref={componentRef}>
        <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
              Laporan Keuangan Koperasi Bergema <br />
              Kelurahan Gandaria Selatan
            </Card.Title>
          </Stack>
          <Stack direction="horizontal" className="justify-content-end">
            <FontAwesomeIcon
              icon={faPrint}
              onClick={handlePrint}
              className="custom-icon-pointer"
            />
          </Stack>
        </Stack>
        <Stack gap={3}>
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
          <Table responsive hover size="sm" className="font-size-small">
            <thead className="table-info align-middle">
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Kode Anggota</th>
                <th className="text-center">Nama</th>
                <th>Simpanan Pokok</th>
                <th>Simpanan Wajib</th>
                <th>Simpanan Sukarela</th>
                <th>Penarikan</th>
                <th>Total Simpanan</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {lapByYear.map((laporan, index) => {
                const totalSaldo =
                  laporan.simpananPokok +
                  laporan.simpananWajib +
                  laporan.simpananSukarela -
                  laporan.penarikan;
                const jumlahSimpanan =
                  laporan.simpananPokok +
                  laporan.simpananWajib +
                  laporan.simpananSukarela;
                const sisaHasilUsaha =
                  (jumlahSimpanan / jumlahSimpananAllRows) * 160000;
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{laporan.kodeAnggota}</td>
                    <td>{laporan.nama}</td>
                    <td>{formatRupiah(laporan.simpananPokok)}</td>
                    <td>{formatRupiah(laporan.simpananWajib)}</td>
                    <td>{formatRupiah(laporan.simpananSukarela)}</td>
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
        </Stack>
      </Stack>
    </>
  );
};

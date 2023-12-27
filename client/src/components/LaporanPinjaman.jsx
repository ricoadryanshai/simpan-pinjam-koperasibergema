import React, { useEffect } from "react";
import { Card, Stack, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatRupiah } from "../utils/format";
import { useReactToPrint } from "react-to-print";
import { getLapAngsuran, getLapAngsuranByYear } from "../utils/api";
import { LaporanPinjamanPrintOut } from "./LaporanPinjamanPrintOut";

export const LaporanPinjaman = () => {
  const [lapAngsuran, setLapAngsuran] = React.useState([]);
  const [lapByYear, setByYear] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchData = async () => {
    try {
      const data = await getLapAngsuran();
      setLapAngsuran(data);
    } catch (error) {
      console.log("Error fetching laporan simpanan: ", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (lapAngsuran.length > 0) {
      const uniqueYears = Array.from(
        new Set(lapAngsuran.map((item) => item.tahunPinjam))
      );
      setUniqueYears(uniqueYears);
    }
  }, [lapAngsuran]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const fetchedDataByYear = async (year) => {
    try {
      const data = await getLapAngsuranByYear(year);
      setByYear(data);
    } catch (error) {
      console.log("Error fetching lapAngsuranByYear: ", error);
    }
  };

  React,
    useEffect(() => {
      if (selectedYear !== "") {
        fetchedDataByYear(selectedYear);
      }
    }, [selectedYear]);

  const totalAngsuranPokok = lapByYear.reduce((total, laporan) => {
    const jumlah = laporan.bayarAngsuranPokok;
    return total + jumlah;
  }, 0);
  const totalAngsuranJasa = lapByYear.reduce((total, laporan) => {
    const jumlah = laporan.bayarAngsuranJasa;
    return total + jumlah;
  }, 0);
  const totalJumlahAngsuran = lapByYear.reduce((total, laporan) => {
    const jumlah = laporan.bayarTagihan;
    return total + jumlah;
  }, 0);
  return (
    <>
      <Stack gap={3}>
        <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
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
          <Stack direction="horizontal" className="justify-content-end">
            <FontAwesomeIcon
              icon={faPrint}
              onClick={handlePrint}
              style={{ cursor: "pointer" }}
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
                <th className="text-center">Nama</th>
                <th className="text-center">Tanggal Pinjam</th>
                <th>Nominal Pinjaman</th>
                <th>Angsuran</th>
                <th>Angsuran Pokok</th>
                <th>Angsuran Jasa</th>
                <th>Angsuran/Bulan</th>
                <th>Bayar Pokok</th>
                <th>Bayar Jasa</th>
                <th>Bayar Total</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {lapByYear.map((laporan, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{laporan.nama}</td>
                  <td className="text-center">
                    {formatDate(laporan.tanggalTransaksi)}
                  </td>
                  <td>{formatRupiah(laporan.nominalPinjam)}</td>
                  <td>{laporan.angsuran}</td>
                  <td>{formatRupiah(laporan.angsuranPokok)}</td>
                  <td>{formatRupiah(laporan.angsuranJasa)}</td>
                  <td>{formatRupiah(laporan.angsuranPerBulan)}</td>
                  <td className="fw-bold border-start">
                    {formatRupiah(laporan.bayarAngsuranPokok)}
                  </td>
                  <td className="fw-bold">
                    {formatRupiah(laporan.bayarAngsuranJasa)}
                  </td>
                  <td className="fw-bold">
                    {formatRupiah(laporan.bayarTagihan)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                        laporan.statusPinjaman === "Lunas" ? "green" : "red",
                    }}
                  >
                    {laporan.statusPinjaman}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={7} className="text-center fw-bold">
                  Jumlah Bayar Angsuran
                </td>
                <td className="fw-bold">{formatRupiah(totalAngsuranPokok)}</td>
                <td className="fw-bold">{formatRupiah(totalAngsuranJasa)}</td>
                <td className="fw-bold">{formatRupiah(totalJumlahAngsuran)}</td>
                <td />
              </tr>
            </tfoot>
          </Table>
        </Stack>
      </Stack>

      <LaporanPinjamanPrintOut
        componentRef={componentRef}
        selectedYear={selectedYear}
        lapByYear={lapByYear}
        totalJumlahAngsuran={totalJumlahAngsuran}
      />
    </>
  );
};

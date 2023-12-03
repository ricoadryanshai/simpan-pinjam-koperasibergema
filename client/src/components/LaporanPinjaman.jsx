import React, { useEffect } from "react";
import { Card, Stack, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatRupiah } from "../utils/format";
import { useReactToPrint } from "react-to-print";
import { getLapAngsuran, getLapAngsuranByYear } from "../utils/api";

export const LaporanPinjaman = () => {
  const [lapAngsuran, setLapAngsuran] = React.useState([]);
  const [lapByYear, setByYear] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

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
  return (
    <>
      <Stack gap={3}>
        <Stack className="justify-content-center pb-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
              Laporan Angsuran Pinjaman Tahun {selectedYear - 2} SD{" "}
              {selectedYear} <br />
              Kelurahan Gandaria Selatan
            </Card.Title>
          </Stack>
          <Stack direction="horizontal" className="justify-content-end">
            <FontAwesomeIcon icon={faPrint} style={{ cursor: "pointer" }} />
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
          <Table responsive hover size="sm" className="print-only">
            <thead className="table-info align-middle">
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Tanggal Pinjam</th>
                <th>Nominal Pinjaman</th>
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
                  <td className="fw-bold">
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
              <tr className="table-light">
                <td colSpan={4} className="text-center fw-bold">
                  Jumlah Angsuran Tahun {selectedYear}
                </td>
                <td className="fw-bold">{"Total Angsuran Pokok"}</td>
                <td className="fw-bold">{"Total Angsuran Jasa"}</td>
                <td className="fw-bold">{"Total Bayar"}</td>
                <td />
              </tr>
            </tbody>
          </Table>
        </Stack>
      </Stack>
    </>
  );
};

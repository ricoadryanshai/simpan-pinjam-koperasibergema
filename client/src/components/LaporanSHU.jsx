/* eslint-disable react/prop-types */
import React from "react";
import { Card, Stack, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { getLapSHU } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { LaporanSHUPrintOut } from "./LaporanSHUPrintOut";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import LaporanSHUExport from "./LaporanSHUExport";

export const LaporanSHU = ({ keanggotaan, lapSHUByYear, fetchLapSHU }) => {
  const [lapSHUBy, setlapSHUBy] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchedData = async () => {
    try {
      const data = await getLapSHU();
      setlapSHUBy(data);
    } catch (error) {
      console.log("Error fetching laporan simpanan: ", error);
    }
  };

  React.useEffect(() => {
    fetchedData();
  }, []);

  React.useEffect(() => {
    if (lapSHUBy.length > 0) {
      // Mendapatkan nilai unik dari properti tahunSimpan
      const uniqueYears = Array.from(
        new Set(lapSHUBy.map((item) => item.tahunPinjam))
      );
      // Mengatur nilai-nilai unik tersebut sebagai pilihan dropdown
      setUniqueYears(uniqueYears);
    }
  }, [lapSHUBy]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // React.useEffect(() => {
  //   if (selectedYear !== "" || selectedYear != null) {
  //     fetchLapSHU(selectedYear);
  //   }
  // }, [fetchLapSHU, selectedYear]);

  const tableRef = React.useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Laporan_Pembagian_SHU_${selectedYear ? selectedYear : "YYYY"}`,
    sheet: "Laporan SHU",
  });
  return (
    <>
      <Stack gap={3}>
        <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
              {selectedYear ? (
                <>
                  Laporan Pembagian SHU Tahun {selectedYear}
                  <br />
                  Kelurahan Gandaria Selatan
                </>
              ) : (
                <>
                  Laporan Pembagian SHU Tahun ...
                  <br />
                  Kelurahan Gandaria Selatan
                </>
              )}
            </Card.Title>
          </Stack>
          <Stack direction="horizontal" className="justify-content-end gap-3">
            <FontAwesomeIcon
              icon={faPrint}
              onClick={handlePrint}
              style={{ cursor: "pointer" }}
            />
            <FontAwesomeIcon
              icon={faFileExport}
              onClick={onDownload}
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
          <Stack className="pb-3 border-bottom border-3">
            <Row className="mb-3">
              <Col>Pendapatan Angsuran Jasa Tahun Ini</Col>
              <Col />
              <Col className="fw-bold">
                {formatRupiah(lapSHUByYear.totalBayarAngsuranPerTahun)}
              </Col>
            </Row>
            <Row>
              <Col>Pengeluaran Kebutuhan Kas Tahun Ini</Col>
              <Col />
              <Col className="fw-bold">
                {formatRupiah(lapSHUByYear.totalPengeluaranKasPerTahun)}
              </Col>
            </Row>
          </Stack>
          <Stack>
            {keanggotaan
              .filter((anggota) => anggota.id !== 6)
              .map((anggota, index) => (
                <Row className="mb-3" key={index}>
                  <Col>{anggota.jenisAnggota}</Col>
                  <Col>{anggota.persentaseSHU}%</Col>
                  <Col className="fw-bold">
                    {selectedYear
                      ? formatRupiah(
                          (anggota.persentaseSHU / 100) *
                            (lapSHUByYear.totalBayarAngsuranPerTahun -
                              lapSHUByYear.totalPengeluaranKasPerTahun)
                        )
                      : formatRupiah(0)}
                  </Col>
                </Row>
              ))}
          </Stack>
        </Stack>
      </Stack>

      <LaporanSHUPrintOut
        componentReference={componentRef}
        selectedYear={selectedYear}
        keanggotaan={keanggotaan}
        lapSHUByYear={lapSHUByYear}
      />

      <LaporanSHUExport
        tableReference={tableRef}
        lapSHUByYear={lapSHUByYear}
        selectedYear={selectedYear}
        keanggotaan={keanggotaan}
      />
    </>
  );
};

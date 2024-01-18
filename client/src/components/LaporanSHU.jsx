/* eslint-disable react/prop-types */
import React from "react";
import { Card, Stack, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { getLapAngsuran, getLapPendapatanByYear, getSHU } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { LaporanSHUPrintOut } from "./LaporanSHUPrintOut";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import LaporanSHUExport from "./LaporanSHUExport";

export const LaporanSHU = () => {
  const [lapSHU, setlapSHU] = React.useState([]);
  const [lapSHUByYear, setlapSHUByYear] = React.useState([]);
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchedData = async () => {
    try {
      const data = await getLapAngsuran();
      setlapSHU(data);
    } catch (error) {
      console.error("Error fetching laporan simpanan: ", error);
    }
  };

  const fetchPembagianSHUByYear = async (year) => {
    try {
      const data = await getLapPendapatanByYear(year);
      setlapSHUByYear(data);
    } catch (error) {
      console.error(
        "Fetching Data Pembagian SHU By Year Error From Client-side:",
        error
      );
    }
  };

  const fetchKeanggotaan = async () => {
    try {
      const data = await getSHU();
      setKeanggotaan(data);
    } catch (error) {
      console.error("Fetching Data Keanggotaan Error From Client-side:", error);
    }
  };

  React.useEffect(() => {
    fetchedData();
  }, []);

  React.useEffect(() => {
    if (selectedYear) {
      fetchPembagianSHUByYear(selectedYear);
      fetchKeanggotaan();
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (lapSHU.length > 0) {
      // Mendapatkan nilai unik dari properti tahunSimpan
      const uniqueYears = Array.from(
        new Set(lapSHU.map((item) => item.tahunPinjam))
      );
      // Mengatur nilai-nilai unik tersebut sebagai pilihan dropdown
      setUniqueYears(uniqueYears);
    }
  }, [lapSHU]);

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
              onClick={() => {
                if (selectedYear) {
                  handlePrint();
                } else {
                  alert("Silahkan pilih tahun terlebih dahulu");
                  return;
                }
              }}
              style={{ cursor: "pointer" }}
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
                {formatRupiah(lapSHUByYear.pendapatanAngsuran)}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>Pengeluaran Kas Tahun Ini</Col>
              <Col />
              <Col className="fw-bold">
                {formatRupiah(lapSHUByYear.pengeluaranKas)}
              </Col>
            </Row>
            <Row>
              <Col>Profit Tahun Ini</Col>
              <Col />
              <Col className="fw-bold">
                {formatRupiah(lapSHUByYear.pendapatanJasa)}
              </Col>
            </Row>
          </Stack>
          <Stack>
            {selectedYear
              ? keanggotaan.map((anggota, index) => (
                  <Row className="mb-3" key={index}>
                    <Col>{anggota.jenisSHU}</Col>
                    <Col>{anggota.persentaseSHU}%</Col>
                    <Col className="fw-bold">
                      {selectedYear
                        ? formatRupiah(
                            (anggota.persentaseSHU / 100) *
                              lapSHUByYear.pendapatanJasa
                          )
                        : formatRupiah(0)}
                    </Col>
                  </Row>
                ))
              : null}
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
        selectedYear={selectedYear}
        lapSHUByYear={lapSHUByYear}
        keanggotaan={keanggotaan}
      />
    </>
  );
};

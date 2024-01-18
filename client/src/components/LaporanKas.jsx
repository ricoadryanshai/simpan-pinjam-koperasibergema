import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Stack, Card, Form, Table } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import { getLapKas, getLapKasByYear } from "../utils/api";
import { formatDate, formatRupiah } from "../utils/format";
import LaporanKasPrintOut from "./LaporanKasPrintOut";
import LaporanKasExport from "./LaporanKasExport";

const LaporanKas = () => {
  const [tahunTransaksi, setTahunTransaksi] = React.useState([]);
  const [transaksiKas, setTransaksiKas] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [uniqueYears, setUniqueYears] = React.useState([]);

  const jumlahNominalAllRows = transaksiKas.reduce((total, transaksi) => {
    const nominal = parseInt(transaksi.nominalTransaksi, 10);
    return total + nominal;
  }, 0);

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const tableRef = React.useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Laporan_Transaksi_Kas_Tahun_${
      selectedYear ? selectedYear : "YYYY"
    }`,
    sheet: "Laporan Pengeluaran",
  });

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const fetchYear = async () => {
    try {
      const data = await getLapKas();
      setTahunTransaksi(data);
    } catch (error) {
      console.log("Fetch Year Error From Client-side:", error);
    }
  };

  const fetchKasByYear = async (year) => {
    try {
      const data = await getLapKasByYear(year);
      setTransaksiKas(data);
    } catch (error) {
      console.log("Fetch Year Error From Client-side:", error);
    }
  };

  React.useEffect(() => {
    fetchYear();
  }, []);

  React.useEffect(() => {
    if (selectedYear) {
      fetchKasByYear(selectedYear);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    if (tahunTransaksi.length > 0) {
      const uniqueYears = Array.from(
        new Set(tahunTransaksi.map((item) => item.tahunTransaksi))
      );
      setUniqueYears(uniqueYears);
    }
  }, [tahunTransaksi]);
  return (
    <>
      <Stack gap={3}>
        <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
          <Stack direction="horizontal" className="justify-content-center">
            <Card.Title className="fw-bold text-uppercase text-center">
              Laporan Pengeluaran Koperasi Bergema{" "}
              {selectedYear ? selectedYear : "..."}
              <br />
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
        <Stack direction="horizontal" gap={3} className="justify-content-end">
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
        </Stack>
        <Table responsive hover size="sm" className="font-size-small">
          <thead className="table-info align-middle">
            <tr>
              <th className="text-center">No.</th>
              <th>Uraian</th>
              <th className="text-center">Tanggal Transaksi</th>
              <th>Nominal</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {transaksiKas.map((kas, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{kas.keterangan}</td>
                <td className="text-center">
                  {formatDate(kas.tanggalTransaksi)}
                </td>
                <td>{formatRupiah(kas.nominalTransaksi)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-light fw-bold">
            <tr>
              <td colSpan={3} className="text-center">
                Jumlah Pengeluaran Tahun Ini{" "}
                {selectedYear ? selectedYear : "..."}
              </td>
              <td colSpan={3}>{formatRupiah(jumlahNominalAllRows)}</td>
            </tr>
          </tfoot>
        </Table>
      </Stack>

      <LaporanKasPrintOut
        componentReference={componentRef}
        selectedYear={selectedYear}
        transaksiKas={transaksiKas}
        jumlahNominalAllRows={jumlahNominalAllRows}
      />
      <LaporanKasExport
        tableReference={tableRef}
        selectedYear={selectedYear}
        transaksiKas={transaksiKas}
        jumlahNominalAllRows={jumlahNominalAllRows}
      />
    </>
  );
};

export default LaporanKas;

import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Stack, Card } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useDownloadExcel } from "react-export-table-to-excel";
import { getLapKas } from "../utils/api";

// const LaporanKas = () => {
//   const [selectedYear, setSelectedYear] = React.useState("");

//   const componentRef = React.useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const tableRef = React.useRef(null);
//   const { onDownload } = useDownloadExcel({
//     currentTableRef: tableRef.current,
//     filename: `Laporan_Transaksi_Kas_Tahun_${
//       selectedYear ? selectedYear : "YYYY"
//     }`,
//     sheet: "Laporan Angsuran",
//   });

//   const fetchYear = async () => {
//     try {
//       const data = await getLapKas();
//       setSelectedYear(data);
//     } catch (error) {
//       console.log("Fetch Year Error From Client-side:", error);
//     }
//   };

//   React.useEffect(() => {
//     fetchYear();
//   }, []);
//   return (
//     <>
//       <Stack gap={3}>
//         <Stack className="justify-content-center py-3 border-bottom border-3 judul-cetak">
//           <Stack direction="horizontal" className="justify-content-center">
//             <Card.Title className="fw-bold text-uppercase text-center">
//               Laporan Angsuran Pinjaman Tahun{" "}
//               {selectedYear ? selectedYear - 1 : "..."} SD{" "}
//               {selectedYear ? selectedYear : "..."}
//               <br />
//               Kelurahan Gandaria Selatan
//             </Card.Title>
//           </Stack>
//           <Stack direction="horizontal" className="justify-content-end gap-3">
//             <FontAwesomeIcon
//               icon={faPrint}
//               onClick={handlePrint}
//               style={{ cursor: "pointer" }}
//             />
//             <FontAwesomeIcon
//               icon={faFileExport}
//               onClick={onDownload}
//               className="custom-icon-pointer"
//             />
//           </Stack>
//         </Stack>
//       </Stack>
//     </>
//   );
// };

// export default LaporanKas;

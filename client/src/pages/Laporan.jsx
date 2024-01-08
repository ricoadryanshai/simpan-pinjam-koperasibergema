import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { LaporanSHU } from "../components/LaporanSHU";
import { LaporanSimpanan } from "../components/LaporanSimpanan";
import { LaporanPinjaman } from "../components/LaporanPinjaman";
import { Container } from "react-bootstrap";
import { getKeanggotaan, getLapSHUByYear } from "../utils/api";

export default function Laporan() {
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [lapSHUByYear, setLapSHUByYear] = React.useState([]);

  const fetchPengaturanPersen = async () => {
    try {
      const data = await getKeanggotaan();
      setKeanggotaan(data);
    } catch (error) {
      console.log("Error fetching pengaturan persen: ", error);
    }
  };

  const fetchLapSHU = async (year) => {
    try {
      const data = await getLapSHUByYear(year);
      setLapSHUByYear(data);
    } catch (error) {
      console.log("Error fetching laporan shu: ", error);
    }
  };

  React.useEffect(() => {
    fetchPengaturanPersen();
  }, []);

  const filteredInvestor = keanggotaan.filter(
    (anggota) => anggota.jenisAnggota === "Investor"
  );
  const filteredAdministrasi = keanggotaan.filter(
    (anggota) => anggota.jenisAnggota === "Administrasi"
  );
  const filteredPengurus = keanggotaan.filter(
    (anggota) => anggota.jenisAnggota === "Pengurus"
  );

  const investorPersentaseSHU =
    filteredInvestor.length > 0 ? filteredInvestor[0].persentaseSHU : null;
  const administrasiPersentaseSHU =
    filteredAdministrasi.length > 0
      ? filteredAdministrasi[0].persentaseSHU
      : null;
  const pengurusPersentaseSHU =
    filteredPengurus.length > 0 ? filteredPengurus[0].persentaseSHU : null;

  const totalBayarAngsuranPerTahun =
    lapSHUByYear.totalBayarAngsuranPerTahun || null;
  const totalPengeluaranKasPerTahun =
    lapSHUByYear.totalPengeluaranKasPerTahun || null;
  // const totalSimpananPerTahun = lapSHUByYear.totalSimpananPerTahun || null;

  const bagianInvestor =
    (investorPersentaseSHU / 100) *
    (totalBayarAngsuranPerTahun - totalPengeluaranKasPerTahun);
  const bagianAdministrasi =
    (administrasiPersentaseSHU / 100) *
    (totalBayarAngsuranPerTahun - totalPengeluaranKasPerTahun);
  const bagianPengurus =
    (pengurusPersentaseSHU / 100) *
    (totalBayarAngsuranPerTahun - totalPengeluaranKasPerTahun);

  const objectSHU = {
    bagianInvestor: bagianInvestor,
    bagianAdministrasi: bagianAdministrasi,
    bagianPengurus: bagianPengurus,
  };

  return (
    <>
      <Container fluid>
        <Tabs defaultActiveKey="key-2" className="no-print" fill>
          <Tab
            eventKey="key-1"
            title="Laporan Pembagian SHU"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSHU
                keanggotaan={keanggotaan}
                lapSHUByYear={lapSHUByYear}
                fetchLapSHU={fetchLapSHU}
              />
            </Container>
          </Tab>
          <Tab
            eventKey="key-2"
            title="Laporan Simpanan"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanSimpanan
                objectSHU={objectSHU}
                fetchLapSHU={fetchLapSHU}
              />
            </Container>
          </Tab>
          <Tab
            eventKey="key-3"
            title="Laporan Angsuran"
            className="border border-top-0 rounded-bottom"
          >
            <Container fluid className="p-3">
              <LaporanPinjaman />
            </Container>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

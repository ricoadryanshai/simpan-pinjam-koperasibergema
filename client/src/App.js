import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  Beranda,
  Anggota,
  Simpanan,
  Pinjaman,
  Laporan,
  Transaksi,
  Pengaturan,
} from "./pages/index";

function App() {
  return (
    <>
      <Router basename="/kpgansel">
        <Header />
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/anggota" element={<Anggota />} />
          <Route path="/simpanan" element={<Simpanan />} />
          <Route path="/pinjaman" element={<Pinjaman />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan/simpan" element={<Pengaturan />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;

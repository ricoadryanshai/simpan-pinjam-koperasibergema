import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { getBeranda } from "../utils/api";
import { formatRupiah } from "../utils/format";

export const BerandaSummaryCard = () => {
  const [beranda, setBeranda] = useState([]);

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  const fetchData = async () => {
    try {
      setBeranda(await getBeranda());
    } catch (error) {
      console.log("Error fetching data statistik: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Card
        bg="danger"
        text="white"
        className="p-2"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
          <h3 className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Pinjaman
          </h3>
          <div className="d-flex justify-content-between">
            <span>Transaksi Bulan Ini</span>
            <span className="fw-bold"></span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Jumlah Tagihan Tahun Ini</span>
            <span className="fw-bold"></span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Sisa Tagihan Tahun Ini</span>
            <span className="fw-bold"></span>
          </div>
        </Container>
      </Card>
      <Card
        bg="success"
        text="white"
        className="p-2"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
          <h3 className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Simpanan {currentMonth} {new Date().getFullYear()}
          </h3>
          <div className="d-flex justify-content-between">
            <span>Jumlah Simpanan</span>
            <span className="fw-bold">
              {formatRupiah(beranda.jumlahSimpanan)}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Penarikan Simpanan</span>
            <span className="fw-bold">
              {formatRupiah(beranda.penarikanSimpanan)}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Jumlah Saldo Simpanan</span>
            <span className="fw-bold">{formatRupiah(beranda.jumlahSaldo)}</span>
          </div>
        </Container>
      </Card>
      <Card
        bg="primary"
        text="white"
        className="p-2"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
          <h3 className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Data Anggota
          </h3>
          <div className="d-flex justify-content-between">
            <span>Jumlah Anggota Terdaftar</span>
            <span className="fw-bold">{beranda.jumlahAnggota}</span>
          </div>
          <div />
          <div />
        </Container>
      </Card>
    </>
  );
};

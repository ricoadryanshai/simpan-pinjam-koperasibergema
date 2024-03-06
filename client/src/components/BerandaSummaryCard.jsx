import { useEffect, useState } from "react";
import { Card, Stack } from "react-bootstrap";
import { getBeranda, getKas } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLandmark,
  faMoneyBill,
  faPiggyBank,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const BerandaSummaryCard = () => {
  const [beranda, setBeranda] = useState([]);
  const [saldoKas, setSaldoKas] = useState([]);

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  const fetchData = async () => {
    try {
      setBeranda(await getBeranda());
    } catch (error) {
      console.error("Error fetching data statistik: ", error);
    }
  };

  const fetchSaldoKas = async () => {
    try {
      const data = await getKas();
      setSaldoKas(data);
    } catch (error) {
      console.error("Error fetching data saldo kas: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSaldoKas();
  }, []);
  return (
    <>
      <Stack direction="horizontal" gap={3} className="flex-wrap">
        <Card
          bg="danger"
          text="white"
          className="p-2 position-relative custom-card"
        >
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Pinjaman
          </Card.Title>
          <Card.Text>
            Transaksi Pinjam {currentMonth}:{" "}
            <span className="fw-bold">{formatRupiah(beranda.pinjamBulan)}</span>
          </Card.Text>
          <Card.Text>
            Transaksi Pinjam {new Date().getFullYear()}:{" "}
            <span className="fw-bold">
              {formatRupiah(beranda.tagihanPerTahun)}
            </span>
          </Card.Text>
          <Card.Text>
            Sisa Tagihan {new Date().getFullYear()}:{" "}
            <span className="fw-bold">
              {formatRupiah(beranda.sisaTagihanPerTahun)}
            </span>
          </Card.Text>
          <FontAwesomeIcon icon={faLandmark} className="floating-icon" />
        </Card>

        <Card
          bg="success"
          text="white"
          className="p-2 position-relative custom-card"
        >
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Simpanan {currentMonth} {new Date().getFullYear()}
          </Card.Title>
          <Card.Text>
            Jumlah Simpanan:{" "}
            <span className="fw-bold">
              {formatRupiah(beranda.jumlahSimpanan)}
            </span>
          </Card.Text>
          <Card.Text>
            Penarikan Simpanan:{" "}
            <span className="fw-bold">
              {formatRupiah(beranda.penarikanSimpanan)}
            </span>
          </Card.Text>
          <Card.Text>
            Jumlah Saldo Simpanan:{" "}
            <span className="fw-bold">{formatRupiah(beranda.jumlahSaldo)}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faPiggyBank} className="floating-icon" />
        </Card>

        <Card
          bg="primary"
          text="white"
          className="p-2 position-relative custom-card"
        >
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Data Anggota
          </Card.Title>
          <Card.Text>
            Jumlah Anggota Terdaftar:{" "}
            <span className="fw-bold">{beranda.jumlahAnggota}</span>
          </Card.Text>
          <Card.Text>
            Jumlah Anggota Aktif:{" "}
            <span className="fw-bold">{beranda.jumlahAktif}</span>
          </Card.Text>
          <Card.Text>
            Jumlah Anggota Tidak Aktif:{" "}
            <span className="fw-bold">{beranda.jumlahTidakAktif}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faUsers} className="floating-icon" />
        </Card>

        <Card
          bg="info"
          text="white"
          className="p-2 position-relative custom-card"
        >
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Data Kas Koperasi
          </Card.Title>
          <Card.Text>
            Total Saldo Kas:{" "}
            <span className="fw-bold">{formatRupiah(saldoKas.saldoKas)}</span>
          </Card.Text>
          <Card.Text>
            Profit Kas Tahun {new Date().getFullYear()}:{" "}
            <span className="fw-bold">{formatRupiah(beranda.profitTahun)}</span>
          </Card.Text>
          <Card.Text>
            Kebutuhan Kas Tahun {new Date().getFullYear()}:{" "}
            <span className="fw-bold">
              {formatRupiah(beranda.pengeluaranTahun)}
            </span>
          </Card.Text>
          <FontAwesomeIcon icon={faMoneyBill} className="floating-icon" />
        </Card>
      </Stack>
    </>
  );
};

import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { getBeranda } from "../utils/api";
import { formatRupiah } from "../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLandmark,
  faPiggyBank,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

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
  }, [beranda]);
  return (
    <>
      <Card
        bg="danger"
        text="white"
        className="p-2 position-relative"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Pinjaman
          </Card.Title>
          <Card.Text>
            Transaksi Pinjam {currentMonth}:{" "}
            <span className="fw-bold">{formatRupiah(beranda.pinjamBulan)}</span>
          </Card.Text>
          <Card.Text>
            Jumlah Tagihan {new Date().getFullYear()}:{" "}
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
        </Container>
        <FontAwesomeIcon icon={faLandmark} className="floating-icon" />
      </Card>
      <Card
        bg="success"
        text="white"
        className="p-2 position-relative"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
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
        </Container>
        <FontAwesomeIcon icon={faPiggyBank} className="floating-icon" />
      </Card>
      <Card
        bg="primary"
        text="white"
        className="p-2 position-relative"
        style={{ minWidth: "421.33px" }}
      >
        <Container className="p-1">
          <Card.Title className="pb-2 text-uppercase fw-bold border-bottom border-2">
            Data Anggota
          </Card.Title>
          <Card.Text>
            Jumlah Anggota Terdaftar:{" "}
            <span className="fw-bold">{beranda.jumlahAnggota}</span>
          </Card.Text>
        </Container>
        <FontAwesomeIcon icon={faUsers} className="floating-icon" />
      </Card>
    </>
  );
};

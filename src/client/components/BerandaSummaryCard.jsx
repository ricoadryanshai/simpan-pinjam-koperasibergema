import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { getBeranda } from "../utils/api";

export const BerandaSummaryCard = () => {
  const [beranda, setBeranda] = useState([]);

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  const cardObject = [
    {
      id: 1,
      bg: "warning",
      cardTitle: "Pinjaman",
      data1: 0,
      data2: 0,
      data3: 0,
    },
    {
      id: 2,
      bg: "success",
      cardTitle: `Simpanan ${currentMonth} ${new Date().getFullYear()}`,
      data1: `Jumlah Simpanan: ${formatRupiah(beranda.jumlahSimpanan)}`,
      data2: `Penarikan Simpanan: ${formatRupiah(beranda.penarikanSimpanan)}`,
      data3: `Jumlah Saldo Simpanan: ${formatRupiah(beranda.jumlahSaldo)}`,
    },
    {
      id: 3,
      bg: "primary",
      cardTitle: "Data Anggota",
      data1: `Jumlah Anggota Terdaftar: ${beranda.jumlahAnggota}`,
      data2: "",
      data3: "",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getBeranda();
      setBeranda(fetchedData);
    };
    fetchData();
  }, []);
  return (
    <>
      {cardObject.map((card) => (
        <Card
          key={card.id}
          style={{ minWidth: "400px" }}
          bg={card.bg}
          text="white"
          className="p-2"
        >
          <Container className="p-1">
            <h3>{card.cardTitle}</h3>
            <hr className="mb-2 mt-0" />
            <h6>{card.data1}</h6>
            <h6>{card.data2}</h6>
            <h6>{card.data3}</h6>
          </Container>
        </Card>
      ))}
    </>
  );
  function formatRupiah(angka) {
    if (typeof angka !== "number") {
      return "Rp. 0,00";
    }

    const formattedAngka = angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });

    return formattedAngka;
  }
};

import { Card, Container } from "react-bootstrap";

export const BerandaSummaryCard = () => {
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
      data1: 0,
      data2: 0,
      data3: 0,
    },
    {
      id: 3,
      bg: "primary",
      cardTitle: "Data Anggota",
      data1: 0,
      data2: 0,
      data3: 0,
    },
  ];
  return (
    <>
      {cardObject.map((card) => (
        <Card
          key={card.id}
          style={{ minWidth: "400px" }}
          bg={card.bg}
          text="white"
        >
          <Container>
            <h2 className="mt-2">{card.cardTitle}</h2>
            <hr className="mb-2 mt-0" />
            <p className="mb-1">Data 1: {card.data1}</p>
            <p className="mb-1">Data 2: {card.data2}</p>
            <p className="mb-1">Data 3: {card.data3}</p>
          </Container>
        </Card>
      ))}
    </>
  );
};

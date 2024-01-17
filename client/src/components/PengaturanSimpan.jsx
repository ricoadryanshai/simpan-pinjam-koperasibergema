import React from "react";
import { Card, Form, Button, Row, Col, Stack } from "react-bootstrap";
import { editPengaturan, getPengaturan } from "../utils/api";
import { formatNumber } from "../utils/format";

const PengaturanSimpan = () => {
  const [fetchData, setFetchData] = React.useState([]);

  const fetchingData = async () => {
    try {
      setFetchData(await getPengaturan());
    } catch (error) {
      console.log("Error fetching data pengaturan: ", error);
    }
  };

  React.useEffect(() => {
    fetchingData();
  }, []);

  const handleResetClick = async () => {
    fetchingData();
  };

  const handleSubmitClick = async () => {
    const simpananPokok = document.getElementById("simpananPokok").value;
    const simpananWajib = document.getElementById("simpananWajib").value;
    const bungaAngsuran = document.getElementById("bungaAngsuran").value;

    try {
      const cleanValue = (value) => {
        return value.replace(/\D/g, "");
      };

      const updatedPengaturan = {
        simpananPokok: cleanValue(simpananPokok),
        simpananWajib: cleanValue(simpananWajib),
        bungaAngsuran: bungaAngsuran,
      };

      await editPengaturan(updatedPengaturan);
      alert("Pengaturan berhasil di update.");
      fetchingData();
    } catch (error) {
      console.log("Update Error From Client-side Handle: ", error);
    }
  };
  return (
    <>
      <Stack className="justify-content-center align-items-center">
        <Card className="custom-width-card p-2">
          <Card.Title className="border-bottom pb-2 border-2 text-uppercase fw-bold">
            Pengaturan Simpanan
          </Card.Title>
          <Card.Body>
            <Form.Group as={Row} controlId="simpananPokok" className="mb-3">
              <Form.Label as={Col}>Simpanan Pokok</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={formatNumber(fetchData.simpananPokok)}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9-]/g, "");
                    setFetchData([{ ...fetchData[0], simpananPokok: value }]);
                  }}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="simpananWajib">
              <Form.Label as={Col}>Simpanan Wajib</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={formatNumber(fetchData.simpananWajib)}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9-]/g, "");
                    setFetchData([{ ...fetchData[0], simpananWajib: value }]);
                  }}
                  required
                />
              </Col>
            </Form.Group>
          </Card.Body>
          <Card.Title className="border-bottom border-top py-2 border-2 text-uppercase fw-bold">
            Pengaturan Angsuran
          </Card.Title>
          <Card.Body>
            <Form.Group as={Row} controlId="bungaAngsuran">
              <Form.Label as={Col}>Bunga Angsuran Jasa</Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  defaultValue={fetchData.bungaAngsuran}
                  required
                />
              </Col>
            </Form.Group>
          </Card.Body>
          <Card.Footer className="d-flex flex-gap-1 justify-content-end">
            <Button variant="secondary" onClick={() => handleResetClick()}>
              Reset
            </Button>
            <Button onClick={() => handleSubmitClick()}>Submit</Button>
          </Card.Footer>
        </Card>
      </Stack>
    </>
  );
};

export default PengaturanSimpan;

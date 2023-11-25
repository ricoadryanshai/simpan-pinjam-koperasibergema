import React from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { editPengaturan, getPengaturan } from "../utils/api";
import { formatNumber } from "../utils/format";
import { useNavigate } from "react-router-dom";

export const PengaturanSimpan = () => {
  const [fetchData, setFetchData] = React.useState([]);

  const simpananPokok =
    fetchData.length > 0 ? fetchData[0]?.simpananPokok || 0 : 0;
  const simpananWajib =
    fetchData.length > 0 ? fetchData[0]?.simpananWajib || 0 : 0;

  const bungaAngsuran =
    fetchData.length > 0 ? fetchData[0]?.bungaAngsuran || 0 : 0;

  const navigate = useNavigate();

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

  const handleResetClick = async () => {};

  const handleSubmitClick = async () => {
    try {
      const cleanValue = (value) => {
        return value.replace(/\D/g, "");
      };

      const updatedPengaturan = {
        simpananPokok: cleanValue(
          document.getElementById("simpananPokok")?.value || ""
        ),
        simpananWajib: cleanValue(
          document.getElementById("simpananWajib")?.value || ""
        ),
        bungaAngsuran: cleanValue(
          document.getElementById("bungaAngsuran")?.value || ""
        ),
      };

      await editPengaturan(updatedPengaturan);
      navigate("/");
    } catch (error) {
      console.log("Error editing data pengaturan: ", error);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-width">
          <Card.Header>
            <Card.Title>Pengaturan Simpanan</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Simpanan Pokok</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="simpananPokok"
                    id="simpananPokok"
                    value={formatNumber(simpananPokok)}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9-]/g, "");
                      setFetchData([{ ...fetchData[0], simpananPokok: value }]);
                    }}
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Simpanan Wajib</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="simpananWajib"
                    id="simpananWajib"
                    value={formatNumber(simpananWajib)}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9-]/g, "");
                      setFetchData([{ ...fetchData[0], simpananWajib: value }]);
                    }}
                    required
                  />
                </Col>
              </Row>
            </Form>
          </Card.Body>
          <Card.Header>
            <Card.Title>Pengaturan Bunga</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col>
                <Form.Label>Bunga Angsuran</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  name="bungaAngsuran"
                  id="bungaAngsuran"
                  value={formatNumber(bungaAngsuran)}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9-]/g, "");
                    value = value % 12 === 0 ? "12" : (value % 12).toString();
                    setFetchData([{ ...fetchData[0], bungaAngsuran: value }]);
                  }}
                  required
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="d-flex flex-gap-1 justify-content-end">
            <Button variant={"secondary"} onClick={() => handleResetClick()}>
              Reset
            </Button>
            <Button onClick={() => handleSubmitClick()}>Submit</Button>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

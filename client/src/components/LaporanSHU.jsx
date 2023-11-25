// eslint-disable-next-line no-unused-vars
import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export const LaporanSHU = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="custom-width-card">
          <Card.Header>
            <Card.Title style={{ textAlign: "center" }}>
              Laporan Pembagian SHU Periode {new Date().getFullYear()}
            </Card.Title>
          </Card.Header>
          <Card.Body as={Row}>
            <Col>
              <Card.Text>Total Pendapatan Jasa</Card.Text>
              <Card.Text>Total Transaksi Kas Keluar</Card.Text>
            </Col>
            <Col>
              <Card.Text style={{ textAlign: "end" }}>1.000.000</Card.Text>
              <Card.Text style={{ textAlign: "end" }}>200.000</Card.Text>
            </Col>
          </Card.Body>
          <Card.Header>
            <Card.Title>Pembagian SHU untuk dana-dana</Card.Title>
          </Card.Header>
          <Card.Body as={Row}>
            <Col>
              <Card.Text>SHU untuk pinjaman</Card.Text>
              <Card.Text>SHU untuk penyerahan modal</Card.Text>
            </Col>
            <Col>
              <Card.Text style={{ textAlign: "center" }}>30%</Card.Text>
              <Card.Text style={{ textAlign: "center" }}>10%</Card.Text>
            </Col>
            <Col>
              <Card.Text style={{ textAlign: "end" }}>10.000.000</Card.Text>
              <Card.Text style={{ textAlign: "end" }}>1.000.000</Card.Text>
            </Col>
          </Card.Body>
          <Card.Header>
            <Card.Title>Pembagian SHU Anggota</Card.Title>
          </Card.Header>
          <Card.Body as={Row}>
            <Col>
              <Card.Text>Investor</Card.Text>
              <Card.Text>Administrasi</Card.Text>
              <Card.Text>Pengurus</Card.Text>
            </Col>
            <Col>
              <Card.Text style={{ textAlign: "center" }}>20%</Card.Text>
              <Card.Text style={{ textAlign: "center" }}>10%</Card.Text>
              <Card.Text style={{ textAlign: "center" }}>30%</Card.Text>
            </Col>
            <Col>
              <Card.Text style={{ textAlign: "end" }}>10.000.000</Card.Text>
              <Card.Text style={{ textAlign: "end" }}>1.000.000</Card.Text>
              <Card.Text style={{ textAlign: "end" }}>1.000.000</Card.Text>
            </Col>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

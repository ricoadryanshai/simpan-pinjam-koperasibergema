/* eslint-disable react/prop-types */
import React from "react";
import { Container, Card, Stack, Row, Col } from "react-bootstrap";
import { formatRupiah } from "../utils/format";

export const LaporanSHUPrintOut = ({
  componentReference,
  selectedYear,
  keanggotaan,
  lapSHUByYear,
}) => {
  return (
    <div className="no-display print-only" ref={componentReference}>
      <Container fluid className="p-3">
        <Card.Title className="py-3 border-bottom border-3 fw-bold text-uppercase text-center mb-3">
          {selectedYear ? (
            <>
              Laporan Pembagian SHU Tahun {selectedYear}
              <br />
              Kelurahan Gandaria Selatan
            </>
          ) : (
            <>
              Laporan Pembagian SHU Tahun ...
              <br />
              Kelurahan Gandaria Selatan
            </>
          )}
        </Card.Title>
        <Stack className="pb-3 mb-3 border-bottom border-3">
          <Row className="mb-3">
            <Col>Pendapatan Angsuran Jasa Tahun Ini</Col>
            <Col />
            <Col className="fw-bold">
              {formatRupiah(lapSHUByYear.pendapatanAngsuran)}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>Pengeluaran Kas Tahun Ini</Col>
            <Col />
            <Col className="fw-bold">
              {formatRupiah(lapSHUByYear.pengeluaranKas)}
            </Col>
          </Row>
          <Row>
            <Col>Profit Tahun Ini</Col>
            <Col />
            <Col className="fw-bold">
              {formatRupiah(lapSHUByYear.pendapatanJasa)}
            </Col>
          </Row>
        </Stack>
        <Stack>
          {selectedYear
            ? keanggotaan.map((anggota, index) => (
                <Row className="mb-3" key={index}>
                  <Col>{anggota.jenisSHU}</Col>
                  <Col>{anggota.persentaseSHU}%</Col>
                  <Col className="fw-bold">
                    {selectedYear
                      ? formatRupiah(
                          (anggota.persentaseSHU / 100) *
                            lapSHUByYear.pendapatanJasa
                        )
                      : formatRupiah(0)}
                  </Col>
                </Row>
              ))
            : null}
        </Stack>
      </Container>
    </div>
  );
};

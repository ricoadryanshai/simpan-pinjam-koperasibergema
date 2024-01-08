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
        <Card.Title className="fw-bold text-uppercase text-center mb-3">
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
            <Col>Angsuran Jasa</Col>
            <Col />
            <Col className="fw-bold">
              {formatRupiah(lapSHUByYear.totalBayarAngsuranPerTahun)}
            </Col>
          </Row>
          <Row>
            <Col>Pengeluaran Kebutuhan Kas</Col>
            <Col />
            <Col className="fw-bold">
              {formatRupiah(lapSHUByYear.totalPengeluaranKasPerTahun)}
            </Col>
          </Row>
        </Stack>
        <Stack>
          {keanggotaan
            .filter((anggota) => anggota.id !== 6)
            .map((anggota, index) => (
              <Row className="mb-3" key={index}>
                <Col>{anggota.jenisAnggota}</Col>
                <Col>{anggota.persentaseSHU}%</Col>
                <Col className="fw-bold">
                  {selectedYear
                    ? formatRupiah(
                        (anggota.persentaseSHU / 100) *
                          (lapSHUByYear.totalBayarAngsuranPerTahun -
                            lapSHUByYear.totalPengeluaranKasPerTahun)
                      )
                    : formatRupiah(0)}
                </Col>
              </Row>
            ))}
        </Stack>
      </Container>
    </div>
  );
};

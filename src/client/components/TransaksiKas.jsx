import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { TransaksiTambahModal } from "./TransaksiTambahModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { TransaksiEditModal } from "./TransaksiEditModal";
import { fetchTransaksi } from "../utils/fetch";
import { formatDate, formatRupiah } from "../utils/format";
import { deleteTransaction } from "../utils/handle";

export default function TransaksiKas() {
  const [transaksi, setTransaksi] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleDeleteWrapper = async (id) => {
    await deleteTransaction(id, setTransaksi);
  };

  const handleEdit = (transaksi) => {
    handleEdit(transaksi, setSelectedItem, setShowEdit);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const transactions = await fetchTransaksi();
      if (transactions) {
        setTransaksi(transactions);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card>
        <Container>
          <h4 className="mt-2 text-uppercase fw-bold">Data Transaksi Kas</h4>
          <hr className="mt-2 mb-2" />
          <Button className="mb-2 no-print" onClick={() => setShowTambah(true)}>
            Tambah Transaksi
            <FontAwesomeIcon
              icon={faSquarePlus}
              size="lg"
              style={{ marginInlineStart: "0.2rem" }}
            />
          </Button>
          <Table hover responsive size="sm">
            <thead className="table-light">
              <tr className="text-center table-info">
                <th>No.</th>
                <th>Tanggal Transaksi</th>
                <th>Jenis Transaksi</th>
                <th>Uraian</th>
                <th>Nominal Transaksi</th>
                <th colSpan={2} className="no-print">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((transaksi, index) => (
                <tr className="text-center align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{formatDate(transaksi.tanggalTransaksi)}</td>
                  <td>{transaksi.jenisTransaksi}</td>
                  <td>{transaksi.keterangan}</td>
                  <td className="text-end">
                    {formatRupiah(parseFloat(transaksi.nominalTransaksi))}
                  </td>
                  <td className="no-print">
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(transaksi)}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ marginInlineEnd: "0.2rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                  <td className="no-print">
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteWrapper(transaksi.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        style={{ marginInlineEnd: "0.2rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Card>

      <TransaksiTambahModal
        show={showTambah}
        onHide={() => setShowTambah(false)}
      />

      {selectedItem && (
        <TransaksiEditModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          selectedTransaction={selectedItem}
        />
      )}
    </>
  );
}

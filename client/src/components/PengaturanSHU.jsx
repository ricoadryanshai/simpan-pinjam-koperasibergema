import React from "react";
import {
  deleteKeanggotaan,
  getKeanggotaan,
  getSHU,
  postKeanggotaan,
} from "../utils/api";
import { Table, Card, Stack, Button } from "react-bootstrap";
import PengaturanSHUModalEdit from "./PengaturanSHUModalEdit";
import PengaturanSHUModalTambah from "./PengaturanSHUModalTambah";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import PengaturanSHUModalDelete from "./PengaturanSHUModalDelete";

const PengaturanSHU = () => {
  const [shuAnggota, setSHUAnggota] = React.useState([]);
  const [keanggotaan, setKeanggotaan] = React.useState([]);
  const [showTambah, setShowTambah] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [record, setRecord] = React.useState([]);

  const fetchSHU = async () => {
    try {
      const data = await getSHU();
      setSHUAnggota(data);
    } catch (error) {
      console.log("Error fetching member's SHU: ", error);
    }
  };

  const fetchKeanggotaan = async () => {
    try {
      const data = await getKeanggotaan();
      setKeanggotaan(data);
    } catch (error) {
      console.log("Fetching Error From Client-side: ", error);
    }
  };

  React.useEffect(() => {
    fetchSHU();
    fetchKeanggotaan();
  }, []);

  const handleModalShow = (modalType, data) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(true);
        break;
      case "edit":
        setShowEdit(true);
        setRecord(data);
        break;
      case "delete":
        setShowDelete(true);
        setRecord(data);
        break;
      default:
        break;
    }
  };

  const handleModalClose = (modalType) => {
    switch (modalType) {
      case "tambah":
        setShowTambah(false);
        fetchSHU();
        break;
      case "edit":
        setShowEdit(false);
        fetchSHU();
        fetchKeanggotaan();
        break;
      case "delete":
        setShowDelete(false);
        fetchSHU();
        fetchKeanggotaan();
        break;
      default:
        break;
    }
  };

  /* const handleDeleteClick = async (id) => {
    try {
      await deleteSHU(id);
      await fetchSHU();
      fetchKeanggotaan();
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  }; */

  const handleTampilClick = async (recordData) => {
    const objectData = {
      jenisSHU: recordData.jenisSHU,
    };

    const jenisSHU = keanggotaan.map((item) => item.jenisSHU);

    if (jenisSHU.includes(recordData.jenisSHU)) {
      alert("Jenis SHU sudah ditampilkan.");
    } else {
      try {
        await postKeanggotaan(objectData);
        fetchKeanggotaan();
      } catch (error) {
        console.log("Insert Error From Client-side:", error);
      }
    }
  };

  const handleSembunyiClick = async (id) => {
    try {
      await deleteKeanggotaan(id);
      fetchKeanggotaan();
    } catch (error) {
      console.log("Delete Error From Client-side:", error);
    }
  };
  return (
    <>
      <Stack
        direction="horizontal"
        className="justify-content-center mx-3"
        gap={3}
      >
        <Card className="p-2">
          <Card.Title className="border-bottom pb-2 border-2 text-uppercase fw-bold">
            Pengaturan SHU Keanggotaan
          </Card.Title>
          <Stack direction="horizontal" className="justify-content-start pb-2">
            {/* <Button variant="primary" onClick={() => handleModalShow("tambah")}>
              Tambah Jenis SHU
              <FontAwesomeIcon icon={faSquarePlus} className="ms-1" />
            </Button> */}
          </Stack>
          <Table hover>
            <thead className="table-info">
              <tr className="text-center">
                <th>No.</th>
                <th>Nama Jenis SHU</th>
                <th>Persentase SHU</th>
                <th colSpan={3}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {shuAnggota.map((shu, index) => (
                <tr className="text-center align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{shu.jenisSHU}</td>
                  <td>{shu.persentaseSHU}%</td>
                  <td>
                    {
                      <Button
                        variant="warning"
                        onClick={() => handleModalShow("edit", shu)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="me-1"
                        />
                        Edit
                      </Button>
                    }
                  </td>
                  {/* <td>
                    {
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(shu.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="me-1" />
                        Delete
                      </Button>
                    }
                  </td> */}
                  <td>
                    {
                      <Button
                        variant="info"
                        onClick={() => handleTampilClick(shu)}
                      >
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        Tampilkan
                      </Button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card className="p-2">
          <Card.Title className="border-bottom pb-2 border-2 text-uppercase fw-bold">
            Keanggotaan Ditampilkan
          </Card.Title>
          <Table hover>
            <thead className="table-info">
              <tr className="text-center">
                <th>No.</th>
                <th>Jenis SHU</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {keanggotaan.map((shu, index) => (
                <tr className="text-center align-middle" key={index}>
                  <td>{index + 1}</td>
                  <td>{shu.jenisSHU}</td>
                  <td>
                    {
                      <Button
                        variant="danger"
                        onClick={() => handleModalShow("delete", shu)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="me-1" />
                        Delete
                      </Button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Stack>

      <PengaturanSHUModalTambah
        show={showTambah}
        onHide={() => handleModalClose("tambah")}
        shuAnggota={shuAnggota}
      />

      <PengaturanSHUModalEdit
        show={showEdit}
        onHide={() => handleModalClose("edit")}
        record={record}
      />

      <PengaturanSHUModalDelete
        show={showDelete}
        onHide={() => handleModalClose("delete")}
        record={record}
        onDelete={handleSembunyiClick}
      />
    </>
  );
};

export default PengaturanSHU;

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  deleteAnggota,
  getAnggota,
  getAnggotaById,
  editAnggota,
} from "../utils/api";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";

function AnggotaTable() {
  const [anggotaData, setAnggotaData] = useState([]);
  const [show, setShow] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    kodeAnggota: "",
    nama: "",
    jenKel: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    noHP: "",
  });

  const fetchDataForEdit = async (id) => {
    try {
      const data = await getAnggotaById(id); // Fetch data for the selected record
      // Set the fetched data into the editFormData state
      setEditFormData({
        kodeAnggota: data.kodeAnggota,
        nama: data.nama,
        jenKel: data.jenKel,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        alamat: data.alamat,
        noHP: data.noHP,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = async () => {
    // Perform the edit by sending editFormData to the server using editAnggota function
    try {
      // Format the date in the editFormData as dd/mm/yyyy
      const formattedDate = formatDate(editFormData.tanggalLahir);
      const editData = { ...editFormData, tanggalLahir: formattedDate };

      // Perform the edit by sending editData to the server using editAnggota function
      await editAnggota(editRecordId, editData);
      handleClose();

      // Optionally, you can refetch the updated data for your table
      setAnggotaData(await getAnggota()); // Update the state with the new data
    } catch (error) {
      console.error("Error editing data:", error);
    }
  };

  // Function to format the date as dd/mm/yyyy
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleShow = (id) => {
    setEditRecordId(id);
    setShow(true);
    // Fetch data for the selected record when the modal is shown
    fetchDataForEdit(id);
  };

  const handleClose = () => {
    setEditRecordId(null);
    setShow(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setAnggotaData(await getAnggota());
    };

    fetchData();
  }, []);

  const handlerDelete = async (id) => {
    try {
      await deleteAnggota(id); // Call the delete function
      // You may also update the state or re-fetch the data here
      setAnggotaData(await getAnggota()); // Fetch the updated data
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <>
      <Container fluid="xl">
        <Card>
          <Card.Header>
            <Card.Title className="fw-bold text-uppercase mt-2">
              Data Anggota
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table hover responsive size="sm">
              <thead>
                <tr className="text-center text-uppercase align-middle fs-7">
                  <th>No.</th>
                  <th>Kode Anggota</th>
                  <th>Nama</th>
                  <th>Jenis Kelamin</th>
                  <th>Tempat Lahir</th>
                  <th>Tanggal Lahir</th>
                  <th>Alamat</th>
                  <th>No. HP</th>
                  <th>Tanggal Daftar</th>
                  <th colSpan={3}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {anggotaData.map((anggota, index) => (
                  <tr key={index} className="align-middle">
                    <td className="text-center align-middle">{index + 1}</td>
                    <td>{anggota.kodeAnggota}</td>
                    <td>{anggota.nama}</td>
                    <td>{anggota.jenKel}</td>
                    <td>{anggota.tempatLahir}</td>
                    <td>{anggota.tanggalLahir}</td>
                    <td>{anggota.alamat}</td>
                    <td>{anggota.noHP}</td>
                    <td>{anggota.tanggalDaftar}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="md"
                        onClick={() => handleShow(anggota.id)}
                      >
                        Edit
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => handlerDelete(anggota.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Data Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Kode Anggota</Form.Label>
              <Form.Control
                type="text"
                name="kodeAnggota"
                value={editFormData.kodeAnggota}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    kodeAnggota: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={editFormData.nama}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    nama: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Col>
                <Form.Check
                  type="radio"
                  label="Pria"
                  name="jenKel"
                  value="Pria"
                  checked={editFormData.jenKel === "Pria"}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      jenKel: e.target.value,
                    })
                  }
                  required
                />
              </Col>
              <Col>
                <Form.Check
                  type="radio"
                  label="Wanita"
                  name="jenKel"
                  value="Wanita"
                  checked={editFormData.jenKel === "Wanita"}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      jenKel: e.target.value,
                    })
                  }
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Label>Tempat Lahir</Form.Label>
              <Form.Control
                type="text"
                name="tempatLahir"
                value={editFormData.tempatLahir}
                onChange={(e) => {
                  setEditFormData({
                    ...editFormData,
                    tempatLahir: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tanggal Lahir</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="tanggalLahir"
                  value={editFormData.tanggalLahir}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      tanggalLahir: e.target.value,
                    });
                  }}
                  required
                />
                <InputGroup.Text id="basic-addon1">dd/mm/yyyy</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                name="alamat"
                value={editFormData.alamat}
                onChange={(e) => {
                  setEditFormData({
                    ...editFormData,
                    alamat: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>No. Mobile Phone</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="noHP"
                  value={editFormData.noHP}
                  onChange={(e) => {
                    setEditFormData({
                      ...editFormData,
                      noHP: e.target.value,
                    });
                  }}
                  required
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AnggotaTable;

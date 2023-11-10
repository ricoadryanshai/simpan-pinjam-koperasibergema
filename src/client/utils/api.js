import axios from "axios";

const API_ENDPOINT = "http://localhost:3002";

// API endpoint to GET tbl_anggota data
export const getAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/anggota`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_anggota & tbl_simpan
export const getSimpanAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/simpan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_anggota & `tbl_pinjam`
export const getPinjamAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/pinjam`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_simpan for lap_simpan
export const getLapSimpanan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lap_simpan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_pengaturan
export const getPengaturan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/pengaturan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_simpan data by kodeAnggota
export const getSimpanAnggotaById = async (kodeAnggota) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/get/simpan/${kodeAnggota}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to GET tbl_anggota data by id
export const getAnggotaById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/anggota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API endpoint to POST tbl_anggota data
export const tambahAnggota = async (anggotaData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/post/anggota`,
      anggotaData
    );
    return response.data;
  } catch (error) {
    console.error("Error inputing data:", error);
    throw error;
  }
};

// API endpoint to POST tbl_simpan data
export const tambahSimpan = async (
  kodeAnggota,
  tanggalSimpan,
  jenisSimpan,
  saldo,
  uploadFile
) => {
  const formData = new FormData();
  formData.append("kodeAnggota", kodeAnggota);
  formData.append("tanggalSimpan", tanggalSimpan);
  formData.append("jenisSimpan", jenisSimpan);
  formData.append("saldo", saldo);
  formData.append("uploadFile", uploadFile);

  try {
    const response = await axios.post(`${API_ENDPOINT}/post/simpan`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error inputing data:", error);
    throw error;
  }
};

// API endpoint to DELETE tbl_anggota data by id
export const deleteAnggota = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/anggota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const deleteSimpan = async (kodeAnggota, id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINT}/delete/simpan/${kodeAnggota}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// API endpoint to UPDATE tbl_anggota data by id
export const editAnggota = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/anggota/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

// API endpoint to UPDATE tbl_pengaturan data by id
export const editPengaturan = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/pengaturan/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

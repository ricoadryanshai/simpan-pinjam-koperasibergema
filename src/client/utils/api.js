import axios from "axios";

const API_ENDPOINT = "http://localhost:3002";

// START >>> API ENDPOINT BERANDA

export const getBeranda = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/beranda`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API ENDPOINT BERANDA <<< END

// START >>> API ENDPOINT ANGGOTA

export const getAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/anggota`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getAnggotaById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/anggota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

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

export const deleteAnggota = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/anggota/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

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

// API ENDPOINT ANGGOTA <<< END

// START >>> API ENDPOINT SIMPANAN

export const getSimpanAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/simpan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

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

// API ENDPOINT SIMPANAN <<< END

// START >>> API ENDPOINT PINJAMAN

export const getPinjamAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/pinjam`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API ENDPOINT PINJAMAN <<< END

// START >>> API ENDPOINT TRANSAKSI

export const getTransaksi = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/transaksi`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post("/post/transaksi", transactionData);

    if (response.status === 200) {
      console.log("Transaction added successfully");
    } else {
      console.error("Failed to add transaction");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// API ENDPOINT TRANSAKSI <<< END

// START >>> API ENDPOINT LAPORAN

export const getLapSimpanan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lap_simpan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// API ENDPOINT LAPORAN <<< END

// START >>> API ENDPOINT PENGATURAN

export const getPengaturan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/pengaturan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

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

// API ENDPOINT PENGATURAN <<< END

import axios from "axios";
import { API_ENDPOINT } from "./server_port";

// START >>> API ENDPOINT BERANDA

export const getBeranda = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/statistik`);
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

export const tambahSimpan = async (objectData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/post/simpan`,
      objectData
    );
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

export const getPinjamByKodeAnggota = async (kodeAnggota) => {
  try {
    const res = await axios.get(`${API_ENDPOINT}/get/pinjam/${kodeAnggota}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBayar = async () => {
  try {
    const res = await axios.get(`${API_ENDPOINT}/get/bayar`);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBayarByKodeAnggota = async (kodeAnggota) => {
  try {
    const res = await axios.get(`${API_ENDPOINT}/get/bayar/${kodeAnggota}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deletePinjamByKodeAnggota = async (kodeAnggota, id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINT}/delete/pinjam/${kodeAnggota}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const getBayarAngsuran = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/angsuran`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBayarAngsuranById = async (idPinjam) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/get/angsuran/${idPinjam}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postPinjam = async (data) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/post/pinjam`, data);
    return response.data;
  } catch (error) {
    console.error("Error insert data:", error);
    throw error;
  }
};

export const postAngsuran = async (data) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/post/angsuran`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateBayarAngsuran = async (id) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/put/pinjam/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update transaction");
  }
};

export const updateLunasAngsuran = async (idPinjam) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/angsuran/${idPinjam}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update transaction");
  }
};

// API ENDPOINT PINJAMAN <<< END

// START >>> API ENDPOINT TRANSAKSI

export const getKas = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/kas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getKasByYear = async (year) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/kas/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getTransaksi = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/transaksi`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const tambahTransaksi = async (transaksiData) => {
  try {
    await axios.post(`${API_ENDPOINT}/post/transaksi`, transaksiData);
  } catch (error) {
    console.error("Error adding data:", error.message);
    throw new Error("Internal Server Error");
  }
};

export const deleteTransaksi = async (transaksiId) => {
  try {
    const deleteResponse = await axios.delete(
      `${API_ENDPOINT}/delete/transaksi/${transaksiId}`
    );
    return deleteResponse.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    throw new Error("Internal Server Error");
  }
};

export const editTransaksi = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/transaksi/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update transaction");
  }
};

// API ENDPOINT TRANSAKSI <<< END

// START >>> API ENDPOINT LAPORAN

export const getLapSimpanan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapSimpan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapSimpananByYear = async (year) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapSimpan/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapAngsuran = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapAngsuran`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapAngsuranByYear = async (year) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapAngsuran/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapKas = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapKas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapKasByYear = async (year) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapKas/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getLapPendapatan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/lapPembagianSHU`);
    return response.data;
  } catch (error) {
    console.error("Fetching Laporan Pembagian Error From Client-side:", error);
    throw error;
  }
};

export const getLapPendapatanByYear = async (year) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/get/lapPembagianSHU/${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Fetching Laporan Pembagian Error From Client-side:", error);
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
    console.error("Fetching Error From Client-side:", error);
    throw error;
  }
};

export const getKeanggotaan = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/keanggotaan`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postKeanggotaan = async (objectData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/post/keanggotaan`,
      objectData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deleteKeanggotaan = async (id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINT}/delete/keanggotaan/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getSHU = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/setSHU`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postSHU = async (objectData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/post/setSHU`,
      objectData
    );
    return response.data;
  } catch (error) {
    console.log("Error submitting data:", error);
    throw error;
  }
};

export const editPengaturan = async (updatedData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/pengaturan`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

export const editSHU = async (updatedData, id) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/put/setSHU/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

export const deleteSHU = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/setSHU/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error deleting data: ", error);
    throw error;
  }
};

// API ENDPOINT PENGATURAN <<< END

// API ENDPOINT LOGIN <<< START

export const postLogin = async ({ username, password }, onLogin) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/post/login`, {
      username,
      password,
    });

    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
};

// API ENDPOINT LOGIN <<< END

// START >>> API ENDPOINT MISC

export const getMiscPinjam = async (year) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/get/miscPinjam/${year}`);
    return response.data;
  } catch (error) {
    console.error(
      "Fetch Kode Anggota From Table Pinjam Error From Client-side:",
      error
    );
    throw error;
  }
};

// API ENDPOINT MISC <<< END

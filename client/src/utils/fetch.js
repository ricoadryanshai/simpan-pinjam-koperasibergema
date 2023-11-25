import { getAnggota, getSimpanAnggota, getTransaksi } from "./api";

// Anggota >>>
export const fetchAnggota = async () => {
  try {
    const res = await getAnggota();
    return res;
  } catch (error) {
    // Handle error jika diperlukan
    console.error("Error fetching anggota:", error);
    return null;
  }
};

// Transaksi >>>
export const fetchTransaksi = async () => {
  try {
    const res = await getTransaksi();
    return res;
  } catch (error) {
    // Handle error jika diperlukan
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const fetchSimpanan = async (setSimpananData) => {
  try {
    const fetchedData = await getSimpanAnggota();
    setSimpananData(fetchedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

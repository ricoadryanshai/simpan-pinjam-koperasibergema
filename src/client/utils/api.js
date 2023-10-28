import axios from "axios";

const API_ENDPOINT = "http://localhost:3002";

export const getAnggota = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/read`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getAnggotaById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/read/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const tambahAnggota = async (anggotaData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/create`, anggotaData);
    return response.data;
  } catch (error) {
    console.error("Error inputing data:", error);
    throw error;
  }
};

export const deleteAnggota = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const editAnggota = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error editing data:", error);
    throw error;
  }
};

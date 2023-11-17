import { deleteAnggota, getAnggota } from "./api";

export const handleDeleteFunction = async (id, setAnggotaData) => {
  try {
    await deleteAnggota(id);
    const newData = await getAnggota();
    setAnggotaData(newData);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

import { deleteAnggota, deleteSimpan, deleteTransaksi } from "./api";

export const handleEdit = (item, setSelectedItem, setShowEditModal) => {
  setSelectedItem(item);
  setShowEditModal(true);
};

export const deleteMembers = async (id, setData) => {
  try {
    await deleteAnggota(id);
    setData((prevTransaksi) => prevTransaksi.filter((item) => item.id !== id));
    console.log("Data deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

export const deleteTransaction = async (id, setData) => {
  try {
    await deleteTransaksi(id);
    setData((prevTransaksi) => prevTransaksi.filter((item) => item.id !== id));
    console.log("Data deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error.message);
  }
};

export const deleteSimpanan = async (
  kodeAnggota,
  transactionId,
  modalData,
  setHeaderData,
  updateModalData,
  setIsDeleting,
  formatRupiah,
  headerData
) => {
  try {
    setIsDeleting(true);

    await deleteSimpan(kodeAnggota, transactionId);

    const updatedData = modalData.filter(
      (transaction) => transaction.id !== transactionId
    );

    const newTotalSaldo = updatedData.reduce((total, transaction) => {
      return (
        total +
        (transaction.jenisSimpan === "Ambil Simpanan"
          ? -transaction.saldo
          : transaction.saldo)
      );
    }, 0);

    setHeaderData({
      ...headerData,
      totalSaldo: formatRupiah(newTotalSaldo),
    });

    updateModalData(updatedData);

    setIsDeleting(false);
  } catch (error) {
    console.error("Error deleting data:", error);
    setIsDeleting(false);
  }
};

export const formatDate = (dateString) => {
  const inputDate = new Date(dateString);
  const isInvalidDate = isNaN(inputDate.getTime());

  if (isInvalidDate) {
    return "dd/mm/yyyy";
  }

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const formattedDate = inputDate.toLocaleDateString("id-ID", options);
  return formattedDate;
};

export const formatRupiah = (angka) => {
  if (typeof angka !== "number") {
    angka = parseFloat(angka);
    if (isNaN(angka)) {
      return "Rp 0,00";
    }
  }

  // Jika angka kurang dari 0, tampilkan sebagai 0
  angka = Math.max(0, angka);

  const formattedAngka = angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });

  return formattedAngka;
};

export const formatNumber = (number) => {
  // Jika angka kurang dari 0, tampilkan sebagai 0
  number = Math.max(0, number);

  return new Intl.NumberFormat("id-ID").format(number);
};

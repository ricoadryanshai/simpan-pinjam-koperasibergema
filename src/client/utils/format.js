export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-GB",
    options
  );
  return formattedDate;
};

export const formatRupiah = (angka) => {
  if (typeof angka !== "number") {
    return "Rp 0,00";
  }

  const formattedAngka = angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });

  return formattedAngka;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("id-ID").format(number);
};

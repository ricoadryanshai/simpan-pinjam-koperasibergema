const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const chalk = require("chalk");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3023;
// const ip_address = "192.168.1.18";
const ip_address = "192.168.43.225";

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/image/");
  },
  filename: function (req, file, cb) {
    const hash = crypto.createHash("md5");
    hash.update(file.originalname + Date.now());
    const fileName = hash.digest("hex") + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(extname)) {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid file type"));
    }
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "client/build")));

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

// MySQL Configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_bergema",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err);
  } else {
    console.log("Connected to the database");
  }
});

// Function to execute a query and return the result
function getQueryResult(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function getArrayResult(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function executeQueryResult(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// START >>> API ENDPOINT BERANDA

app.get("/get/statistik", async (req, res) => {
  try {
    const jumlahAnggota = await getQueryResult(`
      SELECT
        COUNT(*) AS jumlahAnggota
      FROM
        tbl_anggota
    `);

    const jumlahSimpanan = await getQueryResult(`
      SELECT
        SUM(CASE WHEN tbl_simpan.jenisSimpan <> 'Ambil Simpanan' THEN tbl_simpan.saldo ELSE 0 END) AS jumlahSimpanan
      FROM
        tbl_simpan
      WHERE
        MONTH(tbl_simpan.tanggalSimpan) = MONTH(CURRENT_DATE())
        AND YEAR(tbl_simpan.tanggalSimpan) = YEAR(CURRENT_DATE())`);

    const penarikanSimpanan = await getQueryResult(`
      SELECT
        SUM(CASE WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' THEN tbl_simpan.saldo ELSE 0 END) AS penarikanSimpanan
      FROM
        tbl_simpan
      WHERE
        MONTH(tbl_simpan.tanggalSimpan) = MONTH(CURRENT_DATE())
        AND YEAR(tbl_simpan.tanggalSimpan) = YEAR(CURRENT_DATE())`);

    const jumlahSaldo = await getQueryResult(`
      SELECT
        SUM(CASE WHEN tbl_simpan.jenisSimpan <> 'Ambil Simpanan' THEN tbl_simpan.saldo ELSE 0 END) -
        SUM(CASE WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' THEN tbl_simpan.saldo ELSE 0 END) AS jumlahSaldo
      FROM
        tbl_simpan
      WHERE
        MONTH(tbl_simpan.tanggalSimpan) = MONTH(CURRENT_DATE())
        AND YEAR(tbl_simpan.tanggalSimpan) = YEAR(CURRENT_DATE())`);

    const pinjamBulan = await getQueryResult(`
      SELECT
        SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Pinjam' THEN angsuranPokok ELSE 0 END) AS pinjamBulan
      FROM
        tbl_pinjam
      WHERE
        MONTH(tbl_pinjam.tanggalTransaksi) = MONTH(CURRENT_DATE())
        AND YEAR(tbl_pinjam.tanggalTransaksi) = YEAR(CURRENT_DATE())
    `);

    const tagihanPerTahun = await getQueryResult(`
      SELECT
        SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Pinjam' THEN angsuranPerBulan ELSE 0 END) AS tagihanPerTahun
      FROM
        tbl_pinjam
      WHERE
        YEAR(tbl_pinjam.tanggalTransaksi) = YEAR(CURRENT_DATE())
    `);

    const sisaTagihanPerTahun = await getQueryResult(`
      SELECT
        (total_pinjam - total_bayar) AS sisaTagihanPerTahun
      FROM
        (
          SELECT
            COALESCE(SUM(CASE WHEN jenisTransaksi = 'Pinjam' THEN angsuranPerBulan ELSE 0 END), 0) AS total_pinjam,
            COALESCE(SUM(CASE WHEN jenisTransaksi <> 'Pinjam' THEN angsuranPerBulan ELSE 0 END), 0) AS total_bayar
          FROM
            tbl_pinjam
          WHERE
            YEAR(tanggalTransaksi) = YEAR(CURRENT_DATE())
        ) AS subqueryAlias;
    `);

    res.status(200).json({
      jumlahAnggota: jumlahAnggota.jumlahAnggota,
      jumlahSimpanan: jumlahSimpanan.jumlahSimpanan,
      penarikanSimpanan: penarikanSimpanan.penarikanSimpanan,
      jumlahSaldo: jumlahSaldo.jumlahSaldo,
      pinjamBulan: pinjamBulan.pinjamBulan,
      tagihanPerTahun: tagihanPerTahun.tagihanPerTahun,
      sisaTagihanPerTahun: sisaTagihanPerTahun.sisaTagihanPerTahun,
    });
  } catch (error) {
    console.error("Error fetching data: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API ENDPOINT BERANDA <<< END

// START >>> API ENDPOINT ANGGOTA

app.get("/get/anggota", (req, res) => {
  db.query(
    "SELECT * FROM tbl_anggota ORDER BY kodeAnggota ASC",
    (err, results) => {
      if (err) {
        console.error("Error fetching data: " + err.sqlMessage);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/get/anggota/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM tbl_anggota WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.put("/put/anggota/:id", (req, res) => {
  const id = req.params.id;

  const { kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP } =
    req.body;

  const updateQuery = `UPDATE tbl_anggota
    SET kodeAnggota = ?, nama = ?, jenKel = ?, tempatLahir = ?, tanggalLahir = ?, alamat = ?, noHP = ?
    WHERE id = ?`;

  db.query(
    updateQuery,
    [kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP, id],
    (err, result) => {
      if (err) {
        console.error("Error updating record:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Record updated:", result);
        res.status(200).json({ message: "Record updated successfully" });
      }
    }
  );
});

app.delete("/delete/anggota/:id", (req, res) => {
  const id = req.params.id;

  const deleteQuery = `DELETE FROM tbl_anggota WHERE id = ?`;

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Record deleted:", result);
      res.status(200).json({ message: "Record deleted successfully" });
    }
  });
});

app.post("/post/anggota", async (req, res) => {
  const {
    kodeAnggota,
    nama,
    jenisAnggota,
    jenKel,
    tempatLahir,
    tanggalLahir,
    alamat,
    noHP,
  } = req.body;

  const today = new Date();
  const date = today.getDate();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const currentDate = `${year}-${month}-${date}`;

  const insertQuery = `INSERT INTO tbl_anggota (kodeAnggota, nama, jenisAnggota, jenKel, tempatLahir, tanggalLahir, alamat, noHP, tanggalDaftar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    kodeAnggota,
    nama,
    jenisAnggota,
    jenKel,
    tempatLahir,
    tanggalLahir,
    alamat,
    noHP,
    currentDate,
  ];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data inserted successfully", result);
      res.status(200).json({ message: "Data inserted successfully" });
    }
  });
});

// API ENDPOINT ANGGOTA <<< END

// START >>> API ENDPOINT SIMPANAN

app.get("/get/simpan", (req, res) => {
  const sqlQuery = `
    SELECT
    tbl_anggota.kodeAnggota,
    tbl_anggota.nama,
    tbl_anggota.tanggalDaftar,
    (
      SUM(CASE WHEN jenisSimpan != 'Ambil Simpanan' THEN saldo ELSE 0 END) -
      SUM(CASE WHEN jenisSimpan = 'Ambil Simpanan' THEN saldo ELSE 0 END)
    ) AS totalSaldo,
    (
      SUM(CASE 
        WHEN jenisSimpan NOT IN ('Simpanan Pokok', 'Simpanan Wajib', 'Ambil Simpanan') THEN saldo 
        ELSE 0 
      END) -
      SUM(CASE WHEN jenisSimpan = 'Ambil Simpanan' THEN saldo ELSE 0 END)
    ) AS bisaAmbil
    FROM tbl_anggota
    LEFT JOIN tbl_simpan ON tbl_anggota.kodeAnggota = tbl_simpan.kodeAnggota
    WHERE tbl_anggota.jenisAnggota != 'Non-Benefit'
    GROUP BY tbl_anggota.kodeAnggota, tbl_anggota.nama
    ORDER BY kodeAnggota ASC
  `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/post/simpan", upload.single("uploadFile"), (req, res) => {
  const { kodeAnggota, tanggalSimpan, jenisSimpan, saldo } = req.body;
  let uploadFile = null;

  if (req.file) {
    uploadFile = req.file.filename;
  }

  const insertQuery = `
    INSERT INTO tbl_simpan (kodeAnggota, tanggalSimpan, jenisSimpan, saldo, uploadFile)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [kodeAnggota, tanggalSimpan, jenisSimpan, saldo, uploadFile],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Record inserted:", result);
        res.status(200).json({ message: "Record inserted successfully" });
      }
    }
  );
});

app.get("/get/simpan/:kodeAnggota", async (req, res) => {
  const { kodeAnggota } = req.params;

  const selectQuery = `
    SELECT
      *
    FROM
      tbl_simpan
    WHERE
      kodeAnggota = ?
    ORDER BY
      tanggalSimpan DESC;
  `;

  try {
    const results = await getArrayResult(selectQuery, kodeAnggota);
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetching Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/simpan/:kodeAnggota/:id", async (req, res) => {
  const { kodeAnggota, id } = req.params;

  const sqlQuery = `DELETE FROM tbl_simpan WHERE tbl_simpan.kodeAnggota = ? AND tbl_simpan.id = ?`;

  const values = [kodeAnggota, id];

  try {
    await executeQueryResult(sqlQuery, values);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Deleting Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API ENDPOINT SIMPANAN <<< END

// START >>> API ENDPOINT PINJAMAN

app.get("/get/pinjam", (req, res) => {
  const sqlQuery = `
    SELECT
      tbl_anggota.kodeAnggota,
      tbl_anggota.nama,
      tbl_anggota.tanggalDaftar,
      COALESCE(SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Pinjam' THEN tbl_pinjam.angsuranPerBulan ELSE 0 END), 0) AS jumlahHutang,
      COALESCE(SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Bayar' THEN tbl_pinjam.angsuranPerBulan ELSE 0 END), 0) AS jumlahBayar
    FROM
      tbl_anggota
    LEFT JOIN
      tbl_pinjam ON tbl_anggota.kodeAnggota = tbl_pinjam.kodeAnggota
    GROUP BY
      tbl_anggota.kodeAnggota, tbl_anggota.nama, tbl_anggota.tanggalDaftar
    ORDER BY
      tbl_anggota.kodeAnggota ASC
  `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/get/pinjam/:kodeAnggota", (req, res) => {
  const { kodeAnggota } = req.params;

  const selectQuery = `
    SELECT *
    FROM tbl_pinjam
    WHERE kodeAnggota = ?
    ORDER BY createdAt DESC;
  `;

  db.query(selectQuery, [kodeAnggota], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/get/bayar/:kodeAnggota", (req, res) => {
  const { kodeAnggota } = req.params;

  const selectQuery = `
    SELECT
      *
    FROM
      tbl_pinjam
    WHERE
      kodeAnggota = ? AND jenisTransaksi = 'Pinjam'
    ORDER BY
      createdAt DESC
    LIMIT
      1
  `;

  db.query(selectQuery, [kodeAnggota], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/get/angsuran/:idPinjam", (req, res) => {
  const idPinjam = req.params.idPinjam;

  const query = `SELECT id, idPinjam, uangAngsuran, jasaUang, totalBayar, tanggalBayar FROM tbl_angsuran WHERE idPinjam = ?`;

  db.query(query, [idPinjam], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/post/pinjam", async (req, res) => {
  const {
    kodeAnggota,
    jenisTransaksi,
    angsuran,
    tanggalTransaksi,
    angsuranPokok,
    angsuranJasa,
    angsuranPerBulan,
  } = req.body;

  const insertPinjamQuery = `INSERT INTO tbl_pinjam (kodeAnggota, jenisTransaksi, angsuran, tanggalTransaksi, angsuranPokok, angsuranJasa, angsuranPerBulan) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const pinjamValues = [
    kodeAnggota,
    jenisTransaksi,
    angsuran,
    tanggalTransaksi,
    angsuranPokok,
    angsuranJasa,
    angsuranPerBulan,
  ];

  try {
    // Insert data into tbl_pinjam
    const pinjamInsertResult = await new Promise((resolve, reject) => {
      db.query(insertPinjamQuery, pinjamValues, (err, result) => {
        if (err) {
          console.error(
            "Error inserting data into tbl_pinjam: " + err.sqlMessage
          );
          reject(err);
        } else {
          console.log("Data inserted into tbl_pinjam successfully", result);
          resolve(result.insertId); // Resolving with ID of the newly inserted data
        }
      });
    });

    // Get bungaAngsuran from tbl_pengaturan
    const bungaAngsuranQuery = `SELECT bungaAngsuran FROM tbl_pengaturan WHERE idPengaturan = 1`;

    const bungaAngsuranFromDB = await new Promise((resolve, reject) => {
      db.query(bungaAngsuranQuery, (err, result) => {
        if (err) {
          console.error("Error retrieving bungaAngsuran: " + err.sqlMessage);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(parseFloat(result[0].bungaAngsuran));
          } else {
            reject(new Error("No data found for idPengaturan = 1"));
          }
        }
      });
    });

    // Calculate values for tbl_angsuran
    const uangAngsuran = angsuranPokok / angsuran;
    const jasaUang = angsuranPokok * (parseInt(bungaAngsuranFromDB) / 100);
    const totalBayar = uangAngsuran + jasaUang;

    // Create an array to hold values for multiple rows insertion into tbl_angsuran
    const angsuranValues = Array.from({ length: angsuran }, () => [
      pinjamInsertResult, // Using the ID from tbl_pinjam insertion
      uangAngsuran,
      jasaUang,
      totalBayar,
    ]);

    const insertAngsuranQuery = `INSERT INTO tbl_angsuran (idPinjam, uangAngsuran, jasaUang, totalBayar) VALUES ?`;

    // Insert data into tbl_angsuran
    await new Promise((resolve, reject) => {
      db.query(insertAngsuranQuery, [angsuranValues], (err, result) => {
        if (err) {
          console.error(
            "Error inserting data into tbl_angsuran: " + err.sqlMessage
          );
          reject(err);
        } else {
          console.log("Data inserted into tbl_angsuran successfully", result);
          resolve();
        }
      });
    });

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/pinjam/:kodeAnggota/:id", (req, res) => {
  const { id } = req.params;

  // Query untuk menghapus data berdasarkan kodeAnggota dan id
  const deleteQuery = "DELETE FROM tbl_pinjam WHERE id = ?";

  // Menjalankan query dengan parameter yang diberikan
  db.query(deleteQuery, [id], (err) => {
    if (err) {
      res.status(500).send("Gagal menghapus data");
      throw err;
    }
    res.status(200).send("Data berhasil dihapus");
  });
});

app.put("/put/pinjam/:id", async (req, res) => {
  const { id } = req.params;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const updateQuery = `
    UPDATE tbl_angsuran
    SET
      tanggalBayar = '${formattedDate}'
    WHERE id = ${id}
  `;

  try {
    await getQueryResult(updateQuery);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/put/angsuran/:idPinjam", async (req, res) => {
  const { idPinjam } = req.params;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const updateQuery = `
    UPDATE tbl_angsuran
    SET tanggalBayar = '${formattedDate}'
    WHERE idPinjam = ${idPinjam}
      AND (tanggalBayar IS NULL OR tanggalBayar = '')
  `;

  try {
    await getQueryResult(updateQuery);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/post/angsuran", async (req, res) => {
  const {
    kodeAnggota,
    jenisTransaksi,
    angsuran,
    tanggalTransaksi,
    angsuranPokok,
    angsuranJasa,
    angsuranPerBulan,
  } = req.body;

  const insertPinjamQuery = `INSERT INTO tbl_pinjam (kodeAnggota, jenisTransaksi, angsuran, tanggalTransaksi, angsuranPokok, angsuranJasa, angsuranPerBulan) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const pinjamValues = [
    kodeAnggota,
    jenisTransaksi,
    angsuran,
    tanggalTransaksi,
    angsuranPokok,
    angsuranJasa,
    angsuranPerBulan,
  ];

  try {
    // Insert data into tbl_pinjam
    const pinjamInsertResult = await new Promise((resolve, reject) => {
      db.query(insertPinjamQuery, pinjamValues, (err, result) => {
        if (err) {
          console.error(
            "Error inserting data into tbl_pinjam: " + err.sqlMessage
          );
          reject(err);
        } else {
          console.log("Data inserted into tbl_pinjam successfully", result);
          resolve(result.insertId); // Resolving with ID of the newly inserted data
        }
      });
    });

    res.status(200).json({
      message: "Data inserted into tbl_pinjam successfully",
      insertId: pinjamInsertResult,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API ENDPOINT PINJAMAN <<< END

// START >>> API ENDPOINT TRANSAKSI KAS

app.get("/get/kas", async (req, res) => {
  try {
    const queryKas = await getQueryResult(`
      SELECT
        totalTransaksiMasuk,
        totalTransaksiKeluar,
        (totalTransaksiMasuk - totalTransaksiKeluar) AS saldoTransaksiKas
      FROM (
        SELECT
          SUM(CASE WHEN jenisTransaksi != 'Transaksi Keluar' THEN nominalTransaksi ELSE 0 END) AS totalTransaksiMasuk,
          SUM(CASE WHEN jenisTransaksi = 'Transaksi Keluar' THEN nominalTransaksi ELSE 0 END) AS totalTransaksiKeluar
        FROM tbl_transaksi
      ) AS subqueryAlias
    `);

    const querySimpanan = await getQueryResult(`
      SELECT
        totalSimpananPokok,
        totalSimpananWajib,
        totalSimpananSukarela,
        totalAmbilSimpanan,
        (totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela) - totalAmbilSimpanan AS saldoSimpanan
      FROM (
        SELECT
          SUM(CASE WHEN jenisSimpan = 'Simpanan Pokok' THEN saldo ELSE 0 END) AS totalSimpananPokok,
          SUM(CASE WHEN jenisSimpan = 'Simpanan Wajib' THEN saldo ELSE 0 END) AS totalSimpananWajib,
          SUM(CASE WHEN jenisSimpan = 'Simpanan Sukarela' THEN saldo ELSE 0 END) AS totalSimpananSukarela,
          SUM(CASE WHEN jenisSimpan = 'Ambil Simpanan' THEN saldo ELSE 0 END) AS totalAmbilSimpanan
        FROM tbl_simpan
      ) AS subqueryAlias
    `);

    const queryPinjaman = await getQueryResult(`
        SELECT
          jumlahPinjaman,
          jumlahBayaran,
          (jumlahBayaran - jumlahPinjaman) AS saldoPinjaman
        FROM (
          SELECT
            SUM(CASE WHEN jenisTransaksi = 'Pinjam' THEN angsuranPokok ELSE 0 END) AS jumlahPinjaman,
            SUM(CASE WHEN jenisTransaksi = 'Bayar' THEN angsuranPerBulan ELSE 0 END) AS jumlahBayaran
          FROM tbl_pinjam
        ) AS subqueryAlias
    `);

    res.status(200).json({
      transaksiKas: queryKas.saldoTransaksiKas,
      sPokokWajib: querySimpanan.saldoSimpanan,
      pinjaman: queryPinjaman.saldoPinjaman,
      saldoKas:
        queryKas.saldoTransaksiKas +
        querySimpanan.saldoSimpanan +
        queryPinjaman.saldoPinjaman,
    });
  } catch (error) {
    console.error("Error fetching data: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/transaksi", (req, res) => {
  sqlQuery = `SELECT * FROM tbl_transaksi ORDER BY tanggalTransaksi DESC`;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/post/transaksi", async (req, res) => {
  const { jenisTransaksi, tanggalTransaksi, nominalTransaksi, keterangan } =
    req.body;

  // Query untuk menambahkan data ke tbl_transaksi
  const insertQuery = `
    INSERT INTO tbl_transaksi (jenisTransaksi, tanggalTransaksi, nominalTransaksi, keterangan)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    jenisTransaksi,
    tanggalTransaksi,
    nominalTransaksi,
    keterangan,
  ];

  try {
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error(
          "Error inserting data into tbl_transaksi: " + err.sqlMessage
        );
        res
          .status(500)
          .json({ error: "Error inserting data into tbl_transaksi" });
      } else {
        console.log("Data inserted into tbl_transaksi successfully", result);
        res.status(200).json({ insertId: result.insertId });
      }
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/transaksi/:id", async (req, res) => {
  const transaksiId = req.params.id;

  try {
    // Pastikan bahwa transaksiId adalah angka
    if (!/^\d+$/.test(transaksiId)) {
      return res.status(400).json({ error: "Invalid parameter" });
    }

    // Periksa apakah data dengan ID yang diberikan ada di database
    const checkQuery = `SELECT * FROM tbl_transaksi WHERE id = ${transaksiId}`;
    const existingData = await getQueryResult(checkQuery);

    if (existingData.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Jika data ada, lakukan penghapusan
    const deleteQuery = `DELETE FROM tbl_transaksi WHERE id = ${transaksiId}`;
    await getQueryResult(deleteQuery);

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res
      .status(500)
      .json({ error: "Error deleting data", message: error.message });
  }
});

app.put("/put/transaksi/:id", async (req, res) => {
  const { id } = req.params;
  const { jenisTransaksi, tanggalTransaksi, nominalTransaksi, keterangan } =
    req.body;

  const updateQuery = `
    UPDATE tbl_transaksi
    SET
      jenisTransaksi = '${jenisTransaksi}',
      tanggalTransaksi = '${tanggalTransaksi}',
      nominalTransaksi = ${nominalTransaksi},
      keterangan = '${keterangan}'
    WHERE id = ${id};
  `;

  try {
    await getQueryResult(updateQuery);
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API ENDPOINT TRANSAKSI KAS <<< END

// START >>> API ENDPOINT LAPORAN

app.get("/get/lapSimpan", async (req, res) => {
  const sqlQuery = `
    SELECT
      YEAR(tanggalSimpan) AS tahunSimpan
    FROM
      tbl_simpan
    GROUP BY
      tahunSimpan
    ORDER BY
      tahunSimpan DESC
  `;

  try {
    const results = await getArrayResult(sqlQuery);
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetching Year Error From Server-side: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/lapSimpan/:year", async (req, res) => {
  const year = req.params.year;

  const sqlQuery = `
    SELECT 
      a.kodeAnggota, 
      a.nama,
      a.jenisAnggota,
      YEAR(s.tanggalSimpan) AS tahunSimpan,
      SUM(CASE WHEN s.jenisSimpan = 'Simpanan Pokok' THEN s.saldo ELSE 0 END) AS simpananPokok,
      SUM(CASE WHEN s.jenisSimpan = 'Simpanan Wajib' THEN s.saldo ELSE 0 END) AS simpananWajib,
      SUM(CASE WHEN s.jenisSimpan = 'Simpanan Sukarela' THEN s.saldo ELSE 0 END) AS simpananSukarela,
      SUM(CASE WHEN s.jenisSimpan = 'Ambil Simpanan' AND YEAR(s.tanggalSimpan) = ? THEN s.saldo ELSE 0 END) AS penarikan
    FROM
      tbl_anggota a
    LEFT JOIN
      tbl_simpan s ON a.kodeAnggota = s.kodeAnggota
    LEFT JOIN
      tbl_keanggotaan k ON a.jenisAnggota = k.jenisSHU
    WHERE
      YEAR(s.tanggalSimpan) = ?
    GROUP BY
      a.kodeAnggota, tahunSimpan
    ORDER BY
      a.kodeAnggota
  `;

  const values = [year, year];

  try {
    const results = await getArrayResult(sqlQuery, values);
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetching Laporan Error From Server-side: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/lapAngsuran", (req, res) => {
  const sqlQuery = `
    SELECT 
      YEAR(tanggalTransaksi) AS tahunPinjam
    FROM tbl_pinjam
    GROUP BY tahunPinjam
    ORDER BY tahunPinjam DESC
  `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/get/lapAngsuran/:year", (req, res) => {
  const yearInt = parseInt(req.params.year);

  const sqlQuery = `
    SELECT
      s.id,
      a.nama,
      s.tanggalTransaksi,
      s.angsuranPokok AS nominalPinjam,
      s.angsuran,
      s.angsuranPerBulan AS nominalTagihan,
      s.angsuranJasa AS nominalJasa,
      ROUND((s.angsuranPokok / s.angsuran), 2) AS angsuranPokok,
      ROUND((s.angsuranPokok * (SELECT bungaAngsuran FROM tbl_pengaturan LIMIT 1) / 100), 2) AS angsuranJasa,
      ROUND(((s.angsuranPokok / s.angsuran) + (s.angsuranPokok * (SELECT bungaAngsuran FROM tbl_pengaturan LIMIT 1) / 100)), 2) AS angsuranPerBulan,
      ROUND(SUM(CASE WHEN (k.tanggalBayar IS NOT NULL OR k.tanggalBayar = '') AND YEAR(k.tanggalBayar) <= ? THEN k.uangAngsuran ELSE 0 END), 2) AS bayarAngsuranPokok,
      ROUND(SUM(CASE WHEN (k.tanggalBayar IS NOT NULL OR k.tanggalBayar = '') AND YEAR(k.tanggalBayar) <= ? THEN k.jasaUang ELSE 0 END), 2) AS bayarAngsuranJasa,
      ROUND(SUM(CASE WHEN (k.tanggalBayar IS NOT NULL OR k.tanggalBayar = '') AND YEAR(k.tanggalBayar) <= ? THEN k.totalBayar ELSE 0 END), 2) AS bayarTagihan,
      (CASE WHEN (s.angsuranPokok - ROUND(SUM(CASE WHEN (k.tanggalBayar IS NOT NULL OR k.tanggalBayar = '') AND YEAR(k.tanggalBayar) <= ? THEN k.uangAngsuran ELSE 0 END), 2)) <= 0 THEN 'Lunas' ELSE 'Belum Lunas' END) AS statusPinjaman
    FROM tbl_anggota a
    LEFT JOIN tbl_pinjam s ON a.kodeAnggota = s.kodeAnggota
    LEFT JOIN tbl_angsuran k ON s.id = k.idPinjam
    WHERE YEAR(s.tanggalTransaksi) >= ? - 1 AND YEAR(s.tanggalTransaksi) <= ?
      AND s.jenisTransaksi = 'Pinjam'
    GROUP BY s.id
    ORDER BY s.createdAt DESC
  `;

  const startYear = yearInt - 1;
  const endYear = yearInt;

  db.query(
    sqlQuery,
    [yearInt, yearInt, yearInt, yearInt, startYear, endYear],
    (err, results) => {
      if (err) {
        console.error("Error fetching data: " + err.sqlMessage);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/get/lapKas", async (req, res) => {
  const sqlQuery = `
    SELECT 
      YEAR(tanggalTransaksi) AS tahunTransaksi,
      createdAt
    FROM
      tbl_transaksi
    GROUP BY
      tahunTransaksi
    ORDER BY
      createdAt DESC
  `;

  try {
    const results = await getArrayResult(sqlQuery);
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetching Year Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/lapKas/:year", async (req, res) => {
  const year = req.params.year;

  sqlQuery = `
    SELECT
      *
    FROM
      tbl_transaksi
    WHERE
      YEAR(tanggalTransaksi) = ?
  `;

  const values = [year];

  try {
    const results = await getArrayResult(sqlQuery, values);
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetching Laporan Error From Server-side: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/lapPembagianSHU", async (req, res) => {
  sqlQueryJasa = await getQueryResult(`
    SELECT
      SUM(CASE WHEN jenisTransaksi = 'Bayar' THEN angsuranJasa ELSE 0 END) AS totalJasa
    FROM
      tbl_pinjam
  `);

  sqlQueryTransaksi = await getQueryResult(`
    SELECT
      SUM(CASE WHEN jenisTransaksi = 'Transaksi Keluar' THEN nominalTransaksi ELSE 0 END) AS totalTransaksiKeluar
    FROM
      tbl_transaksi
  `);

  try {
    const objectData = {
      totalJasa: sqlQueryJasa.totalJasa,
      totalTransaksiKeluar: sqlQueryTransaksi.totalTransaksiKeluar,
      totalPendapatan:
        sqlQueryJasa.totalJasa - sqlQueryTransaksi.totalTransaksiKeluar,
    };
    res.status(200).json(objectData);
  } catch (error) {
    console.error("Fetch Jasa Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/lapPembagianSHU/:year", async (req, res) => {
  const { year } = req.params;

  sqlQueryJasa = await getQueryResult(
    `
    SELECT
      SUM(CASE WHEN jenisTransaksi = 'Bayar' THEN angsuranJasa ELSE 0 END) AS totalJasa
    FROM
      tbl_pinjam
    WHERE
      YEAR(tanggalTransaksi) = ${year}
  `
  );

  sqlQueryTransaksi = await getQueryResult(
    `
    SELECT
      SUM(CASE WHEN jenisTransaksi = 'Transaksi Keluar' THEN nominalTransaksi ELSE 0 END) AS totalTransaksiKeluar
    FROM
      tbl_transaksi
    WHERE
      YEAR(tanggalTransaksi) = ${year}
  `
  );
  try {
    res.status(200).json({
      totalJasa: sqlQueryJasa.totalJasa,
      totalTransaksiKeluar: sqlQueryTransaksi.totalTransaksiKeluar,
      totalPendapatan:
        sqlQueryJasa.totalJasa - sqlQueryTransaksi.totalTransaksiKeluar,
    });
  } catch (error) {
    console.error("Fetch Jasa Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API ENDPOINT LAPORAN <<< END

// START >>> API ENDPOINT PENGATURAN

app.get("/get/pengaturan", async (req, res) => {
  const sqlQuery = `
      SELECT
        simpananPokok,
        simpananWajib,
        bungaAngsuran
      FROM
        tbl_pengaturan
      WHERE
        idPengaturan = 1
  `;

  try {
    const results = await getQueryResult(sqlQuery);

    const objectData = {
      simpananPokok: results.simpananPokok,
      simpananWajib: results.simpananWajib,
      bungaAngsuran: results.bungaAngsuran,
    };

    res.status(200).json(objectData);
  } catch (error) {
    console.error("Fetching Error From Server-side: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/put/pengaturan", async (req, res) => {
  const { simpananPokok, simpananWajib, bungaAngsuran } = req.body;

  const updateQuery = `
    UPDATE
      tbl_pengaturan
    SET
      simpananPokok = ?,
      simpananWajib = ?,
      bungaAngsuran = ?
    WHERE
      idPengaturan = 1
  `;

  const values = [simpananPokok, simpananWajib, bungaAngsuran];

  try {
    await executeQueryResult(updateQuery, values);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Fetching Error From Server-side: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/keanggotaan", (req, res) => {
  const sqlQuery = `
    SELECT
      *
    FROM
      tbl_keanggotaan
    ORDER BY
      jenisSHU, id
    `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/post/keanggotaan", async (req, res) => {
  const { jenisSHU } = req.body;

  sqlQuery = `INSERT INTO tbl_keanggotaan (jenisSHU) VALUES (?)`;
  try {
    await executeQueryResult(sqlQuery, jenisSHU);
    res.status(200).json({ success: "Insert Success From Server-side" });
  } catch (error) {
    console.log("Error submitting data to table keanggotaan:", error);
    res.status(500).json({ error: "Insert Error From Server-side" });
  }
});

app.delete("/delete/keanggotaan/:id", async (req, res) => {
  const { id } = req.params;

  const sqlQuery = `DELETE FROM tbl_keanggotaan WHERE tbl_keanggotaan.id = ?`;

  try {
    await executeQueryResult(sqlQuery, id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Delete Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/setSHU", async (req, res) => {
  const sqlQuery = `
    SELECT
      *
    FROM
      tbl_pembagian_shu
    ORDER BY
      persentaseSHU DESC, jenisSHU, id
    `;

  try {
    const results = await getArrayResult(sqlQuery);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching record:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/post/setSHU", async (req, res) => {
  const { jenisSHU, persentaseSHU } = req.body;

  sqlQuery = `INSERT INTO tbl_pembagian_shu (jenisSHU, persentaseSHU) VALUES (?, ?)`;

  const values = [jenisSHU, persentaseSHU];

  try {
    await executeQueryResult(sqlQuery, values);
    res.status(200).json({ success: "Insert Success From Server-side" });
  } catch (error) {
    console.log("Error submitting data to table pengaturan SHU:", error);
    res.status(500).json({ error: "Insert Error From Server-side" });
  }
});

app.put("/put/setSHU/:id", async (req, res) => {
  const { id } = req.params;
  const { jenisSHU, persentaseSHU } = req.body;

  const updateQuery = `
    UPDATE
      tbl_pembagian_shu
    SET
      jenisSHU = ?,
      persentaseSHU = ?
    WHERE
      tbl_pembagian_shu.id = ?
  `;

  const values = [jenisSHU, persentaseSHU, id];

  try {
    const response = await executeQueryResult(updateQuery, values);
    res.status(200).json(response);
  } catch (error) {
    console.error("Update Error From Server-side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/setSHU/:id", async (req, res) => {
  const { id } = req.params;

  const sqlQuery = `
    DELETE
    FROM
      tbl_pembagian_shu
    WHERE
      tbl_pembagian_shu.id = ?
  `;

  values = [id];

  try {
    await executeQueryResult(sqlQuery, values);
    res.status(200).json({
      message: "Data deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting record:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// API ENDPOINT PENGATURAN <<< END

// Fungsi untuk menghapus file dari direktori
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};

// Fungsi untuk mencari dan menghapus file serta mengupdate nilai uploadFile dalam database
const processFiles = () => {
  let affectedRows = 0; // Untuk melacak jumlah baris yang terpengaruh

  // Logika untuk mendapatkan tahun saat ini
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Query untuk mendapatkan data yang sesuai dengan kriteria
  const selectQuery = `SELECT * FROM tbl_simpan WHERE YEAR(tanggalSimpan) = ? AND uploadFile IS NOT NULL`;
  db.query(selectQuery, [lastYear], (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    results.forEach((row) => {
      const filePath = path.join("./uploads/image", row.uploadFile);
      if (fs.existsSync(filePath)) {
        deleteFile(filePath);
        affectedRows++; // Menambah jumlah baris yang terpengaruh
      }

      // Update nilai uploadFile menjadi NULL atau kosong
      const updateQuery = `UPDATE tbl_simpan SET uploadFile = NULL WHERE id = ?`;
      db.query(updateQuery, [row.id], (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
        } else {
          console.log("Data updated successfully");
        }
      });
    });

    console.log(`Total ${affectedRows} files affected`);
  });
};

processFiles();

// Start the server
app.listen(port, () => {
  console.log(
    `${chalk.bold("Local:")} \t\t\t http://localhost:${chalk.bold(port)}`
  );
});

app.listen(port, ip_address, () => {
  console.log(
    `${chalk.bold("On Your Network:")} \t http://${ip_address}:${chalk.bold(
      port
    )}`
  );
});

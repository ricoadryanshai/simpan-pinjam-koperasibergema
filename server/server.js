/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3023;

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
function getQueryResult(query) {
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

// START >>> API ENDPOINT BERANDA

app.get("/get/statistik", async (req, res) => {
  try {
    const jumlahAnggota = await getQueryResult(
      "SELECT COUNT(*) AS jumlahAnggota FROM tbl_anggota"
    );

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
        ) AS subquery;
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
      } else if (results.length === 0) {
        res.status(404).json({ error: "Record not found" });
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
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
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

app.post("/post/anggota", (req, res) => {
  const { kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP } =
    req.body;

  const currentDate = new Date();
  const tanggalDaftar = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`;

  const insertQuery = `INSERT INTO tbl_anggota (kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP, tanggalDaftar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    kodeAnggota,
    nama,
    jenKel,
    tempatLahir,
    tanggalLahir,
    alamat,
    noHP,
    tanggalDaftar,
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
    CASE
      WHEN SUM(CASE WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' THEN -tbl_simpan.saldo ELSE tbl_simpan.saldo END) = 0 THEN 0
      ELSE SUM(CASE WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' THEN -tbl_simpan.saldo ELSE tbl_simpan.saldo END)
    END AS totalSaldo
  FROM tbl_anggota
  LEFT JOIN tbl_simpan ON tbl_anggota.kodeAnggota = tbl_simpan.kodeAnggota
  GROUP BY tbl_anggota.kodeAnggota, tbl_anggota.nama
  ORDER BY totalSaldo DESC, kodeAnggota ASC;
  `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/get/simpan/:kodeAnggota", (req, res) => {
  const kodeAnggota = req.params.kodeAnggota;

  const selectQuery = `
    SELECT id, tanggalSimpan, jenisSimpan, saldo, uploadFile
    FROM tbl_simpan
    WHERE kodeAnggota = ?
    ORDER BY tanggalSimpan DESC;
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

app.delete("/delete/simpan/:kodeAnggota/:id", (req, res) => {
  const kodeAnggota = req.params.kodeAnggota;
  const id = req.params.id;

  const selectQuery = `
    SELECT uploadFile
    FROM tbl_simpan
    WHERE kodeAnggota = ? AND id = ?
  `;

  db.query(selectQuery, [kodeAnggota, id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      const uploadFile = results[0].uploadFile;
      let fileDeleted = true;

      if (uploadFile) {
        const filePath = path.join(__dirname, "uploads", "image", uploadFile);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
            fileDeleted = false;
          }
        });
      }

      const deleteQuery = `
        DELETE FROM tbl_simpan
        WHERE kodeAnggota = ? AND id = ?
      `;

      db.query(deleteQuery, [kodeAnggota, id], (deleteErr, result) => {
        if (deleteErr) {
          console.error("Error deleting data:", deleteErr);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (fileDeleted) {
            console.log("Record deleted along with file, if any:", result);
          } else {
            console.log("Record deleted but file deletion failed:", result);
          }
          res.status(200).json({ message: "Record deleted successfully" });
        }
      });
    }
  });
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
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
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

    // Calculate values for tbl_angsuran
    const uangAngsuran = angsuranPokok / angsuran;
    const jasaUang = angsuranPokok * 0.02;
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

  const today = new Date()
    .toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    .split(", ")[0];

  const updateQuery = `
    UPDATE tbl_angsuran
    SET
      tanggalBayar = '${today}'
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

  const today = new Date()
    .toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    .split(", ")[0];

  const updateQuery = `
    UPDATE tbl_angsuran
    SET tanggalBayar = '${today}'
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

// START >>> API ENDPOINT TRANSAKSI

app.get("/get/transaksi", (req, res) => {
  sqlQuery = `SELECT * FROM tbl_transaksi ORDER BY tanggalTransaksi DESC`;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
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

// API ENDPOINT TRANSAKSI <<< END

// START >>> API ENDPOINT LAPORAN

app.get("/get/lap_simpan", (req, res) => {
  const currentYear = new Date().getFullYear();

  const sqlQuery = `
    SELECT
    tbl_anggota.kodeAnggota,
    tbl_anggota.nama,
    CASE
      WHEN SUM(CASE 
        WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' AND YEAR(tbl_simpan.tanggalSimpan) = ${currentYear} THEN -tbl_simpan.saldo 
        WHEN YEAR(tbl_simpan.tanggalSimpan) = ${currentYear} THEN tbl_simpan.saldo 
        ELSE 0
      END) = 0 THEN 0
      ELSE SUM(CASE 
        WHEN tbl_simpan.jenisSimpan = 'Ambil Simpanan' AND YEAR(tbl_simpan.tanggalSimpan) = ${currentYear} THEN -tbl_simpan.saldo 
        WHEN YEAR(tbl_simpan.tanggalSimpan) = ${currentYear} THEN tbl_simpan.saldo 
        ELSE 0
      END)
    END AS totalSaldo
  FROM tbl_anggota
  LEFT JOIN tbl_simpan ON tbl_anggota.kodeAnggota = tbl_simpan.kodeAnggota
  WHERE YEAR(tbl_simpan.tanggalSimpan) = ${currentYear}
  GROUP BY tbl_anggota.kodeAnggota, tbl_anggota.nama
  ORDER BY kodeAnggota ASC;
  `;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(results);
    }
  });
});

// API ENDPOINT LAPORAN <<< END

// START >>> API ENDPOINT PENGATURAN

app.get("/get/pengaturan", (req, res) => {
  const id = 1;

  const sqlQuery = `SELECT * FROM tbl_pengaturan WHERE idPengaturan = ?`;

  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.put("/put/pengaturan", (req, res) => {
  const id = 1;
  const { simpananPokok, simpananWajib, bungaAngsuran } = req.body;

  const updateQuery = `
    UPDATE tbl_pengaturan
    SET simpananPokok = ?, simpananWajib = ?, bungaAngsuran = ?
    WHERE idPengaturan = ?
  `;

  db.query(
    updateQuery,
    [simpananPokok, simpananWajib, bungaAngsuran, id],
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
  console.log(`Server is running on port ${port}`);
});

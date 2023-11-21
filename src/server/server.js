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

    res.status(200).json({
      jumlahAnggota: jumlahAnggota.jumlahAnggota,
      jumlahSimpanan: jumlahSimpanan.jumlahSimpanan,
      penarikanSimpanan: penarikanSimpanan.penarikanSimpanan,
      jumlahSaldo: jumlahSaldo.jumlahSaldo,
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
            fileDeleted = false; // Set fileDeleted to false if there's an error
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
      kodeAnggota,
      nama,
      tanggalDaftar,
      COALESCE(totalPinjam, 0) AS totalPinjam,
      COALESCE(totalAngsuran, 0) AS totalAngsuran,
      COALESCE(totalPinjam - totalAngsuran, 0) AS sisaHutang
    FROM (
      SELECT
        tbl_anggota.kodeAnggota,
        tbl_anggota.nama,
        tbl_anggota.tanggalDaftar,
        COALESCE(total_pinjaman.totalPinjam, 0) AS totalPinjam,
        SUM(
          CASE
            WHEN tbl_angsuran.tanggalBayar IS NOT NULL OR tbl_angsuran.tanggalBayar <> '' THEN tbl_angsuran.uangAngsuran
            ELSE 0
          END
        ) AS totalAngsuran
      FROM
        tbl_anggota
      LEFT JOIN
        (
          SELECT 
            kodeAnggota,
            SUM(nominalTransaksi) AS totalPinjam
          FROM
            tbl_pinjam
          WHERE
            jenisTransaksi = 'Pinjam'
          GROUP BY
            kodeAnggota
        ) AS total_pinjaman ON tbl_anggota.kodeAnggota = total_pinjaman.kodeAnggota
      LEFT JOIN
        tbl_pinjam ON tbl_anggota.kodeAnggota = tbl_pinjam.kodeAnggota
      LEFT JOIN
        tbl_angsuran ON tbl_pinjam.id = tbl_angsuran.idPinjam
      GROUP BY
        tbl_anggota.kodeAnggota
    ) AS aggregatedResults
    ORDER BY
      totalAngsuran DESC, kodeAnggota ASC
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
    SELECT id, kodeAnggota, jenisTransaksi, nominalTransaksi, angsuran, tanggalTransaksi
    FROM tbl_pinjam
    WHERE kodeAnggota = ?
    ORDER BY createdAt DESC;
  `;

  db.query(selectQuery, [kodeAnggota], (err, results) => {
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

app.get("/get/bayar/:kodeAnggota", (req, res) => {
  const { kodeAnggota } = req.params;

  const selectQuery = `
    SELECT *
    FROM tbl_pinjam
    WHERE kodeAnggota = ? AND jenisTransaksi = 'Pinjam'
    ORDER BY createdAt DESC
    LIMIT 1
  `;

  db.query(selectQuery, [kodeAnggota], (err, results) => {
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

app.post("/post/pinjam", async (req, res) => {
  const {
    kodeAnggota,
    jenisTransaksi,
    nominalTransaksi,
    angsuran,
    tanggalTransaksi,
  } = req.body;

  const insertPinjamQuery = `INSERT INTO tbl_pinjam (kodeAnggota, jenisTransaksi, nominalTransaksi, angsuran, tanggalTransaksi) VALUES (?, ?, ?, ?, ?)`;
  const pinjamValues = [
    kodeAnggota,
    jenisTransaksi,
    nominalTransaksi,
    angsuran,
    tanggalTransaksi,
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
    const uangAngsuran = nominalTransaksi / angsuran;
    const jasaUang = nominalTransaksi * 0.02;
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

app.delete("/delete/pinjam/:kodeAnggota/:idPinjam", (req, res) => {
  const { kodeAnggota, id } = req.params;

  // Query untuk menghapus data berdasarkan kodeAnggota dan id
  const deleteQuery =
    "DELETE FROM tbl_pinjam WHERE kodeAnggota = ? AND idPinjam = ?";

  // Menjalankan query dengan parameter yang diberikan
  db.query(deleteQuery, [kodeAnggota, id], (err) => {
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

app.get("/get/angsuran/:idPinjam", (req, res) => {
  const idPinjam = req.params.idPinjam;

  const query = `SELECT id, idPinjam, uangAngsuran, jasaUang, totalBayar, tanggalBayar FROM tbl_angsuran WHERE idPinjam = ?`;

  db.query(query, [idPinjam], (err, rows) => {
    if (err) {
      console.error("Error fetching data: " + err);
      res.status(500).json({ error: "Error fetching data" });
      return;
    }

    res.json(rows);
  });
});

app.post("/post/angsuran", async (req, res) => {
  const {
    kodeAnggota,
    jenisTransaksi,
    nominalTransaksi,
    angsuran,
    tanggalTransaksi,
  } = req.body;

  const insertPinjamQuery = `INSERT INTO tbl_pinjam (kodeAnggota, jenisTransaksi, nominalTransaksi, angsuran, tanggalTransaksi) VALUES (?, ?, ?, ?, ?)`;
  const pinjamValues = [
    kodeAnggota,
    jenisTransaksi,
    nominalTransaksi,
    angsuran,
    tanggalTransaksi,
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
  try {
    const { jenisTransaksi, tanggalTransaksi, nominalTransaksi, keterangan } =
      req.body;

    // Pastikan data yang dibutuhkan ada
    if (!jenisTransaksi || !tanggalTransaksi || !nominalTransaksi) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Query untuk menambahkan data ke tbl_transaksi
    const insertQuery = `
      INSERT INTO tbl_transaksi (jenisTransaksi, tanggalTransaksi, nominalTransaksi, keterangan)
      VALUES (?, ?, ?, ?)
    `;

    // Eksekusi query dengan menggunakan prepared statement untuk menghindari SQL injection
    const result = await getQueryResult(insertQuery, [
      jenisTransaksi,
      tanggalTransaksi,
      nominalTransaksi,
      keterangan,
    ]);

    res.status(200).json({
      message: "Data added successfully",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding data:", error);
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

// Fungsi untuk menghapus gambar berdasarkan tahun
const deleteImagesForPreviousYear = (yearToDelete) => {
  const deleteQuery = `
    DELETE FROM tbl_simpan
    WHERE SUBSTRING(tanggalSimpan, 1, 4) = ?
  `;

  db.query(deleteQuery, [yearToDelete.toString()], (deleteErr, result) => {
    if (deleteErr) {
      console.error("Error deleting images:", deleteErr);
    } else {
      const affectedRows = result.affectedRows;
      console.log(`${affectedRows} images deleted for year ${yearToDelete}`);
      // Handle success message or further logic
    }
  });
};

// Fungsi untuk mendapatkan tahun saat ini
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Fungsi untuk memulai logika penghapusan pada awal tahun baru
const startYearlyImageDeletion = () => {
  const currentYear = getCurrentYear();
  const yearToDelete = currentYear - 1; // Tahun sebelumnya

  // Jalankan penghapusan gambar untuk tahun sebelumnya saat aplikasi dimulai
  deleteImagesForPreviousYear(yearToDelete);
};

// Panggil fungsi untuk memulai logika penghapusan pada awal aplikasi atau saat awal tahun baru
startYearlyImageDeletion();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

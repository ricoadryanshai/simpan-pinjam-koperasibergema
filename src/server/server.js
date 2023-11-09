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
const port = process.env.PORT || 3002;

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/simpanan/");
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

// API endpoint to GET tbl_anggota data
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
        res.status(200).json(results); // Send the data as a JSON response
      }
    }
  );
});

// API endpoint to GET tbl_anggota & tbl_simpan
app.get("/get/simpan", (req, res) => {
  const sqlQuery = `
    SELECT
    tbl_anggota.kodeAnggota,
    tbl_anggota.nama,
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

// API endpoint to GET tbl_anggota & tbl_pinjam
app.get("/get/pinjam", (req, res) => {
  const sqlQuery = `
    SELECT
    tbl_anggota.kodeAnggota,
    tbl_anggota.nama,
    tbl_anggota.tanggalDaftar,
    CASE
      WHEN SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Pinjam' THEN -tbl_pinjam.nominalTransaksi ELSE tbl_pinjam.nominalTransaksi END) = 0 THEN 0
      ELSE SUM(CASE WHEN tbl_pinjam.jenisTransaksi = 'Bayar' THEN -tbl_pinjam.nominalTransaksi ELSE tbl_pinjam.nominalTransaksi END)
    END AS sisaHutang
  FROM tbl_anggota
  LEFT JOIN tbl_pinjam ON tbl_anggota.kodeAnggota = tbl_pinjam.kodeAnggota
  GROUP BY tbl_anggota.kodeAnggota, tbl_anggota.nama
  ORDER BY sisaHutang DESC, kodeAnggota ASC;
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

// API endpoint to GET tbl_pengaturan
app.get("/get/pengaturan", (req, res) => {
  const id = 3;

  const sqlQuery = `SELECT * FROM tbl_pengaturan WHERE id = ?`;

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

// API endpoint to GET tbl_simpan by kodeAnggota
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

// API endpoint to GET tbl_pinjam by kodeAnggota
app.get("/get/pinjam/:kodeAnggota", (req, res) => {
  const kodeAnggota = req.params.kodeAnggota;

  const selectQuery = `
    SELECT id, kodeAnggota, jenisTransaksi, nominalTransaksi, angsuran, tanggalTransaksi
    FROM tbl_pinjam
    WHERE kodeAnggota = ?
    ORDER BY tanggalTransaksi DESC;
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

// API endpoint to GET tbl_anggota data by id
app.get("/get/anggota/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM tbl_anggota WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(results[0]); // Send the data as a JSON response (assuming only one record is expected)
    }
  });
});

// API endpoint to POST tbl_anggota
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

// API endpoint to POST tbl_simpan
app.post("/post/simpan", upload.single("uploadFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { kodeAnggota, tanggalSimpan, jenisSimpan, saldo } = req.body;
  const uploadFile = req.file.filename;

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

// API endpoint to DELETE tbl_anggota data by id
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

// API endpoint to DELETE tbl_simpan by kodeAnggota and id
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

      // Hapus file terkait dari folder "uploads/simpanan"
      const filePath = path.join(__dirname, "uploads", "simpanan", uploadFile);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });

      // Hapus data dari tabel
      const deleteQuery = `
        DELETE FROM tbl_simpan
        WHERE kodeAnggota = ? AND id = ?
      `;

      db.query(deleteQuery, [kodeAnggota, id], (deleteErr, result) => {
        if (deleteErr) {
          console.error("Error deleting data:", deleteErr);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Record deleted:", result);
          res.status(200).json({ message: "Record deleted successfully" });
        }
      });
    }
  });
});

// API endpoint to UPDATE tbl_anggota data by id
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

// API endpoint to UPDATE tbl_pengaturan data by id
app.put("/put/pengaturan/:id", (req, res) => {
  const id = req.params.id;
  const { simpananPokok, simpananWajib, bungaAngsuran } = req.body;

  const updateQuery = `
    UPDATE tbl_pengaturan
    SET simpananPokok = ?, simpananWajib = ?, bungaAngsuran = ?
    WHERE id = ?
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

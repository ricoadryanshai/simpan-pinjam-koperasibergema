/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
  // Your code to retrieve data from the database
  // For example, you can run a SELECT query on your MySQL database.
  db.query("SELECT * FROM tbl_anggota", (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.sqlMessage);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results); // Send the data as a JSON response
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

// API endpoint to POST tbl_anggota data
app.post("/post/anggota", (req, res) => {
  const { kodeAnggota, nama, jenKel, tempatLahir, tanggalLahir, alamat, noHP } =
    req.body;

  const currentDate = new Date();
  const tanggalDaftar = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

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

// API endpoint to UPDATE tbl_anggota data by id
app.put("/edit/anggota/:id", (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

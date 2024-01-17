-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2024 at 10:47 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bergema`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_anggota`
--

CREATE TABLE `tbl_anggota` (
  `id` int(11) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `jenisAnggota` varchar(50) DEFAULT NULL,
  `jenKel` enum('Pria','Wanita') DEFAULT NULL,
  `tempatLahir` varchar(50) DEFAULT NULL,
  `tanggalLahir` varchar(50) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `noHP` varchar(50) DEFAULT NULL,
  `tanggalDaftar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_angsuran`
--

CREATE TABLE `tbl_angsuran` (
  `id` int(11) NOT NULL,
  `idPinjam` int(11) DEFAULT NULL,
  `uangAngsuran` decimal(65,10) DEFAULT NULL,
  `jasaUang` decimal(65,10) DEFAULT NULL,
  `totalBayar` decimal(65,10) DEFAULT NULL,
  `tanggalBayar` varchar(50) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_keanggotaan`
--

CREATE TABLE `tbl_keanggotaan` (
  `id` int(11) NOT NULL,
  `jenisSHU` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_keanggotaan`
--

INSERT INTO `tbl_keanggotaan` (`id`, `jenisSHU`) VALUES
(14, 'Anggota'),
(11, 'Pengurus');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pembagian_shu`
--

CREATE TABLE `tbl_pembagian_shu` (
  `id` int(11) NOT NULL,
  `jenisSHU` varchar(50) DEFAULT NULL,
  `persentaseSHU` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tbl_pembagian_shu`
--

INSERT INTO `tbl_pembagian_shu` (`id`, `jenisSHU`, `persentaseSHU`) VALUES
(2, 'Pengurus', 30),
(3, 'SHU Pinjam', 30),
(4, 'Administrasi', 10),
(5, 'SHU Penyerahan Modal', 10),
(6, 'Non-Anggota', 0),
(17, 'Anggota', 20);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pengaturan`
--

CREATE TABLE `tbl_pengaturan` (
  `idPengaturan` int(11) NOT NULL,
  `simpananPokok` varchar(255) DEFAULT NULL,
  `simpananWajib` varchar(255) DEFAULT NULL,
  `bungaAngsuran` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_pengaturan`
--

INSERT INTO `tbl_pengaturan` (`idPengaturan`, `simpananPokok`, `simpananWajib`, `bungaAngsuran`) VALUES
(1, '200000', '20000', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pinjam`
--

CREATE TABLE `tbl_pinjam` (
  `id` int(11) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `jenisTransaksi` enum('Pinjam','Bayar') DEFAULT NULL,
  `angsuran` int(11) DEFAULT NULL,
  `tanggalTransaksi` varchar(50) DEFAULT NULL,
  `angsuranPokok` decimal(65,10) DEFAULT NULL,
  `angsuranJasa` decimal(65,10) DEFAULT NULL,
  `angsuranPerBulan` decimal(65,10) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_simpan`
--

CREATE TABLE `tbl_simpan` (
  `id` int(50) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `tanggalSimpan` varchar(50) DEFAULT NULL,
  `jenisSimpan` varchar(50) DEFAULT NULL,
  `saldo` int(50) DEFAULT NULL,
  `uploadFile` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaksi`
--

CREATE TABLE `tbl_transaksi` (
  `id` int(11) NOT NULL,
  `jenisTransaksi` enum('Transaksi Masuk','Transaksi Keluar') DEFAULT NULL,
  `tanggalTransaksi` varchar(50) DEFAULT NULL,
  `nominalTransaksi` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `username`, `password`) VALUES
(1, 'kpgansel', 'adminkpgansel24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kodeAnggota` (`kodeAnggota`),
  ADD KEY `jenisAnggota` (`jenisAnggota`) USING BTREE;

--
-- Indexes for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPinjam` (`idPinjam`);

--
-- Indexes for table `tbl_keanggotaan`
--
ALTER TABLE `tbl_keanggotaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jenisKeanggotaan` (`jenisSHU`);

--
-- Indexes for table `tbl_pembagian_shu`
--
ALTER TABLE `tbl_pembagian_shu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `jenisAkun` (`jenisSHU`);

--
-- Indexes for table `tbl_pengaturan`
--
ALTER TABLE `tbl_pengaturan`
  ADD PRIMARY KEY (`idPengaturan`);

--
-- Indexes for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kodeAnggota` (`kodeAnggota`);

--
-- Indexes for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kodeAnggota` (`kodeAnggota`);

--
-- Indexes for table `tbl_transaksi`
--
ALTER TABLE `tbl_transaksi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_keanggotaan`
--
ALTER TABLE `tbl_keanggotaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `tbl_pembagian_shu`
--
ALTER TABLE `tbl_pembagian_shu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_transaksi`
--
ALTER TABLE `tbl_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  ADD CONSTRAINT `tbl_anggota_ibfk_1` FOREIGN KEY (`jenisAnggota`) REFERENCES `tbl_keanggotaan` (`jenisSHU`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD CONSTRAINT `tbl_angsuran_ibfk_1` FOREIGN KEY (`idPinjam`) REFERENCES `tbl_pinjam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_keanggotaan`
--
ALTER TABLE `tbl_keanggotaan`
  ADD CONSTRAINT `tbl_keanggotaan_ibfk_1` FOREIGN KEY (`jenisSHU`) REFERENCES `tbl_pembagian_shu` (`jenisSHU`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  ADD CONSTRAINT `tbl_pinjam_ibfk_1` FOREIGN KEY (`kodeAnggota`) REFERENCES `tbl_anggota` (`kodeAnggota`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  ADD CONSTRAINT `tbl_simpan_ibfk_1` FOREIGN KEY (`kodeAnggota`) REFERENCES `tbl_anggota` (`kodeAnggota`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

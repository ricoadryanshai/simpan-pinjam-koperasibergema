-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2023 at 08:22 AM
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
  `jenKel` varchar(50) DEFAULT NULL,
  `tempatLahir` varchar(50) DEFAULT NULL,
  `tanggalLahir` varchar(50) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `noHP` varchar(50) DEFAULT NULL,
  `tanggalDaftar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_anggota`
--

INSERT INTO `tbl_anggota` (`id`, `kodeAnggota`, `nama`, `jenKel`, `tempatLahir`, `tanggalLahir`, `alamat`, `noHP`, `tanggalDaftar`) VALUES
(46, 'GS.001', 'Agung Meidya Gutama, Ap, MM', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(47, 'GS.002', 'Wikawati, SE, M.Si', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(48, 'GS.003', 'Evi Erawati, SAP', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(49, 'GS.004', 'Suyati', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(50, 'GS.005', 'Indzarti Masthuriyah', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(51, 'GS.007', 'Huryati', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(52, 'GS.008', 'Obaja Sarifin Gultom', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(53, 'GS.009', 'Yuni Susilowati', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(54, 'GS.010', 'Amak Wahyudi', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(55, 'GS.011', 'Agus Budi Hartoyo', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(56, 'GS.012', 'Sri Rahayu', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(57, 'GS.013', 'Eko Hermawan', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(58, 'GS.014', 'Indri', 'Pria', '-', '2023-11-19', '-', '0', '2023/11/19'),
(59, 'GS.015', 'Rico', 'Pria', '-', '2023-11-19', '6, Jl. Karang Tengah Raya No.42, RT.6/RW.4, Lb. Bulus, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12440', '0', '2023/11/19');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_angsuran`
--

CREATE TABLE `tbl_angsuran` (
  `id` int(11) NOT NULL,
  `idPinjam` int(11) DEFAULT NULL,
  `uangAngsuran` int(50) DEFAULT NULL,
  `jasaUang` int(50) DEFAULT NULL,
  `totalBayar` int(50) DEFAULT NULL,
  `tanggalBayar` varchar(50) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_angsuran`
--

INSERT INTO `tbl_angsuran` (`id`, `idPinjam`, `uangAngsuran`, `jasaUang`, `totalBayar`, `tanggalBayar`, `updatedAt`) VALUES
(76, 53, 100000, 10000, 110000, NULL, '2023-11-21 03:46:24'),
(77, 53, 100000, 10000, 110000, NULL, '2023-11-21 03:46:24'),
(78, 53, 100000, 10000, 110000, NULL, '2023-11-21 03:46:24'),
(79, 53, 100000, 10000, 110000, NULL, '2023-11-21 03:46:24'),
(80, 53, 100000, 10000, 110000, NULL, '2023-11-21 03:46:24'),
(81, 54, 500000, 20000, 520000, '11/21/2023', '2023-11-21 03:54:37'),
(82, 54, 500000, 20000, 520000, NULL, '2023-11-21 03:51:11'),
(83, 55, 1000000, 20000, 1020000, NULL, '2023-11-21 03:51:24'),
(84, 56, 100000, 6000, 106000, NULL, '2023-11-21 03:53:25'),
(85, 56, 100000, 6000, 106000, NULL, '2023-11-21 03:53:25'),
(86, 56, 100000, 6000, 106000, NULL, '2023-11-21 03:53:25'),
(87, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(88, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(89, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(90, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(91, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(92, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(93, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(94, 58, 500000, 80000, 580000, NULL, '2023-11-21 04:55:11'),
(95, 59, 183333, 11000, 194333, NULL, '2023-11-21 04:58:44'),
(96, 59, 183333, 11000, 194333, NULL, '2023-11-21 04:58:44'),
(97, 59, 183333, 11000, 194333, NULL, '2023-11-21 04:58:44');

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
(1, '150000', '300000', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pinjam`
--

CREATE TABLE `tbl_pinjam` (
  `id` int(11) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `jenisTransaksi` enum('Pinjam','Bayar') DEFAULT NULL,
  `nominalTransaksi` int(50) DEFAULT NULL,
  `angsuran` int(11) DEFAULT NULL,
  `tanggalTransaksi` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_pinjam`
--

INSERT INTO `tbl_pinjam` (`id`, `kodeAnggota`, `jenisTransaksi`, `nominalTransaksi`, `angsuran`, `tanggalTransaksi`, `createdAt`) VALUES
(53, 'GS.002', 'Pinjam', 500000, 5, '2023-11-21', '2023-11-21 10:46:23'),
(54, 'GS.001', 'Pinjam', 1000000, 2, '2023-11-21', '2023-11-21 10:51:11'),
(55, 'GS.003', 'Pinjam', 1000000, 1, '2023-11-21', '2023-11-21 10:51:24'),
(56, 'GS.004', 'Pinjam', 300000, 3, '2023-11-21', '2023-11-21 10:53:25'),
(57, 'GS.001', 'Bayar', 520000, 1, '11/21/2023', '2023-11-21 10:54:37'),
(58, 'GS.005', 'Pinjam', 4000000, 8, '2023-11-21', '2023-11-21 11:55:11'),
(59, 'GS.015', 'Pinjam', 550000, 3, '2023-11-21', '2023-11-21 11:58:44');

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_simpan`
--

INSERT INTO `tbl_simpan` (`id`, `kodeAnggota`, `tanggalSimpan`, `jenisSimpan`, `saldo`, `uploadFile`) VALUES
(48, 'GS.001', '2023-11-19', 'Simpanan Sukarela', 480000, 'b11a17926d739465390f34e5668dd62a.png');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaksi`
--

CREATE TABLE `tbl_transaksi` (
  `id` int(11) NOT NULL,
  `jenisTransaksi` enum('Transaksi Masuk','Transaksi Keluar') DEFAULT NULL,
  `tanggalTransaksi` varchar(50) DEFAULT NULL,
  `nominalTransaksi` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_transaksi`
--

INSERT INTO `tbl_transaksi` (`id`, `jenisTransaksi`, `tanggalTransaksi`, `nominalTransaksi`, `keterangan`) VALUES
(12, 'Transaksi Masuk', '2023/11/14', '200000', 'Percobaan 2'),
(13, 'Transaksi Masuk', '2023/11/14', '200000', 'Percobaan 2'),
(14, 'Transaksi Keluar', '2023/11/14', '200000', 'Percobaan 3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kodeAnggota` (`kodeAnggota`),
  ADD KEY `kodeAnggota_2` (`kodeAnggota`);

--
-- Indexes for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPinjam` (`idPinjam`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;
--
-- AUTO_INCREMENT for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- AUTO_INCREMENT for table `tbl_transaksi`
--
ALTER TABLE `tbl_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  ADD CONSTRAINT `tbl_angsuran_ibfk_1` FOREIGN KEY (`idPinjam`) REFERENCES `tbl_pinjam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

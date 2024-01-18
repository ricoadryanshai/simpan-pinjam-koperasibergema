-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2024 at 10:33 PM
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
  `status` enum('Aktif','Tidak Aktif') NOT NULL,
  `tanggalDaftar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tbl_anggota`
--

INSERT INTO `tbl_anggota` (`id`, `kodeAnggota`, `nama`, `jenisAnggota`, `jenKel`, `tempatLahir`, `tanggalLahir`, `alamat`, `noHP`, `status`, `tanggalDaftar`) VALUES
(11, 'KB.GS.002', 'Rico Adryan Shai, S.Kom', 'Anggota', 'Pria', '-', '2024-01-19', '-', '0', 'Aktif', '2024-01-19'),
(12, 'KB.GS.003', 'Alfian Salafin, S.Kom', 'Anggota', 'Pria', '-', '2024-01-19', '-', '0', 'Aktif', '2024-01-19'),
(13, 'KB.GS.001', 'Agung Meidya Gutama, Ap, MM', 'Pengurus', 'Pria', '-', '2024-01-19', '-', '0', 'Aktif', '2024-01-19');

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

--
-- Dumping data for table `tbl_angsuran`
--

INSERT INTO `tbl_angsuran` (`id`, `idPinjam`, `uangAngsuran`, `jasaUang`, `totalBayar`, `tanggalBayar`, `updatedAt`) VALUES
(10, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-02-19', '2024-01-18 18:57:30'),
(11, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-03-19', '2024-01-18 18:57:35'),
(12, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-04-19', '2024-01-18 18:57:38'),
(13, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-05-19', '2024-01-18 18:57:42'),
(14, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-06-19', '2024-01-18 18:57:47'),
(15, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-07-19', '2024-01-18 18:57:50'),
(16, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-08-19', '2024-01-18 18:57:53'),
(17, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-09-19', '2024-01-18 18:57:56'),
(18, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-10-19', '2024-01-18 18:58:00'),
(19, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-11-19', '2024-01-18 18:58:04'),
(20, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-12-19', '2024-01-18 18:58:07'),
(21, 9, '41666.6666666667', '10000.0000000000', '51666.6666666667', '2025-01-19', '2024-01-18 18:58:11'),
(22, 22, '60000.0000000000', '6000.0000000000', '66000.0000000000', '2024-02-19', '2024-01-18 19:03:39'),
(23, 22, '60000.0000000000', '6000.0000000000', '66000.0000000000', '2024-03-19', '2024-01-18 19:03:43'),
(24, 22, '60000.0000000000', '6000.0000000000', '66000.0000000000', NULL, '2024-01-18 18:59:02'),
(25, 22, '60000.0000000000', '6000.0000000000', '66000.0000000000', NULL, '2024-01-18 18:59:02'),
(26, 22, '60000.0000000000', '6000.0000000000', '66000.0000000000', NULL, '2024-01-18 18:59:02'),
(27, 25, '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-02-19', '2024-01-18 19:12:54'),
(28, 25, '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-03-19', '2024-01-18 19:12:59'),
(29, 25, '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-04-19', '2024-01-18 19:13:01'),
(30, 25, '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-05-19', '2024-01-18 19:13:04'),
(31, 25, '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-06-19', '2024-01-18 19:13:06');

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
(1, 'Pengurus', 30),
(2, 'SHU Pinjam', 30),
(3, 'Administrasi', 10),
(4, 'SHU Penyerahan Modal', 10),
(5, 'Non-Anggota', 0),
(6, 'Anggota', 20);

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

--
-- Dumping data for table `tbl_pinjam`
--

INSERT INTO `tbl_pinjam` (`id`, `kodeAnggota`, `jenisTransaksi`, `angsuran`, `tanggalTransaksi`, `angsuranPokok`, `angsuranJasa`, `angsuranPerBulan`, `createdAt`) VALUES
(9, 'KB.GS.002', 'Pinjam', 12, '2024-01-19', '500000.0000000000', '120000.0000000000', '620000.0000000000', '2024-01-19 01:49:17'),
(10, 'KB.GS.002', 'Bayar', 1, '2024-02-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:44'),
(11, 'KB.GS.002', 'Bayar', 2, '2024-03-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:44'),
(12, 'KB.GS.002', 'Bayar', 3, '2024-04-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:46'),
(13, 'KB.GS.002', 'Bayar', 4, '2024-05-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:47'),
(14, 'KB.GS.002', 'Bayar', 5, '2024-06-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:47'),
(15, 'KB.GS.002', 'Bayar', 6, '2024-07-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:47'),
(16, 'KB.GS.002', 'Bayar', 7, '2024-08-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:48'),
(17, 'KB.GS.002', 'Bayar', 8, '2024-09-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:49'),
(18, 'KB.GS.002', 'Bayar', 9, '2024-10-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:50'),
(19, 'KB.GS.002', 'Bayar', 10, '2024-11-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:50'),
(20, 'KB.GS.002', 'Bayar', 11, '2024-12-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:50'),
(21, 'KB.GS.002', 'Bayar', 12, '2025-01-19', '41666.6666666667', '10000.0000000000', '51666.6666666667', '2024-01-19 01:49:51'),
(22, 'KB.GS.003', 'Pinjam', 5, '2024-01-19', '300000.0000000000', '30000.0000000000', '330000.0000000000', '2024-01-19 01:59:02'),
(23, 'KB.GS.003', 'Bayar', 1, '2024-02-19', '60000.0000000000', '6000.0000000000', '66000.0000000000', '2024-01-19 02:02:03'),
(24, 'KB.GS.003', 'Bayar', 2, '2024-03-19', '60000.0000000000', '6000.0000000000', '66000.0000000000', '2024-01-19 02:02:05'),
(25, 'KB.GS.001', 'Pinjam', 5, '2024-01-19', '500000.0000000000', '50000.0000000000', '550000.0000000000', '2024-01-19 02:11:28'),
(26, 'KB.GS.001', 'Bayar', 1, '2024-02-19', '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-01-19 02:11:34'),
(27, 'KB.GS.001', 'Bayar', 2, '2024-03-19', '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-01-19 02:11:34'),
(28, 'KB.GS.001', 'Bayar', 3, '2024-04-19', '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-01-19 02:11:35'),
(29, 'KB.GS.001', 'Bayar', 4, '2024-05-19', '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-01-19 02:11:35'),
(30, 'KB.GS.001', 'Bayar', 5, '2024-06-19', '100000.0000000000', '10000.0000000000', '110000.0000000000', '2024-01-19 02:11:36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_simpan`
--

CREATE TABLE `tbl_simpan` (
  `id` int(50) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `tanggalSimpan` varchar(50) DEFAULT NULL,
  `jenisSimpan` varchar(50) DEFAULT NULL,
  `saldo` decimal(65,10) DEFAULT NULL,
  `uploadFile` varchar(225) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tbl_simpan`
--

INSERT INTO `tbl_simpan` (`id`, `kodeAnggota`, `tanggalSimpan`, `jenisSimpan`, `saldo`, `uploadFile`, `createdAt`) VALUES
(95, 'KB.GS.002', '2024-01-19', 'Simpanan Pokok', '200000.0000000000', NULL, '2024-01-19 01:31:04'),
(96, 'KB.GS.002', '2024-01-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:17'),
(97, 'KB.GS.002', '2024-02-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:20'),
(98, 'KB.GS.002', '2024-03-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:22'),
(99, 'KB.GS.002', '2024-04-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:24'),
(100, 'KB.GS.002', '2024-05-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:27'),
(101, 'KB.GS.002', '2024-06-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:29'),
(102, 'KB.GS.002', '2024-07-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:32'),
(103, 'KB.GS.002', '2024-08-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:34'),
(104, 'KB.GS.002', '2024-09-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:36'),
(105, 'KB.GS.002', '2024-10-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:41'),
(106, 'KB.GS.002', '2024-11-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:43'),
(107, 'KB.GS.002', '2024-12-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:33:46'),
(108, 'KB.GS.003', '2024-01-19', 'Simpanan Pokok', '200000.0000000000', NULL, '2024-01-19 01:38:14'),
(109, 'KB.GS.003', '2024-01-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:38:48'),
(110, 'KB.GS.003', '2024-02-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:38:50'),
(111, 'KB.GS.003', '2024-03-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:38:53'),
(112, 'KB.GS.003', '2024-04-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:38:55'),
(113, 'KB.GS.003', '2024-05-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:38:57'),
(114, 'KB.GS.003', '2024-06-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:00'),
(115, 'KB.GS.003', '2024-07-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:01'),
(116, 'KB.GS.003', '2024-08-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:03'),
(117, 'KB.GS.003', '2024-09-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:05'),
(118, 'KB.GS.003', '2024-10-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:08'),
(119, 'KB.GS.003', '2024-11-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:11'),
(120, 'KB.GS.003', '2024-12-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 01:39:13'),
(122, 'KB.GS.003', '2024-01-19', 'Simpanan Sukarela', '500000.0000000000', NULL, '2024-01-19 01:41:30'),
(125, 'KB.GS.001', '2024-01-19', 'Simpanan Pokok', '200000.0000000000', NULL, '2024-01-19 02:08:07'),
(126, 'KB.GS.001', '2024-01-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:35'),
(127, 'KB.GS.001', '2024-02-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:39'),
(128, 'KB.GS.001', '2024-03-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:41'),
(129, 'KB.GS.001', '2024-04-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:44'),
(130, 'KB.GS.001', '2024-05-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:46'),
(131, 'KB.GS.001', '2024-06-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:49'),
(132, 'KB.GS.001', '2024-07-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:51'),
(133, 'KB.GS.001', '2024-08-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:53'),
(134, 'KB.GS.001', '2024-09-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:55'),
(135, 'KB.GS.001', '2024-10-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:08:57'),
(136, 'KB.GS.001', '2024-11-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:09:00'),
(137, 'KB.GS.001', '2024-12-19', 'Simpanan Wajib', '20000.0000000000', NULL, '2024-01-19 02:09:02');

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

--
-- Dumping data for table `tbl_transaksi`
--

INSERT INTO `tbl_transaksi` (`id`, `jenisTransaksi`, `tanggalTransaksi`, `nominalTransaksi`, `keterangan`, `createdAt`) VALUES
(14, 'Transaksi Keluar', '2024-12-31', '150000', 'THR', '2024-01-19 04:04:41');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `tbl_angsuran`
--
ALTER TABLE `tbl_angsuran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `tbl_keanggotaan`
--
ALTER TABLE `tbl_keanggotaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `tbl_pembagian_shu`
--
ALTER TABLE `tbl_pembagian_shu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;
--
-- AUTO_INCREMENT for table `tbl_transaksi`
--
ALTER TABLE `tbl_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
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

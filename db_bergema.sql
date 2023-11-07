-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2023 at 03:51 PM
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
(22, 'GS003', 'Shai', 'Pria', 'Surabaya', '1999-10-17', 'BUMI ASIH V BLOK A6/17, RT002/RW009, LEBAK BULUS, CILANDAK', '6285819109532', '2023/10/27'),
(26, 'GS004', 'Rico', 'Pria', 'Madiun', '1999-10-11', '62 Jl. BUMI ASIH V BLOK A', '6285819109532', '2023/10/30'),
(27, 'GS005', 'Rico Adryan Shai', 'Pria', 'Jombang', '1999-10-17', 'BUMI ASIH V BLOK A6/17, RT002/RW009, LEBAK BULUS, CILANDAK', '6285819109532', '2023/10/30'),
(33, 'GS006', 'Rico Adryan Shai', 'Pria', 'Surabaya', '1999-10-17', 'Jl. BUMI ASIH V BLOK A6/17 RT 002/RW 009', '6285819109532', '2023/10/30'),
(34, 'GS002', 'Alfian Salafin', 'Pria', 'Surabaya', '2000-10-17', 'Cilandak Barat', '085819109532', '2023/11/3'),
(35, 'GS001', 'Rika Tasyadilla', 'Wanita', 'Jombang', '1998-12-02', 'Jakarta Selatan', '085819109532', '2023/11/6');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pinjam`
--

CREATE TABLE `tbl_pinjam` (
  `id` int(11) NOT NULL,
  `kodeAnggota` varchar(50) DEFAULT NULL,
  `jenisTransaksi` enum('Pinjam','Ambil') DEFAULT NULL,
  `nominalTransaksi` varchar(255) DEFAULT NULL,
  `angsuran` int(11) DEFAULT NULL,
  `tanggalTransaksi` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(36, 'GS002', '2023-11-03', 'Simpanan Pokok', 300000, '64868172ee53b0c42c7ac1bb5d57d708.png');

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `tbl_pinjam`
--
ALTER TABLE `tbl_pinjam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbl_simpan`
--
ALTER TABLE `tbl_simpan`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- Constraints for dumped tables
--

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

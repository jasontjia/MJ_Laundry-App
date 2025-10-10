-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2025 at 04:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos_laundry`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--


--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `phone`, `address`) VALUES
(1, 'Jason Ciayadi', '08991657225', 'Jalan Wolter Monginsidi no 148D (MJ Laundry)'),
(3, 'christopher', '08124009044', 'jalan tomang'),
(4, 'paul', '089921544788', 'jalan mawar'),
(5, 'jemmy', '08923437744', 'jalan melati'),
(6, 'steiver', '08210982746', 'jalan sam ratulangi'),
(7, 'susi', '08540987621', 'Jl 17 Agustus'),
(8, 'michelle', '08274654849', 'Jalan Walanda Maramis'),
(9, 'steve', '089773463', 'sulut');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--



--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `customerId`, `weight`, `service`, `price`, `status`, `payment`, `createdAt`) VALUES
(1, 1, 1, 'cuci sepatu', 25000, 'completed', 'paid', '2025-09-11 14:37:09.976'),
(3, 3, 9, 'cuci kering lipat ', 5000, 'completed', 'paid', '2025-09-11 15:14:34.653'),
(4, 4, 2, 'cuci kering lipat setrika', 10000, 'pending', 'unpaid', '2025-09-12 04:24:18.202'),
(5, 5, 5, 'cuci kering lipat', 6000, 'pending', 'unpaid', '2025-09-12 05:55:15.902'),
(6, 7, 8, 'cuci kering lipat', 6000, 'pending', 'unpaid', '2025-09-12 14:01:27.910'),
(7, 1, 8, 'cuci kering lipat', 6000, 'pending', 'unpaid', '2025-09-12 14:11:05.848'),
(8, 1, 5, 'cuci kering lipat', 6000, 'pending', 'unpaid', '2025-09-13 06:59:05.386'),
(9, 7, 5, 'cuci kering lipat setrika', 10000, 'pending', 'unpaid', '2025-09-13 06:59:33.019'),
(10, 9, 5, 'cuci kering lipat', 6000, 'in-progress', 'unpaid', '2025-10-09 09:46:50.129');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--



--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `price`) VALUES
(1, 'cuci kering lipat', 6000),
(2, 'cuci kering lipat setrika', 10000),
(3, 'cuci sepatu', 25000),
(4, 'cuci sprei', 30000);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--



-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--



--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1b2324d4-b827-41e9-a797-6ed34930dca1', 'c41d738445417d7ac9f72d41d6c2cd8386a14a4bdf686be9a0fa8dbce3b65572', '2025-09-11 14:58:16.438', '20250911145816_add_status_payment', NULL, NULL, '2025-09-11 14:58:16.424', 1),
('59ee9356-e90b-4674-8802-3b5fc6f6b398', 'c9c00fca3a793ab1d074f327cde13edae297abecec7f562ae7d502779ef61b73', '2025-09-11 14:27:06.158', '20250911115257_init', NULL, NULL, '2025-09-11 14:27:06.072', 1),
('669d5687-229c-4316-bb27-951f556c839d', '609d9d03bc6f2a0f037f0c43228c4332cab6f537addd7ffb3ff524e1c5dddb66', '2025-09-13 06:56:54.207', '20250913065654_remove_total_from_orders', NULL, NULL, '2025-09-13 06:56:54.194', 1),
('a4c66d29-f9d9-44f4-afbc-b96cf2fbdaca', 'c7933988d66990877286ac2b04fb3d0daa4deb845a2cf895158a0f872309294c', '2025-09-13 06:36:50.742', '20250913063650_add_total_to_orders', NULL, NULL, '2025-09-13 06:36:50.732', 1),
('a76b6b8f-fbb6-4492-affe-6bb008efa8db', 'd53eddf2fa2c4fbfd00d579ae6d14d580540adb857dc9cce159bb5ef5c0df657', '2025-09-12 14:20:54.928', '20250912142054_init', NULL, NULL, '2025-09-12 14:20:54.905', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_customerId_fkey` (`customerId`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

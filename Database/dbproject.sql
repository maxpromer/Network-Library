-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2018 at 05:53 AM
-- Server version: 5.6.21
-- PHP Version: 5.5.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dbproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE IF NOT EXISTS `book` (
`BookId` int(11) NOT NULL,
  `MemId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `name` text NOT NULL,
  `image` text NOT NULL,
  `description` text NOT NULL,
  `credit` int(11) NOT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`BookId`, `MemId`, `CategoryId`, `name`, `image`, `description`, `credit`, `createdOn`) VALUES
(1, 6, 1, 'ผ่าพิภพไททั่น เล่มที่ 23', '/a001.gif', 'อนิเมชั่นชื่อดังและได้รับเสียงตอบดีเยี่ยมของญี่ปุ่น สร้างมาจากมังงะ ผลงานการแต่งเรื่องและวาดภาพประกอบของ อิซะยะมะ ฮะจิเมะ และกำลังถูกผลิตออกมาในรูปแบบภาพยนตร์คนแสดงถึง 2 ภาค โดยมีกำหนดเข้าฉายในปี 2015 นี้ สำหรับเนื้อเรื่องนั้นเล่าถึงโลกที่มนุษยชาติถูกคุกคามจากเหล่าสิ่งมีชีวิตขนาดยักษ์ หรือที่เรียกว่า “ไททัน” จนทำให้ต้องสูญเสียทั้งประชากรและพื้นที่เป็นจำนวนมาก ความหวังเดียวในการต่อกรกับศึกที่เหมือนไร้ซึ่งความหวังครั้งนี้ อยู่ที่ “เอเรน” เด็กหนุ่มผู้สามารถกลายร่างเป็นไททันได้ ร่วมด้วยเหล่ากองกำลังสำรวจที่รวบรวมเหล่ายอดฝีมือที่พร้อมต่อสู่และพลีชีพ เพื่อปกป้องผู้คนในกำแพงเมือง…', 10, '2018-05-10 14:11:38'),
(2, 6, 1, 'โคนัน เล่มที่ 5', '/conan89.jpg', '', 5, '2018-05-10 14:11:38'),
(26, 6, 1, '07-GHOST เซเว่นโกสต์ 12', 'http://localhost:8000/image/image-6d1752773f8eb19a7f4d17a3d7ac1361b2a40ba6.jpeg', 'ระหว่างเข้าร่วมการแข่งซิ่งฮอว์คไซส์ เทย์โตะมองเห็น ?ดวงเนตรแห่งพระเจ้า? และหมดสติไป ความทรงจำที่ถูกปลุกให้ตื่นจากในความทรงจำที่จมดิ่งลึกล้ำคืออดีตของตัวเองที่หลงลืม และตามมาด้วยความทรงจำที่อ่อนโยนแต่แฝงความโหดร้ายมากมาย เทย์โตะตัดสินใจอย่างแน่วแน่ที่จะมุ่งหน้าไปยังก็อดเฮ้าส์หลังถัดไป แต่ทว่าต้องรับมือกับการจู่โจมแบบไม่ทันตั้งตัวของแบล็คฮอว์คที่แทรกตัวเข้ามาปะปนในการแข่งซิ่ง...?\n\nประเภท: FANTASY\nON MOVIE / TV\n\nระดับผู้อ่าน: 13 ปีขึ้นไป\n\nคนเขียน/คนวาด: YUKI AMEMIYA / YUKINO ICHIHARA\n\nจำนวนเล่มจบ: ไม่ระบุ\n\nISBN: 9786160904891\n\nBARCODE: 8854654092759\n\nราคาเต็ม: 45 บาท', 10, '2018-05-29 20:27:44'),
(27, 6, 1, 'ยินดีต้อนรับสู่เอล-พาลาซีโอ้ 5', 'http://localhost:8000/image/image-e7f20abf7c2c611cc280c5ca29036792f229c5e7.jpeg', 'ทาสรับใช้ “♂” ที่ต้องใช้ชีวิตร่วมกับ “♀” สุดแกร่งถึง 5 คน...\nหลังจากที่โอกะพ่ายแพ้ให้กับ...อาซึมิ จึงเป็นเหตุให้... “จะขอยุบทีมเอล-พาลาซีโอ้”!!! อะไรกัน แทบไม่อยากจะเชื่อ!!! แบบนี้สรวงสวรรค์ที่เต็มไปด้วยหญิงสาวของพวกเราจะเป็นยังไงต่อล่ะ? เล่ม 5 กับการเปลี่ยนแปลงครั้งใหญ่ของเอล-พาลาซีโอ้ ห้ามพลาดเด็ดขาด!!\nประเภท:\nCOMEDY\nระดับผู้อ่าน:\n13 ปีขึ้นไป\nคนเขียน/คนวาด:\nTakao AOYAGI (คลิกที่ชื่อนักเขียนเพื่อดูผลงานเรื่องอื่น)\nจำนวนเล่มจบ:\nไม่ระบุ\nISBN:\n9786160911592\nBARCODE:\n8854654155317\nราคาเต็ม:\n50 บาท', 10, '2018-05-29 22:42:21'),
(28, 6, 1, 'ยัยลูกเจี๊ยบบรรเลงรัก 1 [Only at 7-11]', 'http://localhost:8000/image/image-0438f2ae24e3aec5f6c3eb31264483938f4dd8e0.jpeg', 'ฮินาโกะโตมาในโรงเรียนหญิงล้วนและไม่ถูกโรคกับผู้ชายที่สุด! แต่โรงเรียนม.ปลายที่เธอเข้านั้นกลับเป็นอดีตโรงเรียนชายล้วนที่มีนักเรียนหญิงอยู่เพียง 4 คนเท่านั้น! แถมแต่ละวันก็ยังหนักหนาสาหัสเหลือเกิน ทั้งโดนมิสึกิที่นั่งข้างๆ แหย่ ทั้งโดนชุน หัวหน้าห้องมองด้วยสายตาเย็นชา แล้วจะมีวันที่ฮินาโกะมีความรักกับเขาบ้างไหม!? ชีวิตในรั้วโรงเรียนของเธอจะเป็นอย่างไร!!?\nประเภท:\nLOVE ROMANTIC\nระดับผู้อ่าน:\nทั่วไป\nคนเขียน/คนวาด:\nMIKA SATONAKA (คลิกที่ชื่อนักเขียนเพื่อดูผลงานเรื่องอื่น)\nจำนวนเล่มจบ:\n9\nISBN:\n9786160924479\nBARCODE:\n8854654155164\nราคาเต็ม:\n50 บาท', 3, '2018-05-29 22:43:44'),
(29, 6, 2, '[K]-Gent ร้ายขั้นสุด...สุภาพบุรุษสองหน้า', 'http://localhost:8000/image/image-ba4486d622d9ac4a8acf5aa4e06bf53a7f510955.jpeg', 'สวัสดีค่าา-~~\n\nมาเจอกันอีกแล้ววว เบื่อกันรึยังเนี่ยย แต่หวังว่าจะไม่เบื่อนะ เพราะวันีน้กลับมาพร้อมกับเซ็ตที่ทุกคนรอคอย นั่นก็คือ เซ็ต [K] นั่นเอง กับนิยายเรื่องใหม่ และพระเอกนางเอกใหม่แกะกล่อง เทเลอร์-มารี ซึ่งรายละเอียดจะเป็นยังไงบ้างนั้น ไปอ่านกันเลยจ้าาา\n\n1.เรื่องนี้เป็นหนึ่งในเซ็ต [K] ซึ่งเป็นเรื่องราวของนักเรียนในรร.คิไรส์ ไฮสกูล ซีรีส์นี้ออกมาแล้วทั้งหมดสองเล่ม เล่มนี้เป็นเล่มที่สาม มีตัวละครเก่าๆ มาแจมเกือบครบ และที่สำคัญคือ ปมของเรดส์ที่ยังไม่ได้เฉลยในเล่มที่แล้ว เล่มนี้เราจะได้รู้กันแน่นอนจ้า ส่วนใครที่เพิ่งเคยอ่านเล่มนี้เป็นเล่มแรก ไม่งงแน่นอนค่าา\n\n2. ภาพปก เป็นพี่แฝดอยู่แล้วเนอะ จะเป็นใครไม่ได้เลย ไม่งั้นจะโกรธมากก เซ็ตนี้ เรืองแนวนี้ รร.นี้ ยังไงก็ต้องมีแฝดด รักมากก ไม่นอกใจ และหวังว่าน้องๆ จะรักลายเส้นของพี่แฝดอย่างที่พี่รักน้าาา\n\n3. เล่มนี้เป็นเล่มเดียวจบ ไม่ต้องอ่านต่อกับเล่มไหนก็ได้ค่า แต่ถ้าอยากฟินก็อ่านเซ็ต K ให้ครบทุกเล่มจะดีมาก ฟินกว่าเดิมแน่นอนน ราคานั้นแพงสุดเท่าที่เคยเขียนมาเลยจ้า 269 บาทแน่นอน  เก็บตังค์กันรัวๆเลยน้าสาวกก\n\n4.วางแผงเดือนกุมภาพันธ์แน่นอนจ้า ตอนนี้พี่แฝดกำลังวาดอยู่ ใกล้เสร็จแร้วว แต่ห้ามทวงเด็ดขาด เพราะพี่เวลาแต่งนิยาย ก็ไม่ชอบให้ใครทวงง คนวาดก็น่าจะรู้สึกแบบเดียวกัน มันจะกดดันและทำให้ทำอะไรได้ไม่เต็มที่ ดังนั้นอดใจรอกันอีกหน่อยเนอะ ได้อ่านกันแน่นอนจ้า มกราคมนี้เจอกันน้า', 20, '2018-05-29 22:46:25'),
(30, 6, 2, 'TOKYO KISS ❥ ฝ่าภารกิจหัวใจให้ได้ใกล้เธอ', 'http://localhost:8000/image/image-d69b63ec950b996ece6679389a2f9090b9ae8429.jpeg', 'ดวงตกคืออะไรคะ น้ำหนาวคนนี้ไม่รู้จัก ด้วยความที่ฉันเป็นคนโชคดีลัคกี้อินเกมอยู่เสมออ่ะนะ ส่งอะไรไปชิงโชคก็จะได้นู่นได้นี่อยู่ตลอด ^O^แต่ก็ไม่เข้าใจเหมือนกันนะว่าทำไม ‘พี่ไทม์’แฟนของฉันต้องคอยบ่นเรื่องชอบชิงโชคนี่ ถึงขั้นจะต้องเลิกกันเพราะเรื่องนี้เลย? ก็เสียใจนะ... แต่ไม่แคร์\n\nเพราะอย่างล่าสุดนี่ฉันก็เพิ่งได้ตั๋วเครื่องบินไปเที่ยวญี่ปุ่นมาจากการชิงโชคล่ะ ทว่า...ในความโชคดีก็ดูเหมือนจะมีความโชคร้ายแอบแฝงอยู่ เมื่อหนุ่มหล่อเพื่อนร่วมทริปเพียงคนเดียวอย่าง ‘เจเนียล’ ดันดูไม่ค่อยจะเต็ม นี่หมายความว่าฉันต้องมาทำภารกิจตะลุยเมืองญี่ปุ่นตามกติกาของการเป็นผู้โชคดีร่วมกับคนบ๊องๆ อย่างอีตานี่เนี่ยนะ TOTฮือๆ แล้วฉันจะเอาตัวรอดกลับเมืองไทยแบบครบสามสิบสองได้มั้ยล่ะเนี่ย!?', 30, '2018-05-29 22:48:59'),
(31, 7, 1, 'ดูนั้นตกหลุมรัก', 'http://localhost:8000/image/image-1c07343f2367e5742df65759ccbd72d4265f51c3.jpeg', 'ไม่มีจ้า', 3, '2018-05-31 10:40:23');

-- --------------------------------------------------------

--
-- Table structure for table `borrow`
--

CREATE TABLE IF NOT EXISTS `borrow` (
`BorrowId` int(11) NOT NULL,
  `MemId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `dateBorrow` date DEFAULT NULL,
  `dateReturn` date DEFAULT NULL,
  `sendName` varchar(100) NOT NULL,
  `sendAddress` text NOT NULL,
  `sendPostcode` varchar(6) NOT NULL,
  `sendTel` varchar(20) NOT NULL,
  `trackingNumber` varchar(20) DEFAULT NULL,
  `status` enum('Borrow','Return','Waiting','Cancel') NOT NULL DEFAULT 'Waiting'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `borrow`
--

INSERT INTO `borrow` (`BorrowId`, `MemId`, `BookId`, `dateBorrow`, `dateReturn`, `sendName`, `sendAddress`, `sendPostcode`, `sendTel`, `trackingNumber`, `status`) VALUES
(1, 6, 1, '2018-05-09', '2018-05-25', '555', '33333', '000000', '', '', 'Return'),
(5, 6, 1, '2018-05-31', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841119169', '', 'Return'),
(6, 6, 26, '2018-06-01', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Return'),
(7, 6, 27, '2018-06-02', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Return'),
(8, 6, 28, '2018-05-31', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', 'แทร๊กส่งคืน', 'Return'),
(9, 6, 27, '2018-05-31', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Return'),
(10, 6, 28, '2018-06-02', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Return'),
(11, 6, 2, '2018-06-02', '2018-06-03', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Borrow'),
(12, 6, 31, '2018-06-02', '2018-06-16', 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779', '', 'Return');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
`CategoryId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryId`, `name`) VALUES
(1, 'การ์ตูน'),
(2, 'นวนิยาย');

-- --------------------------------------------------------

--
-- Table structure for table `memaddress`
--

CREATE TABLE IF NOT EXISTS `memaddress` (
`AddressId` int(11) NOT NULL,
  `MemId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `postcode` varchar(6) NOT NULL,
  `tel` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `memaddress`
--

INSERT INTO `memaddress` (`AddressId`, `MemId`, `name`, `address`, `postcode`, `tel`) VALUES
(3, 6, 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841079779'),
(4, 6, 'สนธยา นงนุช', '64/2 หมู่ 1 ตำบลบางนาง อำเภอพานทอง จังหวัดชลบุรี', '20160', '0841119169');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE IF NOT EXISTS `member` (
`MemId` int(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(32) NOT NULL,
  `username` varchar(60) NOT NULL,
  `debit` int(11) NOT NULL DEFAULT '10',
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`MemId`, `email`, `password`, `username`, `debit`, `createdOn`) VALUES
(1, 'test@hotmail.com', 'pass', '', 0, '2018-04-20 23:11:42'),
(6, 'saksans@hotmail.com', '123456', 'Hello!222', 7, '2018-05-27 15:48:18'),
(7, 'max30012540@hotmail.com', '123456', 'สวัสดีเดือน 5', 13, '2018-05-31 10:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE IF NOT EXISTS `review` (
`ReviewId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `MemId` int(11) NOT NULL,
  `point` int(1) NOT NULL,
  `comment` text NOT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`ReviewId`, `BookId`, `MemId`, `point`, `comment`, `createdOn`) VALUES
(1, 1, 1, 3, '', '2018-05-10 13:45:49'),
(2, 1, 2, 5, '', '2018-05-10 13:45:59'),
(3, 1, 6, 1, '', '2018-05-10 13:46:11'),
(4, 2, 1, 1, '', '2018-05-10 13:55:56'),
(5, 2, 2, 2, '', '2018-05-10 13:56:07'),
(6, 26, 6, 5, 'ก็ดีนะ', '2018-05-30 17:18:05'),
(7, 27, 6, 5, '', '2018-05-30 17:31:11'),
(8, 28, 6, 3, 'ดีแหละ แต่ชื่อเรื่องไม่ OK เท่าไรนะ', '2018-05-30 23:28:16'),
(9, 27, 6, 4, 'ดีมั้ง', '2018-05-31 10:30:01'),
(10, 28, 6, 3, '', '2018-05-31 10:37:30'),
(11, 31, 6, 5, 'ดีแหละมั้ง', '2018-05-31 10:41:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
 ADD PRIMARY KEY (`BookId`);

--
-- Indexes for table `borrow`
--
ALTER TABLE `borrow`
 ADD PRIMARY KEY (`BorrowId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
 ADD PRIMARY KEY (`CategoryId`);

--
-- Indexes for table `memaddress`
--
ALTER TABLE `memaddress`
 ADD PRIMARY KEY (`AddressId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
 ADD PRIMARY KEY (`MemId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
 ADD PRIMARY KEY (`ReviewId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
MODIFY `BookId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `borrow`
--
ALTER TABLE `borrow`
MODIFY `BorrowId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
MODIFY `CategoryId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `memaddress`
--
ALTER TABLE `memaddress`
MODIFY `AddressId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
MODIFY `MemId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
MODIFY `ReviewId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

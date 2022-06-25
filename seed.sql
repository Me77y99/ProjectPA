SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `project_pa`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `foods`
--

CREATE TABLE `foods` (
  `Id` int(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Quantity` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `foods`
--

INSERT INTO `foods` (`Id`, `Name`, `Quantity`) VALUES
(1, 'Soja ', '120.00'),
(2, 'Crusca ', '115.00'),
(3, 'Barbabietola', '150.00'),
(4, 'Mais', '200.00'),
(5, 'Orzo ', '110.00'),
(6, 'Fave', '180.00');

-- --------------------------------------------------------

--
-- Struttura della tabella `orders`
--

CREATE TABLE `orders` (
  `Id` int(10) NOT NULL,
  `Recipe_id` int(10) NOT NULL,
  `User_id` int(10) NOT NULL,
  `Quantity` decimal(10,2) NOT NULL,
  `Status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `orders`
--

INSERT INTO `orders` (`Id`, `Recipe_id`, `User_id`, `Quantity`, `Status`) VALUES
(1, 3, 2, '20.00', 'CREATO'),
(2, 5, 2, '100.00', 'CREATO'),
(3, 2, 2, '50.00', 'CREATO'),
(4, 4, 2, '125.00', 'CREATO'),
(5, 1, 2, '180.00', 'CREATO');

-- --------------------------------------------------------

--
-- Struttura della tabella `recipes`
--

CREATE TABLE `recipes` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `recipes`
--

INSERT INTO `recipes` (`Id`, `Name`) VALUES
(1, 'Mangime Bovini'),
(2, 'Becchime'),
(3, 'Mangime Ovini'),
(4, 'Mangime Equini'),
(5, 'Mangime Suini');

-- --------------------------------------------------------

--
-- Struttura della tabella `recipe_foods`
--

CREATE TABLE `recipe_foods` (
  `Recipe_id` int(10) NOT NULL,
  `Food_id` int(10) NOT NULL,
  `Sort` int(10) NOT NULL,
  `Rate` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `recipe_foods`
--

INSERT INTO `recipe_foods` (`Recipe_id`, `Food_id`, `Sort`, `Rate`) VALUES
(1, 3, 1, 30),
(1, 1, 2, 60),
(1, 2, 3, 10),
(2, 4, 1, 40),
(2, 5, 2, 45),
(2, 2, 3, 15),
(3, 6, 1, 60),
(3, 2, 2, 40),
(4, 2, 1, 50),
(4, 5, 2, 50),
(5, 2, 1, 20),
(5, 5, 2, 20),
(5, 3, 3, 20),
(5, 4, 4, 20),
(5, 1, 5, 20);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `Id` int(10) NOT NULL,
  `Role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`Id`, `Role`) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'user');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`Id`);

--
-- Indici per le tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ForeignKeyRecipe` (`Recipe_id`),
  ADD KEY `ForeignKeyUser` (`User_id`);

--
-- Indici per le tabelle `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`Id`);

--
-- Indici per le tabelle `recipe_foods`
--
ALTER TABLE `recipe_foods`
  ADD KEY `ForeignKeyFood` (`Food_id`),
  ADD KEY `ForeignKeyRecipeId` (`Recipe_id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `foods`
--
ALTER TABLE `foods`
  MODIFY `Id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `recipes`
--
ALTER TABLE `recipes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `ForeignKeyRecipe` FOREIGN KEY (`Recipe_id`) REFERENCES `recipes` (`Id`),
  ADD CONSTRAINT `ForeignKeyUser` FOREIGN KEY (`User_id`) REFERENCES `users` (`Id`);

--
-- Limiti per la tabella `recipe_foods`
--
ALTER TABLE `recipe_foods`
  ADD CONSTRAINT `ForeignKeyFood` FOREIGN KEY (`Food_id`) REFERENCES `foods` (`Id`),
  ADD CONSTRAINT `ForeignKeyRecipeId` FOREIGN KEY (`Recipe_id`) REFERENCES `recipes` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

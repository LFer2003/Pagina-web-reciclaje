-- Tabla para lecturas de la estación (simuladas)
CREATE TABLE IF NOT EXISTS station_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  material VARCHAR(50) NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  quality VARCHAR(20) NOT NULL, -- Alta / Media / Baja
  price_suggested DECIMAL(10,2) DEFAULT 0,
  points_awarded INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Si tu marketplace tiene tabla products, añade estos campos:
ALTER TABLE products
  ADD COLUMN verified_by_station TINYINT(1) DEFAULT 0,
  ADD COLUMN station_reading_id INT DEFAULT NULL;

-- Tabla de usuarios (si no existe) - solo campos relevantes
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(150),
  points INT DEFAULT 0
);

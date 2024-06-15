-- Creamos la tabla TipoUsuario si no existe
CREATE TABLE IF NOT EXISTS TipoUsuario (
    id_tipo_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario VARCHAR(50),
    Enabled BOOL DEFAULT TRUE
);


-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario ( /*nombre tabla */
    correo_electronico VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(50), 
    telefono VARCHAR(15),
    contrasena VARCHAR(100),    
    Codigo_postal CHAR(5),
    id_tipo_usuario INT,
    credito int,
    Enabled BOOL DEFAULT TRUE,
    FOREIGN KEY (id_tipo_usuario) REFERENCES TipoUsuario(id_tipo_usuario)
);



CREATE TABLE IF NOT EXISTS Mensaje (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_emisor VARCHAR(50),
    id_receptor VARCHAR(50),
    contenido TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    leido BOOL DEFAULT FALSE,
    FOREIGN KEY (id_emisor) REFERENCES Usuario(correo_electronico),
    FOREIGN KEY (id_receptor) REFERENCES Usuario(correo_electronico)
);


-- Tabla Favorito
CREATE TABLE IF NOT EXISTS Favorito (/*--nombre tabla */
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    correo_usuario VARCHAR(50), 
    id_producto INT,
    Enabled BOOL DEFAULT TRUE,
    FOREIGN KEY (correo_usuario) REFERENCES Usuario(correo_electronico),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);


-- Tabla Producto
CREATE TABLE IF NOT EXISTS Producto (/*--nombre tabla */
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50), 
    imagen LONGBLOB,
    objeto_cambio VARCHAR(200),
    correo_electronico VARCHAR(50),    
    Enabled BOOL DEFAULT TRUE,
    FOREIGN KEY (correo_electronico) REFERENCES Usuario(correo_electronico)
);



-- Tabla Categoria
CREATE TABLE IF NOT EXISTS Categoria (/*--nombre tabla */
    id_categoria INT PRIMARY KEY,
    puntos INT NOT NULL, 
    tipo_categoria VARCHAR(50) NOT NULL,
    predefinido boolean,
    creador_categoria varchar(50),
    Enabled BOOL DEFAULT TRUE
);

INSERT INTO Categoria (id_categoria, tipo_categoria, puntos) VALUES
(1, 'Libros/material papeleria', 80),
(2, 'Ropa', 60),
(3, 'Equipo electrónico', 100),
(4, 'Material deportivo', 40),
(5, 'Apuntes', 20);



/*--Tabla ProductoCategoria*/
CREATE TABLE IF NOT EXISTS ProductoCategoria (/*--nombre tabla */
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    id_categoria INT,
    Enabled BOOL DEFAULT TRUE,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);


-- Tabla sesiones
CREATE TABLE IF NOT EXISTS Sesiones (
	id_sesion VARCHAR(200) PRIMARY KEY,
    correo_electronico VARCHAR(50),
    fecha_inicio DATETIME NOT NULL,
    FOREIGN KEY (correo_electronico) REFERENCES Usuario(correo_electronico)
);
-- Fin creación de tablas



DELIMITER //
CREATE TRIGGER insert_session_timestamp
BEFORE INSERT ON Sesiones
FOR EACH ROW
SET NEW.fecha_inicio = NOW();
//
DELIMITER ;


DELIMITER //
CREATE EVENT delete_spired_sessions
ON SCHEDULE
    EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
  DELETE FROM Sesiones
  WHERE fecha_inicio < NOW() - INTERVAL 1 DAY;
//
DELIMITER ;


-- Trigger para asignar 20 puntos a los usuarios de tipo 1 al registrarse
DELIMITER //

CREATE TRIGGER asignar_puntos_nuevo_usuario
BEFORE INSERT ON Usuario
FOR EACH ROW
BEGIN
    DECLARE tipo_usuario INT;

    -- Obtener el tipo de usuario del nuevo registro
    SELECT id_tipo_usuario INTO tipo_usuario FROM TipoUsuario WHERE id_tipo_usuario = NEW.id_tipo_usuario;

    -- Verificar si el tipo de usuario es 1 (Usuario de tipo 1)
    IF tipo_usuario = 1 THEN
        -- Asignar 20 puntos al nuevo usuario
        SET NEW.credito = 20;
    END IF;
END;
//

DELIMITER ;
-- Script de configuración de la base de datos para el Sistema de Gestión de Eventos
-- Ejecutar este script en PostgreSQL para crear las tablas necesarias

-- Crear la base de datos (ejecutar solo si no existe)
-- CREATE DATABASE eventos_db;

-- Conectar a la base de datos
-- \c eventos_db;

-- Crear tabla de provincias
CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Crear tabla de ubicaciones
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    id_province INTEGER REFERENCES provinces(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de ubicaciones de eventos
CREATE TABLE IF NOT EXISTS event_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    full_address TEXT NOT NULL,
    max_capacity INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    id_location INTEGER REFERENCES locations(id),
    id_creator_user INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    duration_in_minutes INTEGER NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    enabled_for_enrollment BOOLEAN DEFAULT true,
    max_assistance INTEGER NOT NULL,
    id_creator_user INTEGER REFERENCES users(id),
    id_event_location INTEGER REFERENCES event_locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de etiquetas
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Crear tabla de relación eventos-etiquetas
CREATE TABLE IF NOT EXISTS event_tags (
    id_event INTEGER REFERENCES events(id) ON DELETE CASCADE,
    id_tag INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (id_event, id_tag)
);

-- Crear tabla de inscripciones a eventos
CREATE TABLE IF NOT EXISTS event_enrollments (
    id SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    id_event INTEGER REFERENCES events(id) ON DELETE CASCADE,
    registration_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_user, id_event)
);

-- Insertar datos de ejemplo

-- Provincias
INSERT INTO provinces (name, full_name, latitude, longitude) VALUES
('BA', 'Buenos Aires', -34.6037, -58.3816),
('CABA', 'Ciudad Autónoma de Buenos Aires', -34.6037, -58.3816),
('CO', 'Córdoba', -31.4167, -64.1833),
('SF', 'Santa Fe', -31.6333, -60.7),
('ME', 'Mendoza', -32.8833, -68.8333);

-- Ubicaciones
INSERT INTO locations (name, id_province, latitude, longitude) VALUES
('Centro de Buenos Aires', 2, -34.6037, -58.3816),
('Palermo', 2, -34.5895, -58.4154),
('Centro de Córdoba', 3, -31.4167, -64.1833),
('Nueva Córdoba', 3, -31.4167, -64.1833),
('Centro de Rosario', 4, -32.9468, -60.6393);

-- Usuarios de ejemplo (password: "123")
INSERT INTO users (first_name, last_name, username, password) VALUES
('Juan', 'Pérez', 'juanperez', '123'),
('María', 'González', 'mariagonzalez', '123'),
('Carlos', 'López', 'carloslopez', '123'),
('Ana', 'Martínez', 'anamartinez', '123'),
('Luis', 'Rodríguez', 'luisrodriguez', '123');

-- Ubicaciones de eventos
INSERT INTO event_locations (name, full_address, max_capacity, latitude, longitude, id_location, id_creator_user) VALUES
('Centro de Convenciones Buenos Aires', 'Av. Figueroa Alcorta 2099, CABA', 500, -34.5895, -58.4154, 1, 1),
('Auditorio Palermo', 'Av. Santa Fe 1234, Palermo, CABA', 200, -34.5895, -58.4154, 2, 2),
('Centro de Eventos Córdoba', 'Av. Hipólito Yrigoyen 123, Córdoba', 300, -31.4167, -64.1833, 3, 3),
('Sala de Conferencias Nueva Córdoba', 'Belgrano 456, Nueva Córdoba', 150, -31.4167, -64.1833, 4, 4),
('Centro de Exposiciones Rosario', 'Bv. Oroño 789, Rosario', 400, -32.9468, -60.6393, 5, 5);

-- Eventos de ejemplo
INSERT INTO events (name, description, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, id_event_location) VALUES
('Conferencia de Tecnología 2024', 'La conferencia más importante de tecnología del año con expertos internacionales', '2024-12-15 18:00:00', 180, 50.00, true, 200, 1, 1),
('Workshop de React Native', 'Aprende a desarrollar aplicaciones móviles con React Native desde cero', '2024-12-20 14:00:00', 240, 25.00, true, 50, 2, 2),
('Meetup de Desarrollo Web', 'Networking y charlas sobre las últimas tendencias en desarrollo web', '2024-12-25 19:00:00', 120, 0.00, true, 100, 3, 3),
('Seminario de Inteligencia Artificial', 'Descubre cómo la IA está transformando diferentes industrias', '2024-12-30 16:00:00', 300, 75.00, true, 150, 4, 4),
('Hackathon de Fintech', 'Competencia de 24 horas para desarrollar soluciones financieras innovadoras', '2025-01-05 09:00:00', 1440, 100.00, true, 80, 5, 5);

-- Etiquetas
INSERT INTO tags (name) VALUES
('Tecnología'),
('Desarrollo'),
('React Native'),
('Web'),
('Inteligencia Artificial'),
('Fintech'),
('Networking'),
('Workshop'),
('Conferencia'),
('Hackathon');

-- Relacionar eventos con etiquetas
INSERT INTO event_tags (id_event, id_tag) VALUES
(1, 1), (1, 9), -- Conferencia de Tecnología
(2, 1), (2, 2), (2, 3), (2, 8), -- Workshop de React Native
(3, 2), (3, 4), (3, 7), -- Meetup de Desarrollo Web
(4, 1), (4, 5), (4, 9), -- Seminario de IA
(5, 1), (5, 6), (5, 10); -- Hackathon de Fintech

-- Inscripciones de ejemplo
INSERT INTO event_enrollments (id_user, id_event) VALUES
(1, 2), -- Juan se inscribe al Workshop de React Native
(2, 1), -- María se inscribe a la Conferencia de Tecnología
(3, 3), -- Carlos se inscribe al Meetup
(4, 4), -- Ana se inscribe al Seminario de IA
(5, 5); -- Luis se inscribe al Hackathon

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_creator ON events(id_creator_user);
CREATE INDEX idx_enrollments_user ON event_enrollments(id_user);
CREATE INDEX idx_enrollments_event ON event_enrollments(id_event);
CREATE INDEX idx_event_locations_creator ON event_locations(id_creator_user);

-- Comentarios sobre las tablas
COMMENT ON TABLE provinces IS 'Tabla de provincias de Argentina';
COMMENT ON TABLE locations IS 'Ubicaciones geográficas dentro de las provincias';
COMMENT ON TABLE users IS 'Usuarios del sistema';
COMMENT ON TABLE event_locations IS 'Ubicaciones específicas donde se realizan eventos';
COMMENT ON TABLE events IS 'Eventos del sistema';
COMMENT ON TABLE tags IS 'Etiquetas para categorizar eventos';
COMMENT ON TABLE event_tags IS 'Relación muchos a muchos entre eventos y etiquetas';
COMMENT ON TABLE event_enrollments IS 'Inscripciones de usuarios a eventos';

-- Verificar que todo se creó correctamente
SELECT 'Base de datos configurada correctamente' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_enrollments FROM event_enrollments;

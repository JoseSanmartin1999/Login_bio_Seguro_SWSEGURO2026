-- Extension para generar UUIDs de forma segura
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('admin', 'cliente')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para WebAuthn (Credenciales Criptográficas)
-- No guardamos huellas, guardamos la clave pública del dispositivo
CREATE TABLE IF NOT EXISTS authenticators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credential_id BYTEA NOT NULL,      -- ID único del hardware
    public_key BYTEA NOT NULL,         -- Clave pública para verificar el login
    sign_count INTEGER DEFAULT 0,      -- Para prevenir ataques de repetición (Replay)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Auditoría (Requisito NIST RV.1 - Monitoreo)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,              -- Ejemplo: 'LOGIN_SUCCESS', 'FAILED_ATTEMPT'
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un Admin inicial para pruebas (Opcional)
-- El login real será biométrico, pero necesitamos el registro del usuario
INSERT INTO users (username, full_name, role) 
VALUES ('jose.admin', 'Jose Sanmartín', 'admin');
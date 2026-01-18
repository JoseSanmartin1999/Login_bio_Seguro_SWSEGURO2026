const db = require('./db');

class UserRepository {
    // Crear un nuevo usuario
    async createUser(username, fullName, role) {
        const query = 'INSERT INTO users (username, full_name, role) VALUES ($1, $2, $3) RETURNING id';
        const result = await db.query(query, [username, fullName, role]);
        return result.rows[0].id;
    }

    // Guardar la llave pública y datos del dispositivo (Registro)
    async saveAuthenticator(userId, authData) {
        const query = `
            INSERT INTO authenticators (user_id, credential_id, public_key, sign_count)
            VALUES ($1, $2, $3, $4)
        `;
        // Los datos de WebAuthn vienen como Buffer/Uint8Array, Postgres los recibe bien como BYTEA
        await db.query(query, [
            userId, 
            authData.credentialID, 
            authData.publicKey, 
            authData.counter
        ]);
    }

    // Obtener dispositivos vinculados (Login)
    async getUserAuthenticators(username) {
        const query = `
            SELECT a.*, u.role FROM authenticators a 
            JOIN users u ON a.user_id = u.id 
            WHERE u.username = $1
        `;
        const result = await db.query(query, [username]);
        return result.rows;
    }

    // Actualizar contador para prevenir Replay Attacks (NIST SSDF PW.2)
    async updateCounter(credentialID, newCounter) {
        const query = 'UPDATE authenticators SET sign_count = $1 WHERE credential_id = $2';
        await db.query(query, [newCounter, credentialID]);
    }
}

// Exportamos una instancia única (Patrón Singleton)
module.exports = new UserRepository();
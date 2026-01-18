const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost', // Importante: local para Node.js externo
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
module.exports = {
    query: (text, params) => pool.query(text, params),
};
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Apunta al .env en la raíz

// --- IMPORTACIONES DE INFRAESTRUCTURA ---
const db = require('./src/infrastructure/db');
// Verifica si tu archivo es 'UserRepository' (U mayúscula) o 'userRepository'
const userRepository = require('./src/infrastructure/UserRepository');

// --- IMPORTACIONES DE ADAPTADORES ---
const { authorize } = require('./src/adapters/authMiddleware');

// --- IMPORTACIONES DE CASOS DE USO ---
const { getRegisterOptions } = require('./src/use_cases/RegisterOptions');
const { verifyRegister } = require('./src/use_cases/VerifyRegister');
const { getLoginOptions } = require('./src/use_cases/LoginOptions');
const { verifyLogin } = require('./src/use_cases/VerifyLogin');

const app = express();
app.use(express.json());
app.use(cors());

// Retos temporales (NIST SSDF: Prevención de Replay)
const currentChallenges = new Map();

// --- RUTAS ---

app.get('/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'ok', serverTime: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Registro
// Registro
app.post('/auth/register-options', async (req, res) => {
    try {
        console.log('📝 Register request received:', req.body);
        const { username, fullName } = req.body;

        if (!username || !fullName) {
            return res.status(400).json({ error: 'Username y fullName son requeridos' });
        }

        // Crear un ID de usuario como Uint8Array (requerido por @simplewebauthn/server v13)
        const newUser = {
            id: new Uint8Array(Buffer.from(username)),
            username,
            fullName
        };
        const options = await getRegisterOptions(newUser);
        currentChallenges.set(username, options.challenge);
        console.log('✅ Register options generated for:', username);
        res.json(options);
    } catch (e) {
        console.error('❌ Error in register-options:', e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/auth/register-verify', async (req, res) => {
    try {
        console.log('🔐 Register verify request received');
        const { body, username, fullName, role } = req.body;
        console.log('Username:', username, 'Role:', role);

        const expectedChallenge = currentChallenges.get(username);
        if (!expectedChallenge) {
            console.error('❌ Challenge not found for user:', username);
            return res.status(400).json({ error: 'Desafío no encontrado' });
        }

        console.log('Challenge found, verifying registration...');
        const verification = await verifyRegister(body, expectedChallenge);

        if (verification.verified) {
            console.log('✅ Registration verified, saving user...');
            const userId = await userRepository.createUser(username, fullName, role || 'cliente');
            await userRepository.saveAuthenticator(userId, verification.data);
            currentChallenges.delete(username);
            console.log('✅ User registered successfully:', username);
            return res.json({ success: true });
        }

        console.error('❌ Verification failed for user:', username);
        res.status(400).json({ error: 'Verificación fallida' });
    } catch (error) {
        console.error('❌ Error in register-verify:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/auth/login-options', async (req, res) => {
    const { username } = req.body;
    console.log('🔐 Login request received for:', username);
    try {
        const options = await getLoginOptions(username);
        currentChallenges.set(username, options.challenge);
        console.log('✅ Login options generated for:', username);
        res.json(options);
    } catch (error) {
        console.error('❌ Error in login-options:', error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/login-verify', async (req, res) => {
    const { body, username } = req.body;
    const expectedChallenge = currentChallenges.get(username);
    try {
        const authenticators = await userRepository.getUserAuthenticators(username);
        const auth = authenticators.find(a => Buffer.from(a.credential_id).toString('base64url') === body.id);
        const verification = await verifyLogin(body, expectedChallenge, auth);
        if (verification.verified) {
            await userRepository.updateCounter(auth.credential_id, verification.authenticationInfo.newCounter);
            res.json({ success: true, role: auth.role });
        } else { res.status(401).json({ error: 'Falla biométrica' }); }
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Dashboards (NIST SSDF: Privilegio Mínimo)
app.get('/api/admin/dashboard', authorize(['admin']), (req, res) => {
    res.json({ message: 'Bienvenido Admin', options: ['Auditoría', 'Gestión'] });
});

app.get('/api/cliente/dashboard', authorize(['cliente', 'admin']), (req, res) => {
    res.json({ message: 'Panel Cliente', restrictedOptions: ['Ver Perfil'] });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Login_bio_Seguro_SWSEGURO2026 en puerto ${PORT}`);
});
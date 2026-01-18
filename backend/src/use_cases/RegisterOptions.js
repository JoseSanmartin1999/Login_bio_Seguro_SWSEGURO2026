const { generateRegistrationOptions } = require('@simplewebauthn/server');

// RP = Relying Party (Tu aplicación)
const rpName = 'LoginBioSeguro2026';
const rpID = 'localhost'; 
const origin = `http://${rpID}:5173`; // URL de tu frontend

async function getRegisterOptions(user) {
    return generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
        userName: user.username,
        attestationType: 'none', // No necesitamos certificar el modelo de hardware
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred', // Aquí es donde usa PIN o Cámara si no hay huella
        },
    });
}

module.exports = { getRegisterOptions };
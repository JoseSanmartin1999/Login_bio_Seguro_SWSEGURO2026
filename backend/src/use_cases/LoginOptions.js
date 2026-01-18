const { generateAuthenticationOptions } = require('@simplewebauthn/server');
const userRepository = require('../infrastructure/UserRepository');

const rpID = 'localhost';

async function getLoginOptions(username) {
    // 1. Buscar los autenticadores registrados para este usuario
    const authenticators = await userRepository.getUserAuthenticators(username);

    if (!authenticators || authenticators.length === 0) {
        throw new Error('Usuario no tiene dispositivos registrados');
    }

    return generateAuthenticationOptions({
        rpID,
        allowCredentials: authenticators.map(auth => ({
            id: auth.credential_id,
            type: 'public-key',
            transports: ['internal'], // Fuerza el uso del hardware del dispositivo (Cámara/PIN)
        })),
        userVerification: 'preferred',
    });
}

module.exports = { getLoginOptions };
const { verifyRegistrationResponse } = require('@simplewebauthn/server');

const rpID = 'localhost';
const origin = `http://${rpID}:5173`; // Asegúrate de que coincida con tu frontend

async function verifyRegister(body, expectedChallenge) {
    const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
        const { credentialPublicKey, credentialID, counter } = registrationInfo;
        return {
            verified: true,
            data: {
                publicKey: Buffer.from(credentialPublicKey),
                credentialID: Buffer.from(credentialID),
                counter
            }
        };
    }

    return { verified: false };
}

module.exports = { verifyRegister };
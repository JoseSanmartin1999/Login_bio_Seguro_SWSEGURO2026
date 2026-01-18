const { verifyAuthenticationResponse } = require('@simplewebauthn/server');

const rpID = 'localhost';
const origin = `http://${rpID}:5173`;

async function verifyLogin(body, expectedChallenge, authenticator) {
    const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
            credentialID: authenticator.credential_id,
            credentialPublicKey: authenticator.public_key,
            counter: authenticator.sign_count,
        },
    });

    return verification;
}

module.exports = { verifyLogin };
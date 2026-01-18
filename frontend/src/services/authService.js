import axios from 'axios';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const API_URL = 'http://localhost:3000/auth';

export const authService = {
  // REGISTRO BIOMÉTRICO
  async register(username, fullName, role) {
    // 1. Obtener opciones del servidor
    const { data: options } = await axios.post(`${API_URL}/register-options`, { username, fullName });

    // 2. Activar el hardware del dispositivo (Cámara/PIN)
    const attestationResponse = await startRegistration(options);

    // 3. Enviar la respuesta para verificación
    const { data: verification } = await axios.post(`${API_URL}/register-verify`, {
      body: attestationResponse,
      username,
      fullName,
      role
    });

    return verification;
  },

  // LOGIN BIOMÉTRICO
  async login(username) {
    // 1. Obtener opciones de desafío
    const { data: options } = await axios.post(`${API_URL}/login-options`, { username });

    // 2. Firmar el desafío con el hardware
    const assertionResponse = await startAuthentication(options);

    // 3. Verificar firma en el backend
    const { data: verification } = await axios.post(`${API_URL}/login-verify`, {
      body: assertionResponse,
      username
    });

    return verification;
  }
};
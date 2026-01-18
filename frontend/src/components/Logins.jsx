import React, { useState } from 'react';
import { authService } from '../services/authService';

export const Login = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' o 'register'
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('cliente');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await authService.login(username);
            if (result.success) {
                alert('¡Autenticación biométrica exitosa!');
                onLoginSuccess(result);
            }
        } catch (err) {
            console.error(err);
            alert('Error: Asegúrate de tener un PIN o Biometría activa en tu equipo.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await authService.register(username, fullName, role);
            if (result.success) {
                alert(`✅ Usuario ${username} registrado exitosamente. Ahora puedes iniciar sesión.`);
                // Limpiar formulario y cambiar a modo login
                setUsername('');
                setFullName('');
                setRole('cliente');
                setMode('login');
            }
        } catch (err) {
            console.error(err);
            alert('Error en el registro. Verifique que el usuario no exista o que tenga biometría activa.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login_bio_Seguro_2026</h2>

            {mode === 'login' ? (
                // Formulario de Login
                <>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Verificando hardware...' : 'Iniciar Sesión con Biometría'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={() => setMode('register')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4a9eff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: 'inherit'
                            }}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </>
            ) : (
                // Formulario de Registro
                <>
                    <h3 style={{ marginBottom: '0.5rem' }}>Registrar Nuevo Usuario</h3>
                    <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                        Se requerirá verificación biométrica del dispositivo
                    </p>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nombre Completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                fontSize: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                        </select>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Procesando hardware...' : 'Registrar y Vincular Biometría'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => setMode('login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4a9eff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: 'inherit'
                            }}
                        >
                            Inicia sesión
                        </button>
                    </p>
                </>
            )}
        </div>
    );
};
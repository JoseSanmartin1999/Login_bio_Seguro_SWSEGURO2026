import React, { useState } from 'react';
// Importamos los componentes correctos
import { Login } from './components/Logins.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser({
      username: userData.username,
      fullName: userData.fullName || 'Usuario',
      role: userData.role
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="auth-wrapper">
          <header className="brand-header">
            <h1>Login_bio_Seguro_SWSEGURO2026</h1>
            <p>Sistema de Autenticación Biométrica Inherente</p>
          </header>
          {/* Aquí inyectamos el componente de Login */}
          <Login onLoginSuccess={handleLoginSuccess} />
          <footer className="security-footer">
            <small>Basado en metodología NIST SSDF (SP 800-218)</small>
          </footer>
        </div>
      ) : (
        <div className="main-layout">
          <nav className="top-nav">
            <span>Sesión Segura: <strong>{user.username}</strong></span>
            <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
          </nav>
          {/* Aquí inyectamos el dashboard con los datos del usuario */}
          <Dashboard user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
import React from 'react';
import { RegisterUser } from '../components/RegisterUser';

export const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <header>
        <h1>Bienvenido, {user.fullName}</h1>
        <span className="badge">{user.role.toUpperCase()}</span>
      </header>

      <main>
        {user.role === 'admin' ? (
          <section className="admin-section">
            <h2>Panel de Control Administrativo</h2>
            <div className="grid">
              <RegisterUser />
              <div className="admin-card">
                <h3>Auditoría Básica</h3>
                <p>Consultar logs de acceso recientes (NIST RV.1)</p>
                <button className="btn-secondary">Ver Logs</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="cliente-section">
            <h2>Mi Perfil</h2>
            <div className="admin-card">
              <p><strong>Usuario:</strong> {user.username}</p>
              <p><strong>Rol:</strong> Cliente</p>
              <button className="btn-secondary">Editar Datos No Sensibles</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
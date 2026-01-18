import React, { useState } from 'react';
import { authService } from '../services/authService';

export const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'cliente'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Llamamos al servicio que definimos antes
      const result = await authService.register(
        formData.username, 
        formData.fullName, 
        formData.role
      );

      if (result.success) {
        alert(`Usuario ${formData.username} registrado y dispositivo vinculado.`);
        setFormData({ username: '', fullName: '', role: 'cliente' });
      }
    } catch (err) {
      console.error(err);
      alert('Error en el registro. Verifique que el usuario no exista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h3>Registrar Nuevo Usuario</h3>
      <p className="subtitle">Se requerirá verificación biométrica del dispositivo local.</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required 
        />
        <input 
          type="text" 
          placeholder="Nombre Completo" 
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          required 
        />
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Procesando hardware...' : 'Registrar y Vincular Biometría'}
        </button>
      </form>
    </div>
  );
};
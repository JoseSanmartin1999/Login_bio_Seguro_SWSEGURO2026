// Middleware para verificar si el usuario está autenticado y su rol
const authorize = (roles = []) => {
    return (req, res, next) => {
        // 1. En una app real, aquí verificarías el JWT o la Session
        // Por ahora, simulamos que el usuario viene en el header para pruebas
        const userRole = req.headers['x-user-role']; 
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // 2. Verificar si el rol del usuario está permitido para esta ruta
        if (roles.length && !roles.includes(userRole)) {
            return res.status(403).json({ error: 'Acceso denegado: Privilegios insuficientes' });
        }

        // Adjuntar datos al request para los siguientes pasos
        req.user = { id: userId, role: userRole };
        next();
    };
};

module.exports = { authorize };
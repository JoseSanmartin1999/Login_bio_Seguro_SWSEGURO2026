const db = require('../infrastructure/db');

const auditLogger = async (req, res, next) => {
    const originalSend = res.send;

    // Interceptamos la respuesta para saber si fue exitosa
    res.send = function (data) {
        const userId = req.user ? req.user.id : null;
        const action = `${req.method} ${req.path}`;
        
        // Registro asíncrono en la base de datos (NIST RV.1)
        db.query(
            'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
            [userId, action, req.ip, req.headers['user-agent']]
        ).catch(err => console.error('Error en auditoría:', err));

        originalSend.call(this, data);
    };
    next();
};

module.exports = auditLogger;
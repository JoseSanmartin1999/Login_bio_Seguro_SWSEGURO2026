// Principio de Responsabilidad Única (SRP): Definir la estructura del usuario
class User {
    constructor(id, username, fullName, role) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role; // 'admin' o 'cliente'
    }

    isAdmin() {
        return this.role === 'admin';
    }
}

module.exports = User;
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('instructor', 'admin'),
        allowNull: false,
        defaultValue: 'instructor'
    }
}, {
    tableName: 'users',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

User.beforeCreate(async (user) => {
    if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
});

User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
};

export default User;

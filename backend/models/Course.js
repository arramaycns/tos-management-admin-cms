import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Course = sequelize.define('Course', {
    code: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    yearLevel: {
        type: DataTypes.STRING(20),
        field: 'year_level'
    },
    semester: {
        type: DataTypes.STRING(20)
    },
    creditUnits: {
        type: DataTypes.STRING(10),
        field: 'credit_units'
    },
    cmoReference: {
        type: DataTypes.STRING(100),
        field: 'cmo_reference'
    },
    prerequisites: {
        type: DataTypes.STRING(200)
    },
    description: {
        type: DataTypes.TEXT
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'courses',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

export default Course;

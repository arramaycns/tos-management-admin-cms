import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const AcademicPeriod = sequelize.define('AcademicPeriod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    academicYear: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'academic_year'
    },
    semester: {
        type: DataTypes.ENUM('1st Semester', '2nd Semester'),
        allowNull: false
    },
    examType: {
        type: DataTypes.ENUM('Midterm', 'Finals'),
        allowNull: false,
        field: 'exam_type'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_active'
    }
}, {
    tableName: 'academic_periods',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

export default AcademicPeriod;

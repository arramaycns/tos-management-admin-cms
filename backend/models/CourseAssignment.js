import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const CourseAssignment = sequelize.define('CourseAssignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'course_code'
    },
    instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'instructor_id'
    },
    academicPeriodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'academic_period_id'
    }
}, {
    tableName: 'course_assignments',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    indexes: [
        { unique: true, fields: ['course_code', 'instructor_id', 'academic_period_id'] }
    ]
});

export default CourseAssignment;

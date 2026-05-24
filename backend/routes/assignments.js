import { Router } from 'express';
import CourseAssignment from '../models/CourseAssignment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import AcademicPeriod from '../models/AcademicPeriod.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/', async (req, res) => {
    const assignments = await CourseAssignment.findAll({ order: [['created_at', 'DESC']] });
    res.json(assignments);
});

router.post('/', async (req, res) => {
    const { courseCode, instructorId, academicPeriodId } = req.body;
    if (!courseCode || !instructorId || !academicPeriodId) {
        return res.status(400).json({ error: 'Course, instructor, and academic period are required' });
    }
    const course = await Course.findByPk(courseCode);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const instructor = await User.findByPk(instructorId);
    if (!instructor || instructor.role !== 'instructor') return res.status(404).json({ error: 'Instructor not found' });
    const period = await AcademicPeriod.findByPk(academicPeriodId);
    if (!period) return res.status(404).json({ error: 'Academic period not found' });
    const existing = await CourseAssignment.findOne({ where: { courseCode, instructorId, academicPeriodId } });
    if (existing) return res.status(409).json({ error: 'This course is already assigned to this instructor for this period' });
    const assignment = await CourseAssignment.create({ courseCode, instructorId, academicPeriodId });
    res.status(201).json(assignment);
});

router.delete('/:id', async (req, res) => {
    const assignment = await CourseAssignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    await assignment.destroy();
    res.json({ message: 'Assignment removed' });
});

export default router;

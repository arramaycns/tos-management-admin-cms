import { Router } from 'express';
import CourseAssignment from '../models/CourseAssignment.js';
import User from '../models/User.js';
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
    const existing = await CourseAssignment.findOne({ where: { courseCode, instructorId, academicPeriodId } });
    if (existing) return res.status(409).json({ error: 'This course is already assigned to this instructor for this period' });
    const assignment = await CourseAssignment.create({ courseCode, instructorId, academicPeriodId });
    res.status(201).json(assignment);
});

router.delete('/:id', async (req, res) => {
    await CourseAssignment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Assignment removed' });
});

export default router;

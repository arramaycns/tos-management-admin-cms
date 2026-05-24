import { Router } from 'express';
import { Course, TosStatus } from '../models/index.js';
import CourseAssignment from '../models/CourseAssignment.js';
import AcademicPeriod from '../models/AcademicPeriod.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    const user = req.user;

    if (user.role === 'admin') {
        const courses = await Course.findAll({
            include: [{ model: TosStatus, as: 'tosStatus' }],
            order: [['code', 'ASC']]
        });
        return res.json(courses);
    }

    const activePeriod = await AcademicPeriod.findOne({ where: { isActive: true } });
    if (!activePeriod) return res.json([]);

    const assignments = await CourseAssignment.findAll({
        where: { instructorId: user.id, academicPeriodId: activePeriod.id }
    });

    if (assignments.length === 0) return res.json([]);

    const courseCodes = assignments.map(a => a.courseCode);
    const courses = await Course.findAll({
        where: { code: courseCodes },
        include: [{ model: TosStatus, as: 'tosStatus' }],
        order: [['code', 'ASC']]
    });

    res.json(courses);
});

export default router;

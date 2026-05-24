import { Router } from 'express';
import AcademicPeriod from '../models/AcademicPeriod.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/', async (req, res) => {
    const periods = await AcademicPeriod.findAll({ order: [['created_at', 'DESC']] });
    res.json(periods);
});

router.post('/', async (req, res) => {
    const { academicYear, semester, examType } = req.body;
    if (!academicYear || !semester || !examType) {
        return res.status(400).json({ error: 'Academic year, semester, and exam type are required' });
    }
    const period = await AcademicPeriod.create({
        academicYear, semester, examType, isActive: false
    });
    res.status(201).json(period);
});

router.put('/:id', async (req, res) => {
    const { academicYear, semester, examType, isActive } = req.body;
    const period = await AcademicPeriod.findByPk(req.params.id);
    if (!period) return res.status(404).json({ error: 'Academic period not found' });

    if (isActive === true) {
        await AcademicPeriod.update({ isActive: false }, { where: { isActive: true } });
    }

    await period.update({ academicYear, semester, examType, isActive });
    res.json(period);
});

export default router;

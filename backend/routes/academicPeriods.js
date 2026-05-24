import { Router } from 'express';
import AcademicPeriod from '../models/AcademicPeriod.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/active', authenticateToken, async (req, res) => {
    const active = await AcademicPeriod.findOne({ where: { isActive: true } });
    res.json(active);
});

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

    const updates = {};
    if (academicYear !== undefined) updates.academicYear = academicYear;
    if (semester !== undefined) updates.semester = semester;
    if (examType !== undefined) updates.examType = examType;

    if (isActive === true) {
        await AcademicPeriod.update({ isActive: false }, { where: { isActive: true } });
        updates.isActive = true;
    } else if (isActive === false) {
        updates.isActive = false;
    }

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    await period.update(updates);
    res.json(period);
});

export default router;

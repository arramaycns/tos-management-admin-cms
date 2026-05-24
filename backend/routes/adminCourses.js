import { Router } from 'express';
import { Course, CourseOutcome, IloItem } from '../models/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/', async (req, res) => {
    const courses = await Course.findAll({
        include: [{ model: CourseOutcome, as: 'outcomes', include: [{ model: IloItem, as: 'ilos' }] }],
        order: [['code', 'ASC']]
    });
    res.json(courses);
});

router.post('/', async (req, res) => {
    const { code, name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description } = req.body;
    if (!code || !name) return res.status(400).json({ error: 'Code and name are required' });
    const existing = await Course.findByPk(code);
    if (existing) return res.status(409).json({ error: 'Course code already exists' });
    const course = await Course.create({ code, name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description });
    res.status(201).json(course);
});

router.put('/:code', async (req, res) => {
    const { name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description, isActive } = req.body;
    const course = await Course.findByPk(req.params.code);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.update({ name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description, isActive });
    res.json(course);
});

router.post('/:code/outcomes', async (req, res) => {
    const { co, description, totalItems } = req.body;
    const outcome = await CourseOutcome.create({ co, description, totalItems: totalItems || 0, courseCode: req.params.code });
    res.status(201).json(outcome);
});

router.delete('/:code/outcomes/:id', async (req, res) => {
    await IloItem.destroy({ where: { coId: req.params.id } });
    await CourseOutcome.destroy({ where: { id: req.params.id, courseCode: req.params.code } });
    res.json({ message: 'Deleted' });
});

router.post('/:code/outcomes/:coId/ilos', async (req, res) => {
    const { description, hours, percentage, items } = req.body;
    const ilo = await IloItem.create({ coId: req.params.coId, description, hours: hours || 0, percentage: percentage || 0, items: items || 0 });
    res.status(201).json(ilo);
});

router.delete('/:code/outcomes/ilos/:id', async (req, res) => {
    await IloItem.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
});

export default router;

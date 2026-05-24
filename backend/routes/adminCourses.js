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
    if (!code || !name) return res.status(400).json({ error: 'Course code and name are required' });
    if (!yearLevel) return res.status(400).json({ error: 'Year level is required' });
    if (!semester) return res.status(400).json({ error: 'Semester is required' });
    if (!creditUnits) return res.status(400).json({ error: 'Credit units is required' });
    if (!cmoReference) return res.status(400).json({ error: 'CMO reference is required' });
    const existing = await Course.findByPk(code);
    if (existing) return res.status(409).json({ error: 'Course code already exists' });
    const course = await Course.create({ code, name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description });
    res.status(201).json(course);
});

router.put('/:code', async (req, res) => {
    const { name, yearLevel, semester, creditUnits, cmoReference, prerequisites, description, isActive } = req.body;
    const course = await Course.findByPk(req.params.code);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (yearLevel !== undefined) updates.yearLevel = yearLevel;
    if (semester !== undefined) updates.semester = semester;
    if (creditUnits !== undefined) updates.creditUnits = creditUnits;
    if (cmoReference !== undefined) updates.cmoReference = cmoReference;
    if (prerequisites !== undefined) updates.prerequisites = prerequisites;
    if (description !== undefined) updates.description = description;
    if (isActive !== undefined) updates.isActive = isActive;

    await course.update(updates);
    res.json(course);
});

router.post('/:code/outcomes', async (req, res) => {
    const { co, description, totalHours, totalPercentage, totalItems } = req.body;
    if (!co) return res.status(400).json({ error: 'CO label is required' });
    const outcome = await CourseOutcome.create({
        co, description: description || '',
        totalHours: totalHours || 0, totalPercentage: totalPercentage || 0,
        totalItems: totalItems || 0, courseCode: req.params.code
    });
    res.status(201).json(outcome);
});

router.put('/:code/outcomes/:id', async (req, res) => {
    const outcome = await CourseOutcome.findOne({ where: { id: req.params.id, courseCode: req.params.code } });
    if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
    const { co, description, totalHours, totalPercentage } = req.body;
    const updates = {};
    if (co !== undefined) updates.co = co;
    if (description !== undefined) updates.description = description;
    if (totalHours !== undefined) updates.totalHours = totalHours;
    if (totalPercentage !== undefined) updates.totalPercentage = totalPercentage;
    await outcome.update(updates);
    res.json(outcome);
});

router.delete('/:code/outcomes/:id', async (req, res) => {
    const outcome = await CourseOutcome.findOne({ where: { id: req.params.id, courseCode: req.params.code } });
    if (!outcome) return res.status(404).json({ error: 'Outcome not found' });
    await IloItem.destroy({ where: { coId: req.params.id } });
    await outcome.destroy();
    res.json({ message: 'Deleted' });
});

router.post('/:code/outcomes/:coId/ilos', async (req, res) => {
    const { label, description, hours, percentage, items } = req.body;
    if (!description) return res.status(400).json({ error: 'ILO description is required' });
    const ilo = await IloItem.create({
        coId: req.params.coId, label: label || '',
        description, hours: hours || 0, percentage: percentage || 0, items: items || 0
    });
    res.status(201).json(ilo);
});

router.put('/:code/outcomes/ilos/:id', async (req, res) => {
    const ilo = await IloItem.findByPk(req.params.id);
    if (!ilo) return res.status(404).json({ error: 'ILO not found' });
    const { label, description, hours, percentage } = req.body;
    const updates = {};
    if (label !== undefined) updates.label = label;
    if (description !== undefined) updates.description = description;
    if (hours !== undefined) updates.hours = hours;
    if (percentage !== undefined) updates.percentage = percentage;
    await ilo.update(updates);
    res.json(ilo);
});

router.delete('/:code/outcomes/ilos/:id', async (req, res) => {
    const ilo = await IloItem.findByPk(req.params.id);
    if (!ilo) return res.status(404).json({ error: 'ILO not found' });
    await ilo.destroy();
    res.json({ message: 'Deleted' });
});

export default router;

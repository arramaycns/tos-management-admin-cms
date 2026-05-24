import { Router } from 'express';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/', async (req, res) => {
    const instructors = await User.findAll({
        where: { role: 'instructor' },
        attributes: ['id', 'username', 'name', 'role']
    });
    res.json(instructors);
});

export default router;

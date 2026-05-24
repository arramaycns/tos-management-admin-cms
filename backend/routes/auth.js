import { Router } from 'express';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.json({
        token,
        user: { id: user.id, username: user.username, name: user.name, role: user.role }
    });
});

router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

export default router;

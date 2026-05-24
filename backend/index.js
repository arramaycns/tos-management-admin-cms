import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import coursesRouter from './routes/courses.js';
import outcomesRouter from './routes/outcomes.js';
import itemsRouter from './routes/items.js';
import statusRouter from './routes/status.js';
import authRouter from './routes/auth.js';
import academicPeriodsRouter from './routes/academicPeriods.js';
import adminCoursesRouter from './routes/adminCourses.js';
import assignmentsRouter from './routes/assignments.js';
import instructorsRouter from './routes/instructors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin/academic-periods', academicPeriodsRouter);
app.use('/api/admin/courses', adminCoursesRouter);
app.use('/api/admin/assignments', assignmentsRouter);
app.use('/api/admin/instructors', instructorsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/courses', outcomesRouter);
app.use('/api/courses', itemsRouter);
app.use('/api/courses', statusRouter);

const distPath = path.resolve(__dirname, '..', 'dist');
const indexHtml = path.join(distPath, 'index.html');

if (fs.existsSync(indexHtml)) {
    const content = fs.readFileSync(indexHtml, 'utf-8');

    app.use(express.static(distPath));

    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            res.status(200).send(content);
            return;
        }
        next();
    });
} else {
    console.log('Build not found — run "npm run build" in the project root first');
}

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Trash2 } from 'react-feather';

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ courseCode: '', instructorId: '', academicPeriodId: '' });
    const [filterPeriod, setFilterPeriod] = useState('');
    const [filterInstructor, setFilterInstructor] = useState('');

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const loadAll = async () => {
        const [a, inst, c, p] = await Promise.all([
            fetch('/api/admin/assignments', { headers }).then(r => r.json()),
            fetch('/api/admin/instructors', { headers }).then(r => r.json()),
            fetch('/api/admin/courses', { headers }).then(r => r.json()),
            fetch('/api/admin/academic-periods', { headers }).then(r => r.json()),
        ]);
        setAssignments(a);
        setInstructors(inst);
        setCourses(c);
        setPeriods(p);
    };

    useEffect(() => { loadAll(); }, []);

    const handleCreate = async () => {
        if (!form.courseCode || !form.instructorId || !form.academicPeriodId) return;
        const res = await fetch('/api/admin/assignments', { method: 'POST', headers, body: JSON.stringify(form) });
        if (!res.ok) { const d = await res.json(); alert(d.error || 'Failed to create assignment'); return; }
        setShowForm(false);
        setForm({ courseCode: '', instructorId: '', academicPeriodId: '' });
        loadAll();
    };

    const handleRemove = async (id) => {
        await fetch(`/api/admin/assignments/${id}`, { method: 'DELETE', headers });
        loadAll();
    };

    const getInstructorName = (id) => instructors.find(i => i.id === id)?.name || id;
    const getCourseName = (code) => courses.find(c => c.code === code)?.name || code;
    const getPeriodLabel = (id) => { const p = periods.find(p => p.id === id); return p ? `${p.academicYear} - ${p.semester} (${p.examType})` : id; };

    const filtered = assignments.filter(a => {
        const matchPeriod = !filterPeriod || a.academicPeriodId == filterPeriod;
        const matchInstructor = !filterInstructor || a.instructorId == filterInstructor;
        return matchPeriod && matchInstructor;
    });

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>Course Assignments</h2>
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Assignment
                </button>
            </div>

            <div className={styles.filterRow} style={{ display: 'flex', gap: 12 }}>
                <select className={styles.input} style={{ width: 250 }} value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}>
                    <option value="">All Periods</option>
                    {periods.map(p => <option key={p.id} value={p.id}>{p.academicYear} - {p.semester} ({p.examType})</option>)}
                </select>
                <select className={styles.input} style={{ width: 250 }} value={filterInstructor} onChange={e => setFilterInstructor(e.target.value)}>
                    <option value="">All Instructors</option>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h3>Create Assignment</h3>
                    <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <div className={styles.field}>
                            <label>Course</label>
                            <select className={styles.input} value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })}>
                                <option value="">Select course...</option>
                                {courses.filter(c => c.isActive !== false).map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Instructor</label>
                            <select className={styles.input} value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
                                <option value="">Select instructor...</option>
                                {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Academic Period</label>
                            <select className={styles.input} value={form.academicPeriodId} onChange={e => setForm({ ...form, academicPeriodId: e.target.value })}>
                                <option value="">Select period...</option>
                                {periods.map(p => <option key={p.id} value={p.id}>{p.academicYear} - {p.semester} ({p.examType})</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.saveBtn} onClick={handleCreate}>Create</button>
                        <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Instructor</th>
                            <th>Academic Period</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td><strong>{a.courseCode}</strong> - {getCourseName(a.courseCode)}</td>
                                <td>{getInstructorName(a.instructorId)}</td>
                                <td>{getPeriodLabel(a.academicPeriodId)}</td>
                                <td>
                                    <button className={styles.iconBtn} style={{ color: '#DC2626' }} onClick={() => handleRemove(a.id)} title="Remove"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No assignments found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

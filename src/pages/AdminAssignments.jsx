import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Trash2 } from 'react-feather';
import ConfirmModal from '../components/ConfirmModal';
import FormModal from '../components/FormModal';

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ courseCode: '', instructorId: '', academicPeriodId: '' });
    const [filterPeriod, setFilterPeriod] = useState('');
    const [filterInstructor, setFilterInstructor] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'courseCode', dir: 'asc' });

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
        setConfirmRemove(null);
        loadAll();
    };

    const getInstructorName = (id) => instructors.find(i => i.id === id)?.name || id;
    const getCourseName = (code) => courses.find(c => c.code === code)?.name || code;
    const getPeriodLabel = (id) => { const p = periods.find(p => p.id === id); return p ? `${p.academicYear} - ${p.semester} (${p.examType})` : id; };

    const handleSort = (key) => {
        setSortConfig(prev => prev.key === key && prev.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' });
    };

    const sortArrow = (key) => sortConfig.key === key ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : '';

    const filtered = assignments.filter(a => {
        const matchPeriod = !filterPeriod || a.academicPeriodId == filterPeriod;
        const matchInstructor = !filterInstructor || a.instructorId == filterInstructor;
        return matchPeriod && matchInstructor;
    }).sort((a, b) => {
        const dir = sortConfig.dir === 'asc' ? 1 : -1;
        const va = (a[sortConfig.key] || '').toString().toLowerCase();
        const vb = (b[sortConfig.key] || '').toString().toLowerCase();
        return va < vb ? -dir : va > vb ? dir : 0;
    });

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>Course Assignments</h2>
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Assignment
                </button>
            </div>

            <div className={styles.filterRow}>
                <select className={styles.input} style={{ width: 250 }} value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}>
                    <option value="">All Periods</option>
                    {periods.map(p => <option key={p.id} value={p.id}>{p.academicYear} - {p.semester} ({p.examType})</option>)}
                </select>
                <select className={styles.input} style={{ width: 250 }} value={filterInstructor} onChange={e => setFilterInstructor(e.target.value)}>
                    <option value="">All Instructors</option>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>

            <FormModal open={showForm} onClose={() => setShowForm(false)} title="Create Assignment">
                <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className={styles.field}>
                        <label>Course *</label>
                        <select className={styles.input} value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })}>
                            <option value="">Select course...</option>
                            {courses.filter(c => c.isActive !== false).map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Instructor *</label>
                        <select className={styles.input} value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
                            <option value="">Select instructor...</option>
                            {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                        <label>Academic Period *</label>
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
            </FormModal>

            <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <colgroup>
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '25%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <thead>
                        <tr>
                            <th onClick={() => handleSort('courseCode')} style={{ cursor: 'pointer', userSelect: 'none' }}>Course{sortArrow('courseCode')}</th>
                            <th onClick={() => handleSort('instructorId')} style={{ cursor: 'pointer', userSelect: 'none' }}>Instructor{sortArrow('instructorId')}</th>
                            <th onClick={() => handleSort('academicPeriodId')} style={{ cursor: 'pointer', userSelect: 'none' }}>Academic Period{sortArrow('academicPeriodId')}</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td><strong>{a.courseCode}</strong> - {getCourseName(a.courseCode)}</td>
                                <td>{getInstructorName(a.instructorId)}</td>
                                <td>{getPeriodLabel(a.academicPeriodId)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className={styles.actionBtns} style={{ justifyContent: 'center' }}>
                                        <button className={`${styles.iconBtn} ${styles.warnBtn}`} onClick={() => setConfirmRemove(a)} title="Remove"><Trash2 size={18} color="#DC2626" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No assignments found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={!!confirmRemove}
                title="Remove Assignment"
                message={`Remove ${confirmRemove?.courseCode} from ${confirmRemove ? getInstructorName(confirmRemove.instructorId) : ''}?`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={() => handleRemove(confirmRemove.id)}
                onCancel={() => setConfirmRemove(null)}
            />
        </div>
    );
}

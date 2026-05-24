import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Check, X } from 'react-feather';

export default function AdminAcademicPeriods() {
    const { user } = useAuth();
    const [periods, setPeriods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ academicYear: '', semester: '1st Semester', examType: 'Midterm' });

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const load = () => fetch('/api/admin/academic-periods', { headers })
        .then(r => r.json()).then(setPeriods);

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        if (!form.academicYear.trim()) return;
        const url = editing ? `/api/admin/academic-periods/${editing.id}` : '/api/admin/academic-periods';
        const method = editing ? 'PUT' : 'POST';
        await fetch(url, { method, headers, body: JSON.stringify(form) });
        setShowForm(false);
        setEditing(null);
        setForm({ academicYear: '', semester: '1st Semester', examType: 'Midterm' });
        load();
    };

    const handleEdit = (p) => {
        setEditing(p);
        setForm({ academicYear: p.academicYear, semester: p.semester, examType: p.examType });
        setShowForm(true);
    };

    const toggleActive = async (p) => {
        await fetch(`/api/admin/academic-periods/${p.id}`, {
            method: 'PUT', headers,
            body: JSON.stringify({ ...p, isActive: !p.isActive })
        });
        load();
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>Academic Periods</h2>
                <button className={styles.addBtn} onClick={() => { setEditing(null); setForm({ academicYear: '', semester: '1st Semester', examType: 'Midterm' }); setShowForm(true); }}>
                    <Plus size={18} /> New Period
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h3>{editing ? 'Edit Academic Period' : 'New Academic Period'}</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Academic Year</label>
                            <input className={styles.input} placeholder="e.g. 2024-2025" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
                        </div>
                        <div className={styles.field}>
                            <label>Semester</label>
                            <select className={styles.input} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                                <option>1st Semester</option>
                                <option>2nd Semester</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Exam Type</label>
                            <select className={styles.input} value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })}>
                                <option>Midterm</option>
                                <option>Finals</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.saveBtn} onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
                        <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Academic Year</th>
                            <th>Semester</th>
                            <th>Exam Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(p => (
                            <tr key={p.id}>
                                <td>{p.academicYear}</td>
                                <td>{p.semester}</td>
                                <td>{p.examType}</td>
                                <td>
                                    <span className={`${styles.badge} ${p.isActive ? styles.activeBadge : styles.inactiveBadge}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.iconBtn} onClick={() => handleEdit(p)} title="Edit">
                                            <Check size={16} />
                                        </button>
                                        <button className={`${styles.iconBtn} ${p.isActive ? styles.warnBtn : styles.neutralBtn}`} onClick={() => toggleActive(p)} title={p.isActive ? 'Deactivate' : 'Set Active'}>
                                            {p.isActive ? <X size={16} /> : <Check size={16} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {periods.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No academic periods yet. Create one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

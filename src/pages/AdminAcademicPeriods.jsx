import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Edit3, CheckCircle, XCircle } from 'react-feather';
import ConfirmModal from '../components/ConfirmModal';
import FormModal from '../components/FormModal';

export default function AdminAcademicPeriods() {
    const [periods, setPeriods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ academicYear: '', semester: '1st Semester', examType: 'Midterm' });
    const [confirmToggle, setConfirmToggle] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'academicYear', dir: 'desc' });

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const handleSort = (key) => {
        setSortConfig(prev => prev.key === key && prev.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' });
    };

    const sortArrow = (key) => sortConfig.key === key ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : '';

    const sortedPeriods = [...periods].sort((a, b) => {
        const dir = sortConfig.dir === 'asc' ? 1 : -1;
        const va = (a[sortConfig.key] || '').toString().toLowerCase();
        const vb = (b[sortConfig.key] || '').toString().toLowerCase();
        return va < vb ? -dir : va > vb ? dir : 0;
    });

    const load = () => fetch('/api/admin/academic-periods', { headers })
        .then(r => r.json()).then(setPeriods);

    useEffect(() => { load(); }, []);

    const getPeriodName = (p) => `${p.academicYear} | ${p.semester} | ${p.examType}`;

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
            body: JSON.stringify({ isActive: !p.isActive })
        });
        setConfirmToggle(null);
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

            <FormModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Academic Period' : 'New Academic Period'}>
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
            </FormModal>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <colgroup>
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '18%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '12%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('academicYear')} style={{ cursor: 'pointer', userSelect: 'none' }}>Period Name{sortArrow('academicYear')}</th>
                            <th onClick={() => handleSort('academicYear')} style={{ cursor: 'pointer', userSelect: 'none' }}>Academic Year{sortArrow('academicYear')}</th>
                            <th onClick={() => handleSort('semester')} style={{ cursor: 'pointer', userSelect: 'none' }}>Semester{sortArrow('semester')}</th>
                            <th onClick={() => handleSort('examType')} style={{ cursor: 'pointer', userSelect: 'none' }}>Exam Type{sortArrow('examType')}</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPeriods.map(p => (
                            <tr key={p.id}>
                                <td><strong>{getPeriodName(p)}</strong></td>
                                <td>{p.academicYear}</td>
                                <td>{p.semester}</td>
                                <td>{p.examType}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`${styles.badge} ${p.isActive ? styles.activeBadge : styles.inactiveBadge}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className={styles.actionBtns} style={{ justifyContent: 'center' }}>
                                        <button className={styles.iconBtn} onClick={() => handleEdit(p)} title="Edit">
                                            <Edit3 size={18} color="#374151" />
                                        </button>
                                        <button className={`${styles.iconBtn} ${p.isActive ? styles.warnBtn : styles.neutralBtn}`} onClick={() => setConfirmToggle(p)} title={p.isActive ? 'Deactivate' : 'Set Active'}>
                                            {p.isActive ? <XCircle size={18} color="#DC2626" /> : <CheckCircle size={18} color="#059669" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {periods.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No academic periods yet. Create one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={!!confirmToggle}
                title={confirmToggle?.isActive ? 'Deactivate Period' : 'Set Active Period'}
                message={confirmToggle?.isActive ? `Deactivate "${confirmToggle.academicYear} - ${confirmToggle.semester}"? Only one period can be active at a time.` : `Set "${confirmToggle?.academicYear} - ${confirmToggle?.semester}" as the active period?`}
                confirmLabel={confirmToggle?.isActive ? 'Deactivate' : 'Set Active'}
                variant={confirmToggle?.isActive ? 'danger' : ''}
                onConfirm={() => toggleActive(confirmToggle)}
                onCancel={() => setConfirmToggle(null)}
            />
        </div>
    );
}

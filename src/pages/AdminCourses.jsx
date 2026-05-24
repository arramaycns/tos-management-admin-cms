import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Search, Edit3, XCircle, CheckCircle } from 'react-feather';
import ConfirmModal from '../components/ConfirmModal';
import FormModal from '../components/FormModal';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterSem, setFilterSem] = useState('');
    const [filterActive, setFilterActive] = useState('');
    const [confirmToggle, setConfirmToggle] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'code', dir: 'asc' });
    const [form, setForm] = useState({
        code: '', name: '', yearLevel: '', semester: '', creditUnits: '', cmoReference: '', prerequisites: '', description: '', isActive: true
    });

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const load = () => fetch('/api/admin/courses', { headers }).then(r => r.json()).then(setCourses);
    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        if (!form.code.trim() || !form.name.trim()) return;
        const url = editing ? `/api/admin/courses/${editing.code}` : '/api/admin/courses';
        const method = editing ? 'PUT' : 'POST';
        await fetch(url, { method, headers, body: JSON.stringify(form) });
        setShowForm(false);
        setEditing(null);
        setForm({ code: '', name: '', yearLevel: '', semester: '', creditUnits: '', cmoReference: '', prerequisites: '', description: '', isActive: true });
        load();
    };

    const handleEdit = (c) => {
        setEditing(c);
        setForm({
            code: c.code, name: c.name, yearLevel: c.yearLevel || '', semester: c.semester || '',
            creditUnits: c.creditUnits || '', cmoReference: c.cmoReference || '',
            prerequisites: c.prerequisites || '', description: c.description || '', isActive: c.isActive !== false
        });
        setShowForm(true);
    };

    const toggleActive = async (c) => {
        await fetch(`/api/admin/courses/${c.code}`, { method: 'PUT', headers, body: JSON.stringify({ isActive: !(c.isActive !== false) }) });
        setConfirmToggle(null);
        load();
    };

    const handleSort = (key) => {
        setSortConfig(prev => prev.key === key && prev.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' });
    };

    const sortArrow = (key) => sortConfig.key === key ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : '';

    const filtered = courses.filter(c => {
        const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
        const matchYear = !filterYear || c.yearLevel === filterYear;
        const matchSem = !filterSem || c.semester === filterSem;
        const matchActive = filterActive === '' || (filterActive === 'active' ? c.isActive !== false : c.isActive === false);
        return matchSearch && matchYear && matchSem && matchActive;
    }).sort((a, b) => {
        const dir = sortConfig.dir === 'asc' ? 1 : -1;
        const va = (a[sortConfig.key] || '').toString().toLowerCase();
        const vb = (b[sortConfig.key] || '').toString().toLowerCase();
        return va < vb ? -dir : va > vb ? dir : 0;
    });

    const yearLevels = [...new Set(courses.map(c => c.yearLevel).filter(Boolean))];
    const sems = [...new Set(courses.map(c => c.semester).filter(Boolean))];

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>Course Catalog</h2>
                <button className={styles.addBtn} onClick={() => { setEditing(null); setForm({ code: '', name: '', yearLevel: '', semester: '', creditUnits: '', cmoReference: '', prerequisites: '', description: '', isActive: true }); setShowForm(true); }}>
                    <Plus size={18} /> Add Course
                </button>
            </div>

            <div className={styles.filterRow}>
                <div className={styles.searchBox}>
                    <Search size={18} color="#9CA3AF" />
                    <input placeholder="Search by code or name..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className={styles.input} style={{ width: 160 }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                    <option value="">All Year Levels</option>
                    {yearLevels.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select className={styles.input} style={{ width: 160 }} value={filterSem} onChange={e => setFilterSem(e.target.value)}>
                    <option value="">All Semesters</option>
                    {sems.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className={styles.input} style={{ width: 140 }} value={filterActive} onChange={e => setFilterActive(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <FormModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Course' : 'Add Course'}>
                <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className={styles.field}>
                        <label>Course Code *</label>
                        <input className={styles.input} placeholder="e.g. BSCS313L" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!editing} />
                    </div>
                    <div className={styles.field}>
                        <label>Course Name *</label>
                        <input className={styles.input} placeholder="e.g. Human & Computer Interaction" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                        <label>Year Level</label>
                        <select className={styles.input} value={form.yearLevel} onChange={e => setForm({ ...form, yearLevel: e.target.value })}>
                            <option value="">Select...</option>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Semester</label>
                        <select className={styles.input} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                            <option value="">Select...</option>
                            <option>1st Semester</option>
                            <option>2nd Semester</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Credit Units</label>
                        <input className={styles.input} placeholder="e.g. 3" value={form.creditUnits} onChange={e => setForm({ ...form, creditUnits: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                        <label>CMO Reference</label>
                        <input className={styles.input} placeholder="e.g. CMO No. 25, s. 2015" value={form.cmoReference} onChange={e => setForm({ ...form, cmoReference: e.target.value })} />
                    </div>
                </div>
                <div className={styles.field} style={{ marginTop: 14 }}>
                    <label>Prerequisites</label>
                    <input className={styles.input} placeholder="e.g. BSCS212L" value={form.prerequisites} onChange={e => setForm({ ...form, prerequisites: e.target.value })} />
                </div>
                <div className={styles.field} style={{ marginTop: 14 }}>
                    <label>Description</label>
                    <textarea className={styles.input} style={{ resize: 'vertical', minHeight: 60 }} placeholder="Brief course description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
                    <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                </div>
            </FormModal>

            <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <colgroup>
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '14%' }} />
                        </colgroup>
                        <thead>
                        <tr>
                            <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', userSelect: 'none' }}>Code{sortArrow('code')}</th>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>Course Name{sortArrow('name')}</th>
                            <th onClick={() => handleSort('yearLevel')} style={{ cursor: 'pointer', userSelect: 'none' }}>Year Level{sortArrow('yearLevel')}</th>
                            <th onClick={() => handleSort('semester')} style={{ cursor: 'pointer', userSelect: 'none' }}>Semester{sortArrow('semester')}</th>
                            <th onClick={() => handleSort('creditUnits')} style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}>Units{sortArrow('creditUnits')}</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.code}>
                                <td><strong>{c.code}</strong></td>
                                <td>{c.name}</td>
                                <td>{c.yearLevel || '-'}</td>
                                <td>{c.semester || '-'}</td>
                                <td style={{ textAlign: 'center' }}>{c.creditUnits || '-'}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`${styles.badge} ${c.isActive !== false ? styles.activeBadge : styles.inactiveBadge}`}>
                                        {c.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className={styles.actionBtns} style={{ justifyContent: 'center' }}>
                                        <button className={styles.iconBtn} onClick={() => handleEdit(c)} title="Edit"><Edit3 size={18} color="#374151" /></button>
                                        <button className={`${styles.iconBtn} ${c.isActive !== false ? styles.warnBtn : styles.neutralBtn}`} onClick={() => setConfirmToggle(c)} title={c.isActive !== false ? 'Deactivate' : 'Activate'}>
                                            {c.isActive !== false ? <XCircle size={18} color="#DC2626" /> : <CheckCircle size={18} color="#059669" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={!!confirmToggle}
                title={confirmToggle?.isActive !== false ? 'Deactivate Course' : 'Activate Course'}
                message={confirmToggle?.isActive !== false ? `Deactivate "${confirmToggle?.code} - ${confirmToggle?.name}"?` : `Activate "${confirmToggle?.code} - ${confirmToggle?.name}"?`}
                confirmLabel={confirmToggle?.isActive !== false ? 'Deactivate' : 'Activate'}
                variant={confirmToggle?.isActive !== false ? 'danger' : ''}
                onConfirm={() => toggleActive(confirmToggle)}
                onCancel={() => setConfirmToggle(null)}
            />
        </div>
    );
}

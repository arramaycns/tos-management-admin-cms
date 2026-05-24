import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Search } from 'react-feather';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterSem, setFilterSem] = useState('');
    const [filterActive, setFilterActive] = useState('');
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
        await fetch(`/api/admin/courses/${c.code}`, { method: 'PUT', headers, body: JSON.stringify({ ...c, isActive: !(c.isActive !== false) }) });
        load();
    };

    const filtered = courses.filter(c => {
        const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
        const matchYear = !filterYear || c.yearLevel === filterYear;
        const matchSem = !filterSem || c.semester === filterSem;
        const matchActive = filterActive === '' || (filterActive === 'active' ? c.isActive !== false : c.isActive === false);
        return matchSearch && matchYear && matchSem && matchActive;
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

            <div className={styles.filterRow} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className={styles.searchBox} style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: 6, padding: '0 10px', flex: 1, background: 'white' }}>
                    <Search size={18} color="#9CA3AF" />
                    <input className={styles.input} style={{ border: 'none', flex: 1, padding: '10px 8px' }} placeholder="Search by code or name..." value={search} onChange={e => setSearch(e.target.value)} />
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

            {showForm && (
                <div className={styles.formCard}>
                    <h3>{editing ? 'Edit Course' : 'Add Course'}</h3>
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
                        <div className={styles.field}>
                            <label>Prerequisites</label>
                            <input className={styles.input} placeholder="e.g. BSCS212L" value={form.prerequisites} onChange={e => setForm({ ...form, prerequisites: e.target.value })} />
                        </div>
                        <div className={styles.field}>
                            <label>Description</label>
                            <textarea className={styles.input} style={{ resize: 'vertical', minHeight: 60 }} placeholder="Brief course description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
                            <th>Code</th>
                            <th>Course Name</th>
                            <th>Year Level</th>
                            <th>Semester</th>
                            <th>Units</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.code}>
                                <td><strong>{c.code}</strong></td>
                                <td>{c.name}</td>
                                <td>{c.yearLevel || '-'}</td>
                                <td>{c.semester || '-'}</td>
                                <td>{c.creditUnits || '-'}</td>
                                <td>
                                    <span className={`${styles.badge} ${c.isActive !== false ? styles.activeBadge : styles.inactiveBadge}`}>
                                        {c.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.iconBtn} onClick={() => handleEdit(c)} title="Edit">Edit</button>
                                        <button className={`${styles.iconBtn} ${c.isActive !== false ? styles.warnBtn : styles.neutralBtn}`} onClick={() => toggleActive(c)} title={c.isActive !== false ? 'Deactivate' : 'Activate'}>
                                            {c.isActive !== false ? 'Deact' : 'Act'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

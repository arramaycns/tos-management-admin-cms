import { useState, useEffect } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Trash2, Edit3 } from 'react-feather';

export default function AdminTemplates() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [outcomes, setOutcomes] = useState([]);
    const [showCoForm, setShowCoForm] = useState(false);
    const [editingCo, setEditingCo] = useState(null);
    const [coForm, setCoForm] = useState({ label: '', description: '', totalHours: '', totalPercentage: '' });
    const [editingIlo, setEditingIlo] = useState(null);
    const [iloForm, setIloForm] = useState({ label: '', description: '', hours: '', percentage: '' });

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        fetch('/api/admin/courses', { headers }).then(r => r.json()).then(setCourses);
    }, []);

    useEffect(() => {
        if (!selectedCourse) { setOutcomes([]); return; }
        fetch(`/api/courses/${selectedCourse}/outcomes`, { headers }).then(r => r.json()).then(setOutcomes);
    }, [selectedCourse]);

    const addCo = async () => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes`, {
            method: 'POST', headers,
            body: JSON.stringify({
                co: coForm.label,
                description: coForm.description,
                totalItems: 0,
                ilos: []
            })
        });
        setShowCoForm(false);
        setCoForm({ label: '', description: '', totalHours: '', totalPercentage: '' });
        const data = await fetch(`/api/courses/${selectedCourse}/outcomes`, { headers }).then(r => r.json());
        setOutcomes(data);
    };

    const removeCo = async (id) => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/${id}`, { method: 'DELETE', headers });
        setOutcomes(prev => prev.filter(o => o.id !== id));
    };

    const addIlo = async (coId) => {
        if (!iloForm.description.trim()) return;
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/${coId}/ilos`, {
            method: 'POST', headers,
            body: JSON.stringify({ description: iloForm.description, hours: parseInt(iloForm.hours) || 0, percentage: parseInt(iloForm.percentage) || 0, items: 0 })
        });
        setEditingIlo(null);
        setIloForm({ label: '', description: '', hours: '', percentage: '' });
        const data = await fetch(`/api/courses/${selectedCourse}/outcomes`, { headers }).then(r => r.json());
        setOutcomes(data);
    };

    const removeIlo = async (id) => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/ilos/${id}`, { method: 'DELETE', headers });
        setOutcomes(prev => prev.map(co => ({ ...co, ilos: (co.ilos || []).filter(i => i.id !== id) })));
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>CO / ILO Templates</h2>
            </div>

            <div className={styles.field} style={{ maxWidth: 400 }}>
                <label>Select Course</label>
                <select className={styles.input} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                    <option value="">Choose a course...</option>
                    {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
            </div>

            {!selectedCourse && <p style={{ color: '#9CA3AF', marginTop: 20 }}>Select a course to manage its CO and ILO templates.</p>}

            {selectedCourse && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className={styles.addBtn} onClick={() => { setEditingCo(null); setCoForm({ label: `CO${outcomes.length + 1}`, description: '', totalHours: '', totalPercentage: '' }); setShowCoForm(true); }}>
                            <Plus size={18} /> Add CO
                        </button>
                    </div>

                    {showCoForm && (
                        <div className={styles.formCard}>
                            <h3>New Course Outcome</h3>
                            <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr' }}>
                                <div className={styles.field}><label>Label</label><input className={styles.input} value={coForm.label} onChange={e => setCoForm({ ...coForm, label: e.target.value })} /></div>
                                <div className={styles.field}><label>Description</label><input className={styles.input} value={coForm.description} onChange={e => setCoForm({ ...coForm, description: e.target.value })} /></div>
                                <div className={styles.field}><label>Total Hours</label><input className={styles.input} type="number" value={coForm.totalHours} onChange={e => setCoForm({ ...coForm, totalHours: e.target.value })} /></div>
                                <div className={styles.field}><label>Total %</label><input className={styles.input} type="number" value={coForm.totalPercentage} onChange={e => setCoForm({ ...coForm, totalPercentage: e.target.value })} /></div>
                            </div>
                            <div className={styles.formActions}>
                                <button className={styles.saveBtn} onClick={addCo}>Add</button>
                                <button className={styles.cancelBtn} onClick={() => setShowCoForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 10 }}>
                        {outcomes.map(co => (
                            <div key={co.id} style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    <div>
                                        <strong style={{ fontSize: 15 }}>{co.co}</strong>
                                        <span style={{ marginLeft: 12, color: '#6B7280', fontSize: 13 }}>{co.description}</span>
                                    </div>
                                    <button className={styles.iconBtn} style={{ color: '#DC2626' }} onClick={() => removeCo(co.id)} title="Remove CO"><Trash2 size={16} /></button>
                                </div>

                                <div style={{ padding: '8px 16px 12px' }}>
                                    <table style={{ width: '100%', fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ color: '#6B7280', fontSize: 12 }}>
                                                <th style={{ textAlign: 'left', padding: '6px 8px', width: 80 }}>ILO</th>
                                                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Description</th>
                                                <th style={{ textAlign: 'center', padding: '6px 8px', width: 80 }}>Hours</th>
                                                <th style={{ textAlign: 'center', padding: '6px 8px', width: 80 }}>%</th>
                                                <th style={{ textAlign: 'center', padding: '6px 8px', width: 50 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(co.ilos || []).map(ilo => (
                                                <tr key={ilo.id}>
                                                    <td style={{ padding: '6px 8px', fontWeight: 500 }}>ILO{ilo.id}</td>
                                                    <td style={{ padding: '6px 8px' }}>{ilo.description}</td>
                                                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>{ilo.hours}</td>
                                                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>{ilo.percentage}%</td>
                                                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                                        <button className={styles.iconBtn} style={{ color: '#DC2626', width: 26, height: 26 }} onClick={() => removeIlo(ilo.id)} title="Remove ILO"><Trash2 size={13} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {editingIlo === co.id ? (
                                        <div className={styles.formGrid} style={{ gridTemplateColumns: '2fr 1fr 1fr auto', marginTop: 8, gap: 8, alignItems: 'end' }}>
                                            <div className={styles.field}>
                                                <label style={{ fontSize: 12 }}>Description</label>
                                                <input className={styles.input} style={{ padding: '6px 10px', fontSize: 13 }} value={iloForm.description} onChange={e => setIloForm({ ...iloForm, description: e.target.value })} />
                                            </div>
                                            <div className={styles.field}>
                                                <label style={{ fontSize: 12 }}>Hours</label>
                                                <input className={styles.input} style={{ padding: '6px 10px', fontSize: 13 }} type="number" value={iloForm.hours} onChange={e => setIloForm({ ...iloForm, hours: e.target.value })} />
                                            </div>
                                            <div className={styles.field}>
                                                <label style={{ fontSize: 12 }}>%</label>
                                                <input className={styles.input} style={{ padding: '6px 10px', fontSize: 13 }} type="number" value={iloForm.percentage} onChange={e => setIloForm({ ...iloForm, percentage: e.target.value })} />
                                            </div>
                                            <button className={styles.saveBtn} style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => addIlo(co.id)}>Add</button>
                                        </div>
                                    ) : (
                                        <button className={styles.addBtn} style={{ padding: '6px 14px', fontSize: 13, marginTop: 8, background: '#374151' }} onClick={() => { setEditingIlo(co.id); setIloForm({ label: '', description: '', hours: '', percentage: '' }); }}>
                                            <Plus size={14} /> Add ILO
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

import { useState, useEffect, Fragment } from 'react';
import styles from '../styles/AdminPage.module.sass';
import { Plus, Trash2, Edit3, X, Check } from 'react-feather';
import ConfirmModal from '../components/ConfirmModal';
import FormModal from '../components/FormModal';

const cellStyle = { verticalAlign: 'middle' };
const centerStyle = { textAlign: 'center', verticalAlign: 'middle' };
const topStyle = { verticalAlign: 'top' };

const cs = (align) => align === 'center' ? centerStyle : cellStyle;

export default function AdminTemplates() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [outcomes, setOutcomes] = useState([]);
    const [showCoForm, setShowCoForm] = useState(false);
    const [editingCo, setEditingCo] = useState(null);
    const [coForm, setCoForm] = useState({ label: '', description: '', totalHours: '', totalPercentage: '' });
    const [showIloFormFor, setShowIloFormFor] = useState(null);
    const [iloForm, setIloForm] = useState({ label: '', description: '', hours: '', percentage: '' });
    const [editingIloId, setEditingIloId] = useState(null);
    const [editIloForm, setEditIloForm] = useState({ label: '', description: '', hours: '', percentage: '' });
    const [confirmRemoveCo, setConfirmRemoveCo] = useState(null);
    const [confirmRemoveIlo, setConfirmRemoveIlo] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        fetch('/api/admin/courses', { headers }).then(r => r.json()).then(setCourses);
    }, []);

    useEffect(() => {
        if (!selectedCourse) { setOutcomes([]); return; }
        fetch(`/api/courses/${selectedCourse}/outcomes`, { headers }).then(r => r.json()).then(setOutcomes);
    }, [selectedCourse]);

    const refreshOutcomes = async () => {
        const data = await fetch(`/api/courses/${selectedCourse}/outcomes`, { headers }).then(r => r.json());
        setOutcomes(data);
    };

    const addCo = async () => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes`, {
            method: 'POST', headers,
            body: JSON.stringify({
                co: coForm.label,
                description: coForm.description,
                totalHours: parseInt(coForm.totalHours) || 0,
                totalPercentage: parseInt(coForm.totalPercentage) || 0,
                totalItems: 0
            })
        });
        setShowCoForm(false);
        setCoForm({ label: '', description: '', totalHours: '', totalPercentage: '' });
        await refreshOutcomes();
    };

    const updateCo = async (id) => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/${id}`, {
            method: 'PUT', headers,
            body: JSON.stringify({
                co: editingCo.label,
                description: editingCo.description,
                totalHours: parseInt(editingCo.totalHours) || 0,
                totalPercentage: parseInt(editingCo.totalPercentage) || 0
            })
        });
        setEditingCo(null);
        await refreshOutcomes();
    };

    const removeCo = async (id) => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/${id}`, { method: 'DELETE', headers });
        setConfirmRemoveCo(null);
        setOutcomes(prev => prev.filter(o => o.id !== id));
    };

    const addIlo = async (coId) => {
        if (!iloForm.description.trim()) return;
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/${coId}/ilos`, {
            method: 'POST', headers,
            body: JSON.stringify({
                label: iloForm.label || `ILO${((outcomes.find(o => o.id === coId) || {}).ilos || []).length + 1}`,
                description: iloForm.description,
                hours: parseInt(iloForm.hours) || 0,
                percentage: parseInt(iloForm.percentage) || 0,
                items: 0
            })
        });
        setShowIloFormFor(null);
        setIloForm({ label: '', description: '', hours: '', percentage: '' });
        await refreshOutcomes();
    };

    const updateIlo = async () => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/ilos/${editingIloId}`, {
            method: 'PUT', headers,
            body: JSON.stringify({
                label: editIloForm.label,
                description: editIloForm.description,
                hours: parseInt(editIloForm.hours) || 0,
                percentage: parseInt(editIloForm.percentage) || 0
            })
        });
        setEditingIloId(null);
        setEditIloForm({ label: '', description: '', hours: '', percentage: '' });
        await refreshOutcomes();
    };

    const removeIlo = async (id) => {
        await fetch(`/api/admin/courses/${selectedCourse}/outcomes/ilos/${id}`, { method: 'DELETE', headers });
        setConfirmRemoveIlo(null);
        setOutcomes(prev => prev.map(co => ({ ...co, ilos: (co.ilos || []).filter(i => i.id !== id) })));
    };

    const startEditCo = (co) => {
        setEditingCo({
            id: co.id,
            label: co.co,
            description: co.description || '',
            totalHours: co.totalHours || '',
            totalPercentage: co.totalPercentage || ''
        });
    };

    const startEditIlo = (ilo) => {
        setEditingIloId(ilo.id);
        setEditIloForm({
            label: ilo.label || '',
            description: ilo.description || '',
            hours: ilo.hours || '',
            percentage: ilo.percentage || ''
        });
    };

    const renderActions = (buttons) => (
        <div className={styles.actionBtns} style={{ justifyContent: 'center' }}>
            {buttons}
        </div>
    );

    const iconBtn = (color, onClick, title, icon, extra) => (
        <button className={styles.iconBtn} style={{ width: 28, height: 28, color, borderColor: extra || '#D1D5DB' }} onClick={onClick} title={title}>{icon}</button>
    );

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <h2>CO / ILO Templates</h2>
                {selectedCourse && (
                    <button className={styles.addBtn} onClick={() => { setCoForm({ label: `CO${outcomes.length + 1}`, description: '', totalHours: '', totalPercentage: '' }); setShowCoForm(true); }}>
                        <Plus size={18} /> Add CO
                    </button>
                )}
            </div>

            <div className={styles.filterRow}>
                <div className={styles.field} style={{ minWidth: 400 }}>
                    <select className={styles.input} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                        <option value="">Select a course...</option>
                        {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                    </select>
                </div>
            </div>

            {!selectedCourse && (
                <p style={{ color: '#9CA3AF', marginTop: 10 }}>Select a course to manage its CO and ILO templates.</p>
            )}

            {selectedCourse && outcomes.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF', border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA' }}>
                    <p style={{ margin: '0 0 16px', fontSize: 15 }}>No course outcomes defined for this course.</p>
                    <button className={styles.addBtn} onClick={() => { setCoForm({ label: 'CO1', description: '', totalHours: '', totalPercentage: '' }); setShowCoForm(true); }}>
                        <Plus size={18} /> Add First Outcome
                    </button>
                </div>
            )}

            {selectedCourse && outcomes.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <colgroup>
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '50%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '20%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>CO / ILO</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'center' }}>Hours</th>
                                <th style={{ textAlign: 'center' }}>%</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outcomes.map(co => {
                                const ilos = co.ilos || [];
                                const coEditing = editingCo && editingCo.id === co.id;

                                return (
                                    <Fragment key={co.id}>
                                        {coEditing ? (
                                            <tr style={{ background: '#F3F4F6' }}>
                                                <td style={{ padding: '8px 10px' }}><input className={styles.input} style={{ width: '100%', padding: '6px 10px', fontSize: 13 }} value={editingCo.label} onChange={e => setEditingCo({ ...editingCo, label: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px' }}><input className={styles.input} style={{ width: '100%', padding: '6px 10px', fontSize: 13 }} value={editingCo.description} onChange={e => setEditingCo({ ...editingCo, description: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}><input className={styles.input} style={{ width: 60, padding: '6px 10px', fontSize: 13 }} type="number" value={editingCo.totalHours} onChange={e => setEditingCo({ ...editingCo, totalHours: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}><input className={styles.input} style={{ width: 60, padding: '6px 10px', fontSize: 13 }} type="number" value={editingCo.totalPercentage} onChange={e => setEditingCo({ ...editingCo, totalPercentage: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                                    {renderActions([
                                                        iconBtn('#059669', () => updateCo(co.id), 'Save', <Check size={14} />, '#A7F3D0'),
                                                        iconBtn('#DC2626', () => setEditingCo(null), 'Cancel', <X size={14} />),
                                                    ])}
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr style={{ background: '#F3F4F6' }}>
                                                <td style={{ padding: '10px 12px' }}><strong style={{ fontSize: 15 }}>{co.co}</strong></td>
                                                <td style={{ padding: '10px 12px' }}><span style={{ color: '#374151' }}>{co.description}</span></td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{co.totalHours || 0}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{co.totalPercentage || 0}%</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                    {renderActions([
                                                        iconBtn('#374151', () => startEditCo(co), 'Edit CO', <Edit3 size={14} />),
                                                        iconBtn('#DC2626', () => setConfirmRemoveCo(co), 'Remove CO', <Trash2 size={14} />),
                                                        iconBtn('#059669', () => { setShowIloFormFor(co.id); setIloForm({ label: '', description: '', hours: '', percentage: '' }); }, 'Add ILO', <Plus size={14} />, '#A7F3D0'),
                                                    ])}
                                                </td>
                                            </tr>
                                        )}

                                        {ilos.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ color: '#9CA3AF', padding: '12px 14px', textAlign: 'center', fontStyle: 'italic', fontSize: 13 }}>
                                                    No ILOs defined for this outcome.
                                                </td>
                                            </tr>
                                        ) : (
                                            ilos.map(ilo => {
                                                const iloEditing = editingIloId === ilo.id;
                                                return (
                                                    <tr key={ilo.id}>
                                                        {iloEditing ? (
                                                            <>
                                                                <td style={topStyle}><input className={styles.input} style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} value={editIloForm.label} onChange={e => setEditIloForm({ ...editIloForm, label: e.target.value })} /></td>
                                                                <td style={topStyle}><input className={styles.input} style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} value={editIloForm.description} onChange={e => setEditIloForm({ ...editIloForm, description: e.target.value })} /></td>
                                                                <td style={topStyle}><input className={styles.input} style={{ width: 50, padding: '6px 8px', fontSize: 13 }} type="number" value={editIloForm.hours} onChange={e => setEditIloForm({ ...editIloForm, hours: e.target.value })} /></td>
                                                                <td style={topStyle}><input className={styles.input} style={{ width: 50, padding: '6px 8px', fontSize: 13 }} type="number" value={editIloForm.percentage} onChange={e => setEditIloForm({ ...editIloForm, percentage: e.target.value })} /></td>
                                                                <td style={centerStyle}>
                                                                    {renderActions([
                                                                        iconBtn('#059669', updateIlo, 'Save', <Check size={14} />, '#A7F3D0'),
                                                                        iconBtn('#DC2626', () => setEditingIloId(null), 'Cancel', <X size={14} />),
                                                                    ])}
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td style={{ paddingLeft: 30, fontWeight: 500, ...cellStyle }}>{ilo.label || `ILO${ilo.id}`}</td>
                                                                <td style={cellStyle}>{ilo.description}</td>
                                                                <td style={centerStyle}>{ilo.hours || 0}</td>
                                                                <td style={centerStyle}>{ilo.percentage || 0}%</td>
                                                                <td style={centerStyle}>
                                                                    {renderActions([
                                                                        iconBtn('#374151', () => startEditIlo(ilo), 'Edit ILO', <Edit3 size={14} />),
                                                                        iconBtn('#DC2626', () => setConfirmRemoveIlo(ilo), 'Remove ILO', <Trash2 size={14} />),
                                                                    ])}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}

                                        {showIloFormFor === co.id && (
                                            <tr style={{ background: '#F9FAFB' }}>
                                                <td style={{ padding: '8px 10px' }}><input className={styles.input} style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} value={iloForm.label} onChange={e => setIloForm({ ...iloForm, label: e.target.value })} placeholder={`ILO${(outcomes.find(o => o.id === co.id)?.ilos?.length || 0) + 1}`} /></td>
                                                <td style={{ padding: '8px 10px' }}><input className={styles.input} style={{ width: '100%', padding: '6px 8px', fontSize: 13 }} value={iloForm.description} onChange={e => setIloForm({ ...iloForm, description: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}><input className={styles.input} style={{ width: 60, padding: '6px 8px', fontSize: 13 }} type="number" value={iloForm.hours} onChange={e => setIloForm({ ...iloForm, hours: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}><input className={styles.input} style={{ width: 60, padding: '6px 8px', fontSize: 13 }} type="number" value={iloForm.percentage} onChange={e => setIloForm({ ...iloForm, percentage: e.target.value })} /></td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    <button className={styles.saveBtn} style={{ padding: '6px 12px', fontSize: 13, marginRight: 6 }} onClick={() => addIlo(co.id)}>Add</button>
                                                    <button className={styles.cancelBtn} style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setShowIloFormFor(null)}>Cancel</button>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <FormModal open={showCoForm} onClose={() => setShowCoForm(false)} title="New Course Outcome">
                <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className={styles.field}><label>Label *</label><input className={styles.input} placeholder="e.g. CO1" value={coForm.label} onChange={e => setCoForm({ ...coForm, label: e.target.value })} /></div>
                    <div className={styles.field}><label>Total Hours</label><input className={styles.input} type="number" placeholder="0" value={coForm.totalHours} onChange={e => setCoForm({ ...coForm, totalHours: e.target.value })} /></div>
                    <div className={styles.field} style={{ gridColumn: 'span 2' }}><label>Description *</label><textarea className={styles.input} style={{ resize: 'vertical', minHeight: 60 }} placeholder="Course outcome description..." value={coForm.description} onChange={e => setCoForm({ ...coForm, description: e.target.value })} /></div>
                    <div className={styles.field} style={{ gridColumn: 'span 2' }}><label>Total %</label><input className={styles.input} type="number" placeholder="0" value={coForm.totalPercentage} onChange={e => setCoForm({ ...coForm, totalPercentage: e.target.value })} /></div>
                </div>
                <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={addCo}>Add</button>
                    <button className={styles.cancelBtn} onClick={() => setShowCoForm(false)}>Cancel</button>
                </div>
            </FormModal>

            <ConfirmModal open={!!confirmRemoveCo} title="Remove Course Outcome" message={`Remove "${confirmRemoveCo?.co}" and all its ILOs? This cannot be undone.`} confirmLabel="Remove" variant="danger" onConfirm={() => removeCo(confirmRemoveCo.id)} onCancel={() => setConfirmRemoveCo(null)} />
            <ConfirmModal open={!!confirmRemoveIlo} title="Remove ILO" message={`Remove "${confirmRemoveIlo?.label || `ILO${confirmRemoveIlo?.id}`}"? This cannot be undone.`} confirmLabel="Remove" variant="danger" onConfirm={() => removeIlo(confirmRemoveIlo.id)} onCancel={() => setConfirmRemoveIlo(null)} />
        </div>
    );
}

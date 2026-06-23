import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import toast from 'react-hot-toast';

interface Reminder { id: string; patientName: string; medicationName: string; dosage: string; time: string; active: boolean; }

const MedicationReminder: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ patientName: '', medicationName: '', dosage: '', time: '09:00' });

    useEffect(() => {
        loadReminders();
        const interval = setInterval(checkReminders, 60000);
        return () => clearInterval(interval);
    }, [reminders]);

    const loadReminders = async () => { const saved = await localforage.getItem<Reminder[]>('reminders'); if (saved) setReminders(saved); };
    const saveReminders = async (newReminders: Reminder[]) => { await localforage.setItem('reminders', newReminders); setReminders(newReminders); };

    const checkReminders = () => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
        reminders.forEach(r => {
            if (r.active && r.time === currentTime && !localStorage.getItem(`reminded_${r.id}_${now.toDateString()}`)) {
                toast.custom((t) => (<div className="bg-danger text-white p-3 rounded shadow"><strong>Time for medication!</strong><br />{r.patientName}: {r.medicationName} ({r.dosage})<button className="btn btn-light btn-sm ms-3" onClick={() => toast.dismiss(t.id)}>OK</button></div>), { duration: 30000 });
                localStorage.setItem(`reminded_${r.id}_${now.toDateString()}`, 'true');
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newReminder = { id: Date.now().toString(), ...formData, active: true };
        await saveReminders([...reminders, newReminder]);
        toast.success('Reminder added!');
        setShowModal(false);
        setFormData({ patientName: '', medicationName: '', dosage: '', time: '09:00' });
    };

    const toggleReminder = async (id: string) => {
        const newReminders = reminders.map(r => r.id === id ? { ...r, active: !r.active } : r);
        await saveReminders(newReminders);
        toast.success('Reminder updated');
    };

    const deleteReminder = async (id: string) => {
        if (window.confirm('Delete reminder?')) {
            await saveReminders(reminders.filter(r => r.id !== id));
            toast.success('Reminder deleted');
        }
    };

    return (
        <div>
            <button className="dropdown-item" onClick={() => setShowModal(true)}><i className="bi bi-alarm me-2"></i>Add Medication Reminder</button>
            {reminders.length > 0 && (
                <div className="mt-3 px-3"><h6 className="text-muted">Reminders</h6>
                {reminders.map(r => (<div key={r.id} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"><div><small><strong>{r.medicationName}</strong> - {r.patientName} at {r.time}</small></div><div><button className={`btn btn-sm ${r.active ? 'btn-success' : 'btn-secondary'} me-1`} onClick={() => toggleReminder(r.id)}><i className={`bi ${r.active ? 'bi-bell' : 'bi-bell-slash'}`}></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteReminder(r.id)}><i className="bi bi-trash"></i></button></div></div>))}</div>
            )}
            {showModal && (<div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}><div className="modal-dialog"><div className="modal-content"><div className="modal-header bg-danger text-white"><h5>Medication Reminder</h5><button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button></div><form onSubmit={handleSubmit}><div className="modal-body"><input type="text" className="form-control mb-2" placeholder="Patient Name" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} required /><input type="text" className="form-control mb-2" placeholder="Medication" value={formData.medicationName} onChange={e => setFormData({...formData, medicationName: e.target.value})} required /><input type="text" className="form-control mb-2" placeholder="Dosage (e.g., 500mg)" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} required /><input type="time" className="form-control" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required /></div><div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-danger">Save</button></div></form></div></div></div>)}
        </div>
    );
};

export default MedicationReminder;
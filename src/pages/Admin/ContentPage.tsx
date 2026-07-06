import React, { useEffect, useState } from 'react';
import { db, FirstAidTopic } from '../../database/db';
import toast from 'react-hot-toast';

const ContentPage: React.FC = () => {
    const [topics, setTopics] = useState<FirstAidTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState<FirstAidTopic | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'burns',
        description: '',
        steps: '',
        dos: '',
        donts: '',
        warning_signs: '',
    });

    useEffect(() => { loadTopics(); }, []);

    const loadTopics = async () => {
        setLoading(true);
        setTopics(await db.firstAidTopics.toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const topicData = {
            title: formData.title,
            slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
            category: formData.category as any,
            description: formData.description,
            steps: formData.steps.split('\n').filter(s => s.trim()),
            dos: formData.dos.split('\n').filter(s => s.trim()),
            donts: formData.donts.split('\n').filter(s => s.trim()),
            warning_signs: formData.warning_signs,
        };
        if (editingTopic?.id) {
            await db.firstAidTopics.update(editingTopic.id, topicData);
            toast.success('Guide updated!');
        } else {
            await db.firstAidTopics.add(topicData);
            toast.success('Guide created!');
        }
        setShowModal(false);
        setEditingTopic(null);
        setFormData({ title: '', category: 'burns', description: '', steps: '', dos: '', donts: '', warning_signs: '' });
        loadTopics();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this guide?')) {
            await db.firstAidTopics.delete(id);
            toast.success('Guide deleted!');
            loadTopics();
        }
    };

    const handleEdit = (topic: FirstAidTopic) => {
        setEditingTopic(topic);
        setFormData({
            title: topic.title,
            category: topic.category,
            description: topic.description,
            steps: Array.isArray(topic.steps) ? topic.steps.join('\n') : topic.steps || '',
            dos: Array.isArray(topic.dos) ? topic.dos.join('\n') : topic.dos || '',
            donts: Array.isArray(topic.donts) ? topic.donts.join('\n') : topic.donts || '',
            warning_signs: topic.warning_signs || '',
        });
        setShowModal(true);
    };

    const categoryIcons: Record<string, string> = {
        burns: '🔥', fractures: '🦴', choking: '🫁', seizures: '⚡', bleeding: '🩸'
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0"><i className="bi bi-book me-2 text-success"></i>First Aid Content</h5>
                <button className="btn btn-danger btn-sm rounded-pill" onClick={() => { setEditingTopic(null); setFormData({ title: '', category: 'burns', description: '', steps: '', dos: '', donts: '', warning_signs: '' }); setShowModal(true); }}>
                    <i className="bi bi-plus-lg me-1"></i>Add Guide
                </button>
            </div>

            {topics.length === 0 ? (
                <div className="text-center py-5"><i className="bi bi-book fs-1 text-muted"></i><p className="text-muted mt-2">No guides found</p></div>
            ) : (
                topics.map(topic => (
                    <div key={topic.id} className="card border-0 shadow-sm mb-2 rounded-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-4">{categoryIcons[topic.category]}</span>
                                        <h6 className="mb-0">{topic.title}</h6>
                                        <span className="badge bg-secondary text-capitalize">{topic.category}</span>
                                    </div>
                                    <small className="text-muted d-block mt-1">{topic.description.substring(0, 80)}...</small>
                                    <small className="text-muted" style={{ fontSize: '10px' }}>{Array.isArray(topic.steps) ? topic.steps.length : 0} steps</small>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(topic)}><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(topic.id!)}><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h6 className="modal-title">{editingTopic ? 'Edit Guide' : 'Add New Guide'}</h6>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3"><label className="form-label small fw-bold">Title</label><input type="text" className="form-control" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Category</label>
                                        <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                            <option value="burns">Burns</option><option value="fractures">Fractures</option><option value="choking">Choking</option><option value="seizures">Seizures</option><option value="bleeding">Bleeding</option>
                                        </select>
                                    </div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Description</label><input type="text" className="form-control" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Steps (one per line)</label><textarea className="form-control" rows={4} value={formData.steps} onChange={(e) => setFormData({...formData, steps: e.target.value})} placeholder="Step 1...\nStep 2..." /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">DO's (one per line)</label><textarea className="form-control" rows={3} value={formData.dos} onChange={(e) => setFormData({...formData, dos: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">DON'Ts (one per line)</label><textarea className="form-control" rows={3} value={formData.donts} onChange={(e) => setFormData({...formData, donts: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Warning Signs</label><input type="text" className="form-control" value={formData.warning_signs} onChange={(e) => setFormData({...formData, warning_signs: e.target.value})} /></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger">{editingTopic ? 'Update' : 'Create'} Guide</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentPage;
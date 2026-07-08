import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SubmitFirstAidGuidePage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        warning_signs: '',
    });
    const [steps, setSteps] = useState<string[]>(['']);
    const [dos, setDos] = useState<string[]>(['']);
    const [donts, setDonts] = useState<string[]>(['']);

    const updateListItem = (list: string[], setList: (v: string[]) => void, index: number, value: string) => {
        const copy = [...list];
        copy[index] = value;
        setList(copy);
    };

    const addListItem = (list: string[], setList: (v: string[]) => void) => {
        setList([...list, '']);
    };

    const removeListItem = (list: string[], setList: (v: string[]) => void, index: number) => {
        setList(list.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanSteps = steps.map(s => s.trim()).filter(Boolean);
        const cleanDos = dos.map(s => s.trim()).filter(Boolean);
        const cleanDonts = donts.map(s => s.trim()).filter(Boolean);

        if (cleanSteps.length === 0 || cleanDos.length === 0 || cleanDonts.length === 0) {
            toast.error(t('submitGuide.fill_all_lists'));
            return;
        }

        if (!navigator.onLine) {
            toast.error(t('submitGuide.online_required'));
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/v1/firstaid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    steps: cleanSteps,
                    dos: cleanDos,
                    donts: cleanDonts,
                    submitted_by: user?.id,
                }),
            });
            if (!res.ok) throw new Error();
            toast.success(t('submitGuide.submitted_success'));
            navigate(-1);
        } catch {
            toast.error(t('submitGuide.submit_failed'));
        } finally {
            setSubmitting(false);
        }
    };

    const renderListEditor = (
        label: string,
        list: string[],
        setList: (v: string[]) => void,
        placeholder: string
    ) => (
        <div className="mb-3">
            <label className="form-label small fw-bold">{label}</label>
            {list.map((item, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                        placeholder={`${placeholder} ${i + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(list, setList, i, e.target.value)}
                    />
                    {list.length > 1 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeListItem(list, setList, i)}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill"
                onClick={() => addListItem(list, setList)}
            >
                <i className="bi bi-plus-lg me-1"></i>{t('submitGuide.add_item')}
            </button>
        </div>
    );

    return (
        <div className="container pt-4 pb-3">
            <div className="d-flex align-items-center gap-3 mb-4">
                <button className="btn btn-link text-body p-0" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="fw-bold mb-0">{t('submitGuide.title')}</h5>
            </div>

            <div className="alert alert-info small mb-4" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                {t('submitGuide.review_notice')}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small fw-bold">{t('submitGuide.guide_title')}</label>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">{t('submitGuide.category')}</label>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                        placeholder={t('submitGuide.category_placeholder')}
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">{t('submitGuide.description')}</label>
                    <textarea
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                        rows={3}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                {renderListEditor(t('submitGuide.steps_label'), steps, setSteps, t('submitGuide.step_placeholder'))}
                {renderListEditor(t('submitGuide.dos_label'), dos, setDos, t('submitGuide.do_placeholder'))}
                {renderListEditor(t('submitGuide.donts_label'), donts, setDonts, t('submitGuide.dont_placeholder'))}

                <div className="mb-4">
                    <label className="form-label small fw-bold">{t('submitGuide.warning_signs_label')}</label>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                        value={formData.warning_signs}
                        onChange={(e) => setFormData({ ...formData, warning_signs: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill" disabled={submitting}>
                    {submitting ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                        <i className="bi bi-send-fill me-2"></i>
                    )}
                    {t('submitGuide.submit_button')}
                </button>
            </form>
        </div>
    );
};

export default SubmitFirstAidGuidePage;
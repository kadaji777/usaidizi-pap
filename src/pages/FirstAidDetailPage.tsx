import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, FirstAidTopic } from '../database/db';

const FirstAidDetailPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<FirstAidTopic | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopic();
    }, [slug]);

    const loadTopic = async () => {
        let found = await db.firstAidTopics.where('slug').equals(slug!).first();
        
        if (!found && navigator.onLine) {
            try {
                const response = await fetch(`/api/v1/firstaid/${slug}`);
                const data = await response.json();
                await db.firstAidTopics.add(data);
                found = data;
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        }
        
        setTopic(found || null);
        setLoading(false);
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    if (!topic) {
        return <div className="container py-5 text-center"><h4>Guide not found</h4></div>;
    }

    const steps = typeof topic.steps === 'string' ? JSON.parse(topic.steps) : topic.steps;
    const dos = typeof topic.dos === 'string' ? JSON.parse(topic.dos) : topic.dos;
    const donts = typeof topic.donts === 'string' ? JSON.parse(topic.donts) : topic.donts;

    return (
        <div className="container py-3">
            <button className="btn btn-link text-dark mb-3 ps-0" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> Back
            </button>
            
            <h1 className="text-danger mb-3">{topic.title}</h1>
            <p className="lead">{topic.description}</p>
            
            <div className="card mb-4">
                <div className="card-header bg-danger text-white">Step-by-Step Instructions</div>
                <div className="card-body">
                    <ol>
                        {steps?.map((step: string, i: number) => <li key={i} className="mb-2">{step}</li>)}
                    </ol>
                </div>
            </div>
            
            <div className="card border-success mb-3">
                <div className="card-header bg-success text-white">DO's</div>
                <div className="card-body">
                    <ul>
                        {dos?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
            
            <div className="card border-danger mb-3">
                <div className="card-header bg-danger text-white">DON'Ts</div>
                <div className="card-body">
                    <ul>
                        {donts?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
            
            <button className="btn btn-danger w-100 py-3" 
                    onClick={() => navigate('/incidents', { state: { newIncident: true, topicId: topic.id, topicTitle: topic.title } })}>
                <i className="bi bi-journal-plus me-2"></i>Log This Incident
            </button>
        </div>
    );
};

export default FirstAidDetailPage;
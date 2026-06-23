import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, FirstAidTopic } from '../database/db';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import StatsCounter from '../components/StatsCounter';
import Testimonials from '../components/Testimonials';
import EmergencyAlert from '../components/EmergencyAlert';
import PullToRefresh from '../components/PullToRefresh';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState<FirstAidTopic[]>([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
        
        loadTopics();
    }, []);

    const loadTopics = async () => {
        setLoading(true);
        let localTopics = await db.firstAidTopics.toArray();
        
        if (localTopics.length === 0 && navigator.onLine) {
            try {
                const response = await fetch('/api/v1/firstaid');
                const data = await response.json();
                await db.firstAidTopics.bulkAdd(data);
                localTopics = data;
            } catch (error) {
                console.error('Failed to fetch topics:', error);
                toast.error('Could not load first aid guides');
            }
        }
        
        setTopics(localTopics);
        setLoading(false);
    };

    const handleRefresh = async () => {
        if (navigator.onLine) {
            toast.loading('Refreshing data...', { id: 'refresh' });
            try {
                const response = await fetch('/api/v1/firstaid');
                const data = await response.json();
                await db.firstAidTopics.clear();
                await db.firstAidTopics.bulkAdd(data);
                setTopics(data);
                toast.success('Data refreshed!', { id: 'refresh' });
            } catch (error) {
                toast.error('Refresh failed', { id: 'refresh' });
            }
        } else {
            toast.error('You are offline. Cannot refresh.', { id: 'refresh' });
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div>
                {/* Welcome Banner for Logged-in Users */}
                {user && (
                    <div className="bg-success text-white py-2 text-center">
                        <i className="bi bi-person-circle me-2"></i>
                        {greeting}, {user.name}! Welcome back to Usaidizi Pap!
                    </div>
                )}
                
                {/* Emergency Alert Banner */}
                <EmergencyAlert />
                
                {/* Hero Section */}
                <HeroSection />
                
                {/* Feature Cards */}
                <FeatureCards />
                
                {/* Stats Counter */}
                <StatsCounter />
                
                {/* Testimonials */}
                <Testimonials />
                
                {/* Call to Action */}
                <div className="bg-danger text-white py-5 text-center mt-4">
                    <div className="container">
                        <h3>Ready to be prepared for emergencies?</h3>
                        <p className="mb-4">Download first aid guides and save them offline today!</p>
                        <button 
                            className="btn btn-light btn-lg" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <i className="bi bi-arrow-down me-2"></i>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </PullToRefresh>
    );
};

export default HomePage;
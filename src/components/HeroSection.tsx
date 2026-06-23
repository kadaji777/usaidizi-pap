import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="position-relative overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', borderRadius: '0 0 30px 30px' }}>
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-md-7 text-white">
                        <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="display-4 fw-bold mb-3">
                            <i className="bi bi-heart-pulse me-2"></i>Usaidizi Pap!
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lead mb-4">
                            Your personal emergency response companion. Get instant first aid guidance, even without internet connection.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="d-flex gap-3 flex-wrap">
                            <button className="btn btn-light btn-lg" onClick={() => navigate('/firstaid/burns')}><i className="bi bi-book me-2"></i>View First Aid Guides</button>
                            <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/quiz')}><i className="bi bi-question-circle me-2"></i>Take Training Quiz</button>
                        </motion.div>
                    </div>
                    <div className="col-md-5 text-center d-none d-md-block">
                        <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} src="https://cdn-icons-png.flaticon.com/512/2972/2972382.png" alt="Emergency Response" style={{ width: '250px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
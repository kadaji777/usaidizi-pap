import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    { name: 'Dr. Sarah Mwangi', role: 'Emergency Physician', text: 'Usaidizi Pap! has revolutionized emergency response in rural areas. The offline capability is a game-changer!', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 5 },
    { name: 'John Kamau', role: 'Community Health Worker', text: 'This app saved a child\'s life when we had no internet. The first aid guides are clear and easy to follow.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5 },
    { name: 'Mary Atieno', role: 'Volunteer Responder', text: 'I love logging incidents even without connection. The sync works perfectly when I get back online.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', rating: 4 }
];

const Testimonials: React.FC = () => {
    return (
        <div className="container py-4">
            <h3 className="text-center mb-4"><i className="bi bi-chat-quote text-danger me-2"></i>What Our Users Say</h3>
            <div className="row g-4">
                {testimonials.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3"><img src={t.avatar} alt={t.name} className="rounded-circle me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} /><div><h6 className="mb-0">{t.name}</h6><small className="text-muted">{t.role}</small></div></div>
                                <p className="card-text">"{t.text}"</p>
                                <div className="text-warning">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
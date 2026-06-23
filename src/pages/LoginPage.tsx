import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let success = false;
        if (isLogin) success = await login(email, password);
        else success = await register(name, email, password);
        if (success) navigate('/');
        setLoading(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container" style={{ maxWidth: '450px' }}>
                <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/2972/2972382.png" alt="Logo" style={{ width: '80px' }} />
                            <h2 className="text-danger mt-2">Usaidizi Pap!</h2>
                            <p className="text-muted">Emergency First Aid Response System</p>
                        </div>
                        <ul className="nav nav-pills nav-justified mb-4">
                            <li className="nav-item"><button className={`nav-link ${isLogin ? 'active bg-danger' : 'text-dark'}`} onClick={() => setIsLogin(true)}>Login</button></li>
                            <li className="nav-item"><button className={`nav-link ${!isLogin ? 'active bg-danger' : 'text-dark'}`} onClick={() => setIsLogin(false)}>Register</button></li>
                        </ul>
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (<div className="mb-3"><input type="text" className="form-control" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required /></div>)}
                            <div className="mb-3"><input type="email" className="form-control" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                            <div className="mb-3"><input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                            <button type="submit" className="btn btn-danger w-100 py-2" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                                {isLogin ? 'Login' : 'Create Account'}
                            </button>
                        </form>
                        <div className="text-center mt-3"><small className="text-muted">Demo: demo@example.com / password</small></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AppLogo from '../components/AppLogo';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('end_user');
    const [loading, setLoading] = useState(false);
    const { login, register, loginWithGoogle, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let success = false;
        if (isLogin) {
            success = await login(email, password);
        } else {
            success = await register(name, email, password, role);
        }
        if (success) navigate('/');
        setLoading(false);
    };

    const handleForgotPassword = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address first');
            return;
        }
        await resetPassword(email);
    };

    const handleSocialLogin = async (provider: string) => {
        if (provider === 'Google') {
            const success = await loginWithGoogle();
            if (success) navigate('/');
        }
    };

    return (
        <div 
            className="min-vh-100 d-flex align-items-center justify-content-center" 
            style={{ 
                backgroundImage: 'url(https://images.pexels.com/photos/14885781/pexels-photo-14885781.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(15, 12, 41, 0.85), rgba(36, 36, 62, 0.75))',
                zIndex: 1
            }}></div>

            {/* Animated particles effect */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(ellipse at 30% 50%, rgba(220, 52, 69, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(220, 52, 69, 0.06) 0%, transparent 50%)',
                animation: 'rotate 60s linear infinite',
                zIndex: 1
            }}></div>
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container"
                style={{ maxWidth: '460px', position: 'relative', zIndex: 2 }}
            >
                <div className="card border-0 shadow-lg" style={{ 
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.97)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(220, 53, 69, 0.08)',
                }}>
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <AppLogo />
                        </div>

                        <div className="d-flex justify-content-center gap-4 mb-4">
                            <motion.div 
                                className="text-center"
                                whileHover={{ scale: 1.08, y: -2 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <div className="fw-bold text-danger" style={{ fontSize: '20px' }}>5+</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>First Aid Guides</div>
                            </motion.div>
                            <motion.div 
                                className="text-center"
                                whileHover={{ scale: 1.08, y: -2 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <div className="fw-bold text-danger" style={{ fontSize: '20px' }}>30+</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>Facilities</div>
                            </motion.div>
                            <motion.div 
                                className="text-center"
                                whileHover={{ scale: 1.08, y: -2 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <div className="fw-bold text-danger" style={{ fontSize: '20px' }}>100%</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>Offline Ready</div>
                            </motion.div>
                        </div>

                        {/* Toggle Tabs */}
                        <div className="d-flex rounded-pill p-1 mb-4" style={{ 
                            background: '#f1f3f5',
                            borderRadius: '50px !important'
                        }}>
                            <motion.button
                                className={`flex-grow-1 py-2 rounded-pill border-0 fw-semibold ${isLogin ? 'text-white' : 'text-muted'}`}
                                style={{
                                    background: isLogin ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'transparent',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px'
                                }}
                                onClick={() => setIsLogin(true)}
                                whileHover={{ scale: isLogin ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sign In
                            </motion.button>
                            <motion.button
                                className={`flex-grow-1 py-2 rounded-pill border-0 fw-semibold ${!isLogin ? 'text-white' : 'text-muted'}`}
                                style={{
                                    background: !isLogin ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'transparent',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px'
                                }}
                                onClick={() => setIsLogin(false)}
                                whileHover={{ scale: !isLogin ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Create Account
                            </motion.button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-3"
                                    >
                                        <label className="form-label fw-semibold small text-secondary">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={!isLogin}
                                            style={{
                                                borderRadius: '12px',
                                                padding: '12px 16px',
                                                border: '1px solid #e9ecef',
                                                fontSize: '14px',
                                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#dc3545';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e9ecef';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="mb-3"
                                    >
                                        <label className="form-label fw-semibold small text-secondary">Role</label>
                                        <select 
                                            className="form-select"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            style={{
                                                borderRadius: '12px',
                                                padding: '12px 16px',
                                                border: '1px solid #e9ecef',
                                                fontSize: '14px',
                                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#dc3545';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e9ecef';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            <option value="end_user">End User (Bystander/Patient)</option>
                                            <option value="chw">Community Health Worker</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                        <small className="text-muted" style={{ fontSize: '11px' }}>
                                            Choose your role. This determines what features you can access.
                                        </small>
                                    </motion.div>
                                </>
                            )}

                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-secondary">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        borderRadius: '12px',
                                        padding: '12px 16px',
                                        border: '1px solid #e9ecef',
                                        fontSize: '14px',
                                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#dc3545';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e9ecef';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="form-label fw-semibold small text-secondary mb-0">Password</label>
                                    {isLogin && (
                                        <a 
                                            href="#" 
                                            className="text-danger small text-decoration-none" 
                                            style={{ fontSize: '12px' }}
                                            onClick={handleForgotPassword}
                                        >
                                            Forgot?
                                        </a>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        borderRadius: '12px',
                                        padding: '12px 16px',
                                        border: '1px solid #e9ecef',
                                        fontSize: '14px',
                                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#dc3545';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e9ecef';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="btn w-100 py-3 fw-semibold text-white border-0"
                                disabled={loading}
                                style={{
                                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(220, 53, 69, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                        <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                        <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                                    </div>
                                ) : (
                                    <>
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Social Login Options - Only Google */}
                        <div className="text-center mt-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="flex-grow-1" style={{ height: '1px', background: '#e9ecef' }}></div>
                                <span className="text-muted small">Or continue with</span>
                                <div className="flex-grow-1" style={{ height: '1px', background: '#e9ecef' }}></div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <motion.button 
                                    className="btn btn-outline-secondary rounded-circle"
                                    style={{ width: '48px', height: '48px', borderColor: '#e9ecef' }}
                                    whileHover={{ scale: 1.1, borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.05)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSocialLogin('Google')}
                                >
                                    <i className="bi bi-google" style={{ fontSize: '20px' }}></i>
                                </motion.button>
                            </div>
                        </div>

                        {/* Demo Credentials */}
                        <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: '#f1f3f5 !important' }}>
                            <small className="text-muted d-block mb-1" style={{ fontSize: '11px', letterSpacing: '0.2px' }}>
                                🔑 Demo: demo@example.com / password
                            </small>
                            <div className="d-flex justify-content-center gap-4 mt-2">
                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-check-circle-fill text-success me-1" style={{ fontSize: '10px' }}></i>
                                    Offline Ready
                                </span>
                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-check-circle-fill text-success me-1" style={{ fontSize: '10px' }}></i>
                                    24/7 Access
                                </span>
                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-check-circle-fill text-success me-1" style={{ fontSize: '10px' }}></i>
                                    Free
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                    <motion.small 
                        className="text-white-50" 
                        style={{ fontSize: '12px', opacity: '0.6' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.8 }}
                    >
                        © 2026 Usaidizi Pap! — Saving Lives, One Click at a Time
                    </motion.small>
                </div>
            </motion.div>

            <style>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
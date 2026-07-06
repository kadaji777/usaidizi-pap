import React from 'react';
import { motion } from 'framer-motion';

const AppLogo: React.FC = () => {
    return (
        <motion.div 
            className="d-flex align-items-center justify-content-center gap-3 mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
            {/* Animated Logo Icon */}
            <motion.div 
                className="d-flex align-items-center justify-content-center position-relative"
                style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #dc3545, #c82333, #a71d2a)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(220, 53, 69, 0.3)',
                }}
                whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: '0 12px 48px rgba(220, 53, 69, 0.5)'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
            >
                {/* Pulsing ring effect */}
                <motion.div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px',
                        border: '2px solid rgba(220, 53, 69, 0.3)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                
                {/* Heartbeat icon */}
                <motion.span 
                    style={{ fontSize: '28px' }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    🚑
                </motion.span>
            </motion.div>

            {/* App Name with animated gradient */}
            <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #dc3545, #c82333, #a71d2a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                    display: 'block',
                    lineHeight: '1.2'
                }}>
                    Usaidizi Pap!
                </span>
                <motion.span 
                    style={{ 
                        fontSize: '11px', 
                        color: '#6c757d',
                        fontWeight: 400,
                        letterSpacing: '0.5px',
                        display: 'block',
                        WebkitTextFillColor: '#6c757d'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <i className="bi bi-heart-fill text-danger me-1" style={{ fontSize: '10px' }}></i>
                    Emergency First Aid Response System
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default AppLogo;
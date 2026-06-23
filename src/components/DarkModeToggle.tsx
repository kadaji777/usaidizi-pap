import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('bg-dark', 'text-white');
            document.body.classList.remove('bg-light');
        } else {
            document.body.classList.add('bg-light');
            document.body.classList.remove('bg-dark', 'text-white');
        }
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    return (
        <button 
            className="btn btn-outline-secondary rounded-circle position-fixed top-0 end-0 m-3"
            style={{ zIndex: 1000, width: '40px', height: '40px' }}
            onClick={() => setIsDark(!isDark)}
        >
            <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
        </button>
    );
};

export default DarkModeToggle;
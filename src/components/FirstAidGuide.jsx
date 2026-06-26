// FirstAidGuide component for Usaidizi Pap!
// Contributed by Peter Onyango Atonga

import React from 'react';

const FirstAidGuide = ({ title, steps }) => {
    return (
        <div className="first-aid-guide">
            <h2>{title}</h2>
            <ul>
                {steps && steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
        </div>
    );
};

export default FirstAidGuide;
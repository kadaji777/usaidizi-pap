import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const VoiceAssistant: React.FC = () => {
    const [listening, setListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';
            recognitionInstance.onresult = (event: any) => {
                const command = event.results[0][0].transcript.toLowerCase();
                setListening(false);
                if (command.includes('burns')) window.location.href = '/firstaid/burns';
                else if (command.includes('fracture')) window.location.href = '/firstaid/fractures';
                else if (command.includes('choke')) window.location.href = '/firstaid/choking';
                else if (command.includes('seizure')) window.location.href = '/firstaid/seizures';
                else if (command.includes('bleed')) window.location.href = '/firstaid/severe-bleeding';
                else if (command.includes('emergency') || command.includes('help')) window.location.href = 'tel:999';
                else if (command.includes('patients')) window.location.href = '/patients';
                else if (command.includes('contacts')) window.location.href = '/contacts';
                else if (command.includes('find hospital')) window.location.href = '/facilities';
              else toast('Say: Burns, Fractures, Choking, Seizures, Bleeding, Emergency, Patients, Contacts, or Find Hospital', { duration: 5000 });
            };
            recognitionInstance.onerror = () => { setListening(false); toast.error('Could not hear you'); };
            setRecognition(recognitionInstance);
        }
    }, []);

    const startListening = () => { if (recognition) { setListening(true); recognition.start(); } else toast.error('Voice not supported'); };
    const stopListening = () => { if (recognition) { recognition.stop(); setListening(false); } };

    return (
        <div className="position-fixed bottom-0 start-0 m-3" style={{ zIndex: 1000 }}>
            <button className={`btn rounded-circle shadow-lg ${listening ? 'btn-danger pulse' : 'btn-danger'}`} onClick={listening ? stopListening : startListening} style={{ width: '56px', height: '56px' }}>
                <i className={`bi bi-mic${listening ? '-fill' : ''} fs-4`}></i>
            </button>
            {listening && <div className="mt-2 bg-dark text-white rounded-pill px-3 py-1 small"><i className="bi bi-earbuds me-1"></i> Listening...</div>}
        </div>
    );
};

export default VoiceAssistant;
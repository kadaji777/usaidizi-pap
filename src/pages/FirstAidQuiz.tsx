import React, { useState, useEffect } from 'react';
import { db, FirstAidTopic } from '../database/db';
import toast from 'react-hot-toast';

const FirstAidQuiz: React.FC = () => {
    const [topics, setTopics] = useState<FirstAidTopic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<FirstAidTopic | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answered, setAnswered] = useState(false);

    useEffect(() => { loadTopics(); }, []);

    const loadTopics = async () => { setTopics(await db.firstAidTopics.toArray()); };

    const startQuiz = (topic: FirstAidTopic) => {
        const steps = typeof topic.steps === 'string' ? JSON.parse(topic.steps) : topic.steps;
        const dos = typeof topic.dos === 'string' ? JSON.parse(topic.dos) : topic.dos;
        setQuestions([
            { question: `What is the FIRST step for ${topic.title}?`, options: [steps?.[0] || 'Assess', steps?.[1] || 'Call help', 'Wait', 'Apply ice'], correct: steps?.[0] || 'Assess', explanation: `First step: ${steps?.[0] || 'assess the situation'}` },
            { question: `Which is a DO for ${topic.title}?`, options: dos || ['Seek help', 'Panic', 'Wait', 'Ignore'], correct: dos?.[0] || 'Seek help', explanation: dos?.[0] || 'Always follow proper first aid' },
            { question: `When to seek professional help?`, options: ['Only if painful', 'For severe cases', 'Never', 'Always wait'], correct: 'For severe cases', explanation: 'Seek help for severe burns, fractures, bleeding, or distress' }
        ]);
        setSelectedTopic(topic);
        setCurrentIndex(0);
        setScore(0);
        setShowResults(false);
        setSelectedAnswer(null);
        setAnswered(false);
        toast.success(`Quiz: ${topic.title}`);
    };

    const handleAnswer = (answer: string) => {
        if (answered) return;
        setSelectedAnswer(answer);
        setAnswered(true);
        const isCorrect = answer === questions[currentIndex].correct;
        if (isCorrect) setScore(prev => prev + 1);
        else toast.error(`Wrong! ${questions[currentIndex].explanation}`);
        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setAnswered(false);
            } else {
                setShowResults(true);
                const percent = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
                toast.success(percent >= 70 ? `Score: ${percent}% - Great job!` : `Score: ${percent}% - Review and try again`);
            }
        }, 1500);
    };

    if (selectedTopic && !showResults) {
        const q = questions[currentIndex];
        return (<div className="container py-3"><div className="card shadow"><div className="card-header bg-danger text-white"><h5>{selectedTopic.title} Quiz - Question {currentIndex+1}/{questions.length}</h5></div><div className="card-body"><h6>{q?.question}</h6>{q?.options.map((opt: string, i: number) => (<button key={i} className={`btn btn-outline w-100 text-start mb-2 ${selectedAnswer === opt ? (opt === q.correct ? 'btn-success' : 'btn-danger') : 'btn-outline-secondary'}`} onClick={() => handleAnswer(opt)} disabled={answered}>{opt}</button>))}</div></div></div>);
    }

    if (showResults) {
        const percent = (score / questions.length) * 100;
        return (<div className="container py-3 text-center"><div className="card shadow"><div className="card-header bg-danger text-white"><h5>Quiz Results</h5></div><div className="card-body"><div className="display-1">{percent >= 70 ? '🎉' : '📚'}</div><h3>{score}/{questions.length}</h3><h5>{percent}%</h5><p>{percent >= 70 ? 'Excellent!' : 'Keep learning!'}</p><button className="btn btn-danger" onClick={() => setSelectedTopic(null)}>Try Another Quiz</button></div></div></div>);
    }

    return (<div className="container py-3"><h4><i className="bi bi-question-circle me-2 text-danger"></i>First Aid Quiz</h4><div className="row g-3">{topics.map(t => (<div key={t.id} className="col-md-6"><div className="card cursor-pointer" onClick={() => startQuiz(t)}><div className="card-body text-center"><div className="display-4">{t.category === 'burns' ? '🔥' : t.category === 'fractures' ? '🦴' : t.category === 'choking' ? '🫁' : t.category === 'seizures' ? '⚡' : '🩸'}</div><h5>{t.title}</h5><button className="btn btn-danger btn-sm mt-2">Take Quiz</button></div></div></div>))}</div></div>);
};

export default FirstAidQuiz;
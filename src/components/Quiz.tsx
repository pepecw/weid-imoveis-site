import { useState } from 'react';

const WA_BASE = 'https://wa.me/5547999999999?text=';

interface Step {
    question: string;
    options?: { label: string; icon: string; value: string }[];
    type: 'options' | 'buttons' | 'slider' | 'final';
}

const STEPS: Step[] = [
    {
        question: 'O que você procura?',
        type: 'options',
        options: [
            { label: 'Casa', icon: '🏡', value: 'Casa' },
            { label: 'Apartamento', icon: '🏢', value: 'Apartamento' },
            { label: 'Sobrado', icon: '🏘️', value: 'Sobrado' },
            { label: 'Terreno', icon: '🌱', value: 'Terreno' },
        ],
    },
    {
        question: 'Quantos quartos precisa?',
        type: 'buttons',
        options: [
            { label: '1', icon: '1️⃣', value: '1 quarto' },
            { label: '2', icon: '2️⃣', value: '2 quartos' },
            { label: '3', icon: '3️⃣', value: '3 quartos' },
            { label: '4+', icon: '4️⃣', value: '4+ quartos' },
        ],
    },
    {
        question: 'Qual região te interessa?',
        type: 'options',
        options: [
            { label: 'Centro', icon: '🏙️', value: 'Centro' },
            { label: 'Iririú', icon: '🌿', value: 'Iririú' },
            { label: 'Vila Nova', icon: '🏗️', value: 'Vila Nova' },
            { label: 'Litoral Norte', icon: '🏖️', value: 'Litoral Norte SC' },
        ],
    },
    {
        question: 'Qual sua faixa de investimento?',
        type: 'buttons',
        options: [
            { label: 'Até 200k', icon: '💚', value: 'Até R$200.000' },
            { label: '200k–350k', icon: '💛', value: 'R$200k a R$350k' },
            { label: '350k–500k', icon: '🧡', value: 'R$350k a R$500k' },
            { label: 'Acima 500k', icon: '❤️', value: 'Acima de R$500k' },
        ],
    },
    {
        question: 'Tem entrada disponível?',
        type: 'options',
        options: [
            { label: 'Sim, tenho FGTS', icon: '🏦', value: 'Tenho FGTS' },
            { label: 'Sim, tenho dinheiro', icon: '💵', value: 'Tenho dinheiro' },
            { label: 'Não tenho entrada', icon: '🤔', value: 'Sem entrada' },
            { label: 'Não sei', icon: '❓', value: 'Não sei sobre entrada' },
        ],
    },
    {
        question: 'Suas opções estão quase prontas!',
        type: 'final',
    },
];

interface QuizProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Quiz({ isOpen, onClose }: QuizProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const currentStep = STEPS[step];
    const progress = Math.round((step / (STEPS.length - 1)) * 100);

    const handleOption = (value: string) => {
        const newAnswers = [...answers];
        newAnswers[step] = value;
        setAnswers(newAnswers);
        setTimeout(() => {
            if (step < STEPS.length - 1) setStep(step + 1);
        }, 300);
    };

    const handleSubmit = () => {
        const answersText = STEPS.slice(0, -1)
            .map((s, i) => `${s.question.replace('?', '')}: ${answers[i] || 'Não informado'}`)
            .join('\n');

        const msg = encodeURIComponent(
            `Olá! Fiz o quiz da Weid Imóveis e quero ver opções personalizadas.\n\n📋 Minhas preferências:\n${answersText}\n\n👤 Nome: ${name}\n📱 WhatsApp: ${phone}`
        );
        window.open(`${WA_BASE}${msg}`, '_blank');
        onClose();
        setStep(0);
        setAnswers([]);
        setName('');
        setPhone('');
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
        else onClose();
    };

    const renderTitle = () => (
        <div>
            <div style={{ marginBottom: '0.25rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                {step < STEPS.length - 1 ? `Pergunta ${step + 1} de ${STEPS.length - 1}` : '🎉 Quase lá!'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                {currentStep.question}
            </h2>
        </div>
    );

    return (
        <div className="quiz-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="quiz-modal">
                {/* Progress */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
                            ← {step === 0 ? 'Fechar' : 'Voltar'}
                        </button>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem', padding: 0 }}>✕</button>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Step content */}
                <div style={{ animation: 'fadeInUp 0.3s ease' }} key={step}>
                    {renderTitle()}

                    {currentStep.type === 'options' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem', marginTop: '1.5rem' }}>
                            {currentStep.options?.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`quiz-option ${answers[step] === opt.value ? 'selected' : ''}`}
                                    onClick={() => handleOption(opt.value)}
                                >
                                    <span className="quiz-option-icon">{opt.icon}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep.type === 'buttons' && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            {currentStep.options?.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`quiz-option ${answers[step] === opt.value ? 'selected' : ''}`}
                                    onClick={() => handleOption(opt.value)}
                                    style={{ flex: '1', minWidth: '80px', padding: '1rem 0.75rem' }}
                                >
                                    <span className="quiz-option-icon">{opt.icon}</span>
                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep.type === 'final' && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ color: '#94A3B8', font: '0.95rem', marginBottom: '0.5rem' }}>
                                Preencha seus dados para receber as opções personalizadas no WhatsApp:
                            </p>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <input
                                className="form-input"
                                type="tel"
                                placeholder="Seu WhatsApp (47) 99999-9999"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            <button
                                className="btn btn-whatsapp"
                                style={{ width: '100%', fontSize: '1rem', marginTop: '0.5rem' }}
                                onClick={handleSubmit}
                                disabled={!name || !phone}
                            >
                                💬 Receber Opções no WhatsApp
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
                                🔒 Sem spam. Só imóveis que combinam com você.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

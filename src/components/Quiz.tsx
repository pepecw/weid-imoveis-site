import { useState, type ReactNode } from 'react';
import { Home, Building2, Map, MapPin, Wallet, Coffee, Gem, DollarSign, HelpCircle, ArrowRight } from 'lucide-react';

const WA_BASE = 'https://wa.me/5547991523220?text=';

interface Step {
    question: string;
    options?: { label: string; icon: ReactNode; value: string }[];
    type: 'options' | 'options-with-input' | 'buttons' | 'final';
    inputPlaceholder?: string;
}

const STEPS: Step[] = [
    {
        question: 'O que você está procurando?',
        type: 'options',
        options: [
            { label: 'Casa', icon: <Home size={28} />, value: 'Casa' },
            { label: 'Apartamento', icon: <Building2 size={28} />, value: 'Apartamento' },
            { label: 'Geminado', icon: <Map size={28} />, value: 'Geminado' },
            { label: 'Studio / Kitnet', icon: <Coffee size={28} />, value: 'Studio / Kitnet' },
        ],
    },
    {
        question: 'Qual a região de preferência?',
        type: 'options-with-input',
        inputPlaceholder: 'Ou digite um bairro específico...',
        options: [
            { label: 'Zona Norte', icon: <MapPin size={28} />, value: 'Zona Norte' },
            { label: 'Zona Sul', icon: <MapPin size={28} />, value: 'Zona Sul' },
            { label: 'Zona Leste', icon: <MapPin size={28} />, value: 'Zona Leste' },
            { label: 'Zona Oeste', icon: <MapPin size={28} />, value: 'Zona Oeste' },
        ],
    },
    {
        question: 'Qual a estimativa do valor de entrada?',
        type: 'buttons',
        options: [
            { label: 'Até R$ 20.000', icon: <Wallet size={20} />, value: 'Até R$20k' },
            { label: 'R$ 20k a R$ 50k', icon: <DollarSign size={20} />, value: 'R$20k a R$50k' },
            { label: 'Acima de R$ 50k', icon: <Gem size={20} />, value: 'Acima de R$50k' },
            { label: 'Prefiro não informar', icon: <HelpCircle size={20} />, value: 'Não informou' },
        ],
    },
    {
        question: 'Qual o valor aproximado do imóvel que você busca?',
        type: 'buttons',
        options: [
            { label: 'Até R$ 250 mil', icon: <Wallet size={20} />, value: 'Até R$250.000' },
            { label: 'R$ 250k a R$ 500k', icon: <DollarSign size={20} />, value: 'R$250k a R$500k' },
            { label: 'R$ 500k a 1 Milhão', icon: <Gem size={20} />, value: 'R$500k a R$1 Milhão' },
            { label: 'Acima de 1 Milhão', icon: <Gem size={20} />, value: 'Acima de R$1 Milhão' },
        ],
    },
    {
        question: 'Suas opções estão prontas!',
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
            `Olá, Peterson! Fiz o quiz da Weid Imóveis e quero ver opções personalizadas.\n\n📋 Minhas preferências:\n${answersText}\n\n👤 Nome: ${name}\n📱 WhatsApp: ${phone}`
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
                {step < STEPS.length - 1 ? `Pergunta ${step + 1} de ${STEPS.length - 1}` : '🎉 Finalizando!'}
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

                    {(currentStep.type === 'options' || currentStep.type === 'options-with-input') && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                                {currentStep.options?.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`quiz-option ${answers[step] === opt.value ? 'selected' : ''}`}
                                        onClick={() => handleOption(opt.value)}
                                        style={{ color: answers[step] === opt.value ? '#C9A96E' : '#FFFFFF' }}
                                    >
                                        <span className="quiz-option-icon text-primary">{opt.icon}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {currentStep.type === 'options-with-input' && (
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder={currentStep.inputPlaceholder}
                                        className="form-input"
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                        value={answers[step] || ''}
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[step] = e.target.value;
                                            setAnswers(newAnswers);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && answers[step]) {
                                                setTimeout(() => { if (step < STEPS.length - 1) setStep(step + 1); }, 150);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (answers[step]) {
                                                setTimeout(() => { if (step < STEPS.length - 1) setStep(step + 1); }, 150);
                                            }
                                        }}
                                        className="btn btn-gold"
                                        style={{ padding: '0 1rem', borderRadius: '8px' }}
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep.type === 'buttons' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1.5rem' }}>
                            {currentStep.options?.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`quiz-option ${answers[step] === opt.value ? 'selected' : ''}`}
                                    onClick={() => handleOption(opt.value)}
                                    style={{ padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: answers[step] === opt.value ? '#C9A96E' : '#FFFFFF' }}
                                >
                                    <span className="text-primary opacity-80">{opt.icon}</span>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep.type === 'final' && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ color: '#94A3B8', font: '0.95rem', marginBottom: '0.5rem' }}>
                                Preencha seus dados para eu enviar um catálogo de imóveis selecionados no seu WhatsApp ✨
                            </p>
                            <input
                                className="form-input w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <input
                                className="form-input w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                type="tel"
                                placeholder="Seu WhatsApp (47) 99999-9999"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            <button
                                className="w-full py-4 mt-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
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

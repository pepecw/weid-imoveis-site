import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const QUESTIONS = [
    {
        id: 'goal',
        question: "O que você está buscando?",
        options: ["Comprar Primeiro Imóvel", "Comprar para Investir", "Trocar de Imóvel", "Alugar"]
    },
    {
        id: 'budget',
        question: "Qual sua faixa de investimento?",
        options: ["Até R$ 250.000", "R$ 250k a R$ 400k", "R$ 400k a R$ 700k", "Acima de R$ 700k"]
    },
    {
        id: 'city',
        question: "Em qual cidade procura?",
        options: ["Joinville", "Araquari", "Balneário Piçarras", "Outra"]
    },
    {
        id: 'type',
        question: "O que não pode faltar?",
        multi: true,
        options: ["2 Quartos", "3 Quartos", "Suíte", "Sacada com Churrasqueira", "Vaga Garagem", "Área de Lazer"]
    },
    {
        id: 'finances',
        question: "Pretende financiar?",
        options: ["Sim, financiar", "Não, pagamento à vista"]
    },
    {
        id: 'entry',
        question: "Qual valor disponível para entrada?",
        options: ["Até R$ 20.000", "R$ 20k a R$ 50k", "R$ 50k a R$ 100k", "Acima de R$ 100k", "Vou usar meu FGTS"],
        condition: (answers: any) => answers['finances'] !== "Não, pagamento à vista"
    }
];

export const QuizModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [name, setName] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    // Filter questions based on conditions
    const activeQuestions = QUESTIONS.filter(q => !q.condition || q.condition(answers));
    const totalSteps = activeQuestions.length + 1; // +1 for name capture
    const currentQuestion = activeQuestions[step];
    const progress = ((step + 1) / totalSteps) * 100;

    const handleAnswer = (answer: string) => {
        if (currentQuestion.multi) {
            const current = answers[currentQuestion.id] || [];
            if (current.includes(answer)) {
                setAnswers({ ...answers, [currentQuestion.id]: current.filter((a: string) => a !== answer) });
            } else {
                setAnswers({ ...answers, [currentQuestion.id]: [...current, answer] });
            }
        } else {
            setAnswers({ ...answers, [currentQuestion.id]: answer });
            nextStep();
        }
    };

    const nextStep = () => {
        if (step < activeQuestions.length) {
            setStep(step + 1);
        } else if (step === activeQuestions.length && name.trim()) {
            setIsThinking(true);
            setTimeout(() => {
                setIsThinking(false);
                setStep(step + 1); // Success screen
            }, 2000);
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const sendToWhatsApp = () => {
        const lines = [
            `*Olá Peterson, sou o ${name}*!`,
            `Acabei de preencher o Quiz no site.`,
            ``,
            `*Resumo do meu perfil:*`,
            ...Object.entries(answers).map(([key, val]) => {
                const q = QUESTIONS.find(q => q.id === key);
                return `- *${q?.question}*: ${Array.isArray(val) ? val.join(', ') : val}`;
            }),
            ``,
            `Gostaria de ver opções para meu perfil!`
        ];

        const text = encodeURIComponent(lines.join('\n'));
        window.open(`https://wa.me/5547991523220?text=${text}`, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                        {step > 0 && step <= activeQuestions.length && !isThinking && (
                            <button onClick={prevStep} className="p-2 -ml-2 text-gray-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <span className="text-sm font-medium text-gray-400 ml-auto mr-4">
                            {step < activeQuestions.length ? `Passo ${step + 1} de ${totalSteps}` : 'Finalizado'}
                        </span>
                        <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-white/5 w-full">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto min-h-[300px] flex flex-col">
                        {isThinking ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <h3 className="text-xl font-bold text-white">Analisando seu perfil...</h3>
                                <p className="text-gray-400">Buscando as melhores oportunidades.</p>
                            </div>
                        ) : step < activeQuestions.length ? (
                            // Questions Step
                            <motion.div
                                key={step}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
                                <div className="space-y-3 flex-1">
                                    {currentQuestion.options.map((option, idx) => {
                                        const isSelected = currentQuestion.multi
                                            ? (answers[currentQuestion.id] || []).includes(option)
                                            : answers[currentQuestion.id] === option;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(option)}
                                                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-center justify-between group ${isSelected
                                                        ? 'bg-primary/20 border-primary text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="font-medium">{option}</span>
                                                {isSelected && <Check className="w-5 h-5 text-primary" />}
                                                {!isSelected && <span className="w-5 h-5 rounded-full border border-white/20 group-hover:border-white/50" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {currentQuestion.multi && (
                                    <button
                                        onClick={nextStep}
                                        disabled={!(answers[currentQuestion.id] || []).length}
                                        className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continuar
                                    </button>
                                )}
                            </motion.div>
                        ) : step === activeQuestions.length ? (
                            // Name Capture Step
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col justify-center"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">Quase lá!</h2>
                                <p className="text-gray-400 mb-6">Como você gostaria de ser chamado?</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite seu nome"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary mb-6 text-lg"
                                    autoFocus
                                />
                                <button
                                    onClick={nextStep}
                                    disabled={!name.trim()}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    Ver Resultado
                                </button>
                            </motion.div>
                        ) : (
                            // Success Step
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center py-6"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Perfil Analisado!</h2>
                                <p className="text-gray-400 mb-8 max-w-xs">
                                    Tenho ótimas opções selecionadas para você, <span className="text-white font-semibold">{name}</span>.
                                </p>
                                <button
                                    onClick={sendToWhatsApp}
                                    className="w-full py-4 bg-secondary hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" alt="WhatsApp" />
                                    Enviar para Peterson
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

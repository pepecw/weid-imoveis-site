import React from 'react';
import { ClipboardList, Gem, ShieldCheck } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const steps = [
    {
        icon: ClipboardList,
        title: "Planejamento",
        desc: "Entendimento profundo do seu momento de vida e financeiro."
    },
    {
        icon: Gem,
        title: "Curadoria",
        desc: "Seleção minuciosa dos imóveis que realmente valem a pena."
    },
    {
        icon: ShieldCheck,
        title: "Segurança",
        desc: "Análise documental rigorosa para garantir sua tranquilidade."
    }
];

export const ProcessSteps: React.FC = () => {
    return (
        <section className="px-6 py-10 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
            <Reveal>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Processo Simplificado</h2>
                    <p className="text-gray-400 text-sm">Do primeiro contato até a entrega das chaves.</p>
                </div>
            </Reveal>

            <div className="relative">
                {/* Line connector */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 to-transparent"></div>

                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <Reveal key={index} width="100%">
                            <div className="flex gap-6 relative">
                                <div className="relative z-10 flex-none w-12 h-12 rounded-full bg-dark border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,102,255,0.2)]">
                                    <step.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

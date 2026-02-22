import React from 'react';
import { ShieldCheck, UserCheck, Zap } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const benefits = [
    {
        icon: UserCheck,
        title: "Autêntico",
        description: "Sem letras miúdas. Transparência total em cada etapa da negociação.",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        icon: ShieldCheck,
        title: "Profissional",
        description: "10 anos de experiência garantindo segurança jurídica e financeira.",
        color: "text-green-400",
        bg: "bg-green-400/10"
    },
    {
        icon: Zap,
        title: "Tecnológico",
        description: "Visualização do potencial do imóvel com redesign digital exclusivo.",
        color: "text-purple-400",
        bg: "bg-purple-400/10"
    }
];

export const BenefitsCarousel: React.FC = () => {
    return (
        <section className="py-8 ml-4">
            <Reveal>
                <h2 className="text-xl font-bold mb-4 text-gray-200">Por que trabalhar comigo?</h2>
            </Reveal>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pr-4 -ml-4 pl-4 scrollbar-hide">
                {benefits.map((item, index) => (
                    <div
                        key={index}
                        className="snap-start flex-none w-[80%] max-w-[300px] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-3"
                    >
                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-1`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

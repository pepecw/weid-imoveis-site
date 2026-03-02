import React from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Reveal } from './ui/Reveal';

interface Props {
    onStartQuiz: () => void;
}

export const HeroActions: React.FC<Props> = ({ onStartQuiz }) => {
    return (
        <section className="px-6 py-6 pb-12 flex flex-col gap-4">
            <Reveal>
                <button
                    onClick={onStartQuiz}
                    className="relative w-full group overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-1"
                >
                    {/* Animated Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out transform rotate-45 scale-[2]"></div>

                    <div className="relative bg-dark/20 backdrop-blur-sm rounded-xl py-4 px-6 flex items-center justify-between border border-white/10 group-hover:bg-transparent transition-colors duration-300">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-white font-bold text-lg text-left">Encontrar Imóvel Ideal</span>
                            <span className="text-blue-100 text-xs text-left opacity-90">Análise de perfil com IA</span>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Floating Tag */}
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] font-bold text-black px-2 py-0.5 rounded-bl-lg rounded-tr-lg shadow-lg animate-bounce duration-[2000ms]">
                        ⭐ MAIS ACESSADO
                    </div>
                </button>
            </Reveal>

            <Reveal>
                <a
                    href="https://wa.me/5547991523220?text=Ol%C3%A1%2C%20Peterson%21%20Vim%20pelo%20site%20da%20Weid%20Im%C3%B3veis%20e%20gostaria%20de%20conversar%20sobre%20im%C3%B3veis."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 flex items-center justify-between hover:bg-white/10 transition-colors group"
                >
                    <span className="text-white font-semibold">Falar com Peterson</span>
                    <MessageCircle className="w-6 h-6 text-secondary group-hover:text-green-400 transition-colors" />
                </a>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 mt-2">
                <Reveal>
                    <button className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors h-full">
                        <span className="text-blue-200 text-xs font-medium block mb-1">Avaliação</span>
                        <span className="text-white text-xs font-bold leading-tight block">Quanto vale seu imóvel?</span>
                    </button>
                </Reveal>
                <Reveal>
                    <button className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors h-full">
                        <span className="text-purple-200 text-xs font-medium block mb-1">VIP</span>
                        <span className="text-white text-xs font-bold leading-tight block">Oportunidades Exclusivas</span>
                    </button>
                </Reveal>
            </div>
        </section>
    );
};

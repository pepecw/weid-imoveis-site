import React from 'react';
import { Instagram, Star } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export const Header: React.FC = () => {
    return (
        <section className="flex flex-col items-center text-center px-6 pt-12 pb-8 gap-6 z-10 relative">
            <Reveal>
                <div className="relative mx-auto mb-4 w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"
                        alt="Peterson Weidgennant"
                        className="w-full h-full object-cover rounded-full border-2 border-white/20 relative z-10"
                    />
                </div>
            </Reveal>

            <Reveal>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                    Peterson Weidgennant
                </h1>
                <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                    Corretor Imobiliário | Joinville e Região
                </p>
            </Reveal>

            <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-gray-200">10 Anos em Vendas | Foco em Primeiro Imóvel</span>
                </div>
            </Reveal>

            <Reveal>
                <blockquote className="text-lg font-medium text-gray-300 italic max-w-xs mx-auto leading-relaxed">
                    "Sair do aluguel não é apenas um sonho, é o início da sua liberdade financeira."
                </blockquote>
            </Reveal>

            <Reveal>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                    <Instagram className="w-4 h-4" />
                    Siga no Instagram
                </a>
            </Reveal>
        </section>
    );
};

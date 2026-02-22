import React from 'react';
import { Wand2 } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export const TechDiff: React.FC = () => {
    return (
        <section className="px-6 py-10">
            <Reveal>
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-black border border-indigo-500/30 p-8 text-center">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md mb-2">
                            <Wand2 className="w-8 h-8 text-indigo-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">Redesign Digital</h2>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                            Não consegue visualizar o potencial do imóvel? Eu crio um projeto digital de como ele pode ficar após a reforma.
                        </p>

                        <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 w-full max-w-xs">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                <span>Antes</span>
                                <span>Depois</span>
                            </div>
                            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-gradient-to-r from-gray-500 to-indigo-500 animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-center mt-2 text-indigo-300">Inteligencia Artificial aplicada a vendas</p>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
};

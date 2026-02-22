import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const faqs = [
    {
        q: "Como funciona a aprovação do financiamento?",
        a: "Eu cuido de todo o processo. Analisamos sua renda, escolhemos o melhor banco e aprovamos seu crédito antes mesmo de escolher o imóvel."
    },
    {
        q: "Qual o valor mínimo de entrada?",
        a: "Geralmente 20% do valor do imóvel, mas existem opções com entrada facilitada ou uso do FGTS. Vamos analisar seu caso específico."
    },
    {
        q: "Você atende em quais cidades?",
        a: "Foco principal em Joinville e Araquari, conhecendo profundamente cada bairro e potencial de valorização."
    }
];

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="px-6 py-10">
            <Reveal>
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-white">Dúvidas Comuns</h2>
                </div>
            </Reveal>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <Reveal key={index} width="100%">
                        <div
                            className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${openIndex === index ? 'bg-white/10 border-primary/50' : 'bg-white/5 border-white/10'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-4 flex items-center justify-between text-left"
                            >
                                <span className="font-semibold text-white pr-4">{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} />
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden px-4">
                                    <p className="text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
};

import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const properties = [
    {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600",
        title: "Residencial Horizonte",
        location: "América, Joinville",
        specs: "2 Quartos • 70m²",
        tag: "🔥 NOVIDADE",
        tagColor: "bg-orange-500",
        price: "R$ 380.000",
        codigo: "IMV0003"
    },
    {
        image: "https://images.unsplash.com/photo-1600596542815-e32cb130eb5b?auto=format&fit=crop&q=80&w=600",
        title: "Apartamento Garden",
        location: "Costa e Silva, Joinville",
        specs: "3 Quartos (1 Suíte) • 92m²",
        tag: "💎 OPORTUNIDADE",
        tagColor: "bg-blue-500",
        price: "R$ 450.000",
        codigo: "IMV0002"
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
        title: "Casa Geminada Alta Padrão",
        location: "Glória, Joinville",
        specs: "3 Suítes • 140m²",
        tag: "✨ EXCLUSIVO",
        tagColor: "bg-purple-500",
        price: "R$ 890.000",
        codigo: "IMV0001"
    }
];

export const PropertyShowcase: React.FC = () => {
    return (
        <section className="px-6 py-10">
            <Reveal>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Seleção Especial</h2>
                    <button className="text-primary text-sm font-medium flex items-center gap-1">
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </Reveal>

            <div className="space-y-6">
                {properties.map((prop, index) => (
                    <Reveal key={index} width="100%">
                        <div className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={prop.image}
                                    alt={prop.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />

                                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white ${prop.tagColor} shadow-lg`}>
                                    {prop.tag}
                                </span>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-lg font-bold text-white mb-1 leading-snug">{prop.title}</h3>
                                    <div className="flex items-center gap-1 text-gray-300 text-xs mb-2">
                                        <MapPin className="w-3 h-3 text-primary" />
                                        {prop.location}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3 text-xs text-gray-400 font-medium">
                                            <span>{prop.specs}</span>
                                        </div>
                                        <span className="text-white font-bold">{prop.price}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="w-full py-3 bg-white/5 text-sm font-semibold text-white hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                onClick={() => window.open(`https://wa.me/5547991523220?text=${encodeURIComponent(`Olá, Peterson! Gostei muito do imóvel *${prop.title}* (Cód: ${prop.codigo}) e gostaria de saber mais.`)}`, '_blank')}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Tenho Interesse
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Imports fix */}
        </section>
    );
};

// Quick fix for missing import in duplicate snippet usage
import { MessageCircle } from 'lucide-react';

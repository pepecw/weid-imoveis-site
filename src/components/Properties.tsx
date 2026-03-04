import { useScrollReveal } from '../hooks/useScrollReveal';

import { Link } from 'react-router-dom';
import { propertiesData } from '../data/properties';

export function Properties() {
    useScrollReveal();

    return (
        <section id="imoveis" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(15, 28, 53, 0.5), transparent)' }}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-tag">🏡 Imóveis</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        Oportunidades Selecionadas<br />
                        <span className="gradient-text">pra Você</span>
                    </h2>
                    <div className="gold-divider" />
                    <p className="body-lg" style={{ maxWidth: 540, margin: '1rem auto 0' }}>
                        Cada imóvel é escolhido a dedo pela nossa equipe
                    </p>
                </div>

                <div className="grid-3">
                    {propertiesData.slice(0, 3).map((p, i) => (
                        <div key={p.id} className={`property-card flex flex-col h-full reveal reveal-delay-${i + 1}`}>
                            <div className="property-image relative h-56 overflow-hidden">
                                {p.featuredImage ? (
                                    <img
                                        src={p.featuredImage}
                                        alt={p.titulo}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#111] flex items-center justify-center border-b border-white/10 group-hover:scale-110 transition-transform duration-700">
                                        <span className="text-[#C9A96E]/50 font-semibold text-sm flex items-center gap-2 opacity-70">📷 EM PREPARAÇÃO</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {p.destaque_texto && (
                                        <span className="px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">
                                            {p.destaque_texto}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="property-info p-6 flex flex-col flex-grow justify-between" style={{ minHeight: '220px' }}>
                                <div>
                                    <h3 className="property-title text-xl font-bold mb-2">{p.titulo}</h3>
                                    <div className="property-location text-gray-400 text-sm mb-4">
                                        <span>📍</span> {p.bairro}, {p.cidade}
                                    </div>
                                    <div className="property-price text-2xl font-bold text-secondary mb-4">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor_venda)}
                                    </div>
                                </div>

                                <Link
                                    to={`/imoveis/${p.id}`}
                                    className="btn btn-gold-outline w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 hover:border-white/20"
                                >
                                    Ver Detalhes do Imóvel →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal reveal-delay-4" style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/imoveis" className="btn btn-gold">
                        Ver Todos os Imóveis →
                    </Link>
                </div>
            </div>
        </section>
    );
}

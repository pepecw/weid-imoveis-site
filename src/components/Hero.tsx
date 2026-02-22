import { useEffect, useRef } from 'react';

interface HeroProps {
    onOpenQuiz: () => void;
}

const WA_LINK = 'https://wa.me/5547999999999?text=Olá!%20Quero%20conhecer%20imóveis%20da%20Weid%20Imóveis';

export function Hero({ onOpenQuiz }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const scrollY = window.scrollY;
                heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroRef.current.style.opacity = `${1 - scrollY / 700}`;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="hero">
            <div ref={heroRef} className="hero-content">
                {/* Logo */}
                <div className="hero-logo">
                    <div className="hero-logo-icon">W</div>
                    <span className="hero-logo-text">
                        Weid <span className="gradient-text">Imóveis</span>
                    </span>
                </div>

                {/* Tagline */}
                <h1 className="hero-tagline">
                    Seu novo endereço<br />
                    <span className="gradient-text">começa aqui</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle">
                    Imóveis selecionados em <strong style={{ color: '#C9A96E' }}>Joinville</strong> e <strong style={{ color: '#C9A96E' }}>Litoral Norte de SC</strong>
                </p>

                {/* Search Bar */}
                <div className="hero-search">
                    <div className="search-group">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>📍</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cidade</div>
                            <select className="search-select">
                                <option value="">Onde você quer morar?</option>
                                <option>Joinville</option>
                                <option>São Francisco do Sul</option>
                                <option>Barra Velha</option>
                                <option>Balneário Piçarras</option>
                            </select>
                        </div>
                    </div>
                    <div className="search-group">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>🏠</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</div>
                            <select className="search-select">
                                <option value="">Que tipo de imóvel?</option>
                                <option>Apartamento</option>
                                <option>Casa</option>
                                <option>Sobrado</option>
                                <option>Terreno</option>
                                <option>Comercial</option>
                            </select>
                        </div>
                    </div>
                    <div className="search-group">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>💰</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faixa de Preço</div>
                            <select className="search-select">
                                <option value="">Qual sua faixa?</option>
                                <option>Até R$200.000</option>
                                <option>R$200k – R$350k</option>
                                <option>R$350k – R$500k</option>
                                <option>Acima de R$500k</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ padding: '0.35rem' }}>
                        <a
                            href={WA_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-gold-shimmer"
                            style={{ borderRadius: '12px', whiteSpace: 'nowrap', minWidth: '120px' }}
                        >
                            🔍 Buscar
                        </a>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="hero-actions">
                    <a href="#imoveis"
                        className="btn btn-white-outline"
                        onClick={e => { e.preventDefault(); handleScroll('#imoveis'); }}>
                        Ver Imóveis
                    </a>
                    <a href={WA_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp">
                        <span>💬</span> Fale no WhatsApp
                    </a>
                    <button onClick={onOpenQuiz} className="btn btn-gold-outline">
                        ✨ Fazer Quiz
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" onClick={() => handleScroll('#imoveis')} style={{ cursor: 'pointer' }}>
                <div className="scroll-arrow" />
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>rolar para baixo</span>
            </div>
        </section>
    );
}

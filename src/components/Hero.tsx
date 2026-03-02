import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesData } from '../data/properties';

interface HeroProps {
    onOpenQuiz: () => void;
}

const ALL_CITIES = ['Joinville', 'São Francisco do Sul, SC', 'Barra Velha', 'Balneário Piçarras'];
const ALL_TYPES = ['Apartamento', 'Casa', 'Sobrado', 'Terreno', 'Comercial'];
const PRICE_RANGES = [
    { label: 'Até R$200.000', min: 0, max: 200000, value: '0-200' },
    { label: 'R$200k – R$350k', min: 200000, max: 350000, value: '200-350' },
    { label: 'R$350k – R$500k', min: 350000, max: 500000, value: '350-500' },
    { label: 'Acima de R$500k', min: 500000, max: 999999999, value: '500-plus' }
];

function abbreviateCity(city: string) {
    if (city === 'São Francisco do Sul, SC') return 'S. Francisco';
    if (city === 'Balneário Piçarras') return 'Bal. Piçarras';
    return city;
}

export function Hero({ onOpenQuiz }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [city, setCity] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');

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

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city) params.append('cidade', city);
        if (type) params.append('tipo', type);
        if (price) params.append('preco', price);
        navigate(`/imoveis?${params.toString()}`);
    };

    // Calculate dynamic counts
    const getPropertiesCount = (filterType: 'cidade' | 'tipo' | 'preco', value: string) => {
        return propertiesData.filter(p => {
            // Apply other active filters
            if (filterType !== 'cidade' && city && p.cidade !== city) return false;
            if (filterType !== 'tipo' && type && p.tipo_imovel !== type) return false;

            if (filterType !== 'preco' && price) {
                const range = PRICE_RANGES.find(r => r.value === price);
                if (range && (p.valor_venda < range.min || p.valor_venda >= range.max)) return false;
            }

            // Check current filter condition
            if (filterType === 'cidade') return p.cidade === value;
            if (filterType === 'tipo') return p.tipo_imovel === value;
            if (filterType === 'preco') {
                const range = PRICE_RANGES.find(r => r.value === value);
                return range ? (p.valor_venda >= range.min && p.valor_venda < range.max) : false;
            }
            return true;
        }).length;
    };

    return (
        <section id="hero" className="hero">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                style={{ zIndex: 0, pointerEvents: 'none' }}
                src="https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-exterior-aerial-view-39327-large.mp4"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark/60 via-dark/80 to-dark" style={{ zIndex: 1, pointerEvents: 'none' }} />

            <div ref={heroRef} className="hero-content relative z-10">
                <div className="hero-logo">
                    <div className="hero-logo-icon">W</div>
                    <span className="hero-logo-text">
                        Weid <span className="gradient-text">Imóveis</span>
                    </span>
                </div>

                <h1 className="hero-tagline">
                    Seu novo endereço<br />
                    <span className="gradient-text">começa aqui</span>
                </h1>

                <p className="hero-subtitle">
                    Imóveis selecionados em <strong style={{ color: '#C9A96E' }}>Joinville</strong> e <strong style={{ color: '#C9A96E' }}>Litoral Norte de SC</strong>
                </p>

                {/* Smart Search Bar */}
                <div className="hero-search">
                    <div className="search-group">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>📍</span>
                        <div style={{ flex: 1 }} className="min-w-0">
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="truncate">Cidade</div>
                            <select
                                className="search-select text-sm md:text-base outline-none cursor-pointer w-full text-ellipsis overflow-hidden"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option value="">Qualquer cidade</option>
                                {ALL_CITIES.map(c => {
                                    const count = getPropertiesCount('cidade', c);
                                    return (
                                        <option key={c} value={c} disabled={count === 0} style={{ color: count === 0 ? '#64748b' : 'inherit' }}>
                                            {abbreviateCity(c)} {count > 0 ? `(${count})` : '(0)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="search-group">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>🏠</span>
                        <div style={{ flex: 1 }} className="min-w-0">
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="truncate">Tipo</div>
                            <select
                                className="search-select text-sm md:text-base outline-none cursor-pointer w-full text-ellipsis overflow-hidden"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Qualquer tipo</option>
                                {ALL_TYPES.map(t => {
                                    const count = getPropertiesCount('tipo', t);
                                    return (
                                        <option key={t} value={t} disabled={count === 0} style={{ color: count === 0 ? '#64748b' : 'inherit' }}>
                                            {t} {count > 0 ? `(${count})` : '(0)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="search-group border-none">
                        <span className="search-icon" style={{ fontSize: '1.1rem' }}>💰</span>
                        <div style={{ flex: 1 }} className="min-w-0">
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="truncate">Faixa de Preço</div>
                            <select
                                className="search-select text-sm md:text-base outline-none cursor-pointer w-full text-ellipsis overflow-hidden"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            >
                                <option value="">Qualquer valor</option>
                                {PRICE_RANGES.map(r => {
                                    const count = getPropertiesCount('preco', r.value);
                                    return (
                                        <option key={r.value} value={r.value} disabled={count === 0} style={{ color: count === 0 ? '#64748b' : 'inherit' }}>
                                            {r.label} {count > 0 ? `(${count})` : '(0)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div style={{ padding: '0.35rem' }}>
                        <button
                            onClick={handleSearch}
                            className="btn btn-gold-shimmer flex items-center justify-center"
                            style={{ borderRadius: '12px', whiteSpace: 'nowrap', minWidth: '120px', height: '100%', border: 'none' }}
                        >
                            <span className="mr-2">🔍</span> Buscar
                        </button>
                    </div>
                </div>

                <div className="hero-actions">
                    <a href="#imoveis"
                        className="btn btn-white-outline"
                        onClick={e => { e.preventDefault(); navigate('/imoveis'); }}>
                        Ver Todos
                    </a>
                    <button onClick={onOpenQuiz} className="btn btn-gold-outline">
                        ✨ Encontrar Imóvel Ideal
                    </button>
                </div>
            </div>

            <div className="scroll-indicator" onClick={() => handleScroll('#imoveis')} style={{ cursor: 'pointer' }}>
                <div className="scroll-arrow" />
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem' }}>rolar para baixo</span>
            </div>
        </section>
    );
}

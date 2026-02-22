import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const testimonials = [
    {
        text: 'Nunca imaginei que comprar minha casa seria tão fácil. A Lia me atendeu pelo WhatsApp de noite e no outro dia eu já tinha as opções na mão!',
        name: 'Maria S.',
        city: 'Joinville',
        initials: 'MS',
        stars: 5,
    },
    {
        text: 'O Peterson me explicou tudo sobre o MCMV de um jeito que nenhum corretor tinha feito. Usei meu FGTS e nem precisei dar entrada do bolso!',
        name: 'Carlos M.',
        city: 'São Francisco do Sul',
        initials: 'CM',
        stars: 5,
    },
    {
        text: 'Achei o apartamento perfeito em menos de uma semana. O atendimento é outro nível.',
        name: 'Ana P.',
        city: 'Joinville',
        initials: 'AP',
        stars: 5,
    },
    {
        text: 'Processo super transparente. Desde o primeiro contato soube exatamente o que ia pagar. Recomendo sem dúvida!',
        name: 'João R.',
        city: 'Barra Velha',
        initials: 'JR',
        stars: 5,
    },
];

export function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);
    useScrollReveal();

    const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

    useEffect(() => {
        if (paused) return;
        intervalRef.current = setInterval(() => {
            setCurrent(c => (c + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [paused]);

    const getVisible = () => {
        const result = [];
        for (let i = 0; i < visibleCount; i++) {
            result.push(testimonials[(current + i) % testimonials.length]);
        }
        return result;
    };

    return (
        <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(15,28,53,0.4), transparent)' }}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-tag">💬 Depoimentos</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        O Que Dizem Nossos <span className="gradient-text">Clientes</span>
                    </h2>
                    <div className="gold-divider" />
                </div>

                <div
                    className="reveal"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(visibleCount, testimonials.length)}, 1fr)`,
                        gap: '1.5rem',
                        transition: 'all 0.5s ease',
                    }}>
                        {getVisible().map((t, i) => (
                            <div key={`${t.name}-${i}`} className="testimonial-card" style={{
                                animation: 'fadeInUp 0.5s ease',
                            }}>
                                <div className="stars">{'⭐'.repeat(t.stars)}</div>
                                <p className="testimonial-text" style={{ marginTop: '1rem' }}>"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.initials}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>📍 {t.city}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 3000); }}
                                style={{
                                    width: i === current ? 24 : 8,
                                    height: 8,
                                    borderRadius: 999,
                                    background: i === current ? '#C9A96E' : 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
    { end: 50, suffix: '+', label: 'Imóveis Disponíveis', icon: '🏠' },
    { end: 200, suffix: '+', label: 'Famílias Atendidas', icon: '👨‍👩‍👧‍👦' },
    { end: 98, suffix: '%', label: 'Satisfação dos Clientes', icon: '⭐' },
    { end: null, label: 'Resposta Garantida', icon: '⚡', special: '24h' },
];

function Counter({ end, suffix, special, active }: { end: number | null; suffix?: string; special?: string; active: boolean }) {
    const [value, setValue] = useState(0);
    const didRun = useRef(false);

    useEffect(() => {
        if (!active || didRun.current || end === null) return;
        didRun.current = true;

        const duration = 2000;
        const steps = 60;
        const increment = end / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setValue(end);
                clearInterval(timer);
            } else {
                setValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [active, end]);

    if (special) {
        return (
            <span className="stat-number" style={{ animation: active ? 'badge-pulse 1.5s ease-in-out 3' : 'none' }}>
                {special}
            </span>
        );
    }

    return (
        <span className="stat-number">
            {value}{suffix}
        </span>
    );
}

export function Stats() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    useScrollReveal();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActive(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section" ref={sectionRef} style={{
            background: 'linear-gradient(180deg, rgba(15,28,53,0.6), rgba(10,22,40,0.8))',
        }}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-tag">📊 Números</span>
                    <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
                        Resultados que <span className="gradient-text">Falam</span>
                    </h2>
                    <div className="gold-divider" />
                </div>
                <div className="grid-4" style={{ textAlign: 'center' }}>
                    {stats.map((stat, i) => (
                        <div key={stat.label}
                            className={`card-glass reveal reveal-delay-${i + 1}`}
                            style={{ padding: '2rem 1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                            <Counter end={stat.end} suffix={stat.suffix} special={stat.special} active={active} />
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
    {
        icon: '🔍',
        title: 'Descubra',
        text: 'Conte pra gente o que você procura. Nossa IA encontra as melhores opções em segundos.',
        animClass: 'pulse',
    },
    {
        icon: '❤️',
        title: 'Se Apaixone',
        text: 'Receba imóveis que combinam com você. Fotos, detalhes e localização na palma da mão.',
        animClass: 'heartbeat',
    },
    {
        icon: '✅',
        title: 'Simplifique',
        text: 'Cuidamos de toda a burocracia. Financiamento, documentação e aprovação sem dor de cabeça.',
        animClass: 'check',
    },
    {
        icon: '🔑',
        title: 'Realize',
        text: 'Receba suas chaves e comece uma nova história no seu novo lar.',
        animClass: 'spin',
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const connectorRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(-1);
    useScrollReveal();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const connector = connectorRef.current;
                    if (connector) connector.classList.add('animated');

                    // Stagger steps
                    steps.forEach((_, i) => {
                        setTimeout(() => setActiveStep(i), i * 400 + 200);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="como-funciona" className="section section-lg" ref={sectionRef}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-tag">⚡ Processo</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        Do Sonho às Chaves<br />
                        <span className="gradient-text">em 4 Passos</span>
                    </h2>
                    <div className="gold-divider" />
                    <p className="body-lg" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                        A gente simplifica o que parece complicado
                    </p>
                </div>

                {/* Desktop: horizontal */}
                <div className="mobile-hidden" style={{ position: 'relative' }}>
                    {/* Connector line */}
                    <div style={{
                        position: 'absolute',
                        top: '50px',
                        left: 'calc(12.5% + 36px)',
                        right: 'calc(12.5% + 36px)',
                        zIndex: 0,
                    }}>
                        <div className="process-connector" ref={connectorRef}>
                            <div className="process-connector-fill" />
                        </div>
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        {steps.map((step, i) => (
                            <div key={step.title}
                                className={`reveal reveal-delay-${i + 1} ${activeStep >= i ? 'step-active' : ''}`}
                                style={{ textAlign: 'center', padding: '0 1rem' }}>
                                <div className="step-icon-wrapper" style={{
                                    fontSize: activeStep >= i ? '2rem' : '1.75rem',
                                    filter: activeStep >= i ? 'drop-shadow(0 0 12px rgba(201,169,110,0.5))' : 'none',
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{
                                    width: 32, height: 32,
                                    background: activeStep >= i
                                        ? 'linear-gradient(135deg, #A8845A, #C9A96E)'
                                        : 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    fontWeight: 700, fontSize: '0.875rem',
                                    color: activeStep >= i ? '#0A1628' : '#94A3B8',
                                    transition: 'all 0.5s ease',
                                    border: activeStep >= i ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                }}>
                                    {i + 1}
                                </div>
                                <h3 className="heading-sm" style={{ marginBottom: '0.75rem', color: activeStep >= i ? '#C9A96E' : '#fff', transition: 'color 0.5s ease' }}>
                                    {step.title}
                                </h3>
                                <p className="body-sm">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: vertical */}
                <div className="md-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {steps.map((step, i) => (
                        <div key={step.title} style={{ display: 'flex', gap: '1.25rem' }}>
                            {/* Timeline */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{
                                    width: 44, height: 44,
                                    background: 'linear-gradient(135deg, #A8845A, #C9A96E)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    boxShadow: '0 0 20px rgba(201,169,110,0.3)',
                                }}>
                                    {step.icon}
                                </div>
                                {i < steps.length - 1 && (
                                    <div style={{ width: 2, flex: 1, background: 'linear-gradient(180deg, #C9A96E, rgba(201,169,110,0.1))', margin: '0.5rem 0', minHeight: 48 }} />
                                )}
                            </div>
                            {/* Content */}
                            <div style={{ paddingBottom: i < steps.length - 1 ? '2rem' : '0', paddingTop: '0.5rem' }}>
                                <h3 className="heading-sm" style={{ color: '#C9A96E', marginBottom: '0.5rem' }}>{step.title}</h3>
                                <p className="body-sm">{step.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

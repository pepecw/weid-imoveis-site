import { useScrollReveal } from '../hooks/useScrollReveal';


interface DiferenciaisProps {
    onOpenQuiz: () => void;
}

export function Diferenciais({ onOpenQuiz }: DiferenciaisProps) {
    useScrollReveal();

    return (
        <section id="diferenciais" className="section">
            <div className="container">
                {/* Quiz CTA Card */}
                <div className="reveal glass-gold" style={{
                    borderRadius: 24,
                    padding: '3rem',
                    textAlign: 'center',
                    marginBottom: '5rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(201,169,110,0.08), transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <span className="section-tag" style={{ marginBottom: '1.5rem' }}>✨ Quiz Gratuito</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        Descubra o Imóvel Ideal<br />
                        <span className="gradient-text">pra Você</span>
                    </h2>
                    <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto 2rem' }}>
                        Responda 5 perguntas rápidas e receba opções personalizadas no seu WhatsApp
                    </p>
                    <button onClick={onOpenQuiz} className="btn btn-gold-shimmer" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                        🚀 Começar Quiz Gratuito
                    </button>
                </div>

                {/* Diferenciais */}
                <div className="section-header reveal" style={{ marginBottom: '3rem' }}>
                    <span className="section-tag">⭐ Diferenciais</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        Por Que a <span className="gradient-text">Weid</span>?
                    </h2>
                    <div className="gold-divider" />
                    <p className="body-lg" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                        Experiência e atendimento focado nos seus objetivos
                    </p>
                </div>

                <div className="grid-2 md:grid-cols-4 gap-6">
                    {[
                        {
                            icon: '🤝',
                            title: 'Atendimento Personalizado',
                            text: 'Nossa equipe entende suas necessidades para encontrar o imóvel perfeito que se encaixe no seu orçamento e momento de vida.',
                            badge: 'Foco em Você',
                            badgeType: 'blue',
                        },
                        {
                            icon: '🛡️',
                            title: 'Transparência Total',
                            text: 'Sem surpresas. Explicamos todos os custos e processos com total clareza: entrada, parcelas e taxas. Tudo na mesa para você decidir.',
                            badge: 'Sem Letras Miúdas',
                            badgeType: 'gold',
                        },
                        {
                            icon: '📈',
                            title: 'Especialista em MCMV',
                            text: 'Dominamos o Minha Casa Minha Vida. Subsídio, FGTS, financiamento. Transformamos burocracia em oportunidade real.',
                            badge: 'Subsídio até R$55k',
                            badgeType: 'gold',
                        },
                        {
                            icon: '👓',
                            title: 'Visão do Futuro',
                            text: 'Transformamos virtualmente a casa desejada no seu lar dos sonhos antes mesmo da compra, para que você tenha total certeza da sua escolha.',
                            badge: 'Tecnologia 3D',
                            badgeType: 'blue',
                        },
                    ].map((card, i) => (
                        <div key={card.title} className={`card-glass reveal reveal-delay-${i + 1}`} style={{ padding: '2rem' }}>
                            <div style={{
                                width: 64, height: 64,
                                background: 'rgba(201,169,110,0.1)',
                                border: '1px solid rgba(201,169,110,0.2)',
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem',
                                marginBottom: '1.5rem',
                                transition: 'all 0.4s ease',
                            }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget;
                                    el.style.transform = 'rotate(12deg) scale(1.1)';
                                    el.style.background = 'rgba(201,169,110,0.2)';
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget;
                                    el.style.transform = 'none';
                                    el.style.background = 'rgba(201,169,110,0.1)';
                                }}
                            >
                                {card.icon}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <h3 className="heading-sm">{card.title}</h3>
                                <span className={`badge badge-${card.badgeType} badge-pulse`}>{card.badge}</span>
                            </div>
                            <p className="body-md">{card.text}</p>
                        </div>
                    ))}
                </div>

                {/* CTA bottom */}
                <div className="reveal" style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <a href={"https://wa.me/5547991523220?text=" + encodeURIComponent("Olá, Peterson! Vim pelo site da Weid Imóveis e quero um atendimento exclusivo.")} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ fontSize: '1.05rem' }}>
                        💬 Falar com o Peterson
                    </a>
                </div>
            </div>
        </section>
    );
}

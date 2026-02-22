import { useScrollReveal } from '../hooks/useScrollReveal';

const WA_LINK = 'https://wa.me/5547999999999?text=Olá!%20Quero%20conversar%20com%20a%20Lia%20da%20Weid%20Imóveis';

export function CTAFinal() {
    useScrollReveal();

    return (
        <section className="section section-lg" style={{
            background: 'linear-gradient(135deg, rgba(15,28,53,0.9), rgba(10,22,40,0.95))',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 600, height: 600,
                borderRadius: '50%',
                border: '1px solid rgba(201,169,110,0.05)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 400, height: 400,
                borderRadius: '50%',
                border: '1px solid rgba(201,169,110,0.08)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div className="reveal">
                    <span className="section-tag" style={{ marginBottom: '1.5rem' }}>🚀 Comece Hoje</span>
                    <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>
                        Pronto pra Encontrar<br />
                        <span className="gradient-text">Seu Novo Lar?</span>
                    </h2>
                    <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto 3rem' }}>
                        A sua mudança está a um clique
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href={WA_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp"
                            style={{ fontSize: '1.1rem', padding: '1rem 2.25rem', animation: 'float-pulse 2s ease-in-out infinite' }}
                        >
                            💬 Falar com a Lia no WhatsApp
                        </a>
                        <a href="#imoveis"
                            className="btn btn-gold-outline"
                            style={{ fontSize: '1.1rem', padding: '1rem 2.25rem' }}
                            onClick={e => { e.preventDefault(); document.querySelector('#imoveis')?.scrollIntoView({ behavior: 'smooth' }); }}>
                            🏡 Ver Todos os Imóveis
                        </a>
                    </div>

                    {/* Social */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', alignItems: 'center' }}>
                        <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Nos siga:</span>
                        <a href="https://instagram.com/weidimoveis" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                            </svg>
                        </a>
                        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </a>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
                        {[
                            { icon: '🔒', text: 'Dados protegidos' },
                            { icon: '⚡', text: 'Resposta em 24h' },
                            { icon: '🏆', text: 'CRECI-SC' },
                        ].map(badge => (
                            <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem' }}>
                                <span>{badge.icon}</span>
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

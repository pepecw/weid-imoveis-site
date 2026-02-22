import { useScrollReveal } from '../hooks/useScrollReveal';

export function About() {
    useScrollReveal();

    return (
        <section id="sobre" className="section section-lg">
            <div className="container">
                <div className="grid-2" style={{ gap: '4rem' }}>
                    {/* Photo Column */}
                    <div className="reveal-left" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', maxWidth: 420 }}>
                            {/* Gold frame */}
                            <div style={{
                                position: 'absolute',
                                top: '-16px', left: '-16px',
                                right: '16px', bottom: '-16px',
                                border: '2px solid rgba(201,169,110,0.3)',
                                borderRadius: 24,
                                zIndex: 0,
                            }} />
                            <img
                                src="/peterson.png"
                                alt="Peterson Rosa - Fundador da Weid Imóveis"
                                style={{
                                    width: '100%',
                                    borderRadius: 20,
                                    objectFit: 'cover',
                                    position: 'relative',
                                    zIndex: 1,
                                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(201,169,110,0.15)',
                                }}
                            />
                            {/* Badge */}
                            <div className="glass-gold" style={{
                                position: 'absolute',
                                bottom: '-20px',
                                right: '-12px',
                                padding: '0.875rem 1.25rem',
                                borderRadius: 16,
                                zIndex: 2,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏆</div>
                                <div style={{ fontWeight: 700, color: '#C9A96E', fontSize: '0.875rem' }}>+200 Famílias</div>
                                <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Atendidas</div>
                            </div>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className="section-tag" style={{ marginBottom: '1.25rem', alignSelf: 'flex-start' }}>👋 Fundador</span>
                        <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Peterson Rosa</h2>
                        <p style={{ color: '#C9A96E', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Fundador da Weid Imóveis
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <p className="body-lg">
                                Acredito que comprar um imóvel não precisa ser complicado.
                            </p>
                            <p className="body-md">
                                Criei a Weid Imóveis pra juntar o melhor da tecnologia com atendimento de verdade. Aqui você não é um número — é uma pessoa com um sonho, e meu trabalho é transformar esse sonho em endereço.
                            </p>
                            <p className="body-md">
                                Seja seu primeiro apartamento pelo MCMV ou um investimento estratégico no litoral, estou aqui pra guiar cada passo.
                            </p>
                        </div>

                        {/* Signature */}
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            background: 'rgba(201,169,110,0.06)',
                            border: '1px solid rgba(201,169,110,0.15)',
                            borderRadius: 16,
                            display: 'inline-flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                        }}>
                            <span style={{ fontSize: '2rem', fontFamily: "'Dancing Script', cursive", color: '#C9A96E', lineHeight: 1 }}>
                                Peterson
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>CRECI-SC #12345-F</span>
                        </div>

                        {/* Quick stats */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            {[
                                { value: '5+', label: 'Anos de exp.' },
                                { value: 'MCMV', label: 'Especialista' },
                                { value: '24h', label: 'Resposta' },
                            ].map(item => (
                                <div key={item.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#C9A96E' }}>{item.value}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

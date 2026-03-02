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
                                alt="Peterson Weidgennant - Fundador da Weid Imóveis"
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
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🤝</div>
                                <div style={{ fontWeight: 700, color: '#C9A96E', fontSize: '0.875rem' }}>Especialista</div>
                                <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>em Joinville</div>
                            </div>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className="section-tag" style={{ marginBottom: '1.25rem', alignSelf: 'flex-start' }}>👋 Fundador</span>
                        <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Peterson Weidgennant</h2>
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
                                { value: '100%', label: 'Transparência' },
                                { value: 'MCMV', label: 'Especialista' },
                                { value: '24/7', label: 'Suporte' },
                            ].map(item => (
                                <div key={item.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#C9A96E' }}>{item.value}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Parceria Sublime Imóveis */}
                <div className="reveal mt-20 p-8 glass-dark rounded-3xl border border-white/10 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="md:w-1/3 flex justify-center">
                            <div className="w-24 h-24 bg-dark border border-gold/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,169,110,0.15)]">
                                <span className="text-3xl">🏢</span>
                            </div>
                        </div>
                        <div className="md:w-2/3 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Parceiro Oficial <span className="text-gold">Sublime Imóveis</span>
                            </h3>
                            <p className="text-gray-400 mb-4 text-sm md:text-base leading-relaxed">
                                Para garantir a maior segurança jurídica, um portfólio robusto e a melhor estrutura física para os nossos clientes, a Weid Imóveis atua em parceria forte e direta com a renomada Sublime Imóveis. Reuniões presenciais e assinaturas de contratos são realizadas na nossa sede oficial parceira.
                            </p>
                            <div className="inline-flex items-center gap-2 text-sm text-gray-300 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                                <span className="text-gold">📍</span> Base de Operações Integrada
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

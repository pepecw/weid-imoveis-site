import { useScrollReveal } from '../hooks/useScrollReveal';

const WA_LINK = 'https://wa.me/5547999999999?text=Olá!%20Quero%20conhecer%20imóveis%20da%20Weid%20Imóveis';

const properties = [
    {
        id: 1,
        image: '/property_sobrado.png',
        badge: { text: 'Destaque', type: 'gold' },
        title: 'Sobrado Moderno com Jardim',
        location: 'Iririú, Joinville',
        price: 'R$ 340.000',
        details: { quartos: 3, banheiros: 2, vagas: 2, area: '110m²' },
        tag: 'MCMV Faixa 3',
    },
    {
        id: 2,
        image: '/property_apartment.png',
        badge: { text: 'Novo', type: 'blue' },
        title: 'Apartamento Luminoso no Centro',
        location: 'Centro, Joinville',
        price: 'R$ 215.000',
        details: { quartos: 2, banheiros: 2, vagas: 1, area: '64m²' },
        tag: 'MCMV Faixa 2',
    },
    {
        id: 3,
        image: '/property_beach.png',
        badge: { text: 'Exclusivo', type: 'gold' },
        title: 'Casa Contemporânea no Litoral',
        location: 'São Francisco do Sul, SC',
        price: 'R$ 480.000',
        details: { quartos: 3, banheiros: 3, vagas: 2, area: '140m²' },
        tag: 'Financiamento SBPE',
    },
];

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
                    {properties.map((p, i) => (
                        <div key={p.id} className={`property-card reveal reveal-delay-${i + 1}`}>
                            <div className="property-image">
                                <img src={p.image} alt={p.title} loading="lazy" />
                                <div className="property-badge">
                                    <span className={`badge badge-${p.badge.type}`}>{p.badge.text}</span>
                                </div>
                                {/* Tag overlay */}
                                <div style={{
                                    position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                                    background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(8px)',
                                    padding: '0.25rem 0.75rem', borderRadius: '999px',
                                    fontSize: '0.7rem', fontWeight: 600, color: '#C9A96E',
                                    border: '1px solid rgba(201,169,110,0.3)',
                                }}>
                                    {p.tag}
                                </div>
                            </div>
                            <div className="property-info">
                                <h3 className="property-title">{p.title}</h3>
                                <div className="property-location">
                                    <span>📍</span> {p.location}
                                </div>
                                <div className="property-price">{p.price}</div>
                                <div className="property-details">
                                    <span className="property-detail">🛏 {p.details.quartos} quartos</span>
                                    <span className="property-detail">🚿 {p.details.banheiros} ban.</span>
                                    <span className="property-detail">🚗 {p.details.vagas} vaga</span>
                                    <span className="property-detail">📐 {p.details.area}</span>
                                </div>
                                <a
                                    href={`${WA_LINK}&text=Olá!%20Tenho%20interesse%20no%20imóvel:%20${encodeURIComponent(p.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-gold-outline"
                                    style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem' }}
                                >
                                    Ver Detalhes →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal reveal-delay-4" style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                        Ver Todos os Imóveis →
                    </a>
                </div>
            </div>
        </section>
    );
}

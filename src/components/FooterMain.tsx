const WA_LINK = 'https://wa.me/5547991523220?text=' + encodeURIComponent('Olá, Peterson! Vim pelo site da Weid Imóveis e gostaria de conversar.');

const footerLinks = ['Imóveis', 'Como Funciona', 'Quiz', 'Calculadora', 'Sobre'];
const footerAnchors: Record<string, string> = {
    'Imóveis': '#imoveis',
    'Como Funciona': '#como-funciona',
    'Quiz': '#quiz',
    'Calculadora': '#calculadora',
    'Sobre': '#sobre',
};

export function FooterMain() {
    const handleNav = (anchor: string) => {
        if (anchor === '#quiz') return; // handled by quiz button
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
                    {/* Col 1 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: 36, height: 36,
                                background: 'linear-gradient(135deg, #A8845A, #C9A96E)',
                                borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: '1.1rem', color: '#0A1628',
                            }}>W</div>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                                Weid <span style={{ color: '#C9A96E' }}>Imóveis</span>
                            </span>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Seu novo endereço começa aqui.<br />
                            Imóveis em Joinville e Litoral Norte SC.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a href="https://instagram.com/weidimoveis" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                                </svg>
                            </a>
                            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Col 2 */}
                    <div>
                        <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Links
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {footerLinks.map(link => (
                                <a
                                    key={link}
                                    href={footerAnchors[link]}
                                    className="footer-link"
                                    onClick={e => { e.preventDefault(); handleNav(footerAnchors[link]); }}
                                >
                                    → {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 */}
                    <div>
                        <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Contato
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[
                                { icon: '📱', label: 'WhatsApp', value: '(47) 99152-3220', href: WA_LINK },
                                { icon: '📧', label: 'Email', value: 'contato@weidimoveis.com.br', href: 'mailto:contato@weidimoveis.com.br' },
                                { icon: '📍', label: 'Localização', value: 'Joinville — SC', href: null },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '1rem', marginTop: '1px' }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1px' }}>{item.label}</div>
                                        {item.href ? (
                                            <a href={item.href} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: '#94A3B8' }}>
                                                {item.value}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{item.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}>
                    <p style={{ color: '#64748B', fontSize: '0.8rem' }}>
                        © 2026 Weid Imóveis. Todos os direitos reservados.
                    </p>
                    <p style={{ color: '#64748B', fontSize: '0.8rem' }}>
                        Feito com 💙 para o seu futuro
                    </p>
                </div>
            </div>
        </footer>
    );
}

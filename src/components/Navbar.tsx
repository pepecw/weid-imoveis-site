import { useState, useEffect } from 'react';

interface NavbarProps {
    onOpenQuiz: () => void;
}

const navLinks = [
    { label: 'Imóveis', href: '#imoveis' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Calculadora', href: '#calculadora' },
    { label: 'Sobre', href: '#sobre' },
];

export function Navbar({ onOpenQuiz }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <a href="#hero" onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #A8845A, #C9A96E)',
                            borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '1.1rem', color: '#0A1628',
                        }}>W</div>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff' }}>
                            Weid <span style={{ color: '#C9A96E' }}>Imóveis</span>
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href}
                                className="nav-link"
                                onClick={e => { e.preventDefault(); handleNavClick(link.href); }}>
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={onOpenQuiz}
                            style={{ marginLeft: '0.5rem', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer' }}
                            className="nav-link"
                        >
                            Quiz
                        </button>
                    </div>

                    {/* Desktop CTA */}
                    <a
                        href="https://wa.me/5547999999999?text=Olá!%20Quero%20conhecer%20imóveis%20da%20Weid"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp mobile-hidden"
                        style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
                    >
                        <span>💬</span> Fale no WhatsApp
                    </a>

                    {/* Hamburger */}
                    <button
                        className="md-hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '5px',
                            padding: '4px',
                        }}
                    >
                        {[0, 1, 2].map(i => (
                            <span key={i} style={{
                                display: 'block', width: 24, height: 2,
                                background: '#fff', borderRadius: 2,
                                transition: 'all 0.3s ease',
                                transform: menuOpen
                                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                                        : i === 1 ? 'scaleX(0)'
                                            : 'rotate(-45deg) translate(5px, -5px)'
                                    : 'none',
                                opacity: menuOpen && i === 1 ? 0 : 1,
                            }} />
                        ))}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu-overlay md-hidden">
                    {navLinks.map((link, i) => (
                        <a key={link.href} href={link.href}
                            className="mobile-nav-link"
                            style={{ animationDelay: `${i * 0.1}s` }}
                            onClick={e => { e.preventDefault(); handleNavClick(link.href); }}>
                            {link.label}
                        </a>
                    ))}
                    <button onClick={() => { setMenuOpen(false); onOpenQuiz(); }}
                        className="mobile-nav-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A96E', fontSize: '1.75rem', fontWeight: 700 }}>
                        Quiz
                    </button>
                    <a
                        href="https://wa.me/5547999999999?text=Olá!%20Quero%20conhecer%20imóveis%20da%20Weid"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                        style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '0.875rem 2rem' }}
                        onClick={() => setMenuOpen(false)}
                    >
                        💬 Fale no WhatsApp
                    </a>
                </div>
            )}
        </>
    );
}

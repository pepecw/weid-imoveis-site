import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
    onOpenQuiz: () => void;
}

const WA_LINK = 'https://wa.me/5547991523220?text=' + encodeURIComponent('Olá, Peterson! Vim pelo site da Weid Imóveis.');

const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Imóveis', href: '/imoveis' },
    { label: 'Como Funciona', href: '/#como-funciona' },
    { label: 'Sobre', href: '/#sobre' },
];

export function Navbar({ onOpenQuiz }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Handle body scroll lock
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // Handle scroll if nav opened with hash
        if (location.hash) {
            setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        return () => window.removeEventListener('scroll', onScroll);
    }, [location]);

    const handleNavClick = (href: string) => {
        setMenuOpen(false);
        if (href.startsWith('/#')) {
            const hash = href.substring(1);
            if (location.pathname === '/') {
                const el = document.querySelector(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(href);
            }
        } else if (href.startsWith('#')) {
            if (location.pathname === '/') {
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(`/${href}`);
            }
        } else {
            navigate(href);
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link to="/" onClick={() => setMenuOpen(false)}
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
                    </Link>

                    {/* Hamburger Button */}
                    <button
                        className="flex flex-col gap-[6px] p-2 bg-transparent border border-white/10 rounded-lg cursor-pointer z-[8100] hover:bg-white/5 transition-colors relative"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span style={{
                            display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2,
                            transition: 'all 0.3s ease',
                            transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none'
                        }} />
                        <span style={{
                            display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2,
                            transition: 'all 0.3s ease',
                            opacity: menuOpen ? 0 : 1
                        }} />
                        <span style={{
                            display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2,
                            transition: 'all 0.3s ease',
                            transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none'
                        }} />
                    </button>
                </div>
            </nav>

            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[8040] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* Sliding Side Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-[300px] max-w-[80vw] bg-[#0A1628] border-l border-white/10 z-[8050] flex flex-col pt-24 px-8 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href}
                        className="text-2xl font-bold text-white mb-6 hover:text-gold transition-colors"
                        onClick={e => { e.preventDefault(); handleNavClick(link.href); }}>
                        {link.label}
                    </a>
                ))}

                <button onClick={() => { setMenuOpen(false); onOpenQuiz(); }}
                    className="text-2xl text-left font-bold text-gold mb-12 bg-transparent border-none cursor-pointer hover:scale-105 transition-transform origin-left w-fit p-0"
                >
                    Quiz
                </button>

                <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 text-base font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-full py-3 px-6 transition-all mt-auto mb-10 w-full"
                    onClick={() => setMenuOpen(false)}
                >
                    <span className="text-xl">💬</span> Falar com o Peterson
                </a>
            </div>
        </>
    );
}

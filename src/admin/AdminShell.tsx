import { type ReactNode } from 'react';
import { useAuth } from './AdminAuth';
import { AdminLogin } from './AdminLogin';
import { LayoutDashboard, PlusCircle, FileText, LogOut, Users } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface AdminShellProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { label: 'Painel', icon: LayoutDashboard, path: '/admin' },
    { label: 'Leads', icon: Users, path: '/admin/leads' },
    { label: 'Cadastrar', icon: PlusCircle, path: '/admin/cadastrar' },
    { label: 'Copys', icon: FileText, path: '/admin/copys' },
];

export function AdminShell({ children }: AdminShellProps) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    if (!isAuthenticated) return <AdminLogin />;

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    return (
        <div className="min-h-screen flex flex-col"
            style={{ background: '#060d1a', fontFamily: "'Outfit', system-ui, sans-serif" }}>

            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/5"
                style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="flex items-center gap-2">
                    <span className="text-[#C9A96E] font-black text-lg tracking-tight">WEID</span>
                    <span className="text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-700">ADMIN</span>
                </div>
                <button onClick={handleLogout}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors text-sm"
                    title="Sair">
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Sair</span>
                </button>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto pb-28 px-4 pt-6 max-w-2xl mx-auto w-full">
                {children}
            </main>

            {/* Bottom Navigation Bar (Mobile App Style) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
                style={{
                    background: 'rgba(6,13,26,0.97)',
                    backdropFilter: 'blur(16px)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: 'env(safe-area-inset-bottom, 12px)',
                    paddingTop: '10px',
                }}>
                {NAV_ITEMS.map(item => {
                    const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    return (
                        <Link to={item.path}
                            key={item.path}
                            className={`flex flex-col items-center gap-1 min-w-[64px] py-1 px-3 rounded-xl transition-all ${active ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                            <div className={`p-2 rounded-xl transition-all ${active ? 'bg-[#C9A96E]/15' : ''}`}>
                                <item.icon size={22} className={active ? 'text-[#C9A96E]' : 'text-gray-400'} />
                            </div>
                            <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-[#C9A96E]' : 'text-gray-500'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

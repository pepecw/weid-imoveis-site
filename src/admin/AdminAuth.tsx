import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string;
const SESSION_KEY = 'weid_admin_session';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session === 'true') setIsAuthenticated(true);
    }, []);

    const login = (email: string, pass: string): boolean => {
        if (email.trim() === ADMIN_EMAIL && pass === ADMIN_PASS) {
            setIsAuthenticated(true);
            sessionStorage.setItem(SESSION_KEY, 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}

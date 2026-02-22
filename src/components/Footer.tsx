import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-8 bg-black text-center border-t border-white/5 px-6">
            <h3 className="text-white font-bold text-lg mb-1">Peterson Weidgennant</h3>
            <p className="text-gray-500 text-sm mb-4">CRECI/SC 12345-F</p>
            <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} Weid Imóveis. Todos os direitos reservados.
            </p>
        </footer>
    );
};

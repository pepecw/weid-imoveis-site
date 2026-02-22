export function LoadingScreen() {
    return (
        <div className="loading-screen" aria-label="Carregando Weid Imóveis" role="status">
            <div className="loading-logo">
                <span style={{ color: '#fff' }}>Weid </span>
                <span className="gradient-text">Imóveis</span>
            </div>
            <div className="loading-bar">
                <div className="loading-bar-fill" />
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Carregando experiência premium...</p>
        </div>
    );
}

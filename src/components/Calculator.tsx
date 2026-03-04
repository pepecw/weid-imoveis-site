import { useState, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const WA_LINK = 'https://wa.me/5547991523220?text=';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

function calcMCMVFaixa(renda: number) {
    if (renda <= 2640) return 'MCMV Faixa 1';
    if (renda <= 4400) return 'MCMV Faixa 2';
    if (renda <= 8000) return 'MCMV Faixa 3';
    return 'Financiamento SBPE';
}

// Updated to more closely match Caixa simulations
function calcResults(renda: number, entrada: number, fgts: number) {
    // Estimativa baseada na Caixa (ex: Renda 3800 -> Parcela ~1020 -> Financia ~168k)
    const parcelaMax = renda * 0.27; // Comprometimento ideal em torno de 27%
    const valorFinanciado = parcelaMax * 163; // Multiplicador base para prazo de 420 meses

    // O poder de compra é o que o banco financia + o que o cliente tem em mãos
    const poderCompra = valorFinanciado + entrada + fgts;
    const programa = calcMCMVFaixa(renda);

    return {
        poderCompra: Math.round(poderCompra / 1000) * 1000,
        valorFinanciado: Math.round(valorFinanciado / 1000) * 1000,
        parcela: Math.round(parcelaMax),
        programa,
    };
}

export function Calculator() {
    const [renda, setRenda] = useState(3000);
    const [entrada, setEntrada] = useState(20000);
    const [hasFgts, setHasFgts] = useState(false);
    const [fgtsValue, setFgtsValue] = useState(15000);
    const [updated, setUpdated] = useState(false);

    useScrollReveal();

    const triggerUpdate = useCallback(() => {
        setUpdated(true);
        setTimeout(() => setUpdated(false), 500);
    }, []);

    const { poderCompra, valorFinanciado, parcela, programa } = calcResults(renda, entrada, hasFgts ? fgtsValue : 0);

    const waMsg = encodeURIComponent(
        `Olá, Peterson! Usei a calculadora do site e gostaria de simular com mais detalhes.\n\nRenda R$: ${formatCurrency(renda)}\nEntrada R$: ${formatCurrency(entrada)}\nFGTS R$: ${hasFgts ? formatCurrency(fgtsValue) : '0'}\nPrograma: ${programa}\nPoder de Compra Real: ${formatCurrency(poderCompra)}`
    );

    return (
        <section id="calculadora" className="section section-lg" style={{ background: 'linear-gradient(180deg, transparent, rgba(15,28,53,0.5), transparent)' }}>
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-tag">🧮 Calculadora</span>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>
                        Quanto Eu Consigo <span className="gradient-text">Financiar?</span>
                    </h2>
                    <div className="gold-divider" />
                    <p className="body-lg" style={{ maxWidth: 480, margin: '1rem auto 0' }}>
                        Descubra em 10 segundos. Sem cadastro.
                    </p>
                </div>

                <div className="reveal" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div className="card-glass" style={{ padding: '2.5rem' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left: Inputs */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Renda */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <label style={{ fontWeight: 600, color: '#fff' }}>Renda familiar</label>
                                        <span style={{ color: '#C9A96E', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(renda)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1500} max={15000} step={100}
                                        value={renda}
                                        onChange={e => { setRenda(+e.target.value); triggerUpdate(); }}
                                        style={{ '--fill': `${((renda - 1500) / (15000 - 1500)) * 100}%` } as React.CSSProperties}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                        <span>R$1.500</span><span>R$15.000</span>
                                    </div>
                                </div>

                                {/* Entrada */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <label style={{ fontWeight: 600, color: '#fff' }}>Valor de entrada</label>
                                        <span style={{ color: '#C9A96E', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(entrada)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0} max={100000} step={1000}
                                        value={entrada}
                                        onChange={e => { setEntrada(+e.target.value); triggerUpdate(); }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                        <span>R$0</span><span>R$100.000</span>
                                    </div>
                                </div>

                                {/* FGTS toggle */}
                                <div>
                                    <label style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: '0.75rem' }}>Tem FGTS disponível?</label>
                                    <div
                                        className="toggle-wrapper"
                                        onClick={() => { setHasFgts(!hasFgts); triggerUpdate(); }}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                    >
                                        <div className={`toggle-track ${hasFgts ? 'active' : ''}`}>
                                            <div className="toggle-thumb" />
                                        </div>
                                        <span style={{ color: hasFgts ? '#C9A96E' : '#94A3B8', fontWeight: 600, transition: 'color 0.3s' }}>
                                            {hasFgts ? 'Sim, tenho FGTS' : 'Não tenho'}
                                        </span>
                                    </div>
                                    {hasFgts && (
                                        <div style={{ marginTop: '1.25rem', animation: 'fadeIn 0.3s' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <label style={{ fontWeight: 600, color: '#fff' }}>Saldo do FGTS</label>
                                                <span style={{ color: '#C9A96E', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(fgtsValue)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={0} max={100000} step={1000}
                                                value={fgtsValue}
                                                onChange={e => { setFgtsValue(+e.target.value); triggerUpdate(); }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                                <span>R$0</span><span>R$100.000</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Result */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className={`calc-result ${updated ? 'updated' : ''}`}>
                                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Poder de Compra (Valor do Imóvel)
                                    </div>
                                    <div style={{
                                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                        fontWeight: 900,
                                        color: '#C9A96E',
                                        lineHeight: 1.1,
                                        marginBottom: '1rem',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        {formatCurrency(poderCompra)}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Limite de Financiamento</span>
                                            <span style={{ color: '#fff', fontWeight: 700 }}>{formatCurrency(valorFinanciado)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Parcela estimada</span>
                                            <span style={{ color: '#fff', fontWeight: 700 }}>{formatCurrency(parcela)}/mês</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'rgba(201,169,110,0.08)', borderRadius: 10, border: '1px solid rgba(201,169,110,0.2)' }}>
                                            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Programa</span>
                                            <span style={{ color: '#C9A96E', fontWeight: 700, fontSize: '0.875rem' }}>{programa}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={`${WA_LINK}${waMsg}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-whatsapp"
                                        style={{ width: '100%', fontSize: '0.9rem' }}
                                    >
                                        💬 Simular com detalhes
                                    </a>
                                </div>

                                <p style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center', marginTop: '1rem' }}>
                                    * Estimativa simplificada. Sujeita à análise de crédito.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { useState, useMemo } from 'react';
import {
    Sparkles, Copy, CheckCheck, Calculator,
    ChevronDown, ChevronUp, Building2, MapPin,
    BedDouble, Bath, Car, TrendingUp, Info,
    Percent, DollarSign, Calendar, Landmark, Users
} from 'lucide-react';
import propertiesData from '../../data/properties.json';

/* ─── Tipo ───────────────────────────────────────────── */
interface Property {
    id: string;
    titulo: string;
    tipo_imovel: string;
    bairro: string;
    cidade: string;
    valor_venda: number;
    status: string;
    area_principal: number;
    quartos: number;
    banheiros: number;
    vagas_garagem: number;
    featuredImage: string;
    codigo_interno: string;
    descricao_ia?: string;
    composicao?: string[];
    condicoes_pagamento?: string;
    aceita_financiamento?: boolean;
    aceita_permuta?: boolean;
    imovel_padrao?: string;
}

type Tab = 'copys' | 'calc';

/* ─── Tabelas MCMV 2026 (Atualizadas) ────────────────────
   Atualizadas com as novas faixas de 2026 (Faixa 1 ampliada, 
   Faixa 3 ampliada e nova Faixa 4).
─────────────────────────────────────────────────────── */
const FAIXAS_MCMV = [
    { label: 'Faixa 1 — Renda até R$ 2.850', juros: 4.25, teto: 200000, subsidio: '⬆️ Máximo (até R$ 55.000)' },
    { label: 'Faixa 2 — Renda até R$ 4.700', juros: 7.66, teto: 280000, subsidio: '⬆️ Parcial' },
    { label: 'Faixa 3 — Renda até R$ 8.600', juros: 8.16, teto: 350000, subsidio: '❌ Sem subsídio' },
    { label: 'Faixa 4 — Classe Média (até 12k)', juros: 10.99, teto: 600000, subsidio: '❌ Sem subsídio' },
];

/* ─── Helpers ────────────────────────────────────────── */
function formatBRL(v: number, decimals = 0) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: decimals });
}

/** Calcula parcela Price (parcelas fixas) */
function calcParcelaPrice(pv: number, taxaAno: number, meses: number): number {
    if (pv <= 0 || meses <= 0) return 0;
    const i = taxaAno / 100 / 12;
    if (i === 0) return pv / meses;
    const fator = Math.pow(1 + i, meses);
    return (pv * i * fator) / (fator - 1);
}

/** Calcula primeira parcela SAC (decrescente) */
function calcPrimeiraParcelaSAC(pv: number, taxaAno: number, meses: number): number {
    if (pv <= 0 || meses <= 0) return 0;
    const amortizacao = pv / meses;
    const i = taxaAno / 100 / 12;
    const jurosPrimeiroMes = pv * i;
    return amortizacao + jurosPrimeiroMes;
}

/** Gera o super-prompt para o Gemini */
function buildGeminiPrompt(p: Property): string {
    const lines: string[] = [
        '👤 Você é um especialista em vendas imobiliárias de alto desempenho.',
        'Com base nos dados abaixo, crie:',
        '1. Um post persuasivo para Instagram (máx. 5 linhas + emojis + chamada pra ação)',
        '2. Uma descrição completa para site (2-3 parágrafos, SEO-friendly)',
        '3. Uma mensagem de WhatsApp descontraída para atrair leads frios',
        '',
        '📋 DADOS DO IMÓVEL:',
        `• Código: ${p.codigo_interno}`,
        `• Título: ${p.titulo}`,
        `• Tipo: ${p.tipo_imovel}${p.imovel_padrao ? ' · Padrão ' + p.imovel_padrao : ''}`,
        `• Preço: ${formatBRL(p.valor_venda)}`,
        `• Localização: ${p.bairro}, ${p.cidade}`,
        p.area_principal > 0 ? `• Área: ${p.area_principal}m²` : null,
        p.quartos > 0 ? `• Quartos: ${p.quartos}` : null,
        p.banheiros > 0 ? `• Banheiros: ${p.banheiros}` : null,
        p.vagas_garagem > 0 ? `• Vagas: ${p.vagas_garagem}` : null,
        p.aceita_financiamento ? '• ✅ Aceita financiamento' : null,
        p.aceita_permuta ? '• ✅ Aceita permuta' : null,
        p.condicoes_pagamento ? `• Condições: ${p.condicoes_pagamento}` : null,
        '',
        p.descricao_ia ? `📝 DESCRIÇÃO ATUAL (melhore-a):\n${p.descricao_ia}` : null,
        p.composicao?.length ? `🏗 COMPOSIÇÃO:\n${p.composicao.join('\n')}` : null,
        '',
        '⚡ Seja direto, persuasivo e mostre o valor real do imóvel. Use o nome "Peterson Weid" como corretor de referência.',
    ].filter(Boolean) as string[];

    return lines.join('\n');
}

/* ════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════════════*/
export function AdminCopys() {
    const [tab, setTab] = useState<Tab>('calc');

    return (
        <div className="flex flex-col gap-5 pb-20">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">✨ Utilidades</h1>
                <p className="text-gray-500 text-sm mt-0.5">Gerador de textos IA + Calculadora Corretor Pro</p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {([
                    { id: 'copys', label: '🤖 Copiar para IA', icon: Sparkles },
                    { id: 'calc', label: '📐 Calculadora Pro', icon: Calculator },
                ] as { id: Tab; label: string; icon: React.ElementType }[]).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                            background: tab === t.id ? 'rgba(201,169,110,0.12)' : 'transparent',
                            color: tab === t.id ? '#C9A96E' : '#4b5563',
                            border: tab === t.id ? '1px solid rgba(201,169,110,0.3)' : '1px solid transparent',
                        }}>
                        <t.icon size={15} />
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'copys' && <CopysTab />}
            {tab === 'calc' && <CalcTab />}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   ABA 1: COPIAR PARA IA
───────────────────────────────────────────────────────── */
function CopysTab() {
    const properties = propertiesData as Property[];
    const active = properties.filter(p => p.status === 'Disponível' || !p.status);

    return (
        <div className="flex flex-col gap-4">
            {/* Instrução */}
            <div className="rounded-2xl p-4 border border-[#C9A96E]/20 flex items-start gap-3"
                style={{ background: 'rgba(201,169,110,0.05)' }}>
                <Sparkles size={18} className="text-[#C9A96E] mt-0.5 shrink-0" />
                <div>
                    <p className="text-[#C9A96E] font-bold text-sm">Como usar</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        Aperte <strong className="text-gray-400">Copiar Resumo →</strong> minimize o app,
                        abra o <strong className="text-gray-400">Gemini</strong> no celular e cole.
                        Você recebe 3 peças de copy prontas <strong className="text-[#C9A96E]">de graça</strong>.
                    </p>
                </div>
            </div>

            {active.length === 0 ? (
                <div className="rounded-2xl p-8 border border-white/5 flex flex-col items-center gap-3 text-center"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Building2 size={28} className="text-gray-700" />
                    <p className="text-gray-600 text-sm">Nenhum imóvel disponível no estoque</p>
                </div>
            ) : (
                active.map(p => <CopyCard key={p.id} property={p} />)
            )}
        </div>
    );
}

function CopyCard({ property: p }: { property: Property }) {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const prompt = useMemo(() => buildGeminiPrompt(p), [p]);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className="rounded-2xl border border-white/5 overflow-hidden transition-all"
            style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="flex gap-3 p-4">
                {/* Thumb */}
                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {p.featuredImage
                        ? <img src={p.featuredImage} alt="" className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        : <div className="w-full h-full flex items-center justify-center">
                            <Building2 size={20} className="text-gray-700" />
                        </div>
                    }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <span className="text-[10px] font-black text-[#C9A96E]/70 tracking-widest">{p.codigo_interno}</span>
                            <p className="text-white font-bold text-sm leading-tight line-clamp-1 mt-0.5">{p.titulo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={10} className="text-gray-600 shrink-0" />
                        <p className="text-gray-500 text-xs truncate">{p.bairro} · {p.cidade}</p>
                    </div>
                    <p className="text-[#C9A96E] font-black text-sm mt-1">{formatBRL(p.valor_venda)}</p>
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 px-4 pb-4">
                <button onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all active:scale-[0.97]"
                    style={{
                        background: copied ? 'rgba(52,211,153,0.12)' : 'linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(232,200,135,0.1) 100%)',
                        border: copied ? '1.5px solid rgba(52,211,153,0.4)' : '1.5px solid rgba(201,169,110,0.3)',
                        color: copied ? '#34d399' : '#C9A96E',
                    }}>
                    {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado! Cole no Gemini →' : 'Copiar Resumo para a IA'}
                </button>

                <button onClick={() => setExpanded(v => !v)}
                    className="flex items-center justify-center w-12 rounded-xl transition-all border border-white/6 text-gray-500 hover:text-gray-300"
                    style={{ background: 'rgba(255,255,255,0.04)' }} title="Ver prompt">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Preview do prompt */}
            {expanded && (
                <div className="px-4 pb-4">
                    <div className="rounded-xl p-3 border border-white/5" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-2">📋 Prompt que será copiado</p>
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed font-mono">{prompt}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   ABA 2: CALCULADORA PRO (2026)
───────────────────────────────────────────────────────── */
function CalcTab() {
    const [valorImovel, setValorImovel] = useState('');
    const [entrada, setEntrada] = useState('');
    const [prazo, setPrazo] = useState('360');
    const [faixaIdx, setFaixaIdx] = useState(1);
    const [sistema, setSistema] = useState<'SAC' | 'PRICE'>('SAC');

    const faixa = FAIXAS_MCMV[faixaIdx];

    /* Valores calculados */
    const calc = useMemo(() => {
        const vImovel = parseFloat(valorImovel.replace(/\D/g, '')) / 100 || 0;
        const vEntrada = parseFloat(entrada.replace(/\D/g, '')) / 100 || 0;
        const meses = parseInt(prazo, 10) || 360;

        const financiado = Math.max(0, vImovel - vEntrada);

        // Parcelas
        const parcelaPrice = calcParcelaPrice(financiado, faixa.juros, meses);
        const primeiraParcelaSAC = calcPrimeiraParcelaSAC(financiado, faixa.juros, meses);
        const parcela = sistema === 'SAC' ? primeiraParcelaSAC : parcelaPrice;

        // Renda Média Exigida (parcela não pode comprometer mais de 30% da renda geralmente)
        const rendaExigida = parcela / 0.30;

        // Custos Extra (ITBI + Cartório - média 5% Brasil)
        const custosExtra = vImovel * 0.05;

        // Total pago (aproximado para SAC)
        let totalPago = 0;
        if (sistema === 'PRICE') {
            totalPago = parcela * meses;
        } else {
            // Soma da PA no SAC
            const ultimaParcela = calcPrimeiraParcelaSAC(financiado, faixa.juros, 1); // rough approx
            totalPago = ((primeiraParcelaSAC + (financiado / meses)) * meses) / 2 + financiado;
        }

        const totalJuros = Math.max(0, totalPago - financiado);
        const percEntrada = vImovel > 0 ? (vEntrada / vImovel) * 100 : 0;

        return {
            vImovel, vEntrada, financiado, parcela, totalPago, totalJuros,
            percEntrada, meses, rendaExigida, custosExtra
        };
    }, [valorImovel, entrada, prazo, faixaIdx, sistema]);

    /* Formatar input como moeda ao digitar */
    const fmtInput = (raw: string) => {
        const digits = raw.replace(/\D/g, '');
        if (!digits) return '';
        return (parseInt(digits, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Aviso taxas */}
            <div className="rounded-xl px-4 py-3 border border-blue-500/20 flex items-start gap-2.5"
                style={{ background: 'rgba(96,165,250,0.05)' }}>
                <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-blue-400/80 text-xs leading-relaxed">
                    <strong>Regras Financiamento 2026.</strong> A aprovação e juros finais dependem
                    da análise restrita da Caixa/Banco. Utilize esta tela apenas como argumento de venda.
                </p>
            </div>

            {/* Seletor de faixa */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Faixa de Renda</p>
                <div className="flex flex-col gap-2">
                    {FAIXAS_MCMV.map((f, i) => (
                        <button key={i} onClick={() => setFaixaIdx(i)}
                            className="flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
                            style={{
                                background: faixaIdx === i ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.03)',
                                border: faixaIdx === i ? '1.5px solid rgba(201,169,110,0.4)' : '1.5px solid rgba(255,255,255,0.06)',
                            }}>
                            <div>
                                <p className="text-xs font-bold" style={{ color: faixaIdx === i ? '#C9A96E' : '#6b7280' }}>{f.label}</p>
                                <p className="text-[11px] text-gray-600 mt-0.5">{f.subsidio}</p>
                            </div>
                            <div className="flex items-center gap-1" style={{ color: faixaIdx === i ? '#C9A96E' : '#374151' }}>
                                <Percent size={12} />
                                <span className="font-black text-sm">{f.juros.toFixed(2)}</span>
                                <span className="text-xs text-gray-600">a.a.</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Valores & Sistema</p>

                <CalcInput label="💰 Valor do Imóvel"
                    value={valorImovel} onChange={e => setValorImovel(fmtInput(e.target.value))}
                    placeholder="R$ 0,00" />

                <CalcInput label="🤝 Entrada + FGTS"
                    value={entrada} onChange={e => setEntrada(fmtInput(e.target.value))}
                    placeholder="R$ 0,00"
                    hint={calc.percEntrada > 0 ? `${calc.percEntrada.toFixed(1)}% do valor` : undefined} />

                {/* Sistema e Prazo lado a lado */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Sistema</label>
                        <div className="flex rounded-xl p-1 border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <button onClick={() => setSistema('SAC')}
                                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                                style={{ background: sistema === 'SAC' ? 'rgba(255,255,255,0.1)' : 'transparent', color: sistema === 'SAC' ? '#fff' : '#6b7280' }}>
                                SAC <span className="text-[9px] font-normal block">Decrescente</span>
                            </button>
                            <button onClick={() => setSistema('PRICE')}
                                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                                style={{ background: sistema === 'PRICE' ? 'rgba(255,255,255,0.1)' : 'transparent', color: sistema === 'PRICE' ? '#fff' : '#6b7280' }}>
                                PRICE <span className="text-[9px] font-normal block">Fixo</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Prazo Máximo</label>
                        <select
                            value={prazo} onChange={e => setPrazo(e.target.value)}
                            className="w-full h-full px-3 outline-none text-sm font-bold text-white transition-all rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.07)' }}>
                            <option value="120" className="bg-gray-900">10 anos (120m)</option>
                            <option value="240" className="bg-gray-900">20 anos (240m)</option>
                            <option value="360" className="bg-gray-900">30 anos (360m)</option>
                            <option value="420" className="bg-gray-900">35 anos (420m)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Resultado */}
            {calc.financiado > 0 && (
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">📊 Prévias & Argumentos</p>

                    {/* Parcela em destaque */}
                    <div className="rounded-2xl p-5 flex flex-col items-center gap-1 border border-[#C9A96E]/30 relative overflow-hidden"
                        style={{ background: 'rgba(201,169,110,0.06)', boxShadow: '0 8px 32px rgba(201,169,110,0.08)' }}>

                        <div className="absolute top-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8C887)' }}></div>

                        <p className="text-[#C9A96E] text-xs uppercase tracking-widest font-black">
                            {sistema === 'SAC' ? '1ª Parcela Estimada' : 'Parcela Fixa Estimada'}
                        </p>
                        <p className="text-[#C9A96E] font-black text-4xl tracking-tight">{formatBRL(calc.parcela, 2)}</p>
                        <p className="text-gray-500 text-xs text-center px-4">
                            Em {calc.meses}x com juros de {faixa.juros}% a.a.<br />
                            {sistema === 'SAC' && <span className="text-xs font-bold text-gray-400">As parcelas diminuem todo mês!</span>}
                        </p>
                    </div>

                    {/* Renda Exigida & Documentação (Novos argumentos de venda) */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl p-3 border border-emerald-500/20 flex flex-col gap-1" style={{ background: 'rgba(16,185,129,0.05)' }}>
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <Users size={12} /> <span className="text-[10px] font-bold uppercase tracking-widest">Renda Ideal ~</span>
                            </div>
                            <span className="text-emerald-400 font-black text-lg">{formatBRL(calc.rendaExigida)}</span>
                            <span className="text-[9px] text-emerald-500/70">Para aprovar esta prestação</span>
                        </div>
                        <div className="rounded-xl p-3 border border-orange-500/20 flex flex-col gap-1" style={{ background: 'rgba(249,115,22,0.05)' }}>
                            <div className="flex items-center gap-1.5 text-orange-500">
                                <Landmark size={12} /> <span className="text-[10px] font-bold uppercase tracking-widest">Doc. Extra ~</span>
                            </div>
                            <span className="text-orange-400 font-black text-lg">{formatBRL(calc.custosExtra)}</span>
                            <span className="text-[9px] text-orange-500/70">ITBI e Cartório (5% estimativa)</span>
                        </div>
                    </div>

                    {/* Detalhes Técnicos */}
                    <div className="rounded-2xl p-4 flex flex-col gap-2.5 border border-white/5" style={{ background: 'rgba(255,255,255,0.025)' }}>
                        <ResultRow icon={<DollarSign size={13} />} label="Valor financiado" value={formatBRL(calc.financiado)} />
                        <ResultRow icon={<Percent size={13} />} label="Total de Juros" value={formatBRL(calc.totalJuros)} highlight />
                    </div>

                    <CopyResultButton calc={calc} faixa={faixa} sistema={sistema} />
                </div>
            )}
        </div>
    );
}

function CalcInput({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{label}</label>
                {hint && <span className="text-[10px] text-gray-600 border border-white/10 px-2 py-0.5 rounded-full">{hint}</span>}
            </div>
            <input
                type="text"
                inputMode="numeric"
                className="w-full px-4 py-3.5 rounded-xl text-white font-bold outline-none transition-all"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1.5px solid rgba(255,255,255,0.07)',
                    fontSize: 20,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                {...props}
            />
        </div>
    );
}

function ResultRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean; }) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2 text-gray-500">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <span className="text-sm font-bold" style={{ color: highlight ? '#f87171' : 'rgba(255,255,255,0.85)' }}>
                {value}
            </span>
        </div>
    );
}

function CopyResultButton({ calc, faixa, sistema }: { calc: any; faixa: any; sistema: string }) {
    const [copied, setCopied] = useState(false);

    const text = [
        '📊 *OPORTUNIDADE DE FINANCIAMENTO*',
        '',
        `🏠 Imóvel: ${formatBRL(calc.vImovel)}`,
        `🤝 Sua Entrada: ${formatBRL(calc.vEntrada)}`,
        '',
        `✅ *Condição de Pagamento:*`,
        `- Financiado direto pelo banco: ${formatBRL(calc.financiado)}`,
        `- Prazo longo: ${calc.meses} meses`,
        `- Taxa Especial (${faixa.label.split('—')[0].trim()}): ${faixa.juros}% a.a.`,
        '',
        `💳 *${sistema === 'SAC' ? 'Primeira prestação em' : 'Sua parcela fixa'}: ${formatBRL(calc.parcela, 2)}*`,
        sistema === 'SAC' ? `📉 *(As parcelas vão caindo todos os meses)*` : '',
        '',
        `💡 _Dica: Você precisa de uma renda bruta média de ${formatBRL(calc.rendaExigida)} para compor este limite!_`,
        '',
        '⚠️ Valores sujeitos à análise de crédito.',
        '📲 Gostou? Vamos fazer sua aprovação rápida via WhatsApp!',
    ].filter(Boolean).join('\n');

    return (
        <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 3000); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] border"
            style={{
                background: copied ? 'rgba(52,211,153,0.1)' : 'rgba(201,169,110,0.1)',
                border: copied ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(201,169,110,0.3)',
                color: copied ? '#34d399' : '#C9A96E',
            }}>
            {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado! Envie para o lead →' : 'Copiar simulação magnética p/ WhatsApp'}
        </button>
    );
}

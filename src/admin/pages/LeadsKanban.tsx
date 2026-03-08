import { useState, useMemo } from 'react';
import {
    Flame, Coffee, Snowflake, AlertTriangle, Sparkles,
    ChevronDown, ChevronUp, X, Copy, CheckCheck,
    CalendarClock, Building2, MapPin, DollarSign,
    Zap, Clock, MessageSquare, Users,
    ChevronsDownUp, ChevronsUpDown
} from 'lucide-react';
import leadsData from '../../data/leads.json';
import propertiesData from '../../data/properties.json';

/* ═══════════════════════════════════════════════════════
   TIPOS (Tipagem Robusta e Segura)
════════════════════════════════════════════════════════ */
export interface Lead {
    id: string;
    nome: string;
    temperatura: 'Quente' | 'Morno' | 'Frio';
    status: 'Em Atendimento' | 'Visita' | 'Proposta';
    resumo_ia?: string;
    interesse_bairros: string[];
    entrada: number;
    orcamento_max: number;
    renda: number;
    urgencia: string;
    followup_status: string;
    data_proximo_contato: string;
}

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
    aceita_financiamento: boolean;
}

interface MatchedProperty extends Property {
    matchScore: number;
    matchReasons: string[];
}

/* ═══════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════ */
function formatBRL(v: number) {
    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `R$ ${Math.round(v / 1_000)}k`;
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function isFollowupLate(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
}

function daysUntil(dateStr: string): number {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ═══════════════════════════════════════════════════════
   HOOK: MATCH DE IMÓVEIS
════════════════════════════════════════════════════════ */
function useLeadMatches(lead: Lead): MatchedProperty[] {
    return useMemo(() => {
        const properties = propertiesData as Property[];
        const matches: MatchedProperty[] = [];

        for (const p of properties) {
            if (p.status !== 'Disponível') continue;

            const reasons: string[] = [];
            let score = 0;

            // Match 1: Orçamento
            if (lead.orcamento_max >= p.valor_venda) {
                score += 3;
                reasons.push('Orçamento compatível');
            } else if (lead.orcamento_max >= p.valor_venda * 0.85) {
                score += 1;
                reasons.push('Orçamento próximo');
            }

            // Match 2: Entrada cobre (estimando 20% do valor)
            const entradaNecessaria = p.valor_venda * 0.2;
            if (lead.entrada >= entradaNecessaria) {
                score += 2;
                reasons.push('Entrada suficiente');
            }

            // Match 3: Bairro de interesse
            const bairroMatch = lead.interesse_bairros.some(b =>
                p.bairro.toLowerCase().includes(b.toLowerCase()) ||
                b.toLowerCase().includes(p.bairro.toLowerCase())
            );
            if (bairroMatch) {
                score += 3;
                reasons.push(`Bairro de interesse: ${p.bairro}`);
            }

            // Match 4: Aceita financiamento (se renda baixa é fator positivo)
            if (p.aceita_financiamento && lead.renda < 5000) {
                score += 1;
                reasons.push('Aceita financiamento');
            }

            if (score >= 2) {
                matches.push({ ...p, matchScore: score, matchReasons: reasons });
            }
        }

        return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    }, [lead]);
}

/* ═══════════════════════════════════════════════════════
   CONFIGURAÇÃO DAS COLUNAS
════════════════════════════════════════════════════════ */
const TEMP_CONFIG = {
    Quente: {
        label: 'Quente',
        emoji: '🔥',
        icon: Flame,
        color: '#C9A96E',
        colorMuted: 'rgba(201,169,110,0.12)',
        colorBorder: 'rgba(201,169,110,0.35)',
        cardBg: 'rgba(201,169,110,0.04)',
        headerBg: 'linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 100%)',
        glow: '0 4px 24px rgba(201,169,110,0.18), 0 0 0 1px rgba(201,169,110,0.12)',
        glowHover: '0 6px 32px rgba(201,169,110,0.28), 0 0 0 1px rgba(201,169,110,0.2)',
        topBar: '#C9A96E',
    },
    Morno: {
        label: 'Morno',
        emoji: '☕',
        icon: Coffee,
        color: '#fb923c',
        colorMuted: 'rgba(251,146,60,0.1)',
        colorBorder: 'rgba(251,146,60,0.22)',
        cardBg: 'rgba(251,146,60,0.03)',
        headerBg: 'linear-gradient(135deg, rgba(251,146,60,0.1) 0%, rgba(251,146,60,0.03) 100%)',
        glow: '0 2px 16px rgba(251,146,60,0.08)',
        glowHover: '0 4px 24px rgba(251,146,60,0.15), 0 0 0 1px rgba(251,146,60,0.15)',
        topBar: '#fb923c',
    },
    Frio: {
        label: 'Frio',
        emoji: '❄️',
        icon: Snowflake,
        color: '#94a3b8',
        colorMuted: 'rgba(148,163,184,0.08)',
        colorBorder: 'rgba(71,85,105,0.4)',
        cardBg: 'rgba(15,28,50,0.6)',
        headerBg: 'linear-gradient(135deg, rgba(71,85,105,0.2) 0%, rgba(30,41,59,0.1) 100%)',
        glow: '0 2px 12px rgba(30,41,59,0.4)',
        glowHover: '0 4px 20px rgba(71,85,105,0.25), 0 0 0 1px rgba(100,116,139,0.25)',
        topBar: '#475569',
    },
} as const;

const URGENCIA_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    'Alta': { color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
    'Média': { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
    'Baixa': { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
};

const STATUS_FILTERS = ['Todos', 'Em Atendimento', 'Visita', 'Proposta'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];
const TEMP_ORDER: Array<'Quente' | 'Morno' | 'Frio'> = ['Quente', 'Morno', 'Frio'];

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════ */
export function LeadsKanban() {
    const leads = leadsData as Lead[];
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
        Quente: false, Morno: false, Frio: false,
    });

    const allCollapsed = Object.values(collapsed).every(Boolean);

    const toggleAll = () => {
        const next = !allCollapsed;
        setCollapsed({ Quente: next, Morno: next, Frio: next });
    };

    const toggleColumn = (temp: string) =>
        setCollapsed(prev => ({ ...prev, [temp]: !prev[temp] }));

    const totalLeads = leads.length;
    const quentes = leads.filter(l => l.temperatura === 'Quente').length;
    const mornos = leads.filter(l => l.temperatura === 'Morno').length;
    const frios = leads.filter(l => l.temperatura === 'Frio').length;
    const lateCount = leads.filter(l => isFollowupLate(l.data_proximo_contato)).length;

    // Contador por status para os filtros
    const statusCount: Record<string, number> = {
        'Todos': totalLeads,
        'Em Atendimento': leads.filter(l => l.status === 'Em Atendimento').length,
        'Visita': leads.filter(l => l.status === 'Visita').length,
        'Proposta': leads.filter(l => l.status === 'Proposta').length,
    };

    const filteredLeads = useMemo(() =>
        statusFilter === 'Todos'
            ? leads
            : leads.filter(l => l.status === statusFilter),
        [leads, statusFilter]
    );

    return (
        <div className="flex flex-col gap-5 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">👥 Leads</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Kanban de atendimento · somente leitura</p>
                </div>
                <div className="flex items-center gap-2">
                    {lateCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <AlertTriangle size={12} className="text-red-400" />
                            <span className="text-[11px] font-black text-red-400">{lateCount} atrasado{lateCount > 1 ? 's' : ''}</span>
                        </div>
                    )}
                    {/* Botão global esconder/mostrar todas as colunas */}
                    <button
                        onClick={toggleAll}
                        title={allCollapsed ? 'Expandir todas as colunas' : 'Recolher todas as colunas'}
                        className="p-2 rounded-xl transition-all active:scale-95"
                        style={{
                            background: allCollapsed ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.05)',
                            border: allCollapsed ? '1.5px solid rgba(201,169,110,0.35)' : '1.5px solid rgba(255,255,255,0.08)',
                            color: allCollapsed ? '#C9A96E' : '#6b7280',
                        }}
                    >
                        {allCollapsed
                            ? <ChevronsUpDown size={15} />
                            : <ChevronsDownUp size={15} />}
                    </button>
                </div>
            </div>

            {/* Mini Stats — clicáveis para filtrar por temperatura */}
            <div className="grid grid-cols-4 gap-2">
                <MiniStat value={totalLeads} label="Total" color="#94a3b8" icon={Users} />
                <MiniStat value={quentes} label="Quentes" color="#C9A96E" icon={Flame} />
                <MiniStat value={mornos} label="Mornos" color="#fb923c" icon={Coffee} />
                <MiniStat value={frios} label="Frios" color="#94a3b8" icon={Snowflake} />
            </div>

            {/* Filtros de Status com contador */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Filtrar por etapa</p>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                    {STATUS_FILTERS.map(f => {
                        const isActive = statusFilter === f;
                        const count = statusCount[f] ?? 0;
                        return (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: isActive ? '1.5px solid rgba(201,169,110,0.45)' : '1.5px solid rgba(255,255,255,0.07)',
                                    color: isActive ? '#C9A96E' : '#6b7280',
                                    boxShadow: isActive ? '0 2px 12px rgba(201,169,110,0.12)' : 'none',
                                    transform: isActive ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                {f}
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                                    style={{
                                        background: isActive ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.08)',
                                        color: isActive ? '#C9A96E' : '#4b5563',
                                    }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Colunas Kanban */}
            <div className="flex flex-col gap-7">
                {TEMP_ORDER.map(temp => {
                    const cfg = TEMP_CONFIG[temp];
                    const columnLeads = filteredLeads.filter(l => l.temperatura === temp);
                    const TempIcon = cfg.icon;
                    const isCollapsed = collapsed[temp];
                    const columnLate = columnLeads.filter(l => isFollowupLate(l.data_proximo_contato)).length;

                    return (
                        <div key={temp}>
                            {/* Cabeçalho da Coluna — com botão de colapsar */}
                            <button
                                onClick={() => toggleColumn(temp)}
                                className="w-full rounded-2xl p-3 mb-3 flex items-center justify-between transition-all active:scale-[0.99]"
                                style={{
                                    background: cfg.headerBg,
                                    border: `1px solid ${cfg.colorBorder}`,
                                    borderLeft: `3px solid ${cfg.topBar}`,
                                    opacity: isCollapsed ? 0.75 : 1,
                                }}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg" style={{ background: cfg.colorMuted }}>
                                        <TempIcon size={14} style={{ color: cfg.color }} />
                                    </div>
                                    <div className="text-left">
                                        <span className="font-black text-sm tracking-wide" style={{ color: cfg.color }}>
                                            {cfg.emoji} {cfg.label}
                                        </span>
                                        {columnLate > 0 && !isCollapsed && (
                                            <span className="ml-2 text-[9px] font-black text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">
                                                {columnLate} ⚠️
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Pill com contagem + ícone de toggle */}
                                    <span className="text-sm font-black px-2.5 py-1 rounded-xl"
                                        style={{ background: cfg.colorMuted, color: cfg.color }}>
                                        {columnLeads.length}
                                    </span>
                                    <div className="p-1 rounded-lg transition-all"
                                        style={{ background: 'rgba(255,255,255,0.06)', color: cfg.color }}>
                                        {isCollapsed
                                            ? <ChevronDown size={13} />
                                            : <ChevronUp size={13} />}
                                    </div>
                                </div>
                            </button>

                            {/* Cards — ocultos quando colapsado */}
                            {!isCollapsed && (
                                <div className="flex flex-col gap-3 pl-1">
                                    {columnLeads.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed px-4 py-8 text-center"
                                            style={{ borderColor: cfg.colorBorder, background: cfg.cardBg }}>
                                            <TempIcon size={22} style={{ color: cfg.color, opacity: 0.2, margin: '0 auto 8px' }} />
                                            <p className="text-xs" style={{ color: cfg.color, opacity: 0.35 }}>
                                                Nenhum lead {temp.toLowerCase()} no momento
                                            </p>
                                        </div>
                                    ) : (
                                        columnLeads.map(lead => (
                                            <LeadCard
                                                key={lead.id}
                                                lead={lead}
                                                tempConfig={cfg}
                                                onClick={() => setSelectedLead(lead)}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Resumo compacto quando colapsado */}
                            {isCollapsed && columnLeads.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pl-1 mb-1 -mt-1">
                                    {columnLeads.map(lead => {
                                        const isLate = isFollowupLate(lead.data_proximo_contato);
                                        return (
                                            <button
                                                key={lead.id}
                                                onClick={() => setSelectedLead(lead)}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95"
                                                style={{
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: `1px solid ${isLate ? 'rgba(239,68,68,0.3)' : cfg.colorBorder}`,
                                                    color: isLate ? '#f87171' : cfg.color,
                                                }}
                                            >
                                                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                                                    style={{ background: cfg.colorMuted }}>
                                                    {lead.nome.charAt(0)}
                                                </span>
                                                {lead.nome}
                                                {isLate && <AlertTriangle size={9} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal de Detalhes */}
            {selectedLead && (
                <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MINI STAT
════════════════════════════════════════════════════════ */
function MiniStat({ value, label, color, icon: Icon }: {
    value: number; label: string; color: string; icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all"
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.07)`,
            }}>
            <div className="p-1.5 rounded-lg" style={{ background: `rgba(${color === '#C9A96E' ? '201,169,110' : color === '#fb923c' ? '251,146,60' : '148,163,184'},0.12)` }}>
                <Icon size={13} style={{ color }} />
            </div>
            <span className="text-xl font-black leading-none" style={{ color }}>{value}</span>
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{label}</span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   CARD DO LEAD — Dark Mode Premium
════════════════════════════════════════════════════════ */
function LeadCard({ lead, tempConfig: cfg, onClick }: {
    lead: Lead;
    tempConfig: typeof TEMP_CONFIG[keyof typeof TEMP_CONFIG];
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const matches = useLeadMatches(lead);
    const isLate = isFollowupLate(lead.data_proximo_contato);
    const days = daysUntil(lead.data_proximo_contato);
    const urgCfg = URGENCIA_CONFIG[lead.urgencia] ?? URGENCIA_CONFIG['Baixa'];

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.97]"
            style={{
                background: hovered ? cfg.cardBg : 'rgba(10,22,40,0.7)',
                border: `1.5px solid ${hovered ? cfg.topBar : cfg.colorBorder}`,
                boxShadow: hovered ? cfg.glowHover : cfg.glow,
                transform: hovered ? 'translateY(-1px)' : 'none',
            }}
        >
            {/* Barra de temperatura no topo — mais grossa e viva */}
            <div className="h-[3px] w-full" style={{
                background: `linear-gradient(90deg, ${cfg.topBar} 0%, ${cfg.topBar}80 100%)`,
            }} />

            <div className="p-4 flex flex-col gap-3">
                {/* Linha 1: Avatar + Nome + Urgência */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar com inicial */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                            style={{
                                background: cfg.colorMuted,
                                color: cfg.color,
                                border: `1px solid ${cfg.colorBorder}`,
                            }}>
                            {lead.nome.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm leading-tight">{lead.nome}</p>
                            <p className="text-gray-600 text-[10px] mt-0.5 font-mono tracking-wide">#{lead.id} · NocoDB</p>
                        </div>
                    </div>
                    {/* Badge de Urgência */}
                    <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{
                            background: urgCfg.bg,
                            color: urgCfg.color,
                            border: `1px solid ${urgCfg.border}`,
                        }}>
                        {lead.urgencia}
                    </span>
                </div>

                {/* Linha 2: Status */}
                <div className="flex items-center gap-1.5">
                    <StatusBadge status={lead.status} />
                </div>

                {/* Linha 3: Dados financeiros */}
                <div className="rounded-xl p-2.5 flex items-center gap-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5 flex-1">
                        <DollarSign size={11} className="text-gray-600 shrink-0" />
                        <div>
                            <p className="text-[9px] text-gray-700 uppercase tracking-wider font-bold">Orçamento</p>
                            <p className="text-white font-black text-xs">Até {formatBRL(lead.orcamento_max)}</p>
                        </div>
                    </div>
                    {lead.entrada > 0 && (
                        <>
                            <div className="w-px h-6 bg-white/8" />
                            <div className="flex-1">
                                <p className="text-[9px] text-gray-700 uppercase tracking-wider font-bold">Entrada</p>
                                <p className="text-gray-400 font-bold text-xs">{formatBRL(lead.entrada)}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Linha 4: Bairros de interesse */}
                {lead.interesse_bairros.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        <MapPin size={10} className="text-gray-700 shrink-0" />
                        {lead.interesse_bairros.slice(0, 2).map(b => (
                            <span key={b} className="text-[10px] text-gray-500 px-2 py-0.5 rounded-md"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {b}
                            </span>
                        ))}
                        {lead.interesse_bairros.length > 2 && (
                            <span className="text-[10px] text-gray-700 px-1.5 py-0.5 rounded-md"
                                style={{ background: 'rgba(255,255,255,0.03)' }}>
                                +{lead.interesse_bairros.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Linha 5: Follow-up + Match — borda superior sutil */}
                <div className="flex items-center justify-between gap-2 pt-2"
                    style={{ borderTop: `1px solid ${cfg.colorBorder}40` }}>

                    {/* Alerta de follow-up atrasado */}
                    {isLate ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <AlertTriangle size={10} className="text-red-400 shrink-0" />
                            <span className="text-[10px] font-black text-red-400">Atrasado!</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <CalendarClock size={10} className="text-gray-700 shrink-0" />
                            <span className="text-[10px] text-gray-600">
                                {days === 0 ? 'Contato hoje' : days > 0 ? `Em ${days}d` : `${Math.abs(days)}d atrás`}
                            </span>
                        </div>
                    )}

                    {/* Match badge — destaque dourado */}
                    {matches.length > 0 ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                            style={{
                                background: 'rgba(201,169,110,0.1)',
                                border: '1px solid rgba(201,169,110,0.25)',
                                boxShadow: '0 0 8px rgba(201,169,110,0.08)',
                            }}>
                            <Sparkles size={10} style={{ color: '#C9A96E' }} />
                            <span className="text-[10px] font-black" style={{ color: '#C9A96E' }}>
                                {matches.length} match{matches.length > 1 ? 'es' : ''}
                            </span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-gray-700">Sem matches</span>
                    )}
                </div>
            </div>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════
   BADGE DE STATUS
════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: Lead['status'] }) {
    const cfg = {
        'Em Atendimento': { icon: MessageSquare, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
        'Visita': { icon: Building2, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
        'Proposta': { icon: Zap, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    }[status];

    const Icon = cfg.icon;
    return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: cfg.bg }}>
            <Icon size={9} style={{ color: cfg.color }} />
            <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{status}</span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MODAL DE DETALHES DO LEAD
════════════════════════════════════════════════════════ */
function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    const matches = useLeadMatches(lead);
    const [showMatches, setShowMatches] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const isLate = isFollowupLate(lead.data_proximo_contato);
    const tempCfg = TEMP_CONFIG[lead.temperatura];
    const TempIcon = tempCfg.icon;
    const urgCfg = URGENCIA_CONFIG[lead.urgencia] ?? URGENCIA_CONFIG['Baixa'];

    const copyMatchText = (p: Property) => {
        const text = `${lead.nome}, com base no seu perfil, este imóvel em ${p.bairro} (${p.cidade}) encaixa no seu orçamento de até ${formatBRL(lead.orcamento_max)}. Ref: ${p.codigo_interno} — ${p.titulo}.`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(p.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

            <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
                style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh' }}>

                {/* Handle (Mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto" style={{ maxHeight: '88vh' }}>
                    {/* Header do Modal */}
                    <div className="flex items-start justify-between p-5 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shrink-0"
                                style={{ background: tempCfg.colorMuted, color: tempCfg.color }}>
                                {lead.nome.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-black text-base">{lead.nome}</p>
                                    <div className="p-1 rounded-lg" style={{ background: tempCfg.colorMuted }}>
                                        <TempIcon size={12} style={{ color: tempCfg.color }} />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs font-mono mt-0.5">ID #{lead.id} · NocoDB</p>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="p-2 rounded-xl text-gray-600 hover:text-gray-300 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                        {/* Tags de Status e Urgência */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={lead.status} />
                            <span className="text-[11px] font-black px-2.5 py-1 rounded-full"
                                style={{ background: urgCfg.bg, color: urgCfg.color }}>
                                Urgência {lead.urgencia}
                            </span>
                        </div>

                        {/* Alerta de Follow-up Atrasado */}
                        {isLate && (
                            <div className="flex items-start gap-2 rounded-xl p-3"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 text-xs font-black">Follow-up Atrasado!</p>
                                    <p className="text-red-400/70 text-[11px] mt-0.5">
                                        Contato deveria ter sido feito em{' '}
                                        {new Date(lead.data_proximo_contato).toLocaleDateString('pt-BR')}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Resumo da IA */}
                        {lead.resumo_ia && (
                            <div className="rounded-xl p-4"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 flex items-center gap-1">
                                    <Sparkles size={9} /> Resumo da IA
                                </p>
                                <p className="text-gray-300 text-xs leading-relaxed">{lead.resumo_ia}</p>
                            </div>
                        )}

                        {/* Dados Financeiros */}
                        <div className="grid grid-cols-3 gap-2">
                            <FinancialCard label="Orçamento" value={formatBRL(lead.orcamento_max)} />
                            <FinancialCard label="Entrada" value={formatBRL(lead.entrada)} />
                            <FinancialCard label="Renda" value={formatBRL(lead.renda)} />
                        </div>

                        {/* Bairros de Interesse */}
                        {lead.interesse_bairros.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 flex items-center gap-1">
                                    <MapPin size={9} /> Bairros de Interesse
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {lead.interesse_bairros.map(b => (
                                        <span key={b} className="text-xs text-gray-400 px-2.5 py-1 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Follow-up Info */}
                        <div className="flex items-center gap-2 rounded-xl p-3"
                            style={{ background: 'rgba(255,255,255,0.025)' }}>
                            <Clock size={13} className="text-gray-600 shrink-0" />
                            <div>
                                <p className="text-gray-400 text-xs font-semibold">{lead.followup_status}</p>
                                <p className="text-gray-700 text-[10px] mt-0.5">
                                    Próximo contato: {new Date(lead.data_proximo_contato).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        {/* ── SEÇÃO DE MATCH ── */}
                        <div className="rounded-2xl overflow-hidden"
                            style={{ border: '1.5px solid rgba(201,169,110,0.2)' }}>
                            <button
                                onClick={() => setShowMatches(v => !v)}
                                className="w-full flex items-center justify-between p-4 transition-colors"
                                style={{ background: showMatches ? 'rgba(201,169,110,0.06)' : 'rgba(201,169,110,0.03)' }}>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} style={{ color: '#C9A96E' }} />
                                    <span className="font-black text-sm" style={{ color: '#C9A96E' }}>
                                        {matches.length > 0
                                            ? `${matches.length} imóvel${matches.length > 1 ? 'is' : ''} para este perfil`
                                            : 'Nenhum imóvel compatível'}
                                    </span>
                                </div>
                                {matches.length > 0 && (
                                    showMatches
                                        ? <ChevronUp size={16} style={{ color: '#C9A96E' }} />
                                        : <ChevronDown size={16} style={{ color: '#C9A96E' }} />
                                )}
                            </button>

                            {showMatches && matches.length > 0 && (
                                <div className="flex flex-col gap-2 p-3 pt-0">
                                    {(matches as MatchedProperty[]).map(p => (
                                        <MatchCard
                                            key={p.id}
                                            property={p}
                                            lead={lead}
                                            isCopied={copiedId === p.id}
                                            onCopy={() => copyMatchText(p)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   CARD DE MATCH (Imóvel compatível)
════════════════════════════════════════════════════════ */
function MatchCard({ property: p, isCopied, onCopy }: {
    property: MatchedProperty;
    lead: Lead;
    isCopied: boolean;
    onCopy: () => void;
}) {
    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-900">
                    {p.featuredImage ? (
                        <img src={p.featuredImage} alt={p.titulo}
                            className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Building2 size={20} className="text-gray-700" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold leading-tight line-clamp-1">{p.titulo}</p>
                    <p className="text-gray-600 text-[10px] mt-0.5">{p.bairro} · {p.cidade}</p>
                    <p className="font-black text-xs mt-1" style={{ color: '#C9A96E' }}>{formatBRL(p.valor_venda)}</p>
                    {/* Match reasons */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {(p as MatchedProperty).matchReasons.slice(0, 2).map(r => (
                            <span key={r} className="text-[9px] px-1.5 py-0.5 rounded-full text-gray-500"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {r}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botão Copiar Sugestão */}
            <button onClick={onCopy}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all"
                style={{
                    background: isCopied ? 'rgba(52,211,153,0.1)' : 'rgba(201,169,110,0.08)',
                    color: isCopied ? '#34d399' : '#C9A96E',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                {isCopied
                    ? <><CheckCheck size={12} /> Copiado!</>
                    : <><Copy size={12} /> Copiar sugestão</>}
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   FINANCIAL CARD
════════════════════════════════════════════════════════ */
function FinancialCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl p-3 flex flex-col gap-0.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{label}</span>
            <span className="text-sm font-black text-white">{value}</span>
        </div>
    );
}

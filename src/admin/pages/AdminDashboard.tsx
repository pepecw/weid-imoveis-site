import { useState, useMemo } from 'react';
import {
    Building2, CheckCircle2, Clock, Tag,
    MapPin, BedDouble, Bath, Car, Search,
    ChevronDown, AlertTriangle, RefreshCw,
    Phone, User, ChevronUp, Home
} from 'lucide-react';
import propertiesData from '../../data/properties.json';

/* ─── Tipo do properties.json ────────────────────────── */
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
    imovel_padrao: string;
    aceita_financiamento: boolean;
    descricao_ia?: string;
    composicao?: string[];
    condicoes_pagamento?: string;
    aceita_permuta?: boolean;
}

/* ─── Dados de contato por imóvel (admin-only, localStorage) */
interface ContactData {
    nome: string;
    telefone: string;
    papel: 'Dono' | 'Captador';
    endereco: string;
}

function loadContacts(): Record<string, ContactData> {
    try { return JSON.parse(localStorage.getItem('weid_contacts') ?? '{}'); }
    catch { return {}; }
}
function saveContacts(data: Record<string, ContactData>) {
    localStorage.setItem('weid_contacts', JSON.stringify(data));
}

/* ─── Status config ──────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'Disponível': { label: 'Disponível', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' },
    'Vendido': { label: 'Vendido', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
    'Pausado': { label: 'Pausado', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)' },
};
const ALL_STATUSES = ['Disponível', 'Vendido', 'Pausado'];

function formatBRL(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
function hexToRgb(hex: string) {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════ */
export function AdminDashboard() {
    const [properties, setProperties] = useState<Property[]>(propertiesData as Property[]);
    const [contacts, setContacts] = useState<Record<string, ContactData>>(loadContacts);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [toggling, setToggling] = useState<string | null>(null);

    /* ── Stats ── */
    const stats = useMemo(() => ({
        total: properties.length,
        disponiveis: properties.filter(p => p.status === 'Disponível').length,
        vendidos: properties.filter(p => p.status === 'Vendido').length,
        pausados: properties.filter(p => p.status === 'Pausado').length,
    }), [properties]);

    /* ── Filtro ── */
    const filtered = useMemo(() => properties.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !search
            || p.titulo.toLowerCase().includes(q)
            || p.codigo_interno.toLowerCase().includes(q)
            || p.cidade.toLowerCase().includes(q)
            || p.bairro.toLowerCase().includes(q);
        return matchSearch && (filterStatus === 'all' || p.status === filterStatus);
    }), [properties, search, filterStatus]);

    /* ── Toggle status ── */
    const cycleStatus = (id: string) => {
        setToggling(id);
        setProperties(prev => prev.map(p => {
            if (p.id !== id) return p;
            const next = ALL_STATUSES[(ALL_STATUSES.indexOf(p.status) + 1) % ALL_STATUSES.length];
            return { ...p, status: next };
        }));
        setTimeout(() => setToggling(null), 400);
    };
    const setStatus = (id: string, status: string) => {
        setToggling(id);
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        setTimeout(() => setToggling(null), 300);
    };

    /* ── Atualizar contato ── */
    const updateContact = (id: string, patch: Partial<ContactData>) => {
        setContacts(prev => {
            const updated = {
                ...prev,
                [id]: { nome: '', telefone: '', papel: 'Dono' as const, endereco: '', ...prev[id], ...patch },
            };
            saveContacts(updated);
            return updated;
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">📋 Prancheta</h1>
                <p className="text-gray-500 text-sm mt-0.5">Estoque · controle de status</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard value={stats.total} label="Imóveis" color="#C9A96E" icon={Building2} active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
                <StatCard value={stats.disponiveis} label="Disponíveis" color="#4ade80" icon={CheckCircle2} active={filterStatus === 'Disponível'} onClick={() => setFilterStatus(filterStatus === 'Disponível' ? 'all' : 'Disponível')} />
                <StatCard value={stats.vendidos} label="Vendidos" color="#f87171" icon={Tag} active={filterStatus === 'Vendido'} onClick={() => setFilterStatus(filterStatus === 'Vendido' ? 'all' : 'Vendido')} />
                <StatCard value={stats.pausados} label="Pausados" color="#fbbf24" icon={Clock} active={filterStatus === 'Pausado'} onClick={() => setFilterStatus(filterStatus === 'Pausado' ? 'all' : 'Pausado')} />
            </div>

            {/* Busca */}
            <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input type="text" placeholder="Buscar por título, código, cidade…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm font-medium outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.07)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                />
                {search && (
                    <button onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-xs font-bold px-1">✕</button>
                )}
            </div>

            <div className="flex items-center justify-between -mt-3">
                <p className="text-gray-600 text-xs">
                    {filtered.length === properties.length
                        ? `${properties.length} imóvel${properties.length !== 1 ? 'is' : ''} no estoque`
                        : `${filtered.length} de ${properties.length}`}
                </p>
                {(search || filterStatus !== 'all') && (
                    <button onClick={() => { setSearch(''); setFilterStatus('all'); }}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-400 text-xs transition-colors">
                        <RefreshCw size={11} /> Limpar filtros
                    </button>
                )}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-4">
                {filtered.length === 0 ? (
                    <div className="rounded-2xl p-8 border border-white/5 flex flex-col items-center gap-3 text-center"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <AlertTriangle size={28} className="text-gray-700" />
                        <p className="text-gray-600 text-sm">Nenhum imóvel encontrado</p>
                    </div>
                ) : filtered.map(p => (
                    <PropertyCard
                        key={p.id}
                        property={p}
                        contact={contacts[p.id]}
                        isToggling={toggling === p.id}
                        onCycle={() => cycleStatus(p.id)}
                        onSetStatus={s => setStatus(p.id, s)}
                        onUpdateContact={patch => updateContact(p.id, patch)}
                    />
                ))}
            </div>

            <div className="rounded-xl px-4 py-3 border border-white/5 flex items-start gap-2.5"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <AlertTriangle size={13} className="text-gray-600 mt-0.5 shrink-0" />
                <p className="text-gray-600 text-xs leading-relaxed">
                    Alterações de status são visuais por enquanto. Contatos ficam salvos no dispositivo (localStorage). Persistência real no NocoDB vem com o Supabase.
                </p>
            </div>
        </div>
    );
}

/* ─── StatCard ───────────────────────────────────────── */
function StatCard({ value, label, color, icon: Icon, active, onClick }: {
    value: number; label: string; color: string; icon: React.ElementType; active: boolean; onClick: () => void;
}) {
    return (
        <button onClick={onClick} className="rounded-2xl p-4 flex flex-col gap-0.5 border transition-all active:scale-[0.97] text-left"
            style={{
                background: active ? `rgba(${hexToRgb(color)}, 0.08)` : 'rgba(255,255,255,0.03)',
                border: active ? `1.5px solid rgba(${hexToRgb(color)}, 0.4)` : '1.5px solid rgba(255,255,255,0.05)',
                boxShadow: active ? `0 4px 20px rgba(${hexToRgb(color)}, 0.1)` : 'none',
            }}>
            <div className="flex items-center justify-between mb-1">
                <Icon size={16} style={{ color: active ? color : '#374151' }} />
                {active && <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: `rgba(${hexToRgb(color)}, 0.15)`, color }}>filtrado</span>}
            </div>
            <span className="text-3xl font-black" style={{ color: active ? color : 'rgba(255,255,255,0.8)' }}>{value}</span>
            <span className="text-xs font-semibold" style={{ color: active ? color : '#6b7280' }}>{label}</span>
        </button>
    );
}

/* ─── PropertyCard ───────────────────────────────────── */
function PropertyCard({ property: p, contact, isToggling, onCycle, onSetStatus, onUpdateContact }: {
    property: Property;
    contact?: ContactData;
    isToggling: boolean;
    onCycle: () => void;
    onSetStatus: (s: string) => void;
    onUpdateContact: (patch: Partial<ContactData>) => void;
}) {
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const sc = STATUS_CONFIG[p.status] ?? STATUS_CONFIG['Disponível'];
    const c = contact ?? { nome: '', telefone: '', papel: 'Dono' as const, endereco: '' };
    const hasContact = !!(c.nome || c.telefone || c.endereco);

    return (
        <div className="rounded-2xl overflow-visible border border-white/5 transition-all"
            style={{ background: 'rgba(255,255,255,0.025)' }}>

            {/* Faixa de status */}
            <div className="h-0.5 w-full rounded-t-2xl" style={{ background: sc.color, opacity: 0.5 }} />

            <div className="flex flex-col sm:flex-row">
                {/* Foto */}
                <div className="relative shrink-0 sm:w-36">
                    {p.featuredImage ? (
                        <img src={p.featuredImage} alt={p.titulo}
                            className="w-full h-40 sm:h-full object-cover"
                            style={{ minHeight: 120, borderRadius: '0 0 0 16px' }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full h-40 sm:h-full flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.03)', minHeight: 120 }}>
                            <Building2 size={28} className="text-gray-700" />
                        </div>
                    )}
                    <span className="absolute top-2 left-2 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md"
                        style={{ background: 'rgba(6,13,26,0.85)', color: '#C9A96E', backdropFilter: 'blur(4px)' }}>
                        {p.codigo_interno}
                    </span>
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                    <div>
                        <p className="text-white font-bold text-sm leading-tight line-clamp-2">{p.titulo}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-gray-600 text-xs">{p.tipo_imovel}</span>
                            <span className="text-gray-700">·</span>
                            <span className="text-gray-600 text-xs">{p.imovel_padrao}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-gray-600 shrink-0" />
                        <p className="text-gray-500 text-xs truncate">{p.bairro} · {p.cidade}</p>
                    </div>

                    {(p.area_principal > 0 || p.quartos > 0 || p.banheiros > 0 || p.vagas_garagem > 0) && (
                        <div className="flex items-center gap-3 flex-wrap">
                            {p.area_principal > 0 && <Attr label={`${p.area_principal}m²`} />}
                            {p.quartos > 0 && <Attr icon={<BedDouble size={11} />} label={String(p.quartos)} />}
                            {p.banheiros > 0 && <Attr icon={<Bath size={11} />} label={String(p.banheiros)} />}
                            {p.vagas_garagem > 0 && <Attr icon={<Car size={11} />} label={String(p.vagas_garagem)} />}
                        </div>
                    )}

                    {/* Preço + Status */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                        <p className="text-[#C9A96E] font-black text-base leading-none">{formatBRL(p.valor_venda)}</p>

                        <div className="relative">
                            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: sc.border }}>
                                <button onClick={onCycle} disabled={isToggling}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
                                    style={{ background: sc.bg, color: sc.color, opacity: isToggling ? 0.5 : 1 }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color, boxShadow: `0 0 4px ${sc.color}` }} />
                                    {isToggling ? '…' : sc.label}
                                </button>
                                <button onClick={() => setShowStatusMenu(v => !v)}
                                    className="flex items-center justify-center px-2 border-l transition-all"
                                    style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                                    <ChevronDown size={12} />
                                </button>
                            </div>
                            {showStatusMenu && (
                                <div className="absolute right-0 bottom-[calc(100%+6px)] z-20 rounded-xl overflow-hidden border border-white/10 shadow-xl"
                                    style={{ background: '#0d1b2e', minWidth: 130 }}>
                                    {ALL_STATUSES.map(s => {
                                        const cfg = STATUS_CONFIG[s];
                                        return (
                                            <button key={s} onClick={() => { onSetStatus(s); setShowStatusMenu(false); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors text-left"
                                                style={{ background: p.status === s ? `rgba(${hexToRgb(cfg.color)}, 0.12)` : 'transparent', color: cfg.color }}>
                                                <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                                                {cfg.label}
                                                {p.status === s && <span className="ml-auto text-[10px] opacity-60">atual</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botão expandir contato */}
                    <button onClick={() => setShowContact(v => !v)}
                        className="flex items-center gap-2 text-xs transition-colors mt-1 -mb-1 w-fit"
                        style={{ color: hasContact ? '#C9A96E' : '#374151' }}>
                        {showContact ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <Phone size={11} />
                        {hasContact
                            ? `${c.papel}: ${c.nome || 'sem nome'}`
                            : 'Adicionar responsável'}
                    </button>
                </div>
            </div>

            {/* ── Painel de contato expansível (admin-only) ── */}
            {showContact && (
                <div className="px-4 pb-4 pt-0">
                    <div className="rounded-xl p-4 flex flex-col gap-3 border"
                        style={{ background: 'rgba(201,169,110,0.04)', borderColor: 'rgba(201,169,110,0.15)' }}>

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A96E]/70">
                                🔒 Dados Internos · Não aparecem no site
                            </p>
                        </div>

                        {/* Toggle Dono / Captador */}
                        <div className="flex items-center gap-2">
                            {(['Dono', 'Captador'] as const).map(papel => (
                                <button key={papel} onClick={() => onUpdateContact({ papel })}
                                    className="flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all"
                                    style={{
                                        background: c.papel === papel ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                                        border: c.papel === papel ? '1.5px solid rgba(201,169,110,0.4)' : '1.5px solid rgba(255,255,255,0.06)',
                                        color: c.papel === papel ? '#C9A96E' : '#4b5563',
                                    }}>
                                    {papel === 'Dono' ? '🏠 Dono' : '🤝 Captador'}
                                </button>
                            ))}
                        </div>

                        {/* Nome */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                <User size={10} /> Nome do responsável
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: João da Silva"
                                value={c.nome}
                                onChange={e => onUpdateContact({ nome: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
                                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            />
                        </div>

                        {/* Telefone */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                <Phone size={10} /> Contato (WhatsApp / Telefone)
                            </label>
                            <input
                                type="tel"
                                inputMode="tel"
                                placeholder="(47) 9 9999-9999"
                                value={c.telefone}
                                onChange={e => onUpdateContact({ telefone: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)', fontSize: 16 }}
                                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            />
                        </div>

                        {/* Endereço completo */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                <Home size={10} /> Endereço completo
                            </label>
                            <textarea
                                placeholder="Rua, número, complemento, bairro, cidade, CEP"
                                value={c.endereco}
                                onChange={e => onUpdateContact({ endereco: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all resize-none"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)', lineHeight: '1.5' }}
                                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            />
                        </div>

                        {/* Preview se tiver dados */}
                        {hasContact && (
                            <div className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
                                style={{ background: 'rgba(0,0,0,0.2)' }}>
                                <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-1">Resumo</p>
                                <p className="text-white text-xs font-semibold">{c.nome || '—'} <span className="text-gray-500 font-normal">({c.papel})</span></p>
                                {c.telefone && (
                                    <a href={`tel:${c.telefone}`} className="text-[#C9A96E] text-xs hover:underline">{c.telefone}</a>
                                )}
                                {c.endereco && (
                                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{c.endereco}</p>
                                )}
                            </div>
                        )}

                        <p className="text-gray-700 text-[10px] text-center">
                            Salvo automaticamente neste dispositivo · não vai para o site público
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Attr ───────────────────────────────────────────── */
function Attr({ icon, label }: { icon?: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-1 text-gray-600">
            {icon}
            <span className="text-xs">{label}</span>
        </div>
    );
}

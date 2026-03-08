import { useRef, useState, useCallback } from 'react';
import {
    Camera, Home, UtensilsCrossed, BedDouble, Bath, Car, TreePine,
    Sofa, Image as ImageIcon, CheckCircle2, Trash2, RotateCcw,
    Copy, MessageCircle, CloudUpload, Loader2,
    AlertCircle, ChevronRight, FolderOpen
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/* ─── Supabase Client ────────────────────────────────────
   Variáveis definidas em .env.local:
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_SUPABASE_BUCKET=imoveis-weid
─────────────────────────────────────────────────────── */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) ?? 'imoveis-weid';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* ─── Tipos ─────────────────────────────────────────── */
interface PhotoFile {
    file: File;
    preview: string;
    name: string;
}

interface PhotoCategory {
    id: string;
    label: string;
    emoji: string;
    icon: React.ElementType;
    color: string;
    multiple: boolean;
}

type Step = 'form' | 'waiting_imv' | 'uploading' | 'done';

interface UploadResult {
    categoria: string;
    emoji: string;
    total: number;
    ok: number;
    urls: string[];
    error?: string;
}

/* ─── Categorias de Foto ─────────────────────────────── */
const CATEGORIES: PhotoCategory[] = [
    { id: 'capa', label: 'CAPA', emoji: '📷', icon: Camera, color: '#C9A96E', multiple: false },
    { id: 'sala', label: 'SALA', emoji: '🛋️', icon: Sofa, color: '#7C9EFF', multiple: true },
    { id: 'cozinha', label: 'COZINHA', emoji: '🍳', icon: UtensilsCrossed, color: '#FF9F6B', multiple: true },
    { id: 'quartos', label: 'QUARTOS', emoji: '🛏', icon: BedDouble, color: '#A78BFA', multiple: true },
    { id: 'banheiros', label: 'BANHEIROS', emoji: '🚿', icon: Bath, color: '#67E8F9', multiple: true },
    { id: 'garagem', label: 'GARAGEM', emoji: '🚗', icon: Car, color: '#86EFAC', multiple: true },
    { id: 'area', label: 'ÁREA EXT.', emoji: '🌳', icon: TreePine, color: '#FDE68A', multiple: true },
    { id: 'fachada', label: 'FACHADA', emoji: '🏠', icon: Home, color: '#F9A8D4', multiple: true },
    { id: 'extras', label: 'EXTRAS', emoji: '🖼️', icon: ImageIcon, color: '#94A3B8', multiple: true },
];

/* ─── Formulário Inicial ─────────────────────────────── */
const EMPTY_FORM = { titulo: '', preco: '', cidade: '', bairro: '', tipo: '', descricao: '' };

/* ─── Helpers ────────────────────────────────────────── */
function formatBRL(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    return (parseInt(digits, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function photoCount(photos: Record<string, PhotoFile[]>): number {
    return Object.values(photos).reduce((a, b) => a + b.length, 0);
}

function hexToRgb(hex: string): string {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
}

/** Gera o texto formatado para colar no Telegram */
function buildTelegramText(form: typeof EMPTY_FORM, photos: Record<string, PhotoFile[]>): string {
    const categorias = CATEGORIES
        .filter(c => (photos[c.id] || []).length > 0)
        .map(c => `${c.emoji} ${c.label}: ${photos[c.id].length} foto${photos[c.id].length > 1 ? 's' : ''}`)
        .join('\n');

    return [
        '🏠 *NOVO IMÓVEL — WEID IMÓVEIS*',
        '',
        `📌 *Título:* ${form.titulo}`,
        form.tipo ? `🏗 *Tipo:* ${form.tipo}` : null,
        `💰 *Preço:* ${form.preco}`,
        `🏙 *Cidade:* ${form.cidade}${form.bairro ? ` · ${form.bairro}` : ''}`,
        form.descricao ? `📝 *Obs:* ${form.descricao}` : null,
        '',
        `📷 *Fotos (${photoCount(photos)} total):*`,
        categorias,
        '',
        '➡️ _Por favor, crie o registro no NocoDB e me envie o código IMV gerado._',
    ].filter(l => l !== null).join('\n');
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════ */
export function AdminCadastrar() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [photos, setPhotos] = useState<Record<string, PhotoFile[]>>({});
    const [step, setStep] = useState<Step>('form');
    const [imvInput, setImvInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
    const [uploadProgress, setUploadProgress] = useState('');
    const [activePreview, setActivePreview] = useState<{ cat: string; idx: number } | null>(null);
    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    /* —— Campos de texto —— */
    const handleField = (key: keyof typeof EMPTY_FORM) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const value = key === 'preco' ? formatBRL(e.target.value) : e.target.value;
            setForm(f => ({ ...f, [key]: value }));
        };

    /* —— Upload de fotos —— */
    const handleFiles = useCallback((catId: string, multiple: boolean) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;
            const newPhotos = files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }));
            setPhotos(prev => ({
                ...prev,
                [catId]: multiple ? [...(prev[catId] || []), ...newPhotos] : [newPhotos[0]],
            }));
            if (fileRefs.current[catId]) fileRefs.current[catId]!.value = '';
        }, []);

    /* —— Remover foto —— */
    const removePhoto = (catId: string, idx: number) => {
        setPhotos(prev => {
            const updated = [...(prev[catId] || [])];
            URL.revokeObjectURL(updated[idx].preview);
            updated.splice(idx, 1);
            return { ...prev, [catId]: updated };
        });
        if (activePreview?.cat === catId && activePreview.idx === idx) setActivePreview(null);
    };

    /* —— Reset geral —— */
    const handleReset = () => {
        Object.values(photos).flat().forEach(p => URL.revokeObjectURL(p.preview));
        setForm(EMPTY_FORM);
        setPhotos({});
        setStep('form');
        setImvInput('');
        setCopied(false);
        setUploadResults([]);
        setUploadProgress('');
        setActivePreview(null);
    };

    /* —— FASE 1 → FASE 2: Copiar dados para o Telegram —— */
    const handleCopyTelegram = () => {
        const text = buildTelegramText(form, photos);
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
        setStep('waiting_imv');
    };

    /* —— FASE 2 → FASE 3: Upload direto para Supabase Storage —— */
    const handleUpload = async () => {
        if (!supabase) return;
        const imvCode = imvInput.trim().toUpperCase();
        setStep('uploading');
        setUploadResults([]);

        const results: UploadResult[] = [];

        for (const cat of CATEGORIES) {
            const catPhotos = photos[cat.id] || [];
            if (!catPhotos.length) continue;

            setUploadProgress(`Enviando ${cat.emoji} ${cat.label}…`);
            const urls: string[] = [];
            let ok = 0;
            let catError: string | undefined;

            for (const p of catPhotos) {
                const ext = p.name.split('.').pop() ?? 'jpg';
                const ts = Date.now();
                const storagePath = `${imvCode}/fotos/${cat.id}/${ts}_${p.name.replace(/\s+/g, '_')}`;

                const { data, error } = await supabase.storage
                    .from(SUPABASE_BUCKET)
                    .upload(storagePath, p.file, {
                        contentType: p.file.type || `image/${ext}`,
                        upsert: true,
                    });

                if (error) {
                    catError = error.message;
                } else {
                    const { data: urlData } = supabase.storage
                        .from(SUPABASE_BUCKET)
                        .getPublicUrl(data.path);
                    urls.push(urlData.publicUrl);
                    ok++;
                }
            }

            results.push({
                categoria: cat.label,
                emoji: cat.emoji,
                total: catPhotos.length,
                ok,
                urls,
                error: catError,
            });
        }

        setUploadProgress('Concluído!');
        setUploadResults(results);
        setStep('done');
    };

    const total = photoCount(photos);
    const capaOk = (photos['capa']?.length || 0) > 0;
    const formOk = !!(form.titulo && form.preco && capaOk);
    const imvOk = imvInput.trim().length >= 6; // ex: IMV-01
    const supabaseConfigured = !!supabase;

    /* ═══════════════════════════════════════════════════ */
    return (
        <div className="flex flex-col gap-6 pb-4">

            {/* ── Cabeçalho ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">⚡ The Flash</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Cadastro rápido de imóvel</p>
                </div>
                {step !== 'uploading' && (form.titulo || total > 0 || step !== 'form') && (
                    <button onClick={handleReset}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors text-sm py-2 px-3 rounded-xl border border-white/5 hover:border-red-400/30">
                        <RotateCcw size={14} />
                        Recomeçar
                    </button>
                )}
            </div>

            {/* ── Indicador de etapas ── */}
            <StepBar current={step} />

            {/* ══════════════════════════════════════════════
                FASE 1 — FORMULÁRIO
            ══════════════════════════════════════════════ */}
            {step === 'form' && (
                <div className="flex flex-col gap-5">

                    {/* Aviso Supabase */}
                    {!supabaseConfigured && (
                        <div className="rounded-xl px-4 py-3 border border-amber-500/20 flex items-start gap-2.5"
                            style={{ background: 'rgba(245,158,11,0.06)' }}>
                            <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                            <p className="text-amber-400/80 text-xs leading-relaxed">
                                Configure <code className="bg-black/20 px-1 rounded">VITE_SUPABASE_URL</code> e{' '}
                                <code className="bg-black/20 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> no{' '}
                                <code className="bg-black/20 px-1 rounded">.env.local</code> para habilitar o upload.
                            </p>
                        </div>
                    )}

                    {/* ── Dados do Imóvel ── */}
                    <Section title="📋 Dados do Imóvel">
                        <FieldBlock label="Título do Imóvel" required>
                            <BigInput id="titulo" placeholder="Ex: Apartamento 3 quartos em Balneário"
                                value={form.titulo} onChange={handleField('titulo')} required />
                        </FieldBlock>

                        <div className="grid grid-cols-2 gap-3">
                            <FieldBlock label="Tipo">
                                <BigSelect id="tipo" value={form.tipo} onChange={handleField('tipo')}>
                                    <option value="">Selecione</option>
                                    <option>Apartamento</option>
                                    <option>Casa</option>
                                    <option>Terreno</option>
                                    <option>Comercial</option>
                                    <option>Cobertura</option>
                                    <option>Kitnet</option>
                                </BigSelect>
                            </FieldBlock>
                            <FieldBlock label="💰 Preço" required>
                                <BigInput id="preco" inputMode="numeric" placeholder="R$ 0,00"
                                    value={form.preco} onChange={handleField('preco')} required
                                    style={{ fontSize: 20, fontWeight: 800, color: '#C9A96E' }} />
                            </FieldBlock>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FieldBlock label="🏙 Cidade" required>
                                <BigInput id="cidade" placeholder="Balneário Camboriú"
                                    value={form.cidade} onChange={handleField('cidade')} required />
                            </FieldBlock>
                            <FieldBlock label="📍 Bairro">
                                <BigInput id="bairro" placeholder="Centro"
                                    value={form.bairro} onChange={handleField('bairro')} />
                            </FieldBlock>
                        </div>

                        <FieldBlock label="📝 Obs para a copy">
                            <BigTextarea id="descricao" rows={3}
                                placeholder="Pontos-chave do imóvel…"
                                value={form.descricao} onChange={handleField('descricao')} />
                        </FieldBlock>
                    </Section>

                    {/* ── Upload Categorizado ── */}
                    <Section title={`📷 Fotos${total > 0 ? ` · ${total} selecionada${total !== 1 ? 's' : ''}` : ''}`}>
                        <div className="flex flex-col gap-3">
                            {CATEGORIES.map(cat => {
                                const catPhotos = photos[cat.id] || [];
                                const has = catPhotos.length > 0;
                                return (
                                    <div key={cat.id}>
                                        <input
                                            ref={el => { fileRefs.current[cat.id] = el; }}
                                            type="file" accept="image/*" multiple={cat.multiple} className="hidden"
                                            onChange={handleFiles(cat.id, cat.multiple)}
                                            id={`file-${cat.id}`}
                                        />
                                        <button type="button" onClick={() => fileRefs.current[cat.id]?.click()}
                                            className="w-full rounded-2xl transition-all active:scale-[0.98] text-left"
                                            style={{
                                                background: has ? `rgba(${hexToRgb(cat.color)}, 0.08)` : 'rgba(255,255,255,0.03)',
                                                border: has
                                                    ? `1.5px solid rgba(${hexToRgb(cat.color)}, 0.35)`
                                                    : '1.5px dashed rgba(255,255,255,0.08)',
                                                padding: has ? '12px 16px' : '16px',
                                            }}>
                                            <div className="flex items-center gap-3">
                                                {has ? (
                                                    <div className="relative shrink-0">
                                                        <img src={catPhotos[0].preview} alt="" className="w-14 h-14 rounded-xl object-cover"
                                                            style={{ border: `2px solid rgba(${hexToRgb(cat.color)}, 0.5)` }} />
                                                        {catPhotos.length > 1 && (
                                                            <span className="absolute -bottom-1 -right-1 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center"
                                                                style={{ background: cat.color, color: '#060d1a' }}>
                                                                {catPhotos.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                                        style={{ background: `rgba(${hexToRgb(cat.color)}, 0.08)` }}>
                                                        <span className="text-2xl">{cat.emoji}</span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-base tracking-wide"
                                                        style={{ color: has ? cat.color : 'rgba(255,255,255,0.5)' }}>
                                                        {cat.emoji} {cat.label}
                                                    </p>
                                                    <p className="text-xs mt-0.5" style={{ color: has ? `rgba(${hexToRgb(cat.color)}, 0.7)` : '#4b5563' }}>
                                                        {has ? `${catPhotos.length} foto${catPhotos.length > 1 ? 's' : ''} · toque para mais` : cat.multiple ? 'Selecionar fotos' : 'Selecionar 1 foto'}
                                                    </p>
                                                </div>
                                                {has && <CheckCircle2 size={20} style={{ color: cat.color }} className="shrink-0" />}
                                            </div>
                                        </button>

                                        {catPhotos.length > 0 && (
                                            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 px-1" style={{ scrollbarWidth: 'none' }}>
                                                {catPhotos.map((p, idx) => (
                                                    <div key={idx} className="relative shrink-0 group">
                                                        <button type="button" onClick={() => setActivePreview({ cat: cat.id, idx })}>
                                                            <img src={p.preview} alt={p.name}
                                                                className="w-20 h-20 rounded-xl object-cover transition-transform active:scale-95"
                                                                style={{
                                                                    border: activePreview?.cat === cat.id && activePreview?.idx === idx
                                                                        ? `2px solid ${cat.color}` : '2px solid rgba(255,255,255,0.08)',
                                                                }} />
                                                        </button>
                                                        <button type="button" onClick={() => removePhoto(cat.id, idx)}
                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: '#ef4444' }}>
                                                            <Trash2 size={10} className="text-white" />
                                                        </button>
                                                        <p className="text-[9px] text-gray-600 mt-1 w-20 truncate text-center">{p.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Preview ampliado */}
                        {activePreview && photos[activePreview.cat]?.[activePreview.idx] && (() => {
                            const p = photos[activePreview.cat][activePreview.idx];
                            const cat = CATEGORIES.find(c => c.id === activePreview.cat)!;
                            return (
                                <div className="mt-4 rounded-2xl overflow-hidden border"
                                    style={{ borderColor: `rgba(${hexToRgb(cat.color)}, 0.3)` }}>
                                    <img src={p.preview} alt={p.name} className="w-full max-h-72 object-cover" />
                                    <div className="px-4 py-3 flex items-center justify-between"
                                        style={{ background: `rgba(${hexToRgb(cat.color)}, 0.06)` }}>
                                        <div>
                                            <p className="text-xs font-bold" style={{ color: cat.color }}>{cat.emoji} {cat.label}</p>
                                            <p className="text-gray-500 text-[11px] mt-0.5 truncate max-w-[200px]">{p.name}</p>
                                        </div>
                                        <button type="button" onClick={() => removePhoto(activePreview.cat, activePreview.idx)}
                                            className="flex items-center gap-1.5 text-red-400 text-sm hover:text-red-300 transition-colors">
                                            <Trash2 size={14} /> Remover
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </Section>

                    {/* ── Botão Fase 1 ── */}
                    <button onClick={handleCopyTelegram} disabled={!formOk}
                        className="w-full rounded-2xl py-5 font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: formOk ? 'linear-gradient(135deg, #C9A96E 0%, #E8C887 100%)' : 'rgba(255,255,255,0.05)',
                            color: formOk ? '#060d1a' : '#4b5563',
                            boxShadow: formOk ? '0 8px 32px rgba(201,169,110,0.25)' : 'none',
                        }}>
                        <MessageCircle size={20} />
                        {!form.titulo ? 'Preencha o Título' : !form.preco ? 'Preencha o Preço' : !capaOk ? 'Selecione a Capa' : 'Copiar dados → Telegram'}
                    </button>
                    {formOk && (
                        <p className="text-center text-gray-600 text-xs -mt-2">
                            Cole no bot do Telegram · aguarde o código IMV · volte aqui
                        </p>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════
                FASE 2 — AGUARDANDO CÓDIGO IMV DO TELEGRAM
            ══════════════════════════════════════════════ */}
            {step === 'waiting_imv' && (
                <div className="flex flex-col gap-4">

                    {/* Confirmação de cópia */}
                    <div className="rounded-2xl p-4 border border-[#C9A96E]/30 flex items-start gap-3"
                        style={{ background: 'rgba(201,169,110,0.06)' }}>
                        <Copy size={18} className="text-[#C9A96E] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[#C9A96E] font-bold text-sm">Dados copiados para a área de transferência!</p>
                            <p className="text-gray-500 text-xs mt-1">
                                Cole no bot de admin do Telegram. O n8n vai criar o registro no NocoDB e te enviar o código IMV.
                            </p>
                        </div>
                    </div>

                    {/* Preview do texto que foi copiado */}
                    <Section title="📋 Texto copiado">
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed font-mono"
                            style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 10 }}>
                            {buildTelegramText(form, photos)}
                        </pre>
                        <button onClick={() => {
                            navigator.clipboard.writeText(buildTelegramText(form, photos));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                            style={{
                                background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                                color: copied ? '#34d399' : '#6b7280',
                                border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                            <Copy size={14} />
                            {copied ? 'Copiado!' : 'Copiar novamente'}
                        </button>
                    </Section>

                    {/* Input do código IMV */}
                    <Section title="🔑 Cole aqui o código IMV retornado pelo Telegram">
                        <FieldBlock label="Código IMV (ex: IMV-0034)" required>
                            <BigInput
                                id="imv-input"
                                placeholder="IMV-0034"
                                value={imvInput}
                                onChange={e => setImvInput(e.target.value.toUpperCase())}
                                style={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    letterSpacing: '0.1em',
                                    color: imvOk ? '#C9A96E' : undefined,
                                    textAlign: 'center',
                                }}
                            />
                        </FieldBlock>
                        <p className="text-gray-600 text-xs text-center">
                            As fotos serão salvas em <code className="text-gray-500">{imvInput.trim() || 'IMV-XXXX'}/categoria/foto.jpg</code>
                        </p>
                    </Section>

                    {/* Botão Upload */}
                    <button onClick={handleUpload}
                        disabled={!imvOk || !supabaseConfigured}
                        className="w-full rounded-2xl py-5 font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: imvOk && supabaseConfigured ? 'linear-gradient(135deg, #7C9EFF 0%, #A78BFA 100%)' : 'rgba(255,255,255,0.05)',
                            color: imvOk && supabaseConfigured ? '#060d1a' : '#4b5563',
                            boxShadow: imvOk && supabaseConfigured ? '0 8px 32px rgba(124,158,255,0.2)' : 'none',
                        }}>
                        <CloudUpload size={20} />
                        {!supabaseConfigured
                            ? '⚠️ Configure o Supabase no .env.local'
                            : !imvOk
                                ? 'Cole o código IMV acima'
                                : `🚀 Subir ${total} foto${total !== 1 ? 's' : ''} para o Supabase`
                        }
                    </button>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                FASE 3 — UPLOADING
            ══════════════════════════════════════════════ */}
            {step === 'uploading' && (
                <div className="flex flex-col gap-4">
                    <div className="rounded-2xl p-8 border border-white/5 flex flex-col items-center gap-4"
                        style={{ background: 'rgba(124,158,255,0.04)' }}>
                        <Loader2 size={40} className="animate-spin text-[#7C9EFF]" />
                        <div className="text-center">
                            <p className="text-white font-bold text-base">{uploadProgress || 'Enviando…'}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Aguarde — as fotos estão sendo salvas no Supabase Storage
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                FASE 4 — CONCLUÍDO
            ══════════════════════════════════════════════ */}
            {step === 'done' && (
                <div className="flex flex-col gap-4">
                    {/* Header de sucesso */}
                    <div className="rounded-2xl p-5 border border-emerald-500/30 flex flex-col gap-3"
                        style={{ background: 'rgba(16,185,129,0.07)' }}>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 size={22} className="text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-emerald-400 font-bold">Fotos enviadas com sucesso!</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Código: <span className="text-[#C9A96E] font-black text-base tracking-widest">{imvInput.trim()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Resultado por categoria */}
                    <Section title="📂 Arquivos salvos no Supabase">
                        <div className="flex flex-col gap-2">
                            {uploadResults.map((r, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                                    style={{
                                        background: r.error
                                            ? 'rgba(239,68,68,0.07)'
                                            : 'rgba(16,185,129,0.05)',
                                        border: `1px solid ${r.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'}`,
                                    }}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{r.emoji}</span>
                                        <div>
                                            <p className="text-sm font-bold text-white">{r.categoria}</p>
                                            {r.error && <p className="text-xs text-red-400 mt-0.5">{r.error}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {r.error
                                            ? <AlertCircle size={16} className="text-red-400" />
                                            : <CheckCircle2 size={16} className="text-emerald-400" />}
                                        <span className="text-sm font-semibold"
                                            style={{ color: r.error ? '#f87171' : '#34d399' }}>
                                            {r.ok}/{r.total}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Path do storage */}
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-1"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <FolderOpen size={14} className="text-gray-500 shrink-0" />
                            <code className="text-gray-500 text-xs break-all">
                                {SUPABASE_BUCKET}/{imvInput.trim()}/fotos/[categoria]/
                            </code>
                        </div>
                    </Section>

                    <p className="text-center text-gray-600 text-xs">
                        Em ~10 minutos acesse o painel e publique o imóvel no site 🚀
                    </p>

                    <button onClick={handleReset}
                        className="w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2 border border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                        <RotateCcw size={16} />
                        Cadastrar próximo imóvel
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── StepBar ────────────────────────────────────────── */
function StepBar({ current }: { current: Step }) {
    const steps: { id: Step; label: string; icon: React.ElementType }[] = [
        { id: 'form', label: 'Dados', icon: Camera },
        { id: 'waiting_imv', label: 'Telegram', icon: MessageCircle },
        { id: 'uploading', label: 'Upload', icon: CloudUpload },
        { id: 'done', label: 'Pronto', icon: CheckCircle2 },
    ];
    const idx = steps.findIndex(s => s.id === current);
    return (
        <div className="flex items-center gap-1">
            {steps.map((s, i) => {
                const done = i < idx;
                const active = i === idx;
                return (
                    <div key={s.id} className="flex items-center gap-1 flex-1">
                        <div className={`flex flex-col items-center gap-1 flex-1`}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                style={{
                                    background: done
                                        ? 'rgba(52,211,153,0.15)'
                                        : active
                                            ? 'rgba(201,169,110,0.15)'
                                            : 'rgba(255,255,255,0.04)',
                                    border: done
                                        ? '1.5px solid rgba(52,211,153,0.5)'
                                        : active
                                            ? '1.5px solid rgba(201,169,110,0.5)'
                                            : '1.5px solid rgba(255,255,255,0.08)',
                                }}>
                                <s.icon size={14}
                                    style={{ color: done ? '#34d399' : active ? '#C9A96E' : '#374151' }} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider"
                                style={{ color: done ? '#34d399' : active ? '#C9A96E' : '#374151' }}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <ChevronRight size={12} className="shrink-0 mb-4"
                                style={{ color: done ? '#34d399' : '#1f2937' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Sub-componentes ────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.15em]">{title}</h2>
            <div className="rounded-2xl p-4 flex flex-col gap-4 border border-white/5"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                {children}
            </div>
        </div>
    );
}

function FieldBlock({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {label}{required && <span className="text-[#C9A96E] ml-1">*</span>}
            </label>
            {children}
        </div>
    );
}

function BigInput({ id, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input id={id}
            className="w-full rounded-xl px-4 py-3.5 text-white font-semibold outline-none transition-all"
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                fontSize: 18,
                ...style,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            {...props}
        />
    );
}

function BigSelect({ id, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string }) {
    return (
        <select id={id}
            className="w-full rounded-xl px-4 py-3.5 text-white font-semibold outline-none transition-all appearance-none"
            style={{
                background: '#0d1b2e',
                border: '1.5px solid rgba(255,255,255,0.10)',
                fontSize: 16,
                colorScheme: 'dark',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
            {...props}>
            {children}
        </select>
    );
}

function BigTextarea({ id, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea id={id}
            className="w-full rounded-xl px-4 py-3.5 text-white font-semibold outline-none transition-all resize-none"
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                fontSize: 15,
                lineHeight: '1.6',
                ...style,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            {...props}
        />
    );
}

import { useParams, Link } from 'react-router-dom';
import { propertiesData } from '../data/properties';
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, Send, X, ChevronLeft, ChevronRight, CheckCircle2, Home, Calendar, Info, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

const WA_BASE = 'https://wa.me/5547991523220?text=';

export function PropertyDetailsPage() {
    const { id } = useParams();
    const property = propertiesData.find(p => p.id === id);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!property) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl font-bold text-white mb-4">Imóvel não encontrado</h1>
                <p className="text-gray-400 mb-8">Parece que este imóvel não está mais disponível ou o link está quebrado.</p>
                <Link to="/imoveis" className="btn btn-gold">
                    Ver Outros Imóveis
                </Link>
            </div>
        );
    }

    const handleWhatsApp = () => {
        const msg = encodeURIComponent(`Olá, Peterson! Gostei muito do imóvel *${property.titulo}* (Cód: ${property.codigo_interno || 'Site'}) e gostaria de saber mais informações.`);
        window.open(`${WA_BASE}${msg}`, '_blank');
    };

    return (
        <div className="pt-24 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">

                {/* Back Link */}
                <Link to="/imoveis" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Voltar
                </Link>

                {/* Top Section: Gallery */}
                {property.images && property.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
                        {property.images.slice(0, 5).map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setLightboxIndex(index)}
                                className={`rounded-xl overflow-hidden cursor-pointer border border-white/5 relative group ${index === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : 'hidden md:block'}`}
                            >
                                <img
                                    src={img}
                                    alt={`Foto ${index + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover aspect-[4/3] group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                                />
                                {index === 0 && ( /* Ensure the first image is always visible to cover mobile screens properly */
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-64 md:h-96 rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#111] flex flex-col items-center justify-center border border-white/10 mb-8">
                        <span className="text-4xl mb-4 opacity-50">📷</span>
                        <span className="text-[#C9A96E]/70 font-semibold text-lg md:text-xl flex items-center gap-3">EM PREPARAÇÃO</span>
                        <p className="text-gray-500 mt-2 text-sm text-center">As fotos deste imóvel estarão disponíveis em breve.</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Title block */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {property.destaque_texto && (
                                    <span className="px-3 py-1 bg-primary/20 border border-primary text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                        {property.destaque_texto}
                                    </span>
                                )}
                                {property.status && (
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${property.status === 'Disponível' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                        property.status === 'Vendido' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                        }`}>
                                        {property.status}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{property.titulo}</h1>
                            <div className="flex items-center text-gray-400 text-lg">
                                <MapPin size={20} className="text-primary mr-2" />
                                <span>{property.bairro}, {property.cidade}</span>
                            </div>
                        </div>

                        {/* Mobile Price Block (Visible only on mobile) */}
                        <div className="lg:hidden bg-white/5 border border-white/10 rounded-2xl p-6">
                            <span className="text-sm text-gray-400 block mb-1">Valor do Imóvel</span>
                            <div className="text-3xl font-black text-secondary mb-4">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor_venda)}
                            </div>
                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Quero detalhes no WhatsApp
                            </button>
                        </div>

                        {/* Icons Features block */}
                        <div className="flex flex-wrap gap-4 py-8 border-y border-white/10 md:justify-start justify-center text-center md:text-left">
                            {property.area_principal > 0 && (
                                <div className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-[80px] gap-2 md:gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                                    <Maximize className="text-primary mt-1" size={24} />
                                    <div>
                                        <div className="text-xl font-bold text-white">{property.area_principal} m²</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Área Útil</div>
                                    </div>
                                </div>
                            )}
                            {property.quartos > 0 && (
                                <div className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-[80px] gap-2 md:gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                                    <Bed className="text-primary mt-1" size={24} />
                                    <div>
                                        <div className="text-xl font-bold text-white">{property.quartos}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Quartos</div>
                                    </div>
                                </div>
                            )}
                            {property.suites !== undefined && property.suites > 0 && (
                                <div className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-[80px] gap-2 md:gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                                    <Bath className="text-primary mt-1" size={24} />
                                    <div>
                                        <div className="text-xl font-bold text-white">{property.suites}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Suítes</div>
                                    </div>
                                </div>
                            )}
                            {property.banheiros > 0 && (
                                <div className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-[80px] gap-2 md:gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                                    <Bath className="text-gray-400 mt-1" size={24} />
                                    <div>
                                        <div className="text-xl font-bold text-white">{property.banheiros}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Banheiros</div>
                                    </div>
                                </div>
                            )}
                            {property.vagas_garagem > 0 && (
                                <div className="flex flex-col md:flex-row items-center md:items-start flex-1 min-w-[80px] gap-2 md:gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                                    <Car className="text-primary mt-1" size={24} />
                                    <div>
                                        <div className="text-xl font-bold text-white">{property.vagas_garagem}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Vagas</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Quick Info Cards (Mapped fields with nice names) */}
                        <div className="grid grid-cols-2 gap-4">
                            {property.tipo_imovel && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-center">
                                    <Home className="text-gray-400" size={20} />
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Tipo</div>
                                        <div className="text-white font-medium">{property.tipo_imovel}</div>
                                    </div>
                                </div>
                            )}
                            {property.imovel_padrao && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-center">
                                    <i className="text-gray-400 text-lg not-italic">✨</i>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Padrão do Imóvel</div>
                                        <div className="text-white font-medium">{property.imovel_padrao}</div>
                                    </div>
                                </div>
                            )}
                            {property.aceita_financiamento !== undefined && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-center">
                                    <CheckCircle2 className={property.aceita_financiamento ? "text-green-400" : "text-gray-600"} size={20} />
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Financiamento</div>
                                        <div className="text-white font-medium">{property.aceita_financiamento ? 'Aceita Financiamento' : 'Não Financia'}</div>
                                    </div>
                                </div>
                            )}
                            {property.aceita_permuta !== undefined && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-center">
                                    <CheckCircle2 className={property.aceita_permuta ? "text-green-400" : "text-gray-600"} size={20} />
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Permuta</div>
                                        <div className="text-white font-medium">{property.aceita_permuta ? 'Estuda Permuta' : 'Sem Permuta'}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description (Mapped from descricao_ia) */}
                        {property.descricao_ia && (
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Info className="text-primary" size={20} />
                                    Detalhes do Imóvel
                                </h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {property.descricao_ia}
                                </p>
                            </div>
                        )}

                        {/* Composition */}
                        {property.composicao && property.composicao.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Layers className="text-primary" size={20} />
                                    Composição
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {property.composicao.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Leisure standard */}
                        {property.lazer_padrao && (
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white mb-4">Área de Lazer / Condomínio</h2>
                                <div className="bg-white/5 border border-white/5 rounded-xl p-5 text-gray-300">
                                    {property.lazer_padrao}
                                </div>
                            </div>
                        )}

                        {/* Special Details: Payment & Delivery */}
                        {(property.condicoes_pagamento || property.previsao_entrega) && (
                            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 mb-12">
                                <h2 className="text-xl font-bold text-white mb-6">Condições e Prazos</h2>
                                <div className="space-y-6">
                                    {property.condicoes_pagamento && (
                                        <div>
                                            <h3 className="text-sm text-primary font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span>💳</span> Formas de Pagamento
                                            </h3>
                                            <p className="text-gray-300 bg-dark/50 p-4 rounded-lg border border-white/5">{property.condicoes_pagamento}</p>
                                        </div>
                                    )}
                                    {property.previsao_entrega && (
                                        <div>
                                            <h3 className="text-sm text-primary font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Calendar size={18} /> Previsão de Entrega
                                            </h3>
                                            <p className="text-white font-medium bg-dark/50 p-4 rounded-lg border border-white/5 inline-block">{property.previsao_entrega}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Desktop Sticky CTA Sidebar */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-32 bg-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">Gostou deste imóvel?</h3>
                            <p className="text-sm text-gray-400 mb-6">Fale comigo agora pelo WhatsApp e vamos agendar uma visita.</p>

                            <div className="pt-6 border-t border-white/10 mb-6 text-center">
                                <span className="text-sm text-gray-400 block mb-1">Valor do Imóvel</span>
                                <span className="text-3xl font-black text-secondary block">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor_venda)}
                                </span>
                            </div>

                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transform hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Tirar dúvidas no WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-dark/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div>
                    <div className="text-xs text-gray-400">Valor de venda</div>
                    <div className="text-xl font-black text-secondary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor_venda)}
                    </div>
                </div>
                <button
                    onClick={handleWhatsApp}
                    className="py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
                >
                    <Send size={18} />
                    Falar Agora
                </button>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-md">
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : property.images.length - 1)}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/20 p-4 rounded-full transition-all backdrop-blur-md"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <img
                        src={property.images[lightboxIndex]}
                        alt="Imagem Ampliada"
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    />

                    <button
                        onClick={() => setLightboxIndex(prev => prev! < property.images.length - 1 ? prev! + 1 : 0)}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/20 p-4 rounded-full transition-all backdrop-blur-md"
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
                        {lightboxIndex + 1} / {property.images.length}
                    </div>
                </div>
            )}
        </div>
    );
}

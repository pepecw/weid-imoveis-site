import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { propertiesData } from '../data/properties';
import { MapPin, ArrowRight, Frown, Filter, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

const PRICE_RANGES = [
    { label: 'Todos os preços', value: '', min: 0, max: 0 },
    { label: 'Até R$200.000', min: 0, max: 200000, value: '0-200' },
    { label: 'R$200k – R$350k', min: 200000, max: 350000, value: '200-350' },
    { label: 'R$350k – R$500k', min: 350000, max: 500000, value: '350-500' },
    { label: 'Acima de R$500k', min: 500000, max: 999999999, value: '500-plus' }
];

export function PropertiesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const cityFilter = searchParams.get('cidade') || '';
    const neighborhoodFilter = searchParams.get('bairro') || '';
    const typeFilter = searchParams.get('tipo') || '';
    const priceFilter = searchParams.get('preco') || '';
    const bedsFilter = searchParams.get('quartos') || '';

    // Extract unique values for filters
    const availableCities = useMemo(() => {
        const cities = propertiesData.map(p => p.cidade).filter(Boolean);
        return [...new Set(cities)].sort();
    }, []);

    const availableNeighborhoods = useMemo(() => {
        let items = propertiesData;
        if (cityFilter) {
            items = items.filter(p => p.cidade === cityFilter);
        }
        const neighborhoods = items.map(p => p.bairro).filter(Boolean);
        return [...new Set(neighborhoods)].sort();
    }, [cityFilter]);

    const availableTypes = useMemo(() => {
        const types = propertiesData.map(p => p.tipo_imovel).filter(Boolean);
        return [...new Set(types)].sort();
    }, []);

    const filteredProperties = propertiesData.filter(p => {
        if (cityFilter && p.cidade !== cityFilter) return false;
        if (neighborhoodFilter && p.bairro !== neighborhoodFilter) return false;
        if (typeFilter && p.tipo_imovel !== typeFilter) return false;
        if (priceFilter) {
            const range = PRICE_RANGES.find(r => r.value === priceFilter);
            if (range && range.value !== '' && (p.valor_venda < range.min || p.valor_venda >= range.max)) return false;
        }
        if (bedsFilter) {
            if (bedsFilter === '4+') {
                if (p.quartos < 4) return false;
            } else {
                if (p.quartos !== parseInt(bedsFilter)) return false;
            }
        }
        return true;
    });

    const updateFilter = (key: string, value: string) => {
        const current = new URLSearchParams(searchParams);
        if (value) {
            current.set(key, value);
        } else {
            current.delete(key);
        }

        // Se trocar de cidade, zere o bairro pois pode não existir lá
        if (key === 'cidade') {
            current.delete('bairro');
        }

        setSearchParams(current);
    };

    const clearFilters = () => {
        navigate('/imoveis');
        setShowMobileFilters(false);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Nossos Imóveis</h1>
                        <p className="text-gray-400 text-lg">Descubra as oportunidades selecionadas para você na região.</p>
                    </div>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden btn btn-gold-outline flex items-center justify-center gap-2"
                    >
                        <Filter size={18} /> Filtrar ({filteredProperties.length})
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <aside className={`lg:w-1/4 xl:w-1/5 flex-shrink-0 flex flex-col gap-6 ${showMobileFilters ? 'block fixed inset-0 z-50 bg-[#0A1628] p-6 overflow-y-auto' : 'hidden lg:flex'}`}>
                        {showMobileFilters && (
                            <div className="flex justify-between items-center mb-4 lg:hidden">
                                <h2 className="text-2xl font-bold text-white">Filtros</h2>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">

                            {/* Cidade */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Cidade</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none appearance-none"
                                    value={cityFilter}
                                    onChange={(e) => updateFilter('cidade', e.target.value)}
                                >
                                    <option value="" className="bg-[#0A1628]">Todas as cidades</option>
                                    {availableCities.map(c => (
                                        <option key={c} value={c} className="bg-[#0A1628]">{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Bairro (Só aparece se uma cidade for escolhida) */}
                            {cityFilter && availableNeighborhoods.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Bairro</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none appearance-none"
                                        value={neighborhoodFilter}
                                        onChange={(e) => updateFilter('bairro', e.target.value)}
                                    >
                                        <option value="" className="bg-[#0A1628]">Todos os bairros</option>
                                        {availableNeighborhoods.map(b => (
                                            <option key={b} value={b} className="bg-[#0A1628]">{b}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Tipo */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tipo de Imóvel</label>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => updateFilter('tipo', '')}
                                        className={`text-left px-4 py-2 rounded-lg transition-colors ${typeFilter === '' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'}`}
                                    >
                                        Todos os tipos
                                    </button>
                                    {availableTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => updateFilter('tipo', t)}
                                            className={`text-left px-4 py-2 rounded-lg transition-colors ${typeFilter === t ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parâmetros */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Quartos</label>
                                <div className="flex gap-2">
                                    {['1', '2', '3', '4+'].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => updateFilter('quartos', bedsFilter === q ? '' : q)}
                                            className={`flex-1 py-2 text-center rounded-lg transition-colors font-medium ${bedsFilter === q ? 'bg-primary text-secondary' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'}`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Valor */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Faixa de Preço</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none appearance-none"
                                    value={priceFilter}
                                    onChange={(e) => updateFilter('preco', e.target.value)}
                                >
                                    {PRICE_RANGES.map(r => (
                                        <option key={r.value} value={r.value} className="bg-[#0A1628]">{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            {(cityFilter || typeFilter || priceFilter || bedsFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-2 w-full py-3 text-sm font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-xl transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            )}

                        </div>

                        {showMobileFilters && (
                            <button onClick={() => setShowMobileFilters(false)} className="btn btn-gold w-full flex items-center justify-center gap-2 mt-auto mb-8">
                                <Search size={20} /> Ver {filteredProperties.length} Imóveis
                            </button>
                        )}
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                            </h2>
                        </div>

                        {filteredProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/10 text-center">
                                <Frown size={64} className="text-gray-500 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Poxa, não encontramos imóveis exatos.</h2>
                                <p className="text-gray-400 mb-6 max-w-md">De acordo com a sua busca, no momento não temos nenhum imóvel disponível com essas características, mas nosso estoque atualiza diariamente!</p>
                                <Link to="/imoveis" className="btn btn-gold-outline" onClick={() => window.history.replaceState({}, '', '/imoveis')}>
                                    Ver Todos os Imóveis
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProperties.map((property) => (
                                    <div key={property.id} className="bg-white/5 border border-white/10 flex flex-col h-full rounded-2xl overflow-hidden hover:bg-white/10 transition-all group">
                                        <div className="relative h-56 overflow-hidden">
                                            {property.featuredImage ? (
                                                <img
                                                    src={property.featuredImage}
                                                    alt={property.titulo}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#111] flex items-center justify-center border-b border-white/10 group-hover:scale-110 transition-transform duration-700">
                                                    <span className="text-[#C9A96E]/50 font-semibold text-sm flex items-center gap-2 opacity-70">📷 EM PREPARAÇÃO</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {property.destaque_texto && (
                                                    <span className="px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">
                                                        {property.destaque_texto}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-white mb-2">{property.titulo}</h3>
                                            <div className="flex items-center text-gray-400 mb-4">
                                                <MapPin size={16} className="text-primary mr-1" />
                                                <span className="text-sm">{property.bairro}, {property.cidade}</span>
                                            </div>

                                            <div className="text-2xl font-bold text-secondary mb-6">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor_venda)}
                                            </div>

                                            <Link
                                                to={`/imoveis/${property.id}`}
                                                className="w-full py-3 bg-white/5 hover:bg-primary text-white rounded-xl transition-all flex items-center justify-center gap-2 group border border-white/10 hover:border-primary mt-auto"
                                            >
                                                Ver Detalhes
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>{/* end col */}
                </div>{/* end layout wrapper */}
            </div>
        </div>
    );
}

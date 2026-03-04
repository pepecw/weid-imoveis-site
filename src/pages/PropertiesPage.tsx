import { Link, useSearchParams } from 'react-router-dom';
import { propertiesData } from '../data/properties';
import { MapPin, ArrowRight, Frown } from 'lucide-react';

const PRICE_RANGES = [
    { label: 'Até R$200.000', min: 0, max: 200000, value: '0-200' },
    { label: 'R$200k – R$350k', min: 200000, max: 350000, value: '200-350' },
    { label: 'R$350k – R$500k', min: 350000, max: 500000, value: '350-500' },
    { label: 'Acima de R$500k', min: 500000, max: 999999999, value: '500-plus' }
];

export function PropertiesPage() {
    const [searchParams] = useSearchParams();

    const cityFilter = searchParams.get('cidade');
    const typeFilter = searchParams.get('tipo');
    const priceFilter = searchParams.get('preco');

    const filteredProperties = propertiesData.filter(p => {
        if (cityFilter && p.cidade !== cityFilter) return false;
        if (typeFilter && p.tipo_imovel !== typeFilter) return false;
        if (priceFilter) {
            const range = PRICE_RANGES.find(r => r.value === priceFilter);
            if (range && (p.valor_venda < range.min || p.valor_venda >= range.max)) return false;
        }
        return true;
    });

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nossos Imóveis</h1>
                <p className="text-gray-400 text-lg mb-12">Descubra as oportunidades selecionadas para você na região.</p>

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
            </div>
        </div>
    );
}

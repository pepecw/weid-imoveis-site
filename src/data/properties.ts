export interface Property {
    id: string; // Used for URL routing (e.g. slug)
    codigo_interno?: string; // e.g. IMV0001
    titulo: string;
    tipo_imovel: string;
    bairro: string;
    cidade: string;
    valor_venda: number;
    status: 'Disponível' | 'Vendido' | 'Reservado';
    area_principal: number;
    quartos: number;
    suites?: number;
    banheiros: number;
    vagas_garagem: number;
    imovel_padrao?: string;
    lazer_padrao?: string;
    aceita_financiamento?: boolean;
    aceita_permuta?: boolean;
    descricao_ia?: string;
    composicao?: string[];
    condicoes_pagamento?: string;
    previsao_entrega?: string;
    destaque_texto?: string;

    // Internal fields - MUST NOT BE RENDERED PUBLICLY
    responsavel_nome?: string;
    responsavel_contato?: string;
    link_origem?: string;
    leads?: number;
    id_banco?: string;

    // Media
    featuredImage: string;
    images: string[];
}

import data from './properties.json';

// Definir type para status para ajudar o TypeScript a deduzir corretamente
type StatusType = 'Disponível' | 'Vendido' | 'Reservado';

export const propertiesData: Property[] = (data as unknown as any[]).map(p => ({
    ...p,
    status: p.status as StatusType
}));

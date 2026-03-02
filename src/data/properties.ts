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

export const propertiesData: Property[] = [
    {
        id: "casa-contemporanea-litoral",
        codigo_interno: "IMV0001",
        titulo: "Casa Contemporânea no Litoral",
        tipo_imovel: "Casa",
        bairro: "Enseada",
        cidade: "São Francisco do Sul, SC",
        valor_venda: 480000,
        status: 'Disponível',
        area_principal: 140,
        quartos: 3,
        suites: 1,
        banheiros: 3,
        vagas_garagem: 2,
        imovel_padrao: "Alto Padrão",
        lazer_padrao: "Piscina, Espaço Gourmet",
        aceita_financiamento: true,
        aceita_permuta: true,
        descricao_ia: "Espetacular casa de design contemporâneo no litoral catarinense, ideal para quem busca requinte e integração com a natureza. Localizada em uma rua tranquila, sem saída, garantindo total silêncio e privacidade. Área externa com piscina aquecida e espaço gourmet totalmente equipado.",
        composicao: ["3 Quartos (1 Suíte)", "Sala ampla", "Cozinha integrada", "Área de serviço", "Piscina aquecida"],
        condicoes_pagamento: "Aceita permuta por apartamento em Joinville até R$ 200 mil. Financiável via SBPE.",
        destaque_texto: "EXCLUSIVIDADE",
        responsavel_nome: "Peterson Weidgennant",
        responsavel_contato: "47991523220",
        leads: 42,
        featuredImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
        ]
    },
    {
        id: "apartamento-luminoso-centro",
        codigo_interno: "IMV0002",
        titulo: "Apartamento Luminoso no Centro",
        tipo_imovel: "Apartamento",
        bairro: "Centro",
        cidade: "Joinville",
        valor_venda: 215000,
        status: 'Disponível',
        area_principal: 64,
        quartos: 2,
        suites: 0,
        banheiros: 2,
        vagas_garagem: 1,
        imovel_padrao: "Econômico",
        aceita_financiamento: true,
        aceita_permuta: false,
        descricao_ia: "Excelente oportunidade para o primeiro imóvel no coração de Joinville. Apartamento em andar alto, oferecendo ventilação cruzada e uma vista incrível do final de tarde. O condomínio tem poucas unidades, sendo muito familiar.",
        composicao: ["2 Quartos", "Sala de estar e jantar", "Cozinha", "Sacada com Reiki", "Piso Laminado"],
        condicoes_pagamento: "Enquadra no Minha Casa Minha Vida (Faixa 2). Utilize seu FGTS.",
        destaque_texto: "NOVO M.C.M.V",
        responsavel_nome: "Corretor X",
        leads: 12,
        featuredImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1e5250ad11?auto=format&fit=crop&q=80",
        ]
    },
    {
        id: "sobrado-moderno-jardim",
        codigo_interno: "IMV0003",
        titulo: "Sobrado Moderno com Jardim",
        tipo_imovel: "Sobrado",
        bairro: "Iririú",
        cidade: "Joinville",
        valor_venda: 340000,
        status: 'Reservado',
        area_principal: 110,
        quartos: 3,
        suites: 1,
        banheiros: 2,
        vagas_garagem: 2,
        imovel_padrao: "Médio Padrão",
        aceita_financiamento: true,
        aceita_permuta: false,
        descricao_ia: "Um belíssimo sobrado em fase final de acabamento em uma das regiões que mais crescem em Joinville. Excelente terreno nos fundos, perfeito para montar uma área de festas com piscina. Esquadrias de alumínio preto e porta pivotante ripada.",
        composicao: ["3 Quartos (1 Suíte)", "Sala e Cozinha integradas", "Lavabo", "Quintal nos fundos"],
        condicoes_pagamento: "Financiamento facilitado em até 420 meses.",
        previsao_entrega: "Outubro / 2026",
        destaque_texto: "LANÇAMENTO",
        responsavel_nome: "Peterson Weidgennant",
        leads: 85,
        featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
        ]
    }
];

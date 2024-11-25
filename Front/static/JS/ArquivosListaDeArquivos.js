/**
 * Dados Mockados para Bibliotecas, Pastas e Documentos seguindo a estrutura das APIs.
 */

// Resposta de Bibliotecas
const mockLibrariesResponse = {
  CODRESPOSTA: [
    {
      current_page: 1,
      pages: 2,
      per_pages: 50,
      registros: 10,
      status: 200,
    },
  ],
  DADOS: [
    {
      codbdoc: 1,
      data_criacao: "2024-11-06T22:51:01Z",
      descricao: "DOCUMENTOS DA CAMPANHA 2024",
      id: 7,
      nome: "CAMPANHA 2024-DOCUMENTOS",
      qtde_pastas: 3,
    },
    {
      codbdoc: 2,
      data_criacao: "2024-11-07T10:15:30Z",
      descricao: "IMAGENS DA CAMPANHA 2024",
      id: 8,
      nome: "CAMPANHA 2024-IMAGENS",
      qtde_pastas: 4,
    },
    {
      codbdoc: 3,
      data_criacao: "2024-11-03T09:00:00Z",
      descricao: "CONTRATOS DIVERSOS",
      id: 5,
      nome: "CONTRATOS",
      qtde_pastas: 5,
    },
    {
      codbdoc: 4,
      data_criacao: "2024-10-21T14:16:16Z",
      descricao: "PARCERIAS E FOMENTO",
      id: 6,
      nome: "PARCERIAS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 5,
      data_criacao: "2024-10-22T08:00:00Z",
      descricao: "RECURSOS HUMANOS",
      id: 4,
      nome: "RH",
      qtde_pastas: 3,
    },
    {
      codbdoc: 6,
      data_criacao: "2024-11-10T09:00:00Z",
      descricao: "GESTÃO FINANCEIRA",
      id: 9,
      nome: "FINANCEIRO",
      qtde_pastas: 2,
    },
    {
      codbdoc: 7,
      data_criacao: "2024-11-11T11:30:45Z",
      descricao: "MARKETING E PUBLICIDADE",
      id: 10,
      nome: "MARKETING",
      qtde_pastas: 4,
    },
    {
      codbdoc: 8,
      data_criacao: "2024-11-12T08:20:10Z",
      descricao: "ARQUIVOS JURÍDICOS",
      id: 11,
      nome: "JURÍDICO",
      qtde_pastas: 3,
    },
    {
      codbdoc: 9,
      data_criacao: "2024-11-13T13:45:00Z",
      descricao: "TREINAMENTOS CORPORATIVOS",
      id: 12,
      nome: "TREINAMENTOS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 10,
      data_criacao: "2024-11-14T16:30:25Z",
      descricao: "GESTÃO DE PROJETOS",
      id: 13,
      nome: "PROJETOS",
      qtde_pastas: 5,
    },
  ],
};

// Resposta de Pastas
const mockFoldersResponse = {
  // Biblioteca 1
  7: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 3, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 1,
        data_criacao: "2024-11-01",
        descricao: "Planejamento",
        id: 101,
        nome: "Planejamento",
        qtde_docs: 5,
      },
      {
        codbdoc: 1,
        data_criacao: "2024-11-05",
        descricao: "Execução",
        id: 102,
        nome: "Execução",
        qtde_docs: 8,
      },
      {
        codbdoc: 1,
        data_criacao: "2024-11-10",
        descricao: "Avaliação",
        id: 103,
        nome: "Avaliação",
        qtde_docs: 4,
      },
    ],
  },

  // Biblioteca 2
  8: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 4, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 2,
        data_criacao: "2024-11-02",
        descricao: "Proposta",
        id: 201,
        nome: "Proposta",
        qtde_docs: 10,
      },
      {
        codbdoc: 2,
        data_criacao: "2024-11-06",
        descricao: "Execução",
        id: 202,
        nome: "Execução",
        qtde_docs: 15,
      },
      {
        codbdoc: 2,
        data_criacao: "2024-11-12",
        descricao: "Eventos",
        id: 203,
        nome: "Eventos",
        qtde_docs: 20,
      },
      {
        codbdoc: 2,
        data_criacao: "2024-11-15",
        descricao: "Conclusão",
        id: 204,
        nome: "Conclusão",
        qtde_docs: 5,
      },
    ],
  },

  // Biblioteca 3
  5: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 3,
        data_criacao: "2024-11-03",
        descricao: "Fornecedores",
        id: 301,
        nome: "Fornecedores",
        qtde_docs: 12,
      },
      {
        codbdoc: 3,
        data_criacao: "2024-11-04",
        descricao: "Serviços",
        id: 302,
        nome: "Serviços",
        qtde_docs: 8,
      },
      {
        codbdoc: 3,
        data_criacao: "2024-11-07",
        descricao: "Parcerias",
        id: 303,
        nome: "Parcerias",
        qtde_docs: 6,
      },
      {
        codbdoc: 3,
        data_criacao: "2024-11-09",
        descricao: "Locação",
        id: 304,
        nome: "Locação",
        qtde_docs: 4,
      },
      {
        codbdoc: 3,
        data_criacao: "2024-11-13",
        descricao: "Empregados",
        id: 305,
        nome: "Empregados",
        qtde_docs: 10,
      },
    ],
  },

  // Biblioteca 4
  6: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 2, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 4,
        data_criacao: "2024-10-22",
        descricao: "Parcerias Estratégicas",
        id: 401,
        nome: "Parcerias Estratégicas",
        qtde_docs: 7,
      },
      {
        codbdoc: 4,
        data_criacao: "2024-10-25",
        descricao: "Fomento",
        id: 402,
        nome: "Fomento",
        qtde_docs: 3,
      },
    ],
  },

  // Biblioteca 5
  4: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 3, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 5,
        data_criacao: "2024-10-23",
        descricao: "Contratações",
        id: 501,
        nome: "Contratações",
        qtde_docs: 9,
      },
      {
        codbdoc: 5,
        data_criacao: "2024-10-24",
        descricao: "Treinamentos",
        id: 502,
        nome: "Treinamentos",
        qtde_docs: 6,
      },
      {
        codbdoc: 5,
        data_criacao: "2024-10-26",
        descricao: "Avaliações",
        id: 503,
        nome: "Avaliações",
        qtde_docs: 4,
      },
    ],
  },

  // Biblioteca 6
  9: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 2, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 6,
        data_criacao: "2024-11-10",
        descricao: "Relatórios Financeiros",
        id: 601,
        nome: "Relatórios",
        qtde_docs: 10,
      },
      {
        codbdoc: 6,
        data_criacao: "2024-11-11",
        descricao: "Orçamentos",
        id: 602,
        nome: "Orçamentos",
        qtde_docs: 5,
      },
    ],
  },

  // Biblioteca 7
  10: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 4, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 7,
        data_criacao: "2024-11-11",
        descricao: "Campanhas",
        id: 701,
        nome: "Campanhas",
        qtde_docs: 12,
      },
      {
        codbdoc: 7,
        data_criacao: "2024-11-12",
        descricao: "Anúncios",
        id: 702,
        nome: "Anúncios",
        qtde_docs: 15,
      },
      {
        codbdoc: 7,
        data_criacao: "2024-11-13",
        descricao: "Relatórios de Marketing",
        id: 703,
        nome: "Relatórios de Marketing",
        qtde_docs: 8,
      },
      {
        codbdoc: 7,
        data_criacao: "2024-11-14",
        descricao: "Materiais Promocionais",
        id: 704,
        nome: "Materiais Promocionais",
        qtde_docs: 10,
      },
    ],
  },

  // Biblioteca 8
  11: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 3, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 8,
        data_criacao: "2024-11-12",
        descricao: "Contratos Jurídicos",
        id: 801,
        nome: "Contratos Jurídicos",
        qtde_docs: 7,
      },
      {
        codbdoc: 8,
        data_criacao: "2024-11-13",
        descricao: "Processos Legais",
        id: 802,
        nome: "Processos Legais",
        qtde_docs: 5,
      },
      {
        codbdoc: 8,
        data_criacao: "2024-11-14",
        descricao: "Documentação Legal",
        id: 803,
        nome: "Documentação Legal",
        qtde_docs: 6,
      },
    ],
  },

  // Biblioteca 9
  12: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 2, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 9,
        data_criacao: "2024-11-13",
        descricao: "Cursos Internos",
        id: 901,
        nome: "Cursos Internos",
        qtde_docs: 9,
      },
      {
        codbdoc: 9,
        data_criacao: "2024-11-14",
        descricao: "Workshops",
        id: 902,
        nome: "Workshops",
        qtde_docs: 7,
      },
    ],
  },

  // Biblioteca 10
  13: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      {
        codbdoc: 10,
        data_criacao: "2024-11-14",
        descricao: "Iniciação de Projetos",
        id: 1001,
        nome: "Iniciação",
        qtde_docs: 11,
      },
      {
        codbdoc: 10,
        data_criacao: "2024-11-15",
        descricao: "Planejamento de Projetos",
        id: 1002,
        nome: "Planejamento",
        qtde_docs: 14,
      },
      {
        codbdoc: 10,
        data_criacao: "2024-11-16",
        descricao: "Execução de Projetos",
        id: 1003,
        nome: "Execução",
        qtde_docs: 13,
      },
      {
        codbdoc: 10,
        data_criacao: "2024-11-17",
        descricao: "Monitoramento",
        id: 1004,
        nome: "Monitoramento",
        qtde_docs: 10,
      },
      {
        codbdoc: 10,
        data_criacao: "2024-11-18",
        descricao: "Encerramento",
        id: 1005,
        nome: "Encerramento",
        qtde_docs: 8,
      },
    ],
  },
};

// Resposta de Documentos
const mockDocumentsResponse = {
  // Pastas da Biblioteca 1
  101: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      {
        id: 1001,
        nome: "Plano_de_Acao.pdf",
        descricao: "Plano de ação para o planejamento estratégico.",
        data_criacao: "2024-11-01T10:00:00Z",
      },
      {
        id: 1002,
        nome: "Cronograma.xlsx",
        descricao: "Cronograma detalhado das atividades.",
        data_criacao: "2024-11-01T12:00:00Z",
      },
      {
        id: 1003,
        nome: "Orcamento.docx",
        descricao: "Orçamento previsto para o ano fiscal.",
        data_criacao: "2024-11-01T14:00:00Z",
      },
      {
        id: 1004,
        nome: "Analise_SWOT.pptx",
        descricao: "Apresentação da análise SWOT.",
        data_criacao: "2024-11-01T16:00:00Z",
      },
      {
        id: 1005,
        nome: "Estrategias_de_Marketing.pdf",
        descricao: "Estratégias de marketing para expansão.",
        data_criacao: "2024-11-01T18:00:00Z",
      },
    ],
  },
  102: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 8, status: 200 },
    ],
    DADOS: [
      {
        id: 1006,
        nome: "Relatorio_Semanal.pdf",
        descricao: "Relatório semanal de progresso.",
        data_criacao: "2024-11-05T09:00:00Z",
      },
      {
        id: 1007,
        nome: "Feedback_Equipe.docx",
        descricao: "Feedback dos membros da equipe.",
        data_criacao: "2024-11-05T11:00:00Z",
      },
      {
        id: 1008,
        nome: "Ajustes_Estrategia.xlsx",
        descricao: "Ajustes na estratégia baseada no feedback.",
        data_criacao: "2024-11-05T13:00:00Z",
      },
      {
        id: 1009,
        nome: "Atualizacao_Recursos.pptx",
        descricao: "Atualização dos recursos disponíveis.",
        data_criacao: "2024-11-05T15:00:00Z",
      },
      {
        id: 1010,
        nome: "Relatorio_Financeiro.pdf",
        descricao: "Relatório financeiro trimestral.",
        data_criacao: "2024-11-05T17:00:00Z",
      },
      {
        id: 1011,
        nome: "Desempenho.docx",
        descricao: "Análise de desempenho da equipe.",
        data_criacao: "2024-11-05T19:00:00Z",
      },
      {
        id: 1012,
        nome: "Plano_Contingencia.xlsx",
        descricao: "Plano de contingência para riscos identificados.",
        data_criacao: "2024-11-05T21:00:00Z",
      },
      {
        id: 1013,
        nome: "Resumo_Atividades.pptx",
        descricao: "Resumo das atividades realizadas no período.",
        data_criacao: "2024-11-05T23:00:00Z",
      },
    ],
  },
  // Adicione os documentos para as demais pastas seguindo o mesmo padrão
  // Biblioteca 1 - Pasta 103
  103: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 4, status: 200 },
    ],
    DADOS: [
      {
        id: 1014,
        nome: "Relatorio_Avaliacao.pdf",
        descricao: "Relatório de avaliação do projeto.",
        data_criacao: "2024-11-10T10:00:00Z",
      },
      {
        id: 1015,
        nome: "Feedback_Avaliacao.docx",
        descricao: "Feedback sobre a avaliação realizada.",
        data_criacao: "2024-11-10T12:00:00Z",
      },
      {
        id: 1016,
        nome: "Melhorias_Sugeridas.xlsx",
        descricao: "Planilha com melhorias sugeridas.",
        data_criacao: "2024-11-10T14:00:00Z",
      },
      {
        id: 1017,
        nome: "Conclusao_Avaliacao.pptx",
        descricao: "Apresentação da conclusão da avaliação.",
        data_criacao: "2024-11-10T16:00:00Z",
      },
    ],
  },

  // Biblioteca 2 - Pastas 201 a 204
  201: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 10, status: 200 },
    ],
    DADOS: [
      {
        id: 2001,
        nome: "Proposta_Parceria_A.pdf",
        descricao: "Proposta de parceria para o projeto A.",
        data_criacao: "2024-11-02T10:00:00Z",
      },
      {
        id: 2002,
        nome: "Proposta_Parceria_B.pdf",
        descricao: "Proposta de parceria para o projeto B.",
        data_criacao: "2024-11-02T12:00:00Z",
      },
      {
        id: 2003,
        nome: "Contrato_Parceria_A.docx",
        descricao: "Contrato de parceria para o projeto A.",
        data_criacao: "2024-11-02T14:00:00Z",
      },
      {
        id: 2004,
        nome: "Contrato_Parceria_B.docx",
        descricao: "Contrato de parceria para o projeto B.",
        data_criacao: "2024-11-02T16:00:00Z",
      },
      {
        id: 2005,
        nome: "Termo_Compromisso_A.pdf",
        descricao: "Termo de compromisso para o projeto A.",
        data_criacao: "2024-11-02T18:00:00Z",
      },
      {
        id: 2006,
        nome: "Termo_Compromisso_B.pdf",
        descricao: "Termo de compromisso para o projeto B.",
        data_criacao: "2024-11-02T20:00:00Z",
      },
      {
        id: 2007,
        nome: "Orcamento_Projeto_A.xlsx",
        descricao: "Orçamento detalhado para o projeto A.",
        data_criacao: "2024-11-02T22:00:00Z",
      },
      {
        id: 2008,
        nome: "Orcamento_Projeto_B.xlsx",
        descricao: "Orçamento detalhado para o projeto B.",
        data_criacao: "2024-11-02T23:00:00Z",
      },
      {
        id: 2009,
        nome: "Plano_Acao_Projeto_A.pptx",
        descricao: "Plano de ação para o projeto A.",
        data_criacao: "2024-11-02T09:00:00Z",
      },
      {
        id: 2010,
        nome: "Plano_Acao_Projeto_B.pptx",
        descricao: "Plano de ação para o projeto B.",
        data_criacao: "2024-11-02T11:00:00Z",
      },
    ],
  },
  202: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 15, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Execução da Biblioteca 2
      // Replicar conforme necessário
      {
        id: 2011,
        nome: "Execucao_Fase1.pdf",
        descricao: "Detalhes da execução da fase 1.",
        data_criacao: "2024-11-06T10:00:00Z",
      },
      // ... (mais documentos até 15)
    ],
  },
  203: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 20, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Eventos da Biblioteca 2
      {
        id: 2021,
        nome: "Evento1.pdf",
        descricao: "Detalhes do Evento 1.",
        data_criacao: "2024-11-12T10:00:00Z",
      },
      // ... (mais documentos até 20)
    ],
  },
  204: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Conclusão da Biblioteca 2
      {
        id: 2031,
        nome: "Conclusao_Projeto.pdf",
        descricao: "Conclusão do projeto final.",
        data_criacao: "2024-11-15T10:00:00Z",
      },
      // ... (mais documentos até 5)
    ],
  },

  // Biblioteca 3 - Pastas 301 a 305
  301: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 12, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Fornecedores
      {
        id: 3001,
        nome: "Fornecedor_A.pdf",
        descricao: "Contrato com o Fornecedor A.",
        data_criacao: "2024-11-03T10:00:00Z",
      },
      // ... (mais documentos até 12)
    ],
  },
  302: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 8, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Serviços
      {
        id: 3002,
        nome: "Servico_A.docx",
        descricao: "Descrição do Serviço A.",
        data_criacao: "2024-11-04T10:00:00Z",
      },
      // ... (mais documentos até 8)
    ],
  },
  303: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 6, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Parcerias
      {
        id: 3003,
        nome: "Parceria_A.pdf",
        descricao: "Detalhes da Parceria A.",
        data_criacao: "2024-11-07T10:00:00Z",
      },
      // ... (mais documentos até 6)
    ],
  },
  304: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 4, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Locação
      {
        id: 3004,
        nome: "Contrato_Locacao.pdf",
        descricao: "Contrato de locação de equipamentos.",
        data_criacao: "2024-11-09T10:00:00Z",
      },
      // ... (mais documentos até 4)
    ],
  },
  305: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 10, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Empregados
      {
        id: 3005,
        nome: "Empregado_A.docx",
        descricao: "Dados do Empregado A.",
        data_criacao: "2024-11-13T10:00:00Z",
      },
      // ... (mais documentos até 10)
    ],
  },

  // Biblioteca 4 - Pastas 401 e 402
  401: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 7, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Parcerias Estratégicas
      {
        id: 4001,
        nome: "Parceria_Estrategica_A.pdf",
        descricao: "Detalhes da Parceria Estratégica A.",
        data_criacao: "2024-10-22T10:00:00Z",
      },
      // ... (mais documentos até 7)
    ],
  },
  402: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 3, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Fomento
      {
        id: 4002,
        nome: "Fomento_A.pdf",
        descricao: "Detalhes do Fomento A.",
        data_criacao: "2024-10-25T10:00:00Z",
      },
      // ... (mais documentos até 3)
    ],
  },

  // Biblioteca 5 - Pastas 501 a 503
  501: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 9, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Contratações
      {
        id: 5001,
        nome: "Contrato_Contratacao_A.pdf",
        descricao: "Contrato de contratação A.",
        data_criacao: "2024-10-23T10:00:00Z",
      },
      // ... (mais documentos até 9)
    ],
  },
  502: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 6, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Treinamentos
      {
        id: 5002,
        nome: "Treinamento_A.pptx",
        descricao: "Material do Treinamento A.",
        data_criacao: "2024-10-24T10:00:00Z",
      },
      // ... (mais documentos até 6)
    ],
  },
  503: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 4, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Avaliações
      {
        id: 5003,
        nome: "Avaliacao_A.docx",
        descricao: "Avaliação do Treinamento A.",
        data_criacao: "2024-10-26T10:00:00Z",
      },
      // ... (mais documentos até 4)
    ],
  },

  // Biblioteca 6 - Pastas 601 e 602
  601: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 10, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Relatórios Financeiros
      {
        id: 6001,
        nome: "Relatorio_Financeiro_Q1.pdf",
        descricao: "Relatório financeiro do primeiro trimestre.",
        data_criacao: "2024-11-10T10:00:00Z",
      },
      // ... (mais documentos até 10)
    ],
  },
  602: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Orçamentos
      {
        id: 6002,
        nome: "Orcamento_Anual.xlsx",
        descricao: "Orçamento anual detalhado.",
        data_criacao: "2024-11-11T10:00:00Z",
      },
      // ... (mais documentos até 5)
    ],
  },

  // Biblioteca 7 - Pastas 701 a 704
  701: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 12, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Campanhas
      {
        id: 7001,
        nome: "Campanha_Verao.pdf",
        descricao: "Detalhes da Campanha de Verão.",
        data_criacao: "2024-11-11T10:00:00Z",
      },
      // ... (mais documentos até 12)
    ],
  },
  702: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 15, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Anúncios
      {
        id: 7002,
        nome: "Anuncio_Facebook.pdf",
        descricao: "Anúncio para Facebook.",
        data_criacao: "2024-11-12T10:00:00Z",
      },
      // ... (mais documentos até 15)
    ],
  },
  703: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 8, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Relatórios de Marketing
      {
        id: 7003,
        nome: "Relatorio_Marketing_Janeiro.pdf",
        descricao: "Relatório de Marketing de Janeiro.",
        data_criacao: "2024-11-13T10:00:00Z",
      },
      // ... (mais documentos até 8)
    ],
  },
  704: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 10, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Materiais Promocionais
      {
        id: 7004,
        nome: "Flyer_Campanha_Verao.pdf",
        descricao: "Flyer para a Campanha de Verão.",
        data_criacao: "2024-11-14T10:00:00Z",
      },
      // ... (mais documentos até 10)
    ],
  },

  // Biblioteca 8 - Pastas 801 a 803
  801: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 7, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Contratos Jurídicos
      {
        id: 8001,
        nome: "Contrato_Juridico_A.pdf",
        descricao: "Contrato jurídico A.",
        data_criacao: "2024-11-12T10:00:00Z",
      },
      // ... (mais documentos até 7)
    ],
  },
  802: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 5, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Processos Legais
      {
        id: 8002,
        nome: "Processo_Legal_A.docx",
        descricao: "Detalhes do Processo Legal A.",
        data_criacao: "2024-11-13T10:00:00Z",
      },
      // ... (mais documentos até 5)
    ],
  },
  803: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 6, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Documentação Legal
      {
        id: 8003,
        nome: "Documentacao_Legal_A.pdf",
        descricao: "Documentação legal referente a A.",
        data_criacao: "2024-11-14T10:00:00Z",
      },
      // ... (mais documentos até 6)
    ],
  },

  // Biblioteca 9 - Pastas 901 e 902
  901: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 9, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Cursos Internos
      {
        id: 9001,
        nome: "Curso_Desenvolvimento.pdf",
        descricao: "Material do Curso de Desenvolvimento.",
        data_criacao: "2024-11-13T10:00:00Z",
      },
      // ... (mais documentos até 9)
    ],
  },
  902: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 7, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Workshops
      {
        id: 9002,
        nome: "Workshop_Lideranca.pptx",
        descricao: "Material do Workshop de Liderança.",
        data_criacao: "2024-11-14T10:00:00Z",
      },
      // ... (mais documentos até 7)
    ],
  },

  // Biblioteca 10 - Pastas 1001 a 1005
  1001: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 11, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Iniciação
      {
        id: 10001,
        nome: "Termo_Iniciacao_Projeto_A.pdf",
        descricao: "Termo de iniciação do Projeto A.",
        data_criacao: "2024-11-14T10:00:00Z",
      },
      // ... (mais documentos até 11)
    ],
  },
  1002: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 14, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Planejamento
      {
        id: 10002,
        nome: "Plano_Projeto_A.xlsx",
        descricao: "Plano detalhado do Projeto A.",
        data_criacao: "2024-11-15T10:00:00Z",
      },
      // ... (mais documentos até 14)
    ],
  },
  1003: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 13, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Execução
      {
        id: 10003,
        nome: "Execucao_Projeto_A.docx",
        descricao: "Relatório de execução do Projeto A.",
        data_criacao: "2024-11-16T10:00:00Z",
      },
      // ... (mais documentos até 13)
    ],
  },
  1004: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 10, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Monitoramento
      {
        id: 10004,
        nome: "Monitoramento_Projeto_A.pdf",
        descricao: "Relatório de monitoramento do Projeto A.",
        data_criacao: "2024-11-17T10:00:00Z",
      },
      // ... (mais documentos até 10)
    ],
  },
  1005: {
    CODRESPOSTA: [
      { current_page: 1, pages: 1, per_pages: 50, registros: 8, status: 200 },
    ],
    DADOS: [
      // Exemplos de documentos para a pasta Encerramento
      {
        id: 10005,
        nome: "Encerramento_Projeto_A.pdf",
        descricao: "Documentação de encerramento do Projeto A.",
        data_criacao: "2024-11-18T10:00:00Z",
      },
      // ... (mais documentos até 8)
    ],
  },
};

/**
 * Mock de resposta da API de Documentos.
 * Estrutura: { [folderId]: { CODRESPOSTA, DADOS } }
 */
class DataService {
  constructor() {
    this.cache = {
      libraries: null,
      folders: new Map(),
      documents: new Map(),
    };
  }

  /**
   * Função para buscar todas as bibliotecas com caching.
   * @returns {Promise<Array>} - Retorna uma promessa que resolve para um array de bibliotecas.
   */
  async fetchLibraries() {
    if (this.cache.libraries) {
      console.log("Bibliotecas obtidas do cache.");
      return this.cache.libraries;
    }
    try {
      const response = await this._simulateFetchLibraries();
      const data = response.DADOS.map((lib) => ({
        id: lib.id,
        type: "library",
        name: lib.nome,
        description: lib.descricao || "Sem descrição",
        creationDate: lib.data_criacao
          ? new Date(lib.data_criacao).toLocaleDateString()
          : "N/A",
        numFolders: lib.qtde_pastas || 0, // Adicionado para contagem de pastas
        children: [], // Será carregado dinamicamente
      }));
      this.cache.libraries = data;
      console.log("Bibliotecas carregadas e armazenadas no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar bibliotecas:", error);
      throw error;
    }
  }

  /**
   * Função para buscar todas as pastas de uma biblioteca específica com caching.
   * @param {number} libId - ID da biblioteca.
   * @returns {Promise<Array>} - Retorna uma promessa que resolve para um array de pastas.
   */
  async fetchFolders(libId) {
    if (this.cache.folders.has(libId)) {
      console.log(`Pastas da biblioteca ${libId} obtidas do cache.`);
      return this.cache.folders.get(libId);
    }
    try {
      const response = await this._simulateFetchFolders(libId);
      const data = response.DADOS.map((folder) => ({
        id: folder.id,
        type: "folder",
        name: folder.nome,
        description: folder.descricao || "Sem descrição",
        creationDate: folder.data_criacao || "N/A",
        numDocuments: folder.qtde_docs || 0, // Adicionado para contagem de documentos
        children: [], // Será carregado dinamicamente
      }));
      this.cache.folders.set(libId, data);
      console.log(
        `Pastas da biblioteca ${libId} carregadas e armazenadas no cache.`
      );
      return data;
    } catch (error) {
      console.error(`Erro ao buscar pastas da biblioteca ${libId}:`, error);
      throw error;
    }
  }

  /**
   * Função para buscar documentos de uma pasta específica com caching.
   * @param {number} folderId - ID da pasta.
   * @returns {Promise<Array>} - Retorna uma promessa que resolve para um array de documentos.
   */
  async fetchDocuments(folderId) {
    if (this.cache.documents.has(folderId)) {
      console.log(`Documentos da pasta ${folderId} obtidos do cache.`);
      return this.cache.documents.get(folderId);
    }
    try {
      const response = await this._simulateFetchDocuments(folderId);
      const data = response.DADOS.map((doc) => ({
        id: doc.id,
        type: "document",
        name: doc.nome,
        description: doc.descricao || "Sem descrição",
        creationDate: doc.data_criacao
          ? new Date(doc.data_criacao).toLocaleDateString()
          : "N/A",
        children: [], // Documentos geralmente não têm filhos
      }));
      this.cache.documents.set(folderId, data);
      console.log(
        `Documentos da pasta ${folderId} carregados e armazenados no cache.`
      );
      return data;
    } catch (error) {
      console.error(`Erro ao buscar documentos da pasta ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Função para simular a chamada da API de bibliotecas.
   * @returns {Promise<Object>} - Promessa que resolve para a resposta mockada da API.
   */
  _simulateFetchLibraries() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLibrariesResponse);
      }, 500); // Simula atraso de 500ms
    });
  }

  /**
   * Função para simular a chamada da API de pastas.
   * @param {number} libId - ID da biblioteca.
   * @returns {Promise<Object>} - Promessa que resolve para a resposta mockada da API.
   */
  _simulateFetchFolders(libId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockFoldersResponse[libId]) {
          resolve(mockFoldersResponse[libId]);
        } else {
          // Retorna uma resposta vazia com status 404 se a biblioteca não tiver pastas mockadas
          resolve({
            CODRESPOSTA: [
              {
                current_page: 1,
                pages: 1,
                per_pages: 50,
                registros: 0,
                status: 404,
              },
            ],
            DADOS: [],
          });
        }
      }, 500); // Simula atraso de 500ms
    });
  }

  /**
   * Função para simular a chamada da API de documentos.
   * @param {number} folderId - ID da pasta.
   * @returns {Promise<Object>} - Promessa que resolve para a resposta mockada da API.
   */
  _simulateFetchDocuments(folderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockDocumentsResponse[folderId]) {
          resolve(mockDocumentsResponse[folderId]);
        } else {
          // Retorna um array vazio se não houver documentos mockados para a pasta
          resolve({
            CODRESPOSTA: [
              {
                current_page: 1,
                pages: 1,
                per_pages: 50,
                registros: 0,
                status: 200,
              },
            ],
            DADOS: [],
          });
        }
      }, 500); // Simula atraso de 500ms
    });
  }

  /**
   * Função para limpar o cache (opcional)
   */
  clearCache() {
    this.cache.libraries = null;
    this.cache.folders.clear();
    this.cache.documents.clear();
    console.log("Cache limpo.");
  }
}

const dataService = new DataService();

export { dataService };

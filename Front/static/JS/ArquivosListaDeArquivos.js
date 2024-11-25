// ArquivosListaDeArquivos.js

/**
 * Dados Mockados para Bibliotecas, Pastas e Documentos seguindo a estrutura das APIs.
 */

/**
 * Mock de resposta da API de Bibliotecas.
 */
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
      data_criacao: "Wed, 06 Nov 2024 22:51:01 GMT",
      descricao: "DOCUMENTOS DA CAMPANHA 2024",
      id: 7,
      nome: "CAMPANHA 2024-DOCUMENTOS",
      qtde_pastas: 3,
    },
    {
      codbdoc: 2,
      data_criacao: "Thu, 07 Nov 2024 10:15:30 GMT",
      descricao: "REGISTRO FOTOGRÁFICO E IMAGENS DA CAMPANHA 2024",
      id: 8,
      nome: "CAMPANHA 2024-IMAGENS",
      qtde_pastas: 4,
    },
    {
      codbdoc: 3,
      data_criacao: null,
      descricao: "CONTRATOS DE BENS E SERVIÇOS",
      id: 5,
      nome: "CONTRATOS",
      qtde_pastas: 5,
    },
    {
      codbdoc: 4,
      data_criacao: "Mon, 21 Oct 2024 14:16:16 GMT",
      descricao:
        "CONSTRUÇÃO DE PARCERIAS POLÍTICAS, TÉCNICAS E FOMENTO DA CIDADANIA",
      id: 6,
      nome: "PARCERIAS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 5,
      data_criacao: null,
      descricao: "PASTA FUNCIONAL",
      id: 4,
      nome: "RH",
      qtde_pastas: 3,
    },
    {
      codbdoc: 6,
      data_criacao: "Fri, 10 Nov 2024 09:00:00 GMT",
      descricao: "DOCUMENTOS FINANCEIROS",
      id: 9,
      nome: "FINANCEIRO",
      qtde_pastas: 2,
    },
    {
      codbdoc: 7,
      data_criacao: "Sat, 11 Nov 2024 11:30:45 GMT",
      descricao: "Documentos de Marketing e Publicidade",
      id: 10,
      nome: "MARKETING",
      qtde_pastas: 4,
    },
    {
      codbdoc: 8,
      data_criacao: "Sun, 12 Nov 2024 08:20:10 GMT",
      descricao: "Arquivos Jurídicos e Legais",
      id: 11,
      nome: "JURÍDICO",
      qtde_pastas: 3,
    },
    {
      codbdoc: 9,
      data_criacao: "Mon, 13 Nov 2024 13:45:00 GMT",
      descricao: "Recursos Humanos e Treinamentos",
      id: 12,
      nome: "TREINAMENTOS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 10,
      data_criacao: "Tue, 14 Nov 2024 16:30:25 GMT",
      descricao: "Projetos e Desenvolvimento",
      id: 13,
      nome: "PROJETOS",
      qtde_pastas: 5,
    },
  ],
};

/**
 * Mock de resposta da API de Pastas.
 * Estrutura: { [libId]: { CODRESPOSTA, DADOS } }
 */
const mockFoldersResponse = {
  7: {
    // CAMPANHA 2024-DOCUMENTOS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 3,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 7,
        data_criacao: "01/11/2024",
        descricao: "Planejamento da Campanha",
        id: 101,
        nome: "Planejamento",
        qtde_docs: 5,
      },
      {
        codbdoc: 7,
        data_criacao: "05/11/2024",
        descricao: "Execução da Campanha",
        id: 102,
        nome: "Execução",
        qtde_docs: 8,
      },
      {
        codbdoc: 7,
        data_criacao: "10/11/2024",
        descricao: "Avaliação da Campanha",
        id: 103,
        nome: "Avaliação",
        qtde_docs: 4,
      },
    ],
  },
  8: {
    // CAMPANHA 2024-IMAGENS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 4,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 8,
        data_criacao: "02/11/2024",
        descricao: "Fotos da Proposta",
        id: 201,
        nome: "Proposta",
        qtde_docs: 10,
      },
      {
        codbdoc: 8,
        data_criacao: "06/11/2024",
        descricao: "Fotos da Execução",
        id: 202,
        nome: "Execução",
        qtde_docs: 15,
      },
      {
        codbdoc: 8,
        data_criacao: "12/11/2024",
        descricao: "Fotos dos Eventos",
        id: 203,
        nome: "Eventos",
        qtde_docs: 20,
      },
      {
        codbdoc: 8,
        data_criacao: "15/11/2024",
        descricao: "Fotos de Conclusão",
        id: 204,
        nome: "Conclusão",
        qtde_docs: 5,
      },
    ],
  },
  5: {
    // CONTRATOS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 5,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 5,
        data_criacao: "03/11/2024",
        descricao: "Contratos de Fornecedores",
        id: 301,
        nome: "Fornecedores",
        qtde_docs: 12,
      },
      {
        codbdoc: 5,
        data_criacao: "04/11/2024",
        descricao: "Contratos de Serviços",
        id: 302,
        nome: "Serviços",
        qtde_docs: 8,
      },
      {
        codbdoc: 5,
        data_criacao: "07/11/2024",
        descricao: "Contratos de Parcerias",
        id: 303,
        nome: "Parcerias",
        qtde_docs: 6,
      },
      {
        codbdoc: 5,
        data_criacao: "09/11/2024",
        descricao: "Contratos de Locação",
        id: 304,
        nome: "Locação",
        qtde_docs: 4,
      },
      {
        codbdoc: 5,
        data_criacao: "13/11/2024",
        descricao: "Contratos de Empregados",
        id: 305,
        nome: "Empregados",
        qtde_docs: 10,
      },
    ],
  },
  6: {
    // PARCERIAS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 2,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 6,
        data_criacao: "08/11/2024",
        descricao: "Parcerias Técnicas",
        id: 401,
        nome: "Técnicas",
        qtde_docs: 7,
      },
      {
        codbdoc: 6,
        data_criacao: "14/11/2024",
        descricao: "Parcerias Políticas",
        id: 402,
        nome: "Políticas",
        qtde_docs: 9,
      },
    ],
  },
  4: {
    // RH
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 3,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 4,
        data_criacao: "19/10/2024",
        descricao: "ANDRÉ CASTRO",
        id: 501,
        nome: "ANDRÉ CASTRO",
        qtde_docs: 3,
      },
      {
        codbdoc: 4,
        data_criacao: "21/10/2024",
        descricao: "BRUNA SANTOS",
        id: 502,
        nome: "BRUNA SANTOS",
        qtde_docs: 4,
      },
      {
        codbdoc: 4,
        data_criacao: "22/10/2024",
        descricao: "EDILENE BELO",
        id: 503,
        nome: "EDILENE BELO",
        qtde_docs: 2,
      },
    ],
  },
  9: {
    // FINANCEIRO
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 2,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 9,
        data_criacao: "10/11/2024",
        descricao: "Relatórios Financeiros",
        id: 601,
        nome: "Relatórios",
        qtde_docs: 10,
      },
      {
        codbdoc: 9,
        data_criacao: "11/11/2024",
        descricao: "Comprovantes de Pagamento",
        id: 602,
        nome: "Pagamentos",
        qtde_docs: 15,
      },
    ],
  },
  10: {
    // MARKETING
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 4,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 10,
        data_criacao: "12/11/2024",
        descricao: "Campanhas Publicitárias",
        id: 701,
        nome: "Campanhas",
        qtde_docs: 20,
      },
      {
        codbdoc: 10,
        data_criacao: "13/11/2024",
        descricao: "Materiais Promocionais",
        id: 702,
        nome: "Materiais",
        qtde_docs: 25,
      },
      {
        codbdoc: 10,
        data_criacao: "14/11/2024",
        descricao: "Análises de Mercado",
        id: 703,
        nome: "Análises",
        qtde_docs: 18,
      },
      {
        codbdoc: 10,
        data_criacao: "15/11/2024",
        descricao: "Relatórios de Campanha",
        id: 704,
        nome: "Relatórios",
        qtde_docs: 12,
      },
    ],
  },
  11: {
    // JURÍDICO
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 3,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 11,
        data_criacao: "16/11/2024",
        descricao: "Contratos Legais",
        id: 801,
        nome: "Contratos",
        qtde_docs: 10,
      },
      {
        codbdoc: 11,
        data_criacao: "17/11/2024",
        descricao: "Documentos Jurídicos",
        id: 802,
        nome: "Documentos",
        qtde_docs: 8,
      },
      {
        codbdoc: 11,
        data_criacao: "18/11/2024",
        descricao: "Processos Legais",
        id: 803,
        nome: "Processos",
        qtde_docs: 5,
      },
    ],
  },
  12: {
    // TREINAMENTOS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 2,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 12,
        data_criacao: "19/11/2024",
        descricao: "Programas de Treinamento",
        id: 901,
        nome: "Programas",
        qtde_docs: 7,
      },
      {
        codbdoc: 12,
        data_criacao: "20/11/2024",
        descricao: "Materiais de Treinamento",
        id: 902,
        nome: "Materiais",
        qtde_docs: 10,
      },
    ],
  },
  13: {
    // PROJETOS
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 5,
        status: 200,
      },
    ],
    DADOS: [
      {
        codbdoc: 13,
        data_criacao: "21/11/2024",
        descricao: "Projetos em Andamento",
        id: 1001,
        nome: "Andamento",
        qtde_docs: 15,
      },
      {
        codbdoc: 13,
        data_criacao: "22/11/2024",
        descricao: "Projetos Concluídos",
        id: 1002,
        nome: "Concluídos",
        qtde_docs: 20,
      },
      {
        codbdoc: 13,
        data_criacao: "23/11/2024",
        descricao: "Planejamento de Projetos",
        id: 1003,
        nome: "Planejamento",
        qtde_docs: 10,
      },
      {
        codbdoc: 13,
        data_criacao: "24/11/2024",
        descricao: "Avaliação de Projetos",
        id: 1004,
        nome: "Avaliação",
        qtde_docs: 12,
      },
      {
        codbdoc: 13,
        data_criacao: "25/11/2024",
        descricao: "Recursos de Projetos",
        id: 1005,
        nome: "Recursos",
        qtde_docs: 18,
      },
    ],
  },
};

/**
 * Mock de resposta da API de Documentos.
 * Estrutura: { [folderId]: { CODRESPOSTA, DADOS } }
 */
const mockDocumentsResponse = {
  101: {
    // Planejamento (Biblioteca 7)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 5,
        status: 200,
      },
    ],
    DADOS: [
      { id: 1001, nome: "Plano de Ação.pdf" },
      { id: 1002, nome: "Cronograma.xlsx" },
      { id: 1003, nome: "Orçamento.docx" },
      { id: 1004, nome: "Análise SWOT.pptx" },
      { id: 1005, nome: "Estratégias de Marketing.pdf" },
    ],
  },
  102: {
    // Execução (Biblioteca 7)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 8,
        status: 200,
      },
    ],
    DADOS: [
      { id: 1006, nome: "Relatório Semanal.pdf" },
      { id: 1007, nome: "Feedback da Equipe.docx" },
      { id: 1008, nome: "Ajustes de Estratégia.xlsx" },
      { id: 1009, nome: "Atualização de Recursos.pptx" },
      { id: 1010, nome: "Relatório Financeiro.pdf" },
      { id: 1011, nome: "Avaliação de Desempenho.docx" },
      { id: 1012, nome: "Plano de Contingência.xlsx" },
      { id: 1013, nome: "Resumo de Atividades.pptx" },
    ],
  },
  103: {
    // Avaliação (Biblioteca 7)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 4,
        status: 200,
      },
    ],
    DADOS: [
      { id: 1014, nome: "Relatório Final.pdf" },
      { id: 1015, nome: "Feedback dos Participantes.docx" },
      { id: 1016, nome: "Análise de Resultados.xlsx" },
      { id: 1017, nome: "Recomendações.pptx" },
    ],
  },
  // Adicione aqui os documentos para as demais pastas...
  // Exemplos para outras pastas:

  201: {
    // Proposta (Biblioteca 8)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 10,
        status: 200,
      },
    ],
    DADOS: Array.from({ length: 10 }, (_, i) => ({
      id: 2000 + i + 1,
      nome: `Foto_Proposta_${i + 1}.jpg`,
    })),
  },
  202: {
    // Execução (Biblioteca 8)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 15,
        status: 200,
      },
    ],
    DADOS: Array.from({ length: 15 }, (_, i) => ({
      id: 2010 + i + 1,
      nome: `Foto_Execucao_${i + 1}.jpg`,
    })),
  },
  203: {
    // Eventos (Biblioteca 8)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 20,
        status: 200,
      },
    ],
    DADOS: Array.from({ length: 20 }, (_, i) => ({
      id: 2025 + i + 1,
      nome: `Foto_Evento_${i + 1}.jpg`,
    })),
  },
  204: {
    // Conclusão (Biblioteca 8)
    CODRESPOSTA: [
      {
        current_page: 1,
        pages: 1,
        per_pages: 50,
        registros: 5,
        status: 200,
      },
    ],
    DADOS: Array.from({ length: 5 }, (_, i) => ({
      id: 2045 + i + 1,
      nome: `Foto_Conclusao_${i + 1}.jpg`,
    })),
  },
  // Continue adicionando documentos para outras pastas conforme necessário
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
        description: `Descrição do ${doc.nome}`,
        creationDate: "2024-03-10", // Data fixa para mock
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
          reject(
            new Error(`Nenhuma pasta encontrada para a biblioteca ID ${libId}`)
          );
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

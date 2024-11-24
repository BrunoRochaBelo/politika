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
      pages: 1,
      per_pages: 50,
      registros: 5,
      status: 200,
    },
  ],
  DADOS: [
    {
      codbdoc: 4,
      data_criacao: "Wed, 06 Nov 2024 22:51:01 GMT",
      descricao: "DOCUMENTOS DA CAMPANHA 2024",
      id: 7,
      nome: "CAMPANHA 2024-DOCUMENTOS",
      qtde_pastas: 3,
    },
    {
      codbdoc: 5,
      data_criacao: "Wed, 06 Nov 2024 22:51:01 GMT",
      descricao: "REGISTRO FOTOGRÁFICO E IMAGENS DA CAMPANHA 2024",
      id: 8,
      nome: "CAMPANHA 2024-IMAGENS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 2,
      data_criacao: null,
      descricao: "CONTRATOS DE BENS E SERVIÇOS",
      id: 5,
      nome: "CONTRATOS",
      qtde_pastas: 4,
    },
    {
      codbdoc: 3,
      data_criacao: "Mon, 21 Oct 2024 14:16:16 GMT",
      descricao:
        "CONSTRUÇÃO DE PARCERIAS POLÍTICAS, TÉCNICAS E FOMENTO DA CIDADANIA",
      id: 6,
      nome: "PARCERIAS",
      qtde_pastas: 2,
    },
    {
      codbdoc: 1,
      data_criacao: null,
      descricao: "PASTA FUNCIONAL",
      id: 4,
      nome: "RH",
      qtde_pastas: 5,
    },
  ],
};

/**
 * Mock de resposta da API de Pastas.
 * Exemplo para a biblioteca com id 4.
 */
const mockFoldersResponse = {
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
      codbdoc: 1,
      data_criacao: "19/10/2024",
      descricao: "Documentos pessoais de André Castro",
      id: 3,
      nome: "ANDRÉ CASTRO",
      qtde_docs: 5,
    },
    {
      codbdoc: 1,
      data_criacao: "21/10/2024",
      descricao: "Documentos pessoais de Bruna Santos",
      id: 7,
      nome: "BRUNA SANTOS",
      qtde_docs: 4,
    },
    {
      codbdoc: 1,
      data_criacao: "22/10/2024",
      descricao: "Documentos pessoais de Edilene Belo",
      id: 8,
      nome: "EDILENE BELO",
      qtde_docs: 3,
    },
  ],
};

/**
 * Mock de resposta da API de Documentos.
 * Exemplo para a pasta com id 8.
 */
const mockDocumentsResponse = {
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
      codbdoc: 1,
      data_criacao: "04/11/2024",
      descricao: "Fotografia para o crachá oficial",
      id: 9,
      nome: "FOTO_DO_CRACHA.pdf",
    },
    {
      codbdoc: 1,
      data_criacao: "22/10/2024",
      descricao: "Identidade SSP-PE digitalizada",
      id: 7,
      nome: "IDENTIDADE.pdf",
    },
  ],
};

/**
 * Classe para gerenciar o serviço de dados com caching e adaptação das respostas das APIs.
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
          ? this._formatDate(lib.data_criacao)
          : "N/A",
        numFolders: lib.qtde_pastas || 0, // Adicionado para contagem de pastas
        children: [], // Será carregado dinamicamente
      }));
      this.cache.libraries = data;
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
          ? this._formatDate(doc.data_criacao)
          : "N/A",
        children: [], // Documentos geralmente não têm filhos
      }));
      this.cache.documents.set(folderId, data);
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aqui você pode personalizar as pastas retornadas com base em libId se necessário
        // Para torná-lo mais realista, podemos variar os dados com base no libId
        let response;
        switch (libId) {
          case 7:
            response = {
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
                  codbdoc: 1,
                  data_criacao: "19/10/2024",
                  descricao: "Documentos pessoais de André Castro",
                  id: 3,
                  nome: "ANDRÉ CASTRO",
                  qtde_docs: 5,
                },
                {
                  codbdoc: 1,
                  data_criacao: "21/10/2024",
                  descricao: "Documentos pessoais de Bruna Santos",
                  id: 7,
                  nome: "BRUNA SANTOS",
                  qtde_docs: 4,
                },
                {
                  codbdoc: 1,
                  data_criacao: "22/10/2024",
                  descricao: "Documentos pessoais de Edilene Belo",
                  id: 8,
                  nome: "EDILENE BELO",
                  qtde_docs: 3,
                },
                {
                  codbdoc: 1,
                  data_criacao: "23/10/2024",
                  descricao: "Documentos administrativos",
                  id: 10,
                  nome: "ADMINISTRATIVO",
                  qtde_docs: 2,
                },
              ],
            };
            break;
          case 8:
            response = mockFoldersResponse; // Usando o mesmo mock para simplificação
            break;
          // Adicione mais casos conforme necessário para diferentes libIds
          default:
            response = mockFoldersResponse;
        }
        resolve(response);
      }, 500); // Simula atraso de 500ms
    });
  }

  /**
   * Função para simular a chamada da API de documentos.
   * @param {number} folderId - ID da pasta.
   * @returns {Promise<Object>} - Promessa que resolve para a resposta mockada da API.
   */
  _simulateFetchDocuments(folderId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aqui você pode personalizar os documentos retornados com base em folderId se necessário
        let response;
        switch (folderId) {
          case 3:
            response = {
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
                  codbdoc: 1,
                  data_criacao: "04/11/2024",
                  descricao: "Fotografia para o crachá oficial",
                  id: 9,
                  nome: "FOTO_DO_CRACHA.pdf",
                },
                {
                  codbdoc: 1,
                  data_criacao: "22/10/2024",
                  descricao: "Identidade SSP-PE digitalizada",
                  id: 7,
                  nome: "IDENTIDADE.pdf",
                },
                {
                  codbdoc: 1,
                  data_criacao: "25/10/2024",
                  descricao: "Certidão de nascimento",
                  id: 11,
                  nome: "CERTIDAO_NASCIMENTO.pdf",
                },
                {
                  codbdoc: 1,
                  data_criacao: "26/10/2024",
                  descricao: "Carteira de trabalho",
                  id: 12,
                  nome: "CARTEIRA_TRABALHO.pdf",
                },
                {
                  codbdoc: 1,
                  data_criacao: "27/10/2024",
                  descricao: "Declaração de imposto de renda",
                  id: 13,
                  nome: "DECLARACAO_IR.pdf",
                },
              ],
            };
            break;
          case 7:
            response = {
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
                  codbdoc: 1,
                  data_criacao: "05/11/2024",
                  descricao: "Contratos de serviços de Bruna",
                  id: 14,
                  nome: "CONTRATO_SERVICO_BRUNA.docx",
                },
                {
                  codbdoc: 1,
                  data_criacao: "06/11/2024",
                  descricao: "Acordo de confidencialidade",
                  id: 15,
                  nome: "ACORDO_CONFIDENCIALIDADE.pdf",
                },
                {
                  codbdoc: 1,
                  data_criacao: "07/11/2024",
                  descricao: "Documentação de projeto",
                  id: 16,
                  nome: "DOCUMENTACAO_PROJETO.xlsx",
                },
                {
                  codbdoc: 1,
                  data_criacao: "08/11/2024",
                  descricao: "Resumo executivo",
                  id: 17,
                  nome: "RESUMO_EXECUTIVO.pdf",
                },
              ],
            };
            break;
          case 8:
            response = mockDocumentsResponse; // Usando o mesmo mock para simplificação
            break;
          // Adicione mais casos conforme necessário para diferentes folderIds
          default:
            response = mockDocumentsResponse;
        }
        resolve(response);
      }, 500); // Simula atraso de 500ms
    });
  }

  /**
   * Função para formatar a data de "d/m/yyyy" para um formato mais legível.
   * @param {string} dateStr - Data no formato "d/m/yyyy".
   * @returns {string} - Data formatada como "dd/mm/yyyy".
   */
  _formatDate(dateStr) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
    return dateStr; // Retorna como está se o formato não for esperado
  }

  /**
   * Função para limpar o cache (opcional)
   */
  clearCache() {
    this.cache.libraries = null;
    this.cache.folders.clear();
    this.cache.documents.clear();
  }
}

const dataService = new DataService();

export { dataService };

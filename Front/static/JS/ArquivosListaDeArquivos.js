// ArquivosListaDeArquivos.js

/**
 * Dados Mockados para Bibliotecas, Pastas e Documentos
 */
const mockLibraries = [
  {
    id: 1,
    nome: "Biblioteca Principal",
    pastas: 2,
  },
  {
    id: 2,
    nome: "Biblioteca Secundária",
    pastas: 1,
  },
];

const mockFolders = {
  1: [
    {
      id: 101,
      nome: "Pasta Financeira",
      docs: 3,
    },
    {
      id: 102,
      nome: "Pasta Recursos Humanos",
      docs: 2,
    },
  ],
  2: [
    {
      id: 201,
      nome: "Pasta TI",
      docs: 4,
    },
  ],
};

const mockDocuments = {
  101: [
    { id: 1001, nome: "Relatório Anual.pdf" },
    { id: 1002, nome: "Planilha Orçamentária.xlsx" },
    { id: 1003, nome: "Contrato de Prestação de Serviços.docx" },
  ],
  102: [
    { id: 1004, nome: "Manual do Funcionário.pdf" },
    { id: 1005, nome: "Política de Privacidade.pdf" },
  ],
  201: [
    { id: 1006, nome: "Diagrama de Rede.vsdx" },
    { id: 1007, nome: "Plano de Backup.docx" },
    { id: 1008, nome: "Relatório de Segurança.pdf" },
    { id: 1009, nome: "Configuração de Servidores.xlsx" },
  ],
};

/**
 * Classe para gerenciar o serviço de dados com caching
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
      const data = await this._simulateFetch(
        mockLibraries.map((lib) => ({
          id: lib.id,
          type: "library",
          name: lib.nome,
          description: `Descrição da ${lib.nome}`,
          creationDate: "2024-01-15",
          children: [], // Será carregado dinamicamente
        }))
      );
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
      const folders = mockFolders[libId] || [];
      const data = await this._simulateFetch(
        folders.map((folder) => ({
          id: folder.id,
          type: "folder",
          name: folder.nome,
          description: `Descrição da ${folder.nome}`,
          creationDate: "2024-02-20",
          children: [], // Será carregado dinamicamente
        }))
      );
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
      const documents = mockDocuments[folderId] || [];
      const data = await this._simulateFetch(
        documents.map((doc) => ({
          id: doc.id,
          type: "document",
          name: doc.nome,
          description: `Descrição do ${doc.nome}`,
          creationDate: "2024-03-10",
          children: [], // Documentos geralmente não têm filhos
        }))
      );
      this.cache.documents.set(folderId, data);
      return data;
    } catch (error) {
      console.error(`Erro ao buscar documentos da pasta ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Função para simular uma requisição assíncrona com atraso.
   * @param {any} data - Dados a serem retornados.
   * @returns {Promise<any>} - Promessa que resolve para os dados fornecidos.
   */
  _simulateFetch(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
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
  }
}

const dataService = new DataService();

export { dataService };

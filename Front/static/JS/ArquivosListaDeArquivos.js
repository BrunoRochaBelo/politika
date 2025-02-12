/**
 * ArquivosListaDeArquivos.js
 *
 * - Realiza chamadas reais às APIs usando o objeto global Config, OU
 * - Retorna dados mockados localmente, caso USE_MOCK = true.
 *
 * Certifique-se de que config.js seja carregado antes deste arquivo.
 *
 * A instância de DataService é atribuída à variável global window.dataService.
 */
(function () {
  /**
   * Ative ou desative o modo MOCK.
   * true = retorna dados locais (mock).
   * false = faz requisições reais usando fetch().
   */
  const USE_MOCK = true;

  /**
   * MOCK_DATA:
   * Estrutura simulando as mesmas respostas que a API retornaria.
   */
  const MOCK_DATA = {
    // Mock para Bibliotecas
    GET_ALL_LIBS: {
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
          id: 1,
          nome: "Biblioteca A",
          descricao: "Documentos da Biblioteca A",
          data_criacao: "2024-11-01T10:00:00Z",
          qtde_pastas: 2,
        },
        {
          id: 2,
          nome: "Biblioteca B",
          descricao: "Documentos da Biblioteca B",
          data_criacao: "2024-11-05T10:00:00Z",
          qtde_pastas: 1,
        },
      ],
    },

    // Mock para Pastas – chave = ID da biblioteca
    GET_ALL_FOLDERS: {
      1: {
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
            id: 10,
            nome: "Pasta X",
            descricao: "Pasta de Documentos",
            data_criacao: "2024-11-02",
            qtde_docs: 3,
          },
          {
            id: 11,
            nome: "Pasta Y",
            descricao: "Outra pasta",
            data_criacao: "2024-11-03",
            qtde_docs: 2,
          },
        ],
      },
      2: {
        CODRESPOSTA: [
          {
            current_page: 1,
            pages: 1,
            per_pages: 50,
            registros: 1,
            status: 200,
          },
        ],
        DADOS: [
          {
            id: 20,
            nome: "Pasta Z",
            descricao: "Pasta da Biblioteca B",
            data_criacao: "2024-11-06",
            qtde_docs: 4,
          },
        ],
      },
    },

    // Mock para Documentos – chave = ID da pasta
    GET_ALL_FOLDER_DOCS: {
      10: {
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
            id: 100,
            filename: "doc1.png",
            descricao: "Documento 1",
            data_criacao: "2024-11-02",
            p1: 1,
            p2: 2,
            p3: "123456",
            p4: "2024",
          },
          {
            id: 101,
            filename: "doc2.png",
            descricao: "Documento 2",
            data_criacao: "2024-11-03",
            p1: 1,
            p2: 2,
            p3: "654321",
            p4: "2024",
          },
          {
            id: 102,
            filename: "doc3.png",
            descricao: "Documento 3",
            data_criacao: "2024-11-04",
            p1: 1,
            p2: 2,
            p3: "111111",
            p4: "2024",
          },
        ],
      },
      11: {
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
            id: 110,
            filename: "docA.png",
            descricao: "Documento A",
            data_criacao: "2024-11-05",
            p1: 2,
            p2: 1,
            p3: "222222",
            p4: "2024",
          },
          {
            id: 111,
            filename: "docB.png",
            descricao: "Documento B",
            data_criacao: "2024-11-06",
            p1: 2,
            p2: 1,
            p3: "333333",
            p4: "2024",
          },
        ],
      },
      20: {
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
            id: 200,
            filename: "docX.png",
            descricao: "Documento X",
            data_criacao: "2024-11-07",
            p1: 3,
            p2: 1,
            p3: "444444",
            p4: "2024",
          },
          {
            id: 201,
            filename: "docY.png",
            descricao: "Documento Y",
            data_criacao: "2024-11-08",
            p1: 3,
            p2: 1,
            p3: "555555",
            p4: "2024",
          },
          {
            id: 202,
            filename: "docZ.png",
            descricao: "Documento Z",
            data_criacao: "2024-11-09",
            p1: 3,
            p2: 1,
            p3: "666666",
            p4: "2024",
          },
          {
            id: 203,
            filename: "docW.png",
            descricao: "Documento W",
            data_criacao: "2024-11-10",
            p1: 3,
            p2: 1,
            p3: "777777",
            p4: "2024",
          },
        ],
      },
    },
  };

  /**
   * DataService
   * - Caso USE_MOCK = false, faz requisições reais a fetch().
   * - Caso USE_MOCK = true, retorna os dados de MOCK_DATA.
   */
  function DataService() {
    this.cache = {
      libraries: null,
      folders: new Map(),
      documents: new Map(),
    };
  }

  // -------------------------------------------------------
  //  1) fetchLibraries
  // -------------------------------------------------------
  DataService.prototype.fetchLibraries = async function () {
    // Verifica no cache
    if (this.cache.libraries) {
      console.log("Bibliotecas obtidas do cache.");
      return this.cache.libraries;
    }

    // Se estivermos no modo mock, retorna dados simulados:
    if (USE_MOCK) {
      console.log("Carregando bibliotecas do MOCK_DATA...");
      const json = MOCK_DATA.GET_ALL_LIBS;
      const data = json.DADOS.map((lib) => ({
        id: lib.id,
        type: "library",
        name: lib.nome,
        description: lib.descricao || "Sem descrição",
        creationDate: lib.data_criacao || "N/A",
        numFolders: lib.qtde_pastas || 0,
        children: [],
      }));
      this.cache.libraries = data;
      console.log("Bibliotecas carregadas (mock) e armazenadas no cache.");
      return data;
    }

    // Caso contrário, faz requisição real
    try {
      const url =
        Config.BASE_URL.development + Config.API_ENDPOINTS.GET_ALL_LIBS;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar bibliotecas: " + response.statusText);
      }
      const json = await response.json();
      const data = json.DADOS.map((lib) => ({
        id: lib.id,
        type: "library",
        name: lib.nome,
        description: lib.descricao || "Sem descrição",
        creationDate: lib.data_criacao || "N/A",
        numFolders: lib.qtde_pastas || 0,
        children: [],
      }));
      this.cache.libraries = data;
      console.log("Bibliotecas carregadas (fetch) e armazenadas no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar bibliotecas:", error);
      throw error;
    }
  };

  // -------------------------------------------------------
  //  2) fetchFolders
  // -------------------------------------------------------
  DataService.prototype.fetchFolders = async function (libId) {
    // Verifica no cache
    if (this.cache.folders.has(libId)) {
      console.log("Pastas da biblioteca " + libId + " obtidas do cache.");
      return this.cache.folders.get(libId);
    }

    // Modo mock
    if (USE_MOCK) {
      console.log("Carregando pastas (mock) para biblioteca:", libId);
      const mockFolders = MOCK_DATA.GET_ALL_FOLDERS[libId];
      if (!mockFolders) {
        // Se não há dados para essa biblioteca, simulamos 404
        console.warn(
          "Pastas para a biblioteca " +
            libId +
            " não encontradas (mock). Retornando vazio."
        );
        const emptyResult = { CODRESPOSTA: [{ status: 404 }], DADOS: [] };
        this.cache.folders.set(libId, emptyResult.DADOS);
        return emptyResult; // repare que é um objeto com .DADOS
      }
      const data = mockFolders.DADOS.map((folder) => ({
        id: folder.id,
        type: "folder",
        name: folder.nome,
        description: folder.descricao || "Sem descrição",
        creationDate: folder.data_criacao || "N/A",
        numDocuments: folder.qtde_docs || 0,
        children: [],
      }));
      this.cache.folders.set(libId, data);
      console.log(
        "Pastas (mock) da biblioteca " + libId + " armazenadas no cache."
      );
      return data;
    }

    // Modo fetch real
    try {
      const url =
        Config.BASE_URL.development +
        Config.API_ENDPOINTS.GET_ALL_FOLDERS +
        "/" +
        libId;
      const response = await fetch(url);
      if (response.status === 404) {
        console.warn(
          "Pastas para a biblioteca " +
            libId +
            " não foram encontradas. Retornando array vazio."
        );
        return {
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
        };
      }
      if (!response.ok) {
        throw new Error(
          "Erro ao buscar pastas para a biblioteca " +
            libId +
            ": " +
            response.statusText
        );
      }
      const json = await response.json();
      const data = json.DADOS.map((folder) => ({
        id: folder.id,
        type: "folder",
        name: folder.nome,
        description: folder.descricao || "Sem descrição",
        creationDate: folder.data_criacao || "N/A",
        numDocuments: folder.qtde_docs || 0,
        children: [],
      }));
      this.cache.folders.set(libId, data);
      console.log(
        "Pastas da biblioteca " +
          libId +
          " carregadas (fetch) e armazenadas no cache."
      );
      return data;
    } catch (error) {
      console.error(
        "Erro ao buscar pastas da biblioteca " + libId + ":",
        error
      );
      throw error;
    }
  };

  // -------------------------------------------------------
  //  3) fetchDocuments
  // -------------------------------------------------------
  DataService.prototype.fetchDocuments = async function (folderId) {
    // Verifica no cache
    if (this.cache.documents.has(folderId)) {
      console.log("Documentos da pasta " + folderId + " obtidos do cache.");
      return this.cache.documents.get(folderId);
    }

    // Modo mock
    if (USE_MOCK) {
      console.log("Carregando documentos (mock) para a pasta:", folderId);
      const mockDocs = MOCK_DATA.GET_ALL_FOLDER_DOCS[folderId];
      if (!mockDocs) {
        console.warn(
          "Documentos para a pasta " +
            folderId +
            " não encontrados (mock). Retornando vazio."
        );
        const emptyResult = { CODRESPOSTA: [{ status: 404 }], DADOS: [] };
        this.cache.documents.set(folderId, emptyResult.DADOS);
        return emptyResult;
      }
      const data = mockDocs.DADOS.map((doc) => {
        let docUrl = "";
        if (doc.link_doc) {
          docUrl = doc.link_doc;
        } else if (
          doc.filename &&
          doc.p1 !== undefined &&
          doc.p2 !== undefined &&
          doc.p3 !== undefined &&
          doc.p4 !== undefined
        ) {
          // Simulação de como o URL seria montado no modo real
          docUrl =
            Config.BASE_URL.development +
            "/files/" +
            doc.filename +
            "?p1=" +
            doc.p1 +
            "&p2=" +
            doc.p2 +
            "&p3=" +
            doc.p3 +
            "&p4=" +
            doc.p4;
        }
        return {
          id: doc.id,
          type: "document",
          name: doc.titulo || doc.filename || "Documento",
          description: doc.descricao || "Sem descrição",
          creationDate: doc.data_criacao || "N/A",
          children: [],
          url: docUrl,
        };
      });
      this.cache.documents.set(folderId, data);
      console.log(
        "Documentos (mock) da pasta " + folderId + " armazenados no cache."
      );
      return data;
    }

    // Modo fetch real
    try {
      const url =
        Config.BASE_URL.development +
        Config.API_ENDPOINTS.GET_ALL_FOLDER_DOCS +
        "/" +
        folderId;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erro ao buscar documentos para a pasta " +
            folderId +
            ": " +
            response.statusText
        );
      }
      const json = await response.json();
      const data = json.DADOS.map((doc) => {
        let docUrl;
        if (doc.link_doc) {
          docUrl = doc.link_doc;
        } else if (
          doc.filename &&
          doc.p1 !== undefined &&
          doc.p2 !== undefined &&
          doc.p3 !== undefined &&
          doc.p4 !== undefined
        ) {
          docUrl =
            Config.BASE_URL.development +
            "/files/" +
            doc.filename +
            "?p1=" +
            doc.p1 +
            "&p2=" +
            doc.p2 +
            "&p3=" +
            doc.p3 +
            "&p4=" +
            doc.p4;
        } else {
          docUrl = "";
        }
        return {
          id: doc.id,
          type: "document",
          name: doc.titulo || doc.filename || "Documento",
          description: doc.descricao || "Sem descrição",
          creationDate: doc.data_criacao || "N/A",
          children: [],
          url: docUrl,
        };
      });
      this.cache.documents.set(folderId, data);
      console.log(
        "Documentos da pasta " +
          folderId +
          " carregados (fetch) e armazenados no cache."
      );
      return data;
    } catch (error) {
      console.error(
        "Erro ao buscar documentos para a pasta " + folderId + ":",
        error
      );
      throw error;
    }
  };

  // -------------------------------------------------------
  //  Limpar o cache (bibliotecas, pastas, documentos)
  // -------------------------------------------------------
  DataService.prototype.clearCache = function () {
    this.cache.libraries = null;
    this.cache.folders.clear();
    this.cache.documents.clear();
    console.log("Cache limpo.");
  };

  // -------------------------------------------------------
  //  Expor a instância global
  // -------------------------------------------------------
  window.dataService = new DataService();
})();

/*-----------------------------------------------------------------------------------------*
|                                                                                          |
|                           * CODIGO ORIGINAL SEM MOCK!                                    |
|                                                                                          |
 *-----------------------------------------------------------------------------------------*/

/**
 * ArquivosListaDeArquivos.js
 *
 * Realiza chamadas reais às APIs usando o objeto global Config.
 * Certifique-se de que config.js seja carregado antes deste arquivo.
 *
 * A instância de DataService é atribuída à variável global window.dataService.
 */

/*(function() {
  function DataService() {
    this.cache = {
      libraries: null,
      folders: new Map(),
      documents: new Map()
    };
  }

  DataService.prototype.fetchLibraries = async function() {
    if (this.cache.libraries) {
      console.log("Bibliotecas obtidas do cache.");
      return this.cache.libraries;
    }
    try {
      const url = Config.BASE_URL.development + Config.API_ENDPOINTS.GET_ALL_LIBS;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar bibliotecas: " + response.statusText);
      }
      const json = await response.json();
      const data = json.DADOS.map(lib => ({
        id: lib.id,
        type: "library",
        name: lib.nome,
        description: lib.descricao || "Sem descrição",
        creationDate: lib.data_criacao || "N/A",
        numFolders: lib.qtde_pastas || 0,
        children: []
      }));
      this.cache.libraries = data;
      console.log("Bibliotecas carregadas e armazenadas no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar bibliotecas:", error);
      throw error;
    }
  };

  DataService.prototype.fetchFolders = async function(libId) {
    if (this.cache.folders.has(libId)) {
      console.log("Pastas da biblioteca " + libId + " obtidas do cache.");
      return this.cache.folders.get(libId);
    }
    try {
      const url = Config.BASE_URL.development + Config.API_ENDPOINTS.GET_ALL_FOLDERS + "/" + libId;
      const response = await fetch(url);
      if (response.status === 404) {
        console.warn("Pastas para a biblioteca " + libId + " não foram encontradas. Retornando array vazio.");
        return { CODRESPOSTA: [{ current_page: 1, pages: 1, per_pages: 50, registros: 0, status: 404 }], DADOS: [] };
      }
      if (!response.ok) {
        throw new Error("Erro ao buscar pastas para a biblioteca " + libId + ": " + response.statusText);
      }
      const json = await response.json();
      const data = json.DADOS.map(folder => ({
        id: folder.id,
        type: "folder",
        name: folder.nome,
        description: folder.descricao || "Sem descrição",
        creationDate: folder.data_criacao || "N/A",
        numDocuments: folder.qtde_docs || 0,
        children: []
      }));
      this.cache.folders.set(libId, data);
      console.log("Pastas da biblioteca " + libId + " carregadas e armazenadas no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar pastas da biblioteca " + libId + ":", error);
      throw error;
    }
  };

  DataService.prototype.fetchDocuments = async function(folderId) {
    if (this.cache.documents.has(folderId)) {
      console.log("Documentos da pasta " + folderId + " obtidos do cache.");
      return this.cache.documents.get(folderId);
    }
    try {
      const url = Config.BASE_URL.development + Config.API_ENDPOINTS.GET_ALL_FOLDER_DOCS + "/" + folderId;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar documentos para a pasta " + folderId + ": " + response.statusText);
      }
      const json = await response.json();
      const data = json.DADOS.map(doc => {
        let url;
        if (doc.link_doc) {
          url = doc.link_doc;
        } else if (doc.filename && doc.p1 !== undefined && doc.p2 !== undefined &&
                   doc.p3 !== undefined && doc.p4 !== undefined) {
          url = Config.BASE_URL.development + "/files/" + doc.filename +
                "?p1=" + doc.p1 + "&p2=" + doc.p2 + "&p3=" + doc.p3 + "&p4=" + doc.p4;
        } else {
          url = "";
        }
        return {
          id: doc.id,
          type: "document",
          name: doc.titulo || doc.filename || "Documento",
          description: doc.descricao || "Sem descrição",
          creationDate: doc.data_criacao || "N/A",
          children: [],
          url: url
        };
      });
      this.cache.documents.set(folderId, data);
      console.log("Documentos da pasta " + folderId + " carregados e armazenados no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar documentos para a pasta " + folderId + ":", error);
      throw error;
    }
  };

  DataService.prototype.clearCache = function() {
    this.cache.libraries = null;
    this.cache.folders.clear();
    this.cache.documents.clear();
    console.log("Cache limpo.");
  };

  window.dataService = new DataService();
})();*/

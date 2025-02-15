/**
 * ArquivosListaDeArquivos.js
 *
 * Realiza chamadas reais às APIs usando o objeto global Config.
 * Certifique-se de que config.js seja carregado antes deste arquivo.
 *
 * A instância de DataService é atribuída à variável global window.dataService.
 */

(function () {
  function DataService() {
    this.cache = {
      libraries: null,
      folders: new Map(),
      documents: new Map(),
    };
  }

  DataService.prototype.fetchLibraries = async function () {
    if (this.cache.libraries) {
      console.log("Bibliotecas obtidas do cache.");
      return this.cache.libraries;
    }
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
      console.log("Bibliotecas carregadas e armazenadas no cache.");
      return data;
    } catch (error) {
      console.error("Erro ao buscar bibliotecas:", error);
      throw error;
    }
  };

  DataService.prototype.fetchFolders = async function (libId) {
    if (this.cache.folders.has(libId)) {
      console.log("Pastas da biblioteca " + libId + " obtidas do cache.");
      return this.cache.folders.get(libId);
    }
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
        "Pastas da biblioteca " + libId + " carregadas e armazenadas no cache."
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

  DataService.prototype.fetchDocuments = async function (folderId) {
    if (this.cache.documents.has(folderId)) {
      console.log("Documentos da pasta " + folderId + " obtidos do cache.");
      return this.cache.documents.get(folderId);
    }
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
        let url;
        if (doc.link_doc) {
          url = doc.link_doc;
        } else if (
          doc.filename &&
          doc.p1 !== undefined &&
          doc.p2 !== undefined &&
          doc.p3 !== undefined &&
          doc.p4 !== undefined
        ) {
          url =
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
          url = "";
        }
        return {
          id: doc.id,
          type: "document",
          name: doc.titulo || doc.filename || "Documento",
          description: doc.descricao || "Sem descrição",
          creationDate: doc.data_criacao || "N/A",
          children: [],
          url: url,
        };
      });
      this.cache.documents.set(folderId, data);
      console.log(
        "Documentos da pasta " +
          folderId +
          " carregados e armazenados no cache."
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

  DataService.prototype.clearCache = function () {
    this.cache.libraries = null;
    this.cache.folders.clear();
    this.cache.documents.clear();
    console.log("Cache limpo.");
  };

  window.dataService = new DataService();
})();

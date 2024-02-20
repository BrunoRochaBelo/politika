document.addEventListener("DOMContentLoaded", function () {
  class BuscaEndereco {
    constructor() {
      this.ufElement = document.getElementById("uf");
      this.cidadeElement = document.getElementById("cidade");
      this.bairroElement = document.getElementById("bairro");
      this.ruaElement = document.getElementById("rua");
      this.timeout = null;

      const cepElement = document.getElementById("cep");
      cepElement.addEventListener("input", () => {
        clearTimeout(this.timeout);
        if (cepElement.value.replace(/\D/g, "").length === 8) {
          this.timeout = setTimeout(() => {
            this.buscarEndereco(cepElement.value);
          }, 500);
        }
      });

      const ruaPesquisaElement = document.getElementById("rua");
      ruaPesquisaElement.addEventListener("input", () => {
        clearTimeout(this.timeout);
        if (ruaPesquisaElement.value.length > 2) {
          this.timeout = setTimeout(() => {
            this.buscarEnderecoPorRua(ruaPesquisaElement.value);
          }, 500);
        }
      });
    }

    preencherCamposEndereco(data) {
      this.ufElement.value = data.uf;
      this.cidadeElement.value = data.localidade;
      this.bairroElement.value = data.bairro;
      this.ruaElement.value = data.logradouro;
    }

    validarCEP(cep) {
      return cep.replace(/\D/g, "").length === 8;
    }

    async buscarEndereco(cep) {
      if (!this.validarCEP(cep)) {
        console.log("CEP inválido");
        return;
      }

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          console.log("CEP não encontrado");
          return;
        }

        this.preencherCamposEndereco(data);
      } catch (error) {
        console.error("Erro na busca de endereço:", error);
      }
    }

    async buscarEnderecoPorRua(rua) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${encodeURIComponent(rua)}/json/`
        );
        const data = await response.json();

        if (data.erro) {
          console.log("Endereço não encontrado");
          return;
        }

        this.preencherCamposEndereco(data);
      } catch (error) {
        console.error("Erro na busca de endereço:", error);
      }
    }
  }

  const buscaEndereco = new BuscaEndereco();
});

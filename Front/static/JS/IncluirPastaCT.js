// IncluirFornecedor.js

// ===============================
// EstiloUtils: pinta borda no erro
// ===============================
window.EstiloUtils = (() => {
  const alterarCorBorda = (el, cor) => {
    if (el) el.style.borderColor = cor;
  };
  return { alterarCorBorda };
})();

// ===============================
// MaskUtils: CPF, CNPJ/CPF e Moeda
// ===============================
window.MaskUtils = (() => {
  const cpf = (campo) => {
    let v = campo.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    campo.value = v;
  };

  const cnpj = (campo) => {
    let v = campo.value.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/(\d{2})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
    v = v.replace(/(\d{4})\/(\d{4})(\d)/, "$1/$2-$3");
    campo.value = v;
  };

  const cnpjCpf = (campo) => {
    const nums = campo.value.replace(/\D/g, "");
    if (nums.length <= 11) cpf(campo);
    else cnpj(campo);
  };

  const moeda = (campo) => {
    let v = campo.value.replace(/\D/g, "");
    v = v.padStart(3, "0");
    v = v.replace(/(\d+)(\d{2})$/, "$1,$2");
    campo.value = v;
  };

  return { cpf, cnpjCpf, moeda };
})();

// ===============================
// CampoUtils: valida obrigatório, CPF/CNPJ, moeda e patterns
// ===============================
window.CampoUtils = (() => {
  const obterLabel = (campo) =>
    document.querySelector(`label[for="${campo.id}"]`) ||
    campo.closest(".campo")?.querySelector("label");

  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const lbl = obterLabel(campo);
    if (lbl) {
      lbl.classList.add(classe);
      const span = lbl.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const lbl = obterLabel(campo);
    if (lbl) {
      lbl.classList.remove(...classes);
      const span = lbl.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  };

  const exibirMensagemErroCampo = (campo, msg) => {
    let el = campo.nextElementSibling;
    if (!el || !el.classList.contains("mensagem-erro")) {
      el = document.createElement("div");
      el.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(el, campo.nextSibling);
    }
    el.innerText = msg;
    el.style.color = "var(--erro)";
    el.style.margin = "8px 0 0 15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  };

  const removerMensagemErroCampo = (campo) => {
    const el = campo.nextElementSibling;
    if (el && el.classList.contains("mensagem-erro")) el.remove();
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "success", "error");

    const val = campo.value.trim();

    // obrigatório
    if (campo.hasAttribute("required") && !val) {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      return false;
    }

    // CPF/CNPJ do fornecedor
    if (campo.id === "cnpjCpfFornecedor" && val) {
      const nums = val.replace(/\D/g, "");
      const cpfOK = /^\d{11}$/.test(nums);
      const cnpjOK = /^\d{14}$/.test(nums);
      if (!cpfOK && !cnpjOK) {
        exibirMensagemErroCampo(campo, "Formato de CPF/CNPJ inválido.");
        return false;
      }
    }

    // CPF do responsável
    if (campo.id === "cpfResponsavel" && val) {
      if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val)) {
        exibirMensagemErroCampo(campo, "Formato de CPF inválido.");
        return false;
      }
    }

    // moeda
    if (campo.id === "valorTotal" && val) {
      if (!/^\d+,\d{2}$/.test(val)) {
        exibirMensagemErroCampo(campo, "Formato de valor inválido.");
        return false;
      }
    }

    // pattern genérico (nomes etc)
    if (campo.hasAttribute("pattern") && val) {
      const rgx = new RegExp(`^${campo.getAttribute("pattern")}$`);
      if (!rgx.test(val)) {
        exibirMensagemErroCampo(campo, "Formato inválido.");
        return false;
      }
    }

    // tá tudo certo
    if (val) adicionarClasse(campo, "success");
    return true;
  };

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    adicionarClasse,
    removerClasses,
  };
})();

// ======================================
// Formulário de Fornecedor: valida + feedback
// ======================================
window.FormularioFornecedorUtils = (() => {
  let feedbackTimeout;

  const validarFormulario = () => {
    let ok = true;
    const faltando = [];

    [
      "nomeFornecedor",
      "cnpjCpfFornecedor",
      "numeroContrato",
      "objetoContrato",
      "valorTotal",
      "inicioContrato",
      "fimContrato",
      "nomeResponsavel",
      "cpfResponsavel",
    ].forEach((id) => {
      const fld = document.getElementById(id);
      if (!CampoUtils.validarCampo(fld)) {
        ok = false;
        const lbl = document
          .querySelector(`label[for="${id}"]`)
          .innerText.replace(":", "");
        faltando.push(lbl);
      }
    });

    if (!ok) {
      mostrarFeedback("error", `Preencha: ${faltando.join(", ")}`);
    }
    return ok;
  };

  const mostrarFeedback = (tipo, msg) => {
    let cont = document.querySelector(".alert-container");
    if (!cont) {
      cont = document.createElement("div");
      cont.className = "alert-container";
      document.body.appendChild(cont);
    }
    const div = document.createElement("div");
    div.classList.add(
      "alert",
      "alert-dismissible",
      "fade",
      tipo === "success" ? "alert-sucesso" : "alert-erro"
    );
    const span = document.createElement("span");
    span.innerText = msg;
    const btn = document.createElement("button");
    btn.className = "close-btn";
    btn.innerHTML = "&times;";
    btn.addEventListener("click", () => div.remove());
    div.append(span, btn);
    cont.appendChild(div);
    setTimeout(() => div.classList.add("show"), 10);
    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      div.classList.remove("show");
      div.addEventListener("transitionend", () => div.remove());
    }, 5000);
  };

  const enviarFormulario = (event) => {
    event.preventDefault();
    document
      .querySelectorAll(".alert-container, .mensagem-erro")
      .forEach((el) => el.remove());
    if (!validarFormulario()) {
      const prv = document.querySelector(".error");
      prv?.scrollIntoView({ behavior: "smooth", block: "center" });
      prv?.focus();
      return false;
    }
    mostrarFeedback("success", "Criando contrato...");
    setTimeout(() => event.target.submit(), 200);
    return true;
  };

  return { enviarFormulario, validarFormulario, mostrarFeedback };
})();

// ======================================
// Ouvintes de evento
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener(
    "submit",
    window.FormularioFornecedorUtils.enviarFormulario
  );

  // valida inline
  document
    .querySelectorAll(
      '#form input[type="text"], #form input[type="date"], #form textarea'
    )
    .forEach((c) => {
      c.addEventListener("blur", () => CampoUtils.validarCampo(c));
      c.addEventListener("input", () => CampoUtils.validarCampo(c));
    });

  // campos e containers
  const nomeFornecedorField = document.getElementById("nomeFornecedor");
  const cnpjCpfFornecedorField = document.getElementById("cnpjCpfFornecedor");
  const nomeResponsavelField = document.getElementById("nomeResponsavel");
  const cpfResponsavelField = document.getElementById("cpfResponsavel");

  const suggestionsNomeFornecedor = document.getElementById(
    "suggestions-nomeFornecedor"
  );
  const suggestionsCnpjCpfFornecedor = document.getElementById(
    "suggestions-cnpjCpfFornecedor"
  );
  const suggestionsNomeResponsavel = document.getElementById(
    "suggestions-nomeResponsavel"
  );
  const suggestionsCpfResponsavel = document.getElementById(
    "suggestions-cpfResponsavel"
  );

  const loadingNomeFornecedor = document.getElementById(
    "loading-indicator-nomeFornecedor"
  );
  const loadingCnpjCpfFornecedor = document.getElementById(
    "loading-indicator-cnpjCpfFornecedor"
  );
  const loadingNomeResponsavel = document.getElementById(
    "loading-indicator-nomeResponsavel"
  );
  const loadingCpfResponsavel = document.getElementById(
    "loading-indicator-cpfResponsavel"
  );

  const showLoading = (el) => {
    if (el) el.style.display = "block";
  };

  const hideLoading = (el) => {
    if (el) el.style.display = "none";
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchContato = async (query, params) => {
    const baseURL = Config.BASE_URL[Config.ENVIRONMENT];
    const endpoint = Config.API_ENDPOINTS.CONTACT_SEARCH_ALL;
    const url = `${baseURL}${endpoint}/${encodeURIComponent(query)}${params}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      return data.DADOS || [];
    } catch (err) {
      console.error("Erro na busca:", err);
      return [];
    }
  };

  const fetchFornecedor = (q, fs) => fetchContato(q, `?fs=${fs}&qt=3`);
  const fetchResponsavel = (q, fs) => fetchContato(q, `?tp=1&fs=${fs}`);

  const displaySuggestions = (list, container, fillFn) => {
    container.innerHTML = "";
    if (list.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhuma correspondência encontrada";
      container.appendChild(li);
    } else {
      const ul = document.createElement("ul");
      list.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.cnpj_cpf}`;
        li.addEventListener("click", () => {
          fillFn(item);
          container.innerHTML = "";
          container.classList.remove("visible");
        });
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
    container.classList.add("visible");
  };

  const handleNomeFornecedorInput = debounce(async () => {
    const query = nomeFornecedorField.value.trim();
    if (query.length >= 3) {
      showLoading(loadingNomeFornecedor);
      const results = await fetchFornecedor(query, 1);
      displaySuggestions(results, suggestionsNomeFornecedor, (item) => {
        nomeFornecedorField.value = item.name;
        cnpjCpfFornecedorField.value = item.cnpj_cpf;
      });
      hideLoading(loadingNomeFornecedor);
    } else {
      suggestionsNomeFornecedor.innerHTML = "";
      suggestionsNomeFornecedor.classList.remove("visible");
    }
  }, 300);

  const handleCnpjCpfFornecedorInput = debounce(async () => {
    const query = cnpjCpfFornecedorField.value.replace(/\D/g, "");
    if (query.length >= 3) {
      showLoading(loadingCnpjCpfFornecedor);
      const results = await fetchFornecedor(query, 2);
      displaySuggestions(results, suggestionsCnpjCpfFornecedor, (item) => {
        nomeFornecedorField.value = item.name;
        cnpjCpfFornecedorField.value = item.cnpj_cpf;
      });
      hideLoading(loadingCnpjCpfFornecedor);
    } else {
      suggestionsCnpjCpfFornecedor.innerHTML = "";
      suggestionsCnpjCpfFornecedor.classList.remove("visible");
    }
  }, 300);

  const handleNomeResponsavelInput = debounce(async () => {
    const query = nomeResponsavelField.value.trim();
    if (query.length >= 3) {
      showLoading(loadingNomeResponsavel);
      const results = await fetchResponsavel(query, 1);
      displaySuggestions(results, suggestionsNomeResponsavel, (item) => {
        nomeResponsavelField.value = item.name;
        cpfResponsavelField.value = item.cnpj_cpf;
      });
      hideLoading(loadingNomeResponsavel);
    } else {
      suggestionsNomeResponsavel.innerHTML = "";
      suggestionsNomeResponsavel.classList.remove("visible");
    }
  }, 300);

  const handleCpfResponsavelInput = debounce(async () => {
    const query = cpfResponsavelField.value.replace(/\D/g, "");
    if (query.length >= 3) {
      showLoading(loadingCpfResponsavel);
      const results = await fetchResponsavel(query, 2);
      displaySuggestions(results, suggestionsCpfResponsavel, (item) => {
        nomeResponsavelField.value = item.name;
        cpfResponsavelField.value = item.cnpj_cpf;
      });
      hideLoading(loadingCpfResponsavel);
    } else {
      suggestionsCpfResponsavel.innerHTML = "";
      suggestionsCpfResponsavel.classList.remove("visible");
    }
  }, 300);

  // máscaras
  nomeFornecedorField.addEventListener("input", handleNomeFornecedorInput);
  cnpjCpfFornecedorField.addEventListener("input", () => {
    MaskUtils.cnpjCpf(cnpjCpfFornecedorField);
    handleCnpjCpfFornecedorInput();
  });
  nomeResponsavelField.addEventListener("input", handleNomeResponsavelInput);
  cpfResponsavelField.addEventListener("input", () => {
    MaskUtils.cpf(cpfResponsavelField);
    handleCpfResponsavelInput();
  });

  cnpjCpfFornecedorField.addEventListener("blur", () =>
    CampoUtils.validarCampo(cnpjCpfFornecedorField)
  );
  cpfResponsavelField.addEventListener("blur", () =>
    CampoUtils.validarCampo(cpfResponsavelField)
  );

  const fldValor = document.getElementById("valorTotal");
  fldValor.addEventListener("input", () => MaskUtils.moeda(fldValor));
  fldValor.addEventListener("blur", () => CampoUtils.validarCampo(fldValor));

  document.addEventListener("click", (e) => {
    if (
      !suggestionsNomeFornecedor.contains(e.target) &&
      e.target !== nomeFornecedorField
    ) {
      suggestionsNomeFornecedor.classList.remove("visible");
    }
    if (
      !suggestionsCnpjCpfFornecedor.contains(e.target) &&
      e.target !== cnpjCpfFornecedorField
    ) {
      suggestionsCnpjCpfFornecedor.classList.remove("visible");
    }
    if (
      !suggestionsNomeResponsavel.contains(e.target) &&
      e.target !== nomeResponsavelField
    ) {
      suggestionsNomeResponsavel.classList.remove("visible");
    }
    if (
      !suggestionsCpfResponsavel.contains(e.target) &&
      e.target !== cpfResponsavelField
    ) {
      suggestionsCpfResponsavel.classList.remove("visible");
    }
  });
});

// compat com onclick no botão
function submitForm() {
  return window.FormularioFornecedorUtils.enviarFormulario(event);
}

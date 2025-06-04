// IncluirColaborador.js

// ===============================
// EstiloUtils: só pinta borda no erro
// ===============================
window.EstiloUtils = (() => {
  const alterarCorBorda = (el, cor) => {
    if (el) el.style.borderColor = cor;
  };
  return { alterarCorBorda };
})();

// ===============================
// MaskUtils: máscara de CPF e limpa vínculo
// ===============================
window.MaskUtils = (() => {
  const cpf = (campo) => {
    let v = campo.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    campo.value = v;
  };

  const vinculo = (campo) => {
    // remove qualquer coisa que não seja letra ou número
    campo.value = campo.value.replace(/[^A-Za-z0-9]/g, "");
  };

  return { cpf, vinculo };
})();

// ===============================
// CampoUtils: valida obrigatório, pattern e CPF
// ===============================
window.CampoUtils = (() => {
  const obterLabel = (campo) =>
    document.querySelector(`label[for="${campo.id}"]`) ||
    campo.closest(".campo")?.querySelector("label");

  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const label = obterLabel(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const label = obterLabel(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  };

  const exibirMensagemErroCampo = (campo, msgText) => {
    let msg = campo.nextElementSibling;
    if (!msg || !msg.classList.contains("mensagem-erro")) {
      msg = document.createElement("div");
      msg.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(msg, campo.nextSibling);
    }
    msg.innerText = msgText;
    msg.style.color = "var(--erro)";
    msg.style.margin = "8px 0 0 15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  };

  const removerMensagemErroCampo = (campo) => {
    const msg = campo.nextElementSibling;
    if (msg && msg.classList.contains("mensagem-erro")) msg.remove();
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "success", "error");

    const valor = campo.value.trim();

    // obrigatório
    if (campo.hasAttribute("required") && !valor) {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      return false;
    }

    // CPF (caso especial)
    if (campo.id === "cpfColaborador" && valor) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(valor)) {
        exibirMensagemErroCampo(campo, "Formato de CPF inválido.");
        return false;
      }
    }

    // pattern (nome, lotação etc.)
    if (campo.hasAttribute("pattern") && valor) {
      const regex = new RegExp(`^${campo.getAttribute("pattern")}$`);
      if (!regex.test(valor)) {
        exibirMensagemErroCampo(campo, "Formato inválido.");
        return false;
      }
    }

    // tudo certo
    if (valor) adicionarClasse(campo, "success");
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
// Formulário de Colaborador (feedback + submit)
// ======================================
window.FormularioColaboradorUtils = (() => {
  let feedbackTimeout;

  const validarFormulario = () => {
    let formValido = true;
    const faltando = [];

    [
      "nomeColaborador",
      "cpfColaborador",
      "vinculo",
      "cargoFuncao",
      "admissao",
      "lotacao",
    ].forEach((id) => {
      const campo = document.getElementById(id);
      if (!CampoUtils.validarCampo(campo)) {
        formValido = false;
        const label = document
          .querySelector(`label[for="${id}"]`)
          .innerText.replace(":", "");
        faltando.push(label);
      }
    });

    if (!formValido) {
      mostrarFeedback("error", `Preencha: ${faltando.join(", ")}`);
    }
    return formValido;
  };

  const mostrarFeedback = (tipo, mensagem) => {
    let container = document.querySelector(".alert-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "alert-container";
      document.body.appendChild(container);
    }
    const alertDiv = document.createElement("div");
    alertDiv.classList.add(
      "alert",
      "alert-dismissible",
      "fade",
      tipo === "success" ? "alert-sucesso" : "alert-erro"
    );
    const span = document.createElement("span");
    span.innerText = mensagem;
    const btn = document.createElement("button");
    btn.className = "close-btn";
    btn.innerHTML = "&times;";
    btn.addEventListener("click", () => alertDiv.remove());
    alertDiv.append(span, btn);
    container.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add("show"), 10);
    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.addEventListener("transitionend", () => alertDiv.remove());
    }, 5000);
  };

  const enviarFormulario = (event) => {
    event.preventDefault();
    document
      .querySelectorAll(".alert-container, .mensagem-erro")
      .forEach((el) => el.remove());

    if (!validarFormulario()) {
      const primeiro = document.querySelector(".error");
      primeiro?.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiro?.focus();
      return false;
    }

    mostrarFeedback("success", "Criando colaborador...");
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
    window.FormularioColaboradorUtils.enviarFormulario
  );

  // valida tudo que for text, date e textarea
  document
    .querySelectorAll(
      '#form input[type="text"], #form input[type="date"], #form textarea'
    )
    .forEach((campo) => {
      campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
      campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
    });

  // máscara CPF
  const cpfField = document.getElementById("cpfColaborador");
  cpfField.addEventListener("blur", () => CampoUtils.validarCampo(cpfField));

  const nomeField = document.getElementById("nomeColaborador");
  const suggestionsNome = document.getElementById("suggestions-nomeColaborador");
  const suggestionsCpf = document.getElementById("suggestions-cpfColaborador");
  const loadingNome = document.getElementById("loading-indicator-nome");
  const loadingCpf = document.getElementById("loading-indicator-cpf");

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

  const fetchColaborador = async (query, fs) => {
    const baseURL = Config.BASE_URL[Config.ENVIRONMENT];
    const endpoint = Config.API_ENDPOINTS.CONTACT_SEARCH_ALL;
    const url = `${baseURL}${endpoint}/${encodeURIComponent(query)}?fs=${fs}&qt=2`;
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

  const displaySuggestions = (list, container) => {
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
          nomeField.value = item.name;
          cpfField.value = item.cnpj_cpf;
          container.innerHTML = "";
          container.classList.remove("visible");
        });
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
    container.classList.add("visible");
  };

  const handleNomeInput = debounce(async () => {
    const query = nomeField.value.trim();
    if (query.length >= 3) {
      showLoading(loadingNome);
      const results = await fetchColaborador(query, 1);
      displaySuggestions(results, suggestionsNome);
      hideLoading(loadingNome);
    } else {
      suggestionsNome.innerHTML = "";
      suggestionsNome.classList.remove("visible");
    }
  }, 300);

  const handleCpfInput = debounce(async () => {
    const query = cpfField.value.replace(/\D/g, "");
    if (query.length >= 3) {
      showLoading(loadingCpf);
      const results = await fetchColaborador(query, 2);
      displaySuggestions(results, suggestionsCpf);
      hideLoading(loadingCpf);
    } else {
      suggestionsCpf.innerHTML = "";
      suggestionsCpf.classList.remove("visible");
    }
  }, 300);

  nomeField.addEventListener("input", handleNomeInput);
  cpfField.addEventListener("input", () => {
    MaskUtils.cpf(cpfField);
    handleCpfInput();
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsNome.contains(e.target) && e.target !== nomeField) {
      suggestionsNome.classList.remove("visible");
    }
    if (!suggestionsCpf.contains(e.target) && e.target !== cpfField) {
      suggestionsCpf.classList.remove("visible");
    }
  });

  // máscara Vínculo
  const vincField = document.getElementById("vinculo");
  vincField.addEventListener("input", () => MaskUtils.vinculo(vincField));
  vincField.addEventListener("blur", () => CampoUtils.validarCampo(vincField));
});

// compat com onclick
function submitForm() {
  return window.FormularioColaboradorUtils.enviarFormulario(event);
}

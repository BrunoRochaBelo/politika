// Autocomplete para campos de fornecedor na tela de Despesa
// Busca dados da API de contatos e preenche nome e CNPJ/CPF

document.addEventListener('DOMContentLoaded', () => {
  const nomeField = document.getElementById('nome_fornecedor');
  const cnpjField = document.getElementById('cnpj_cpf_fornecedor');
  const suggestionsNome = document.getElementById('suggestions-nome');
  const suggestionsCnpj = document.getElementById('suggestions-cnpj');
  const loadingNome = document.getElementById('loading-indicator-nome');
  const loadingCnpj = document.getElementById('loading-indicator-cnpj');

  const showLoading = (el) => { if (el) el.style.display = 'block'; };
  const hideLoading = (el) => { if (el) el.style.display = 'none'; };

  const debounce = (fn, delay) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const fetchFornecedor = async (query, fs) => {
    const baseURL = Config.BASE_URL[Config.ENVIRONMENT];
    const endpoint = Config.API_ENDPOINTS.CONTACT_SEARCH_ALL;
    const url = `${baseURL}${endpoint}/${encodeURIComponent(query)}?fs=${fs}&qt=3`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Erro ao buscar dados');
      const data = await resp.json();
      return data.DADOS || [];
    } catch (err) {
      console.error('Erro na busca:', err);
      return [];
    }
  };

  const displaySuggestions = (list, container, fillFn) => {
    container.innerHTML = '';
    if (list.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhuma correspondência encontrada';
      container.appendChild(li);
    } else {
      const ul = document.createElement('ul');
      list.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.cnpj_cpf}`;
        li.addEventListener('click', () => {
          fillFn(item);
          container.innerHTML = '';
          container.classList.remove('visible');
        });
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
    container.classList.add('visible');
  };

  const handleNomeInput = debounce(async () => {
    const query = nomeField.value.trim();
    if (query.length >= 3) {
      showLoading(loadingNome);
      const results = await fetchFornecedor(query, 1);
      displaySuggestions(results, suggestionsNome, (item) => {
        nomeField.value = item.name;
        cnpjField.value = item.cnpj_cpf;
      });
      hideLoading(loadingNome);
    } else {
      suggestionsNome.innerHTML = '';
      suggestionsNome.classList.remove('visible');
    }
  }, 300);

  const handleCnpjInput = debounce(async () => {
    const query = cnpjField.value.replace(/\D/g, '');
    if (query.length >= 3) {
      showLoading(loadingCnpj);
      const results = await fetchFornecedor(query, 2);
      displaySuggestions(results, suggestionsCnpj, (item) => {
        nomeField.value = item.name;
        cnpjField.value = item.cnpj_cpf;
      });
      hideLoading(loadingCnpj);
    } else {
      suggestionsCnpj.innerHTML = '';
      suggestionsCnpj.classList.remove('visible');
    }
  }, 300);

  nomeField.addEventListener('input', handleNomeInput);
  cnpjField.addEventListener('input', () => {
    MascaraUtils.aplicarMascaraCPFCNPJ(cnpjField);
    handleCnpjInput();
  });

  document.addEventListener('click', (e) => {
    if (!suggestionsNome.contains(e.target) && e.target !== nomeField) {
      suggestionsNome.classList.remove('visible');
    }
    if (!suggestionsCnpj.contains(e.target) && e.target !== cnpjField) {
      suggestionsCnpj.classList.remove('visible');
    }
  });
});

// Seleciona todos os botões
let buttons = document.querySelectorAll(".btn-filter-leaked");

// Adiciona um evento de clique a cada botão
buttons.forEach((button) => {
  button.addEventListener("click", async function () {
    // Pega o valor do filtro do botão clicado
    let filter = this.getAttribute("data-filter");

    try {
      // Faz uma requisição para o servidor
      let response = await fetch(
        `https://meuservidor.com/api/contatos?filter=${filter}`
      );

      // Verifica se a resposta é ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parseia a resposta
      let contatos = await response.json();

      // Seleciona a lista de contatos
      let contatosList = document.querySelector("#contatosList");

      // Limpa a lista de contatos
      contatosList.innerHTML = "";

      // Adiciona os novos contatos à lista
      contatos.forEach((contato) => {
        contatosList.innerHTML += `
          <li>
            <a class="card-s contatos-small-card" href="#">
              <p class="contatos-small-card-title">${contato.nome}</p>
              <div class="contatos-small-card-num">${contato.telefone}</div>
              <div class="contatos-small-card-star"><img src="imagens/icones/${contato.estrelas}-estrelas.svg" alt="Perfil influencia Icon"></div>
              <div class="contatos-small-card-phone"><img src="imagens/icones/phone.svg" alt="Ligar Icon"></div>
            </a>
          </li>
        `;
      });

      // Atualiza o total de resultados
      document.querySelector("#totalResults").textContent = contatos.length;
    } catch (error) {
      console.error("Houve um erro na requisição", error);
    }
  });
});

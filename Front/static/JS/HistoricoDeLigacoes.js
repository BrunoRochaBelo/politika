// Lista para armazenar o histórico de ligações
let historicoLigacoes = {};

// Função para registrar uma ligação
function registrarLigacao(nomeContato, numero, dataHora) {
  const dia = new Date(dataHora).toLocaleDateString(); // Obtém o dia da data/hora
  const horaMinutos = new Date(dataHora).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Obtém a hora e os minutos
  if (!historicoLigacoes[dia]) {
    historicoLigacoes[dia] = [];
  }
  historicoLigacoes[dia].push({ nomeContato, numero, horaMinutos });
  // Atualizar a lista de histórico de ligações na página
  atualizarHistoricoLigacoes();
}

// Função para atualizar a lista de histórico de ligações na página
function atualizarHistoricoLigacoes() {
  const listaHistorico = document.querySelector("#listaHistorico");
  if (!listaHistorico) return; // Se a lista não existir, não faz nada

  // Limpa a lista atual
  listaHistorico.innerHTML = "";

  // Adiciona cada dia e suas ligações ao elemento da lista
  for (const dia in historicoLigacoes) {
    const itemDia = document.createElement("li");
    itemDia.textContent = dia;
    listaHistorico.appendChild(itemDia);

    const listaLigacoesDia = document.createElement("ul");
    historicoLigacoes[dia].forEach((ligacao) => {
      const itemLista = document.createElement("li");
      itemLista.textContent = `${ligacao.nomeContato} (${ligacao.numero}) as ${ligacao.horaMinutos}`;
      listaLigacoesDia.appendChild(itemLista);
    });
    listaHistorico.appendChild(listaLigacoesDia);
  }
}

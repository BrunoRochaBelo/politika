function scrollToTop(element, duration) {
  const startingY = element.scrollTop;
  const startTime = performance.now();

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;

    element.scrollTop = startingY * (1 - progress);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

function changeSession(sessionNumber) {
  var sessions = document.querySelectorAll(".session");
  var selectedSession = document.getElementById("sessao" + sessionNumber);
  var cards = document.querySelectorAll(".cad-session");
  var selectedCard = cards[sessionNumber - 1]; // Assumindo que a ordem é a mesma
  var areaContent =
    document.querySelector(".area-container-template-content") ||
    document.querySelector(".area-container-abas-template-content");

  if (!selectedSession || !selectedCard || !areaContent) {
    console.error(
      "Elementos não encontrados. Verifique se todos os elementos necessários estão presentes no DOM."
    );
    return;
  }

  var selectedHeader = selectedCard.querySelector(
    ".area-template-sessao-int-header"
  );
  var selectedArrow = selectedHeader.querySelector(".arrow");

  // Verificar se a sessão clicada já está ativa
  if (selectedSession.classList.contains("active")) {
    // Se estiver ativa, recolher a sessão e fazer o scroll para o topo
    selectedSession.classList.remove("active");
    selectedHeader.classList.remove("active-header");
    selectedArrow.classList.remove("up");
    selectedArrow.classList.add("down");
    selectedCard.classList.remove("active");

    // Fazer o scroll para o topo
    scrollToTop(areaContent, 300);
  } else {
    // Recolher todas as sessões ativas e fazer o scroll para o topo
    sessions.forEach(function (session, index) {
      if (session.classList.contains("active")) {
        session.classList.remove("active");

        var card = cards[index];
        var header = card.querySelector(".area-template-sessao-int-header");
        var arrow = header.querySelector(".arrow");

        header.classList.remove("active-header");
        arrow.classList.remove("up");
        arrow.classList.add("down");
        card.classList.remove("active");
      }
    });

    // Fazer o scroll para o topo antes de exibir a nova sessão
    scrollToTop(areaContent, 300);

    // Exibir a nova sessão selecionada após o scroll
    setTimeout(function () {
      selectedSession.classList.add("active");
      selectedHeader.classList.add("active-header");
      selectedArrow.classList.remove("down");
      selectedArrow.classList.add("up");
      selectedCard.classList.add("active");
    }, 300); // Ajuste o tempo de acordo com a duração do scroll
  }
}

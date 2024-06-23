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
  var headers = document.querySelectorAll(".area-template-sessao-int-header");
  var selectedHeader = headers[sessionNumber - 1]; // Assumindo que a ordem é a mesma
  var arrows = document.querySelectorAll(".arrow");
  var selectedArrow = arrows[sessionNumber - 1]; // Assumindo que a ordem é a mesma

  var areaAbas = document.querySelector(".area-container-template-content");

  // Verificar se a sessão clicada já está ativa
  if (selectedSession.classList.contains("active")) {
    // Se estiver ativa, recolher a sessão e fazer o scroll para o topo
    selectedSession.classList.remove("active");
    selectedHeader.classList.remove("active-header");
    selectedArrow.classList.remove("up");
    selectedArrow.classList.add("down");

    // Fazer o scroll para o topo
    scrollToTop(areaAbas, 300);
  } else {
    // Recolher todas as sessões ativas e fazer o scroll para o topo
    sessions.forEach(function (session, index) {
      if (session.classList.contains("active")) {
        session.classList.remove("active");
        headers[index].classList.remove("active-header");
        arrows[index].classList.remove("up");
        arrows[index].classList.add("down");
      }
    });

    // Fazer o scroll para o topo antes de exibir a nova sessão
    scrollToTop(areaAbas, 300);

    // Exibir a nova sessão selecionada após o scroll
    setTimeout(function () {
      selectedSession.classList.add("active");
      selectedHeader.classList.add("active-header");
      selectedArrow.classList.remove("down");
      selectedArrow.classList.add("up");
    }); // Ajuste o tempo de acordo com a duração do scroll
  }
}

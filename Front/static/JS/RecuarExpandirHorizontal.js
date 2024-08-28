function toggleRecuarExpandirHorizontal() {
  var element = document.querySelector(".lista-horizontal");
  var button = document.querySelector(".btn-recuar-expandir");

  if (element.classList.contains("expandir")) {
    element.style.height = `${element.scrollHeight}px`; // Fixa a altura atual
    requestAnimationFrame(() => {
      element.classList.remove("expandir");
      element.style.height = ""; // Volta para auto
    });
    button.classList.remove("up");
    button.innerHTML = "Expandir";
  } else {
    element.classList.add("expandir");
    element.style.height = ""; // Garante que a altura esteja correta
    button.classList.add("up");
    button.innerHTML = "Recuar";
  }
}

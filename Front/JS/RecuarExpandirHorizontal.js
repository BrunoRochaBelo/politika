function toggleRecuarExpandirHorizontal() {
  var elemento = document.querySelector(".recuar-expandir-horizontal");

  // Verifica se a classe atual é .lista-horizontal-template
  if (elemento.classList.contains("lista-horizontal-template")) {
    // Remove a classe atual
    elemento.classList.remove("lista-horizontal-template");
    // Adiciona a nova classe
    elemento.classList.add("lista-vertical-3-template");
  } else {
    // Se a classe atual não for .lista-horizontal-template, inverte a lógica
    elemento.classList.remove("lista-vertical-3-template");
    elemento.classList.add("lista-horizontal-template");
  }
}

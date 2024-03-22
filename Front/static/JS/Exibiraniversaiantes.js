function toggleExibiraniversaiantes(diaId) {
  // Seleciona todos os elementos com a classe .area-aniversaiantes dentro do elemento com o id especificado
  var aniversaiantesElements = document.querySelectorAll(
    `#${diaId} .area-aniversaiantes`
  );

  // Seleciona o botão
  var button = document.querySelector(
    ".btn-recuar-expandir-alt.btn-pesquisa-rapida"
  );

  // Itera sobre cada elemento
  aniversaiantesElements.forEach(function (element) {
    // Verifica se o elemento já tem a classe .visible
    if (element.classList.contains("visible")) {
      // Se tiver, remove a classe .visible e adiciona a classe .hidden
      element.classList.remove("visible");
      element.classList.add("hidden"); // Adiciona a classe .hidden se necessário
    } else {
      // Se não tiver, remove a classe .hidden e adiciona a classe .visible
      element.classList.remove("hidden"); // Remove a classe .hidden se necessário
      element.classList.add("visible");
    }
  });

  // Atualiza o texto do botão e o estilo do triângulo
  if (button.classList.contains("up")) {
    button.classList.remove("up");
    button.textContent = "Exibir aniversariantes";
  } else {
    button.classList.add("up");
    button.textContent = "Ocultar";
  }
}

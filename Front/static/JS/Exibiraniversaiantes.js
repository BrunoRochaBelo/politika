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
    if (element.classList.contains("visible")) {
      element.classList.remove("visible");
      element.classList.add("hidden");
      // Remove a classe item-visible dos elementos <li>
      element.querySelectorAll("li").forEach(function (li) {
        li.classList.remove("item-visible");
      });
    } else {
      element.classList.remove("hidden");
      element.classList.add("visible");
      // Adiciona a classe item-visible aos elementos <li>
      element.querySelectorAll("li").forEach(function (li) {
        li.classList.add("item-visible");
      });
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

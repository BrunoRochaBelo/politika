function toggleRecuarExpandirHorizontal() {
  var element = document.querySelector(".lista-horizontal-template");
  var button = document.querySelector(".btn-recuar-expandir");
  element.classList.toggle("desativar-responsivo");

  if (element.classList.contains("desativar-responsivo")) {
    button.innerHTML = "Recuar";
  } else {
    button.innerHTML = "Expandir";
  }
}

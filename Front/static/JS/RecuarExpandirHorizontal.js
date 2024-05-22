function toggleRecuarExpandirHorizontal() {
  var element = document.querySelector(".lista-horizontal");
  var button = document.querySelector(".btn-recuar-expandir");
  element.classList.toggle("expandir");

  if (element.classList.contains("expandir")) {
    button.classList.add("up");
    button.innerHTML = "Recuar";
  } else {
    button.classList.remove("up");
    button.innerHTML = "Expandir";
  }
}

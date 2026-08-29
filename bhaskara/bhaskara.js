function bhaskara() {

  //pegar os valores do html
  let a = document.getElementById("a").value;
  let b = document.getElementById("b").value;
  let c = document.getElementById("c").value;

  // ... (código para pegar os valores de a, b e c)

  var delta = (b * b) - 4 * a * c;

  document.getElementById('p3').innerHTML = `Valor de Delta: ${delta}`;

  if (delta < 0) {
    document.getElementById('p5').innerHTML = "Não existem raízes reais.";
  } else if (delta === 0) {
    // Caso delta seja igual a zero
    const x = -b / (2 * a);
    document.getElementById('p4').innerHTML = `Raiz única: x = ${x}`;
  } else {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    document.getElementById('p4').innerHTML = `Raízes da equação:`;
    document.getElementById('p1').innerHTML = `x₁ = ${x1}`;
    document.getElementById('p2').innerHTML = `x₂ = ${x2}`;
  }
}

function raiz2() {
// raiz quadrada
let numero = document.getElementById('raizq').value;
let raizQuadrada = Math.sqrt(numero);
document.getElementById('p1').innerHTML = raizQuadrada; // Output: 8
}
function raiz3() {
  
// raiz cubica
let numero = document.getElementById('raizc').value;
let raizCubica = numero ** (1/3);
document.getElementById('p2').innerHTML = raizCubica; // Output: 3
}

// raiz quinta
function raiz5() {
let numero = document.getElementById('raizq').value;
let raizQuinta = numero ** (1/5);
document.getElementById('p3').innerHTML = raizQuinta; // Output: 2
}
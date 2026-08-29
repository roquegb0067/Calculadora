function porcentagem() {
  // Tab to edit

let numero = document.getElementById('input1').value;
let porcentagem = document.getElementById('input2').value;
let resultado = porcentagem / 100 * numero
document.getElementById('p1').innerHTML = resultado;
}
function resolverCompleto() {
  let numero = document.getElementById('input1').value;
let porcentagem = document.getElementById('input2').value;
  //pegar a porcentage e fazer / 100
  let calcs = porcentagem / 100;
  let calc = porcentagem + " ÷ 100";
  let calculo = porcentagem / 100;
  //pegar o resultado e fazer * o numero
let cunc = calcs + " * " + numero;
document.getElementById('pas1').innerHTML = '<b> Primeiro fazer o numero da porcentagem dividido por 100% </b>: ' + calc;
document.getElementById('pas3').innerHTML = 'Resultado: ' + calcs;
document.getElementById('pas2').innerHTML = 'Depois fazer o resultado vezes o numero para obter a porcentagem: ' + cunc;
}
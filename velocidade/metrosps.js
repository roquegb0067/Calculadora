function inputs() {
  
  let metrops = document.getElementById('inpute').value;
  kmt = metrops * 3.6;
  document.getElementById('p1').innerHTML = metrops + ' M/s é igual a: ' + kmt+ ' Km/h';
}
function input1() {
  
  let metrs = document.getElementById('input2').value;
  kmts = metrs / 3.6;
  document.getElementById('p2').innerHTML = metrs + ' Km/h é igual a: ' + kmts + ' M/s';
}

/*if (onclick in document.getElementById('reset')) {
  var elemento = document.getElementById('tab')

 Remove o elemento em questão
elemento.parentElement.removeChild(elemento)
  
}*/
  
  function multiplicar() {

    let multiplicador = document.getElementById('multiplicador').value;
     for (var i = 0; i <= 10; i++) {
       resultado = multiplicador * i
       document.getElementById('tab').innerHTML += 
       '<table border="3">' +
       '<tr>'+
    
       '<td>' + multiplicador + '</td>' +
    
       '<td> x </td>' + 
       '<td>' + i + '</td>' +
       '<td> = </td>' +
       '<td>' + resultado + '</td>'
     
       '</tr>' +
       '</table>';
        document.getElementById('hp').innerHTML = 'Tabuada da multiplicação ' +
          multiplicador + ' :';
   }
  }

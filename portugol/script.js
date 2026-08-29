let insertText = document.getElementById('insertText');
let consoleDiv = document.getElementById('console');
let id = 0;
let varInputTextEditor = "";
let codigosUsuario = []; 
let memoriaVariaveis = {}; // Onde os valores reais (10, 5, 15) ficam guardados

function One() {
  insertText.innerHTML = '<button onclick="inputAndLines()" class="comecar" type="submit">COMEÇAR</button>';
}

function inputAndLines() {
  insertText.innerHTML = '';
  reloadValueInput();
}

/** * CRIA UMA NOVA LINHA DE INPUT 
 * Mantendo a lógica de não resetar os inputs anteriores
 */
function reloadValueInput() {
  id++;
  let divLinha = document.createElement('div');
  divLinha.style.marginBottom = "5px";
  divLinha.style.display = "flex";
  divLinha.style.alignItems = "center";
  
  let novoInput = document.createElement('input');
  novoInput.type = "text";
  novoInput.value = varInputTextEditor;
  novoInput.id = "input-" + id; 
  novoInput.style.flex = "1";
  novoInput.style.marginLeft = "10px";
  
  divLinha.innerHTML = `<span style="color: red; min-width: 20px;">${id}</span>`;
  divLinha.appendChild(novoInput);
  insertText.appendChild(divLinha);
}

/** * LÓGICA DO INTERPRETADOR
 * Lê linha por linha, resolve contas e mostra no console
 */
function Play() {
  codigosUsuario = [];
  memoriaVariaveis = {}; 
  consoleDiv.innerHTML = "<strong>Console:</strong><br>";

  for (let i = 1; i <= id; i++) {
    let inputAtual = document.getElementById("input-" + i);
    
    if (inputAtual) {
      let linhaTexto = inputAtual.value.trim();
      if (linhaTexto === "") continue;

      // --- 1. LÓGICA DE ATRIBUIÇÃO E SOMA (Ex: Z <- X + Y) ---
      if (linhaTexto.includes("<-")) {
        let partes = linhaTexto.split("<-");
        let nomeVar = partes[0].trim();
        let expressao = partes[1].trim();
        
        // Substitui nomes de variáveis pelos valores (Ex: "X + Y" vira "10 + 5")
        let expressaoParaCalcular = expressao;
        for (let v in memoriaVariaveis) {
            // Usamos regex para substituir apenas a palavra inteira da variável
            let regex = new RegExp("\\b" + v + "\\b", "g");
            expressaoParaCalcular = expressaoParaCalcular.replace(regex, memoriaVariaveis[v]);
        }

        try {
          // Calcula o resultado matemático
          let resultado = eval(expressaoParaCalcular);
          memoriaVariaveis[nomeVar] = resultado;
          consoleDiv.innerHTML += `<span style="color: #5555ff">Var ${nomeVar} definida como ${resultado}</span><br>`;
        } catch (e) {
          // Se não for conta, salva como texto puro
          let textoPuro = expressao.replace(/['"]+/g, '');
          memoriaVariaveis[nomeVar] = textoPuro;
          consoleDiv.innerHTML += `<span style="color: #5555ff">Var ${nomeVar} definida como ${textoPuro}</span><br>`;
        }
      }

      // --- 2. LÓGICA DE ESCREVER ---
      else if (linhaTexto.toUpperCase().startsWith("ESCREVA ")) {
        let termo = linhaTexto.substring(8).trim();
        // Se o que estiver no ESCREVA for uma variável conhecida, mostra o valor dela
        let resultadoSaida = memoriaVariaveis[termo] !== undefined ? memoriaVariaveis[termo] : termo;
        consoleDiv.innerHTML += `<span style="color: white">> ${resultadoSaida}</span><br>`;
      }

      // Salva no seu Array de Objetos para manter o histórico
      codigosUsuario.push({ id: i, conteudo: linhaTexto });
    }
  }
}

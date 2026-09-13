const inputIa = document.getElementById('search');
let textoDigitadoGlobal;

function BuscaNaIA() {
  const textoDigitado = inputIa.value;
  textoDigitadoGlobal = textoDigitado;
  if (!textoDigitado.trim()) return;
  
  // Monta um objeto JS
  const dados = {
    pergunta: textoDigitado
  };
  
  // Chama a função assíncrona passando o objeto
  enviarParaRust(dados);
}

async function enviarParaRust(dados) {
  try {
    const resposta = await fetch('/api/pesquisa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Converte o objeto completo em JSON string aqui
      body: JSON.stringify(dados)
    });
    
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }
    
    const resultado = await resposta.json();
    // console.log('Resposta do Rust:', resultado);
    cardsResposta(resultado)
    return resultado;
  } catch (erro) {
    console.error('Falha ao enviar JSON:', erro);
  }
}
const chatHeader = document.getElementById('container');

function cardsResposta(resultado) {
  if (chatHeader) {
    chatHeader.classList.add('iniciado');
  }
  const chatHistory = document.getElementById('chat-history');
  
  // Extrai a propriedade de texto retornada pelo Rust (ex: resultado.resposta ou resultado.mensagem)
  const textoResposta = typeof resultado === 'string' ? resultado : (resultado.resposta || resultado.mensagem || JSON.stringify(resultado));
  
  // Formata o Markdown
  const htmlFormatado = marked.parse(textoResposta);
  
  const novasMensagens = `
        <div class="mensagemEnviada"><p>${textoDigitadoGlobal}</p></div>
        <div class="mensagemRecebida">${htmlFormatado}</div>
    `;
  
  chatHistory.insertAdjacentHTML('beforeend', novasMensagens);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
const rodape_ia = `
<div id="chat-history"></div>
  <div class="rodape">
    <!-- 1. Botão Citroën (Subir) -->
    <button onclick="menuRodape()" type="button" class="btn-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 11L12 5L6 11"></path>
        <path d="M18 18L12 12L6 18"></path>
      </svg>
    </button>
    <!-- 2. Container com Glow exclusivo para o Input -->
    <div class="input-glow">
      <input type="text" id="search" placeholder="Faça uma pergunta a IA">
    </div>
    
    <!-- 3. Botão Aviãozinho -->
    <button onclick="BuscaNaIA()" type="button" class="btn-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 2L11 13"></path>
        <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
      </svg>
      
    </button>
  </div>
`

let visorRodape = document.getElementById('visorRodape');

function menuRodape() {
  visorRodape.innerHTML = `
        <div class="menuRodape" id="meuMenu">
            <button type="button" onclick="selecionarImagem()">📷</button>

            <button onclick="abrirMenu()" type="button">⚒</button><a href="/videos"><button type="button">YT</button></a>
            <button type="button">💾</button>
            <button type="button" onclick="fecharMenu()">×</button>
        </div>
    `;
  
  setTimeout(() => {
    document.getElementById("meuMenu").style.width = "70%";
  }, 10);
}

function fecharMenu() {
    if (!displayFerramentas) return;
    
    // Remove a classe para disparar a animação de saída no CSS
    displayFerramentas.classList.remove('active');
    
    const menu = document.getElementById("meuMenu");
    if (menu) {
        menu.classList.add("recolher");
    }
    
    // Aguarda o tempo da transição para limpar a estrutura
    setTimeout(() => {
        const visorRodape = document.getElementById('visorRodape');
        if (visorRodape) {
            visorRodape.innerHTML = "";
        }
    }, 500);
}


function selecionarImagem() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  
  input.onchange = async (event) => {
    const arquivo = event.target.files[0];
    
    if (arquivo) {
      // Opção 1: Enviar como FormData (Recomendado para multipart/form-data no Rust)
      const formData = new FormData();
      formData.append("file", arquivo);
      
      /* 
      // Exemplo da requisição HTTP para a sua API Rust:
      await fetch("http://seu-servidor-rust/api/upload", {
          method: "POST",
          body: formData
      });
      */
      
      // Opção 2: Converter para Base64 (se a API de IA exigir JSON com string Base64)
      const leitor = new FileReader();
      leitor.onload = () => {
        const base64String = leitor.result;
        console.log("Pronto para enviar ao Rust em Base64:", base64String);
      };
      leitor.readAsDataURL(arquivo);
    }
  };
  
  input.click();
}

// ''logica'' do menu de ferramentas
const displayFerramentas = document.getElementById('ferramentas');
const ferramentasMenu = 
`
      <a href="/Gemini/index.html"><button type="button" class="btn-menu">Inteligência Artificial</button></a>
      <a href="/bhaskara/bhaskara.html"><button type="button" class="btn-menu">Formula de Bhaskara</button></a>
      <a href="/calcularPorcentagem/porcentagem.html"><button type="button" class="btn-menu">Calcular porcentagem</button></a>
      <a href="/velocidade/metrosps.html"><button type="button" class="btn-menu">Calcular velocidade</button></a>
      <a href="/raizes/raizes.html"><button type="button" class="btn-menu">Calcular raizes</button></a>
      <a href="/tabuada/tabuada.html"><button type="button" class="btn-menu">Tabuada</button></a>
      <a href="/portugol/index.html"><button type="button" class="btn-menu">Portugol</button></a>`;
function abrirMenu() {
  displayFerramentas.innerHTML = ferramentasMenu
    if (displayFerramentas) {
        displayFerramentas.classList.add('active');
    }
}
//menu LATERAL SIDEBAR

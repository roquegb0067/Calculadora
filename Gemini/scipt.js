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
const chatHeader = document.getElementById('chat-header');

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

let visorRodape = document.getElementById('visorRodape');

function menuRodape() {
    visorRodape.innerHTML = `
        <div class="menuRodape" id="meuMenu">
            <button type="button" onclick="selecionarImagem()">📷</button>

            <button type="button">⚒</button>
            <button type="button">YT</button>
            <button type="button">💾</button>
            <button type="button" onclick="fecharMenu()">×</button>
        </div>
    `;
    
    setTimeout(() => {
        document.getElementById("meuMenu").style.width = "70%";
    }, 10);
}

function fecharMenu() {
    const menu = document.getElementById("meuMenu");
    if (!menu) return;
    
    // Adiciona a classe que dispara as animações de saída no CSS
    menu.classList.add("recolher");
    
    // Aguarda o tempo da animação (0.5s do transition) para limpar o HTML
    setTimeout(() => {
        visorRodape.innerHTML = "";
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
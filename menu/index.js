const inputIa = document.getElementById('search');

function BuscaNaIA() {
  const textoDigitado = inputIa.value; 

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
        console.log('Resposta do Rust:', resultado);
        return resultado;
    } catch (erro) {
        console.error('Falha ao enviar JSON:', erro);
    }
}
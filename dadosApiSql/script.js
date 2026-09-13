async function enviarDados() {
    try {
        const resposta = await fetch("/api/dados", {
            method: "POST",
            
            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            throw new Error("Erro ao enviar dados");
        }
        
        return await resposta.json();
        
    } catch (erro) {
        console.error(erro);
    }
}

async function buscarDados() {
    try {
        const resposta = await fetch("/api/dados");
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados");
        }
        visor.innerHTML= resposta;
        return await resposta.json();
        
    } catch (erro) {
        console.error(erro);
    }
}
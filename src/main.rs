use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::env;

#[tokio::main]
async fn main() {
    // Carrega o arquivo .env para o ambiente de execução
    dotenvy::dotenv().ok();

    // Pega a chave da variável de ambiente
    let api_key = env::var("GEMINI_API_KEY")
        .expect("A variável GEMINI_API_KEY não foi configurada no arquivo .env");

    println!("Chave carregada com sucesso!");

    // Seu código do servidor Axum continua aqui...
}

#[derive(Deserialize)]
struct PesquisaRequest {
    pergunta: String,
}

#[derive(Serialize)]
struct PesquisaResponse {
    resposta: String,
}

// Estruturas auxiliares para a API do Gemini
#[derive(Serialize)]
struct GeminiContent {
    parts: Vec<GeminiPart>,
}

#[derive(Serialize)]
struct GeminiPart {
    text: String,
}

#[derive(Serialize)]
struct GeminiRequestBody {
    contents: Vec<GeminiContent>,
}

#[derive(Deserialize)]
struct GeminiCandidate {
    content: GeminiContentResponse,
}

#[derive(Deserialize)]
struct GeminiContentResponse {
    parts: Vec<GeminiPartResponse>,
}

#[derive(Deserialize)]
struct GeminiPartResponse {
    text: String,
}

#[derive(Deserialize)]
struct GeminiResponseBody {
    candidates: Option<Vec<GeminiCandidate>>,
}

async fn tratar_pesquisa(Json(payload): Json<PesquisaRequest>) -> Json<PesquisaResponse> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={}",
        api_key
    );

    let body = GeminiRequestBody {
        contents: vec![GeminiContent {
            parts: vec![GeminiPart {
                text: payload.pergunta,
            }],
        }],
    };

    let client = reqwest::Client::new();
    let res = client.post(&url).json(&body).send().await;

    let resposta_texto = match res {
        Ok(response) => {
            if let Ok(gemini_res) = response.json::<GeminiResponseBody>().await {
                gemini_res
                    .candidates
                    .and_then(|c| c.into_iter().next())
                    .and_then(|c| c.content.parts.into_iter().next())
                    .map(|p| p.text)
                    .unwrap_or_else(|| "Sem resposta da IA.".to_string())
            } else {
                "Erro ao ler JSON da API.".to_string()
            }
        }
        Err(_) => "Erro ao conectar com a API do Gemini.".to_string(),
    };

    Json(PesquisaResponse {
        resposta: resposta_texto,
    })
}

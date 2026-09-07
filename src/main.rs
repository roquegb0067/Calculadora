use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::env;
use tower_http::services::ServeDir;

// ============================================================================
// 1. ESTRUTURAS (STRUCTS) - Ficam fora de qualquer função
// ============================================================================

// O que o JavaScript envia para o Rust
#[derive(Deserialize)]
struct PesquisaRequest {
    pergunta: String,
}

// O que o Rust devolve para o JavaScript
#[derive(Serialize)]
struct PesquisaResponse {
    resposta: String,
}

// Estruturas de requisição para a API do Gemini
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

// Estruturas de resposta da API do Gemini
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

// ============================================================================
// 2. HANDLERS (FUNÇÕES DAS ROTAS) - Também ficam fora da main
// ============================================================================

async fn tratar_pesquisa(Json(payload): Json<PesquisaRequest>) -> Json<PesquisaResponse> {
    // Busca a chave configurada no arquivo .env
    let api_key = env::var("GEMINI_API_KEY").unwrap_or_default();
    
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
                "Erro ao ler resposta da API.".to_string()
            }
        }
        Err(_) => "Erro ao conectar com a API do Gemini.".to_string(),
    };

    Json(PesquisaResponse {
        resposta: resposta_texto,
    })
}

// ============================================================================
// 3. FUNÇÃO MAIN - Apenas inicializa o servidor
// ============================================================================
#[derive(Serialize)]
struct retorno_videos{
    id: i32,
    id_video: String,
    classe_video: String,
    titulo_video: String,
}
/*async fn conectar_yt(){
    let key_youtube = env::var("YOUTUBE_API_KEY").unwrap_or_default();
}
*/
    async fn tratar_videos() -> Json<retorno_videos> {
    let video = json_videos {
        id: 1,
        id_video: "dQw4w9WgXcQ".to_string(),
        titulo_video: "Curso de Rust para Iniciantes".to_string(),
        classe_video: "Programação".to_string(),
    };

    Json(video)
}

#[tokio::main]
async fn main() {
    // Carrega as variáveis do arquivo .env
    dotenvy::dotenv().ok();

    // Monta a aplicação com as rotas e arquivos estáticos
    let app = Router::new()
        .route("/api/pesquisa", post(tratar_pesquisa))
        .route("/api/videos", post(tratar_videos))
        .nest_service("/", ServeDir::new("."));

    println!("Servidor rodando em http://127.0.0.1:3000");

    // Inicia o servidor escutando na porta 3000
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

use axum::{routing::{get, post}, Json, Router};
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
struct RetornoVideos{
    id: i32,
    id_video: String,
    classe_video: String,
    titulo_video: String,
}
#[derive(Deserialize, Debug)]
struct YouTubeResponse {
    items: Vec<YouTubeItem>,
}

#[derive(Deserialize, Debug)]
struct YouTubeItem {
    id: VideoId,
    snippet: Snippet,
}

#[derive(Deserialize, Debug)]
struct VideoId {
    #[serde(rename = "videoId")]
    video_id: Option<String>, // Pode ser None se o resultado for um canal/playlist
}

#[derive(Deserialize, Debug)]
struct Snippet {
    title: String,
}
async fn conectar_yt() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Suas variáveis
    let key_youtube = env::var("YOUTUBE_API_KEY").unwrap_or_default();
    let termo_pesquisa = "Ciência todo dia";
    
    // 2. Construindo a URL com os parâmetros de consulta (Query Parameters)
    let url = "https://googleapis.com";
    
    let params = [
        ("part", "snippet"),
        ("q", termo_pesquisa), // Passando a sua variável aqui
        ("type", "video"),
        ("maxResults", "5"),
        ("key", key_youtube),
    ];

    // 3. Criando o cliente HTTP e fazendo a requisição GET
    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .query(&params)
        .send()
        .await?;

    // 4. Verificando o status e tratando a resposta
    if response.status().is_success() {
        let dados: YouTubeResponse = response.json().await?;
        
        for item in dados.items {
            if let Some(id) = item.id.video_id {
                println!("Título: {}", item.snippet.title);
                println!("Link: https://youtu.be{}\n", id);
            }
        }
    } else {
        println!("Erro na requisição: {}", response.status());
         println!("{}", response.text().await?);
    }

    Ok(())
}

    
    
    
    
    
    
    async fn tratar_videos() -> Json<RetornoVideos> {
    let video = RetornoVideos {
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
        .route("/api/videos", get(tratar_videos))
        .nest_service("/", ServeDir::new("."));

    println!("Servidor rodando em http://127.0.0.1:3000");

    // Inicia o servidor escutando na porta 3000
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

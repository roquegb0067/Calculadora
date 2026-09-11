use axum::{routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use std::env;
use tower_http::services::ServeDir;

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
//pesquisa youtube
#[derive(Deserialize, Serialize, Debug)]
struct PesquisaUsuario {
    pergunta: String,
}


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

async fn tratar_pesquisa_usuario(Json(payload): Json<PesquisaUsuario>) {
    // Chama o conectar_yt passando a struct desserializada
    let _ = conectar_yt(payload).await;
}

async fn conectar_yt(pesquisa_usuario: PesquisaUsuario) -> Result<Vec<RetornoVideos>, Box<dyn std::error::Error>> {

    let key_youtube = env::var("YOUTUBE_API_KEY").unwrap_or_default();
    let termo_pesquisa = pesquisa_usuario.pergunta; 
    
    let url = "https://www.googleapis.com/youtube/v3/search";
    
    let params = [
        ("part", "snippet"),
        ("q", &termo_pesquisa),
        ("type", "video"),
        ("maxResults", "5"),
        ("key", &key_youtube),
    ];

    // 3. Criando o cliente HTTP e fazendo a requisição GET
    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .query(&params)
        .send()
        .await?;
    
    //cria a lista de videos que vão ser enviados para o front
    let mut lista_videos = Vec::new();
    // 4. Verificando o status e tratando a resposta
    if response.status().is_success() {
        let dados: YouTubeResponse = response.json().await?;
        let mut contador_id = 1;
        for item in dados.items {
            if let Some(id) = item.id.video_id {
                lista_videos.push(RetornoVideos {
                    id: contador_id,
                    id_video: id,
                    titulo_video: item.snippet.title,
                    classe_video: termo_pesquisa.to_string(),
                });
                contador_id += 1;
            }
        }
    } else {
        println!("Erro na requisição: {}", response.status());
         println!("{}", response.text().await?);
    }

    Ok(lista_videos)
}


async fn tratar_videos(PesquisaUsuario) -> Json<Vec<RetornoVideos>> {
    // Tenta buscar do YouTube. Se der erro, retorna uma lista vazia
    let lista = conectar_yt().await.unwrap_or_default();

    Json(lista)
}

#[tokio::main]
async fn main() {
    // Carrega as variáveis do arquivo .env
    dotenvy::dotenv().ok();

    // Monta a aplicação com as rotas e arquivos estáticos
    let app = Router::new()
        .route("/api/pesquisa", post(tratar_pesquisa))
        .route("/api/videos", get(tratar_videos))
        .route("/api/categorias", get(tratar_categorias))
        .route("/api/videoSearch", post(tratar_pesquisa_usuario))
        .nest_service("/", ServeDir::new("."));
        
    println!("Servidor rodando em http://127.0.0.1:3000");

    // Inicia o servidor escutando na porta 3000
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

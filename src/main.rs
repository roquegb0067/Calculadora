use axum::{
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::services::ServeDir;

#[derive(Deserialize)]
struct PesquisaRequest {
    pergunta: String,
}

#[derive(Serialize)]
struct PesquisaResponse {
    resposta: String,
}

// Sua rota de API para a IA
async fn tratar_pesquisa(Json(payload): Json<PesquisaRequest>) -> Json<PesquisaResponse> {
    println!("Pergunta recebida: {}", payload.pergunta);

    Json(PesquisaResponse {
        resposta: format!("Resposta para: {}", payload.pergunta),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        // Rota da API que recebe o JSON do front-end
        .route("/api/pesquisa", post(tratar_pesquisa))
        // Serve a raiz "." (onde estão as pastas menu, bhaskara, etc.)
        .nest_service("/", ServeDir::new(".menu/index.html"));

    println!("Servidor rodando em http://127.0.0.1:3000");

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

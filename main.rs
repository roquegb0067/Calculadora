use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct PesquisaRequest {
    pergunta: String,
}

#[derive(Serialize)]
struct PesquisaResponse {
    resposta: String,
}

async fn tratar_pesquisa(Json(payload): Json<PesquisaRequest>) -> Json<PesquisaResponse> {
    println!("Texto recebido do JS: {}", payload.pergunta);

    Json(PesquisaResponse {
        resposta: format!("Sua busca por '{}' foi processada!", payload.pergunta),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/api/pesquisa", post(tratar_pesquisa));
    
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

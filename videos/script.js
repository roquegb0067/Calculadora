let container_videos = document.getElementById('container_principal_videos');

function montar_cards(classe_video, titulo_video, id_video, id) {
  let card_video = `<div class="video-card">
  <div class="video-header">
    <span class="video-class">${classe_video}</span>
    <button type="button" class="more-options">⋮</button>
  </div>
  
  <iframe src="${id_video}" class="video-thumbnail-placeholder">
    <span>Vídeo indisponível</span>
  </iframe>

  <h3 class="video-title">${titulo_video}</h3><p style="display: none;">${id}</p>`;
  container_videos.innerHTML = card_video;
}
async function Receber_json() {
    try {
    const RetornoVideos = await fetch('http://127.0.0.1:3000/api/videos');
    if (!RetornoVideos.ok) {
  throw new Error(`HTTP error! Status: ${RetornoVideos.status}`);

    const resposta = await RetornoVideos.json();
    const { classe_video, titulo_video, id_video, id } = resposta;
    // Percorre cada vídeo retornado do Rust
    listaDeVideos.forEach(video => {
      montar_cards(classe_video, titulo_video, id_video, id);
    });

  return { classe_video, titulo_video, id_video, id };
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
  }
}

Receber_json();
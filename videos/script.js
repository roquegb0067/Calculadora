let container_videos = document.getElementById('container_principal_videos');

function montar_cards(classe_video, titulo_video, id_video, id) {
  const urlThumbnail = `https://img.youtube.com/vi/${id_video}/hqdefault.jpg`;
  let card_video = `<div class="video-card">
  <div class="video-header">
    <span class="video-class">${classe_video}</span>
    <button type="button" class="more-options">⋮</button>
  </div>
  <img src="${urlThumbnail}" alt="${titulo_video}" class="thumb-img" />
    <span>Vídeo indisponível</span>
  </iframe>

  <h3 class="video-title">${titulo_video}</h3><p style="display: none;">${id}</p>`;
  container_videos.innerHTML += card_video;
}
async function Receber_json() {
  try {
    const RetornoVideos = await fetch('http://127.0.0.1:3000/api/videos');
    
    // 1. Tratamento de erro HTTP
    if (!RetornoVideos.ok) {
      throw new Error(`HTTP error! Status: ${RetornoVideos.status}`);
    }

    // 2. Converte a resposta em Array/Lista vinda do Rust
    const listaDeVideos = await RetornoVideos.json();

    // 3. Percorre CADA vídeo da lista e passa as propriedades para a montar_cards
    listaDeVideos.forEach(video => {
      const { classe_video, titulo_video, id_video, id } = video;
      montar_cards(classe_video, titulo_video, id_video, id);
    });

    return listaDeVideos;

  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
  }
}
Receber_json();
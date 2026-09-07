let container_videos = document.getElementById('container_principal_videos');

function montar_cards() {
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
    const json_videos = await fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Converte o objeto completo em JSON string aqui
            body: JSON.stringify(dados)
        });
    if (!json_videos.ok) {
      throw new Error(`HTTP error! Status: ${json_videos.status}`);
    }
    const resposta = await json_videos.json();
    console.log(resposta);
    const { classe_video, titulo_video, id_video, id } = resposta;
    montar_cards(classe_video, titulo_video, id_video, id)
    return { classe_video, titulo_video, id_video, id };
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
Receber_json();
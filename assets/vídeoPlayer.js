/* busca de videos, cards e reprodução*/
let container_videos = document.getElementById(
  'container_principal_videos'
);

let inputPesquisaYt = document.getElementById(
  'inputPesquisaYt'
);
const sidebar = document.getElementById('sidebarMenu');

async function PesquisaYouTube() {
  
  if (!inputPesquisaYt.value.trim()) return;
  
  
  const dados = {
    pergunta: inputPesquisaYt.value
  };
  
  
  try {
    
    const resposta = await fetch(
      '/api/videoSearch',
      {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(dados)
      }
    );
    
    
    if (!resposta.ok) {
      
      throw new Error(
        `Erro na requisição: ${resposta.status}`
      );
      
    }
    
    
    const listaDeVideos =
      await resposta.json();
    
    
    container_videos.innerHTML = "";
    
    
    listaDeVideos.forEach(video => {
      
      const {
        classe_video,
        titulo_video,
        id_video,
        id
      } = video;
      
      
      montar_cards(
        classe_video,
        titulo_video,
        id_video,
        id
      );
      
    });
    
    
  } catch (erro) {
    
    console.error(
      'Erro ao pesquisar vídeos:',
      erro
    );
  }
}
/*
function montar_cards(
  classe_video,
  titulo_video,
  id_video,
  id
) {
  
  const urlThumbnail =
    `https://img.youtube.com/vi/${id_video}/hqdefault.jpg`;
  
  
  let card_video = `
  
  <div class="video-card">

    <div class="video-header">

      <span class="video-class">
        ${classe_video}
      </span>

      <button
        type="button"
        class="more-options"
      >
        ⋮
      </button>

    </div>


    <img
      src="${urlThumbnail}"
      alt="${titulo_video}"
      class="thumb-img"
    />


    <h3 class="video-title">
      ${titulo_video}
    </h3>


    <p style="display: none;">
      ${id}
    </p>

  </div>
  
  `;
  
  
  container_videos.innerHTML += card_video;
  
}


*/
function montar_cards(classe_video, titulo_video, id_video, id) {
  const urlThumbnail = `https://img.youtube.com/vi/${id_video}/hqdefault.jpg`;

  let card_video = `
  <div class="video-card">
    <div class="video-header">
      <span class="video-class">${classe_video}</span>
      <button type="button" class="more-options">⋮</button>
    </div>

    <!-- Adicionado onclick para disparar a função abrirPlayer -->
    <img
      src="${urlThumbnail}"
      alt="${titulo_video}"
      class="thumb-img"
      style="cursor: pointer;"
      onclick="abrirPlayer('${id_video}')"
    />

    <h3 class="video-title">${titulo_video}</h3>
    <p style="display: none;">${id}</p>
  </div>
  `;

  container_videos.innerHTML += card_video;
}

// Lógica do Modal de Reprodução do Vídeo
const modalVideo = document.getElementById('modal-video');
const containerPlayer = document.getElementById('container-player');
const btnFecharVideo = document.getElementById('btn-fechar-video');

function abrirPlayer(idVideo) {
  if (!modalVideo || !containerPlayer) return;

  // Injeta o iframe configurado com autoplay
  containerPlayer.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${idVideo}?autoplay=1" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;

  // Exibe a janela modal
  modalVideo.showModal();
}

// Fecha a janela e remove o iframe para o som/reprodução parar
function fecharPlayer() {
  if (!modalVideo || !containerPlayer) return;
  modalVideo.close();
  containerPlayer.innerHTML = ''; // Limpa o iframe interrompendo o som do vídeo
}

if (btnFecharVideo) {
  btnFecharVideo.addEventListener('click', fecharPlayer);
}

// Fecha ao clicar fora do conteúdo (no backdrop escuro)
if (modalVideo) {
  modalVideo.addEventListener('click', (event) => {
    if (event.target === modalVideo) {
      fecharPlayer();
    }
  });
}



function MenuAdaptavelPlayer() {
  displayMenuPlayer.innerHTML = conteudoMenu
    if (displayMenuPlayer) {
        displayMenuPlayer.classList.add('active');
    }
}
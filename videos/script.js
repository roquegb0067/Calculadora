let container_videos = document.getElementById('container_principal_videos');
let inputPesquisaYt = document.getElementById('inputPesquisaYt');

// 1. Função de Pesquisa no YouTube (POST)
async function PesquisaYouTube() {
  if (!inputPesquisaYt.value.trim()) return;

  const dados = {
    pergunta: inputPesquisaYt.value
  };

  try {
    const resposta = await fetch('/api/videoSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const listaDeVideos = await resposta.json();
    container_videos.innerHTML = "";

    listaDeVideos.forEach(video => {
      const { classe_video, titulo_video, id_video, id } = video;
      montar_cards(classe_video, titulo_video, id_video, id);
    });

  } catch (erro) {
    console.error('Erro ao pesquisar vídeos:', erro);
  }
}

// 2. Renderiza os cards de vídeo na tela
function montar_cards(classe_video, titulo_video, id_video, id) {
  const urlThumbnail = `https://img.youtube.com/vi/${id_video}/hqdefault.jpg`;

  let card_video = `
  <div class="video-card">
    <div class="video-header">
      <span class="video-class">${classe_video}</span>
      <button type="button" class="more-options">⋮</button>
    </div>
    <img src="${urlThumbnail}" alt="${titulo_video}" class="thumb-img" />
    <h3 class="video-title">${titulo_video}</h3>
    <p style="display: none;">${id}</p>
  </div>
  `;

  container_videos.innerHTML += card_video;
}

// 3. Busca de Categorias no Backend (GET)
async function categoriasDB(tipoCategoria) {
  openMenu();

  try {
    // Caso precise enviar o parâmetro de tipo no GET: `/api/categorias?tipo=${tipoCategoria}`
    const dadosCategoriasGet = await fetch('/api/categorias');

    if (!dadosCategoriasGet.ok) {
      throw new Error(`HTTP error! Status: ${dadosCategoriasGet.status}`);
    }

    const objetoCategoriasGet = await dadosCategoriasGet.json();
    
    // Chama a função para desenhar as categorias recebidas no menu
    openclass(objetoCategoriasGet);

    return objetoCategoriasGet;

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

// 4. Encaminha a lista recebida do backend para a criação de elementos
function openclass(classList) {
  if (!Array.isArray(classList)) return;

  classList.forEach(item => {
    // Se o backend retornar um array de objetos contendo dados_menu e nomes_categorias:
    if (item.nomes_categorias) {
      criar(item.dados_menu, item.nomes_categorias);
    } else if (typeof item === 'string') {
      // Caso o backend retorne apenas uma lista simples de strings Vec<String>:
      criar(null, [item]);
    }
  });
}

// 5. Injeta os botões na sidebar
function criar(dados_menu, nomes_categorias) {
  // Limpa os botões antigos antes de inserir os novos
  sidebar.innerHTML = '';

  nomes_categorias.forEach((nomecategoriaReturn) => {
    const botao = document.createElement('button');
    botao.type = 'button'; // 'button' é mais indicado do que 'submit' se não estiver dentro de um <form>
    botao.textContent = nomecategoriaReturn;
    
    sidebar.appendChild(botao);
  });
}

// 6. Lógica do Menu Lateral
const sidebar = document.getElementById('sidebarMenu');
if (sidebar) {
  sidebar.classList.add('off');
}

async function CategoriaMenu(categoria) {
  if (categoria === 'classes') {
    await categoriasDB('classes');
  } else if (categoria === 'interesses') {
    await categoriasDB('interesses');
  } else if (categoria === 'mais') {
    await categoriasDB('mais');
  }
}

function openMenu() {
  if (sidebar) sidebar.classList.add('active');
}

function closeMenu() {
  if (sidebar) sidebar.classList.remove('active');
}

// 7. Eventos de Touch (Swipe para fechar o menu)
let xInicial = 0;
let yInicial = 0;
const limiteMinimo = 50;

document.addEventListener('touchstart', (e) => {
  xInicial = e.touches[0].clientX;
  yInicial = e.touches[0].clientY;
}, false);

document.addEventListener('touchend', (e) => {
  if (!xInicial || !yInicial) return;

  let xFinal = e.changedTouches[0].clientX;
  let yFinal = e.changedTouches[0].clientY;

  let diferencaX = xInicial - xFinal;
  let diferencaY = yInicial - yFinal;

  if (Math.abs(diferencaX) > Math.abs(diferencaY)) {
    if (diferencaX > limiteMinimo) {
      closeMenu();
    }
  }

  xInicial = 0;
  yInicial = 0;
}, false);

let container_videos = document.getElementById('container_principal_videos');

function montar_cards(classe_video, titulo_video, id_video, id) {
  const urlThumbnail = `https://img.youtube.com/vi/${id_video}/hqdefault.jpg`;
  let card_video = `<div class="video-card">
  <div class="video-header">
    <span class="video-class">${classe_video}</span>
    <button type="button" class="more-options">⋮</button>
  </div>
  <img src="${urlThumbnail}" alt="${titulo_video}" class="thumb-img" />

  <h3 class="video-title">${titulo_video}</h3><p style="display: none;">${id}</p> </div>`;
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
// Transformamos em um Array de Objetos usando [ ]
async function categoriasDB(){
  openMenu()
try {
  const dadosCategoriasGet = await fetch('/api/categorias');
  // 1. Tratamento de erro HTTP
  if (!dadosCategoriasGet.ok) {
      throw new Error(`HTTP error! Status: ${dadosCategoriasGet.status}`);
    }
  
  // 2. Converte a resposta em Array/Lista vinda do Rust
  const objetoCategoriasGet = await dadosCategoriasGet.json();
  
  // 3. Percorre CADA vídeo da lista e passa as propriedades para a montar_cards
  bjetoCategoriasGet.forEach(dataGet => {
    const { dados_menu, nomes_categorias } = dataGet;
  });
  
  return objetoCategoriasGet;
  
} catch (error) {
  console.error('Erro ao buscar dados:', error);
}
const classList = [
  dataGet
];
openclass(classList)
}
function openclass(classList){
  // Agora o forEach funciona perfeitamente
  classList.forEach(item => {
    const { dados_menu, nomes_categorias } = item;
    
    // O console.log precisa ficar aqui dentro para acessar as variáveis de cada item
    criar(dados_menu, nomes_categorias);
  });
}
function criar(dados_menu, nomes_categorias) {
  // 1. Limpa o menu antes de criar os novos botões (opcional, mas evita duplicar se a função rodar duas vezes)
  sidebar.innerHTML = '';

  // 2. Passa por cada nome da categoria
  nomes_categorias.forEach((nomecategoriaReturn) => {
    // 3. Cria o elemento de botão na memória
    const botao = document.createElement('button');
    
    // 4. Configura as propriedades do botão
    botao.type = 'submit';
    botao.textContent = nomecategoriaReturn; // Injeta apenas o nome atual com segurança
    
    // 5. Adiciona o botão diretamente dentro da sidebar
    sidebar.appendChild(botao);
  });
}

// Chama a função para testar

//logica de abrir e fechar menu lateral
const sidebar = document.getElementById('sidebarMenu');
  sidebar.classList.add('off');
// Função para abrir o menu (chame esta função no evento onclick do botão no rodapé)
function CategoriaMenu(categoria) {
  if (categoria === 'classes') {
    let categoriasBuscadas = 'classes';
    let categoriaList = 
    categoriasDB(categoriasBuscadas);
  }
  if (categoria === 'interesses') {
    let categoriasBuscadas = 'interesses';
    categoriasDB(categoriasBuscadas);
}
  if (categoria === 'mais') {
    let categoriasBuscadas = 'mais';
    categoriasDB(categoriasBuscadas);
  }
}
function openMenu() {
  sidebar.classList.add('active');
}

// Função para fechar o menu
function closeMenu() {
  sidebar.classList.remove('active');
}

let xInicial = 0;
let yInicial = 0;
const limiteMinimo = 50; // Distância mínima em pixels para considerar um swipe

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

    // Confere se o movimento horizontal foi maior que o vertical
    if (Math.abs(diferencaX) > Math.abs(diferencaY)) {
        if (diferencaX > limiteMinimo) {
            closeMenu()
            // Coloque sua ação aqui
        }
    }

    xInicial = 0;
    yInicial = 0;
}, false);

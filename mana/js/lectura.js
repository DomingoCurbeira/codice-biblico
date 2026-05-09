// --- CONFIGURACIÓN ---
const URL_BASE = '../data/mana/';
const URL_INDICE = '../data/indices/indice_mana.json';

// --- ELEMENTOS DEL DOM ---
const contentDom = document.getElementById('lectura-content');

async function cargarLectura() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 1. Buscamos en qué archivo está este ID usando el índice
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        let metaData = null;
        // El índice de maná está organizado por FECHAS, buscamos el ID dentro de los valores
        for (const fecha in indice) {
            const item = indice[fecha].find(i => i.id == id);
            if (item) {
                metaData = item;
                break;
            }
        }

        if (!metaData) throw new Error("Lectura no localizada");

        // 2. Cargamos el archivo del mes/grupo
        const resData = await fetch(`${URL_BASE}${metaData.grupo}.json`);
        const data = await resData.json();
        const lectura = data.find(d => d.id == id);

        if (lectura) {
            renderizarLectura(lectura);
            inicializarMejorasLector();
        }

    } catch (e) {
        console.error(e);
        contentDom.innerHTML = `<p style="text-align:center; padding: 50px;">⚠️ Error al cargar el maná: ${e.message}</p>`;
    }
}

function renderizarLectura(l) {
    const esNT = l.testamento === 'nuevo';
    const sub = esNT ? 'Nuevo Testamento' : 'Antiguo Testamento';

    // 1. Header y Mensaje Central
    let html = `
        <div class="hero-lectura">
            <div class="bg-title-fade">${l.titulo.split(' ')[0]}</div>
            <p class="tema-subtitle">${sub}</p>
            <h1 class="main-title">${l.titulo}</h1>
        </div>

        <div class="mensaje-central">
            ${l.mensaje}
        </div>
    `;

    // 2. Mapear 'explicacion' a las Perlas Visuales
    const perlas = l.explicacion || l.perlas || [];
    
    if (perlas.length > 0) {
        html += `<div class="perlas-grid">`;
        perlas.forEach(p => {
            html += `
                <div class="perla-card">
                    <h3>${p.titulo || p.titulo_perla}</h3>
                    <p class="perla-contexto">${p.texto || p.contexto}</p>
                    <div class="perla-revelacion">
                        ✨ ${p.mensaje || p.revelacion}
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    contentDom.innerHTML = html;
    document.title = `${l.titulo} | Maná Visual`;

    // Configurar botones de compartir
    configurarBotonesCompartir(l);
}

function inicializarMejorasLector() {
    // 1. Barra de Progreso
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    progressContainer.innerHTML = '<div id="reading-progress" class="reading-progress-bar"></div>';
    document.body.prepend(progressContainer);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const bar = document.getElementById("reading-progress");
        if (bar) bar.style.width = scrolled + "%";
    });

    // 2. Control de Fuente
    const fontWrapper = document.createElement('div');
    fontWrapper.className = 'font-control-wrapper';
    fontWrapper.innerHTML = `
        <button id="btn-font-toggle" class="btn-font-toggle" title="Ajustar texto">
            <i class="fas fa-font"></i>
        </button>
        <div id="font-panel" class="font-control-panel">
            <button id="btn-font-up" class="btn-font-action" title="Aumentar">A+</button>
            <button id="btn-font-down" class="btn-font-action" title="Disminuir">A-</button>
        </div>
    `;
    document.body.appendChild(fontWrapper);

    const btnToggle = document.getElementById('btn-font-toggle');
    const fontPanel = document.getElementById('font-panel');

    let currentSize = parseInt(localStorage.getItem('mana_font_size')) || 18;
    document.documentElement.style.setProperty('--reading-size', currentSize + 'px');

    btnToggle.onclick = (e) => {
        e.stopPropagation();
        fontPanel.classList.toggle('active');
    };

    document.getElementById('btn-font-up').onclick = () => {
        if (currentSize < 32) {
            currentSize += 2;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('mana_font_size', currentSize);
        }
    };

    document.getElementById('btn-font-down').onclick = () => {
        if (currentSize > 14) {
            currentSize -= 2;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('mana_font_size', currentSize);
        }
    };

    document.addEventListener('click', () => fontPanel.classList.remove('active'));
    fontPanel.onclick = (e) => e.stopPropagation();
}

function configurarBotonesCompartir(l) {
    const btnWa = document.getElementById('btn-wa');
    const btnFb = document.getElementById('btn-fb');
    const btnCopy = document.getElementById('btn-copy');
    const btnNota = document.getElementById('btn-nota-mana');

    const currentUrl = window.location.href;
    const text = `📖 Mi Maná de hoy: "${l.titulo}". Léelo aquí:`;

    if(btnWa) btnWa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`, '_blank');
    if(btnFb) btnFb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
    if(btnCopy) btnCopy.onclick = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert("Enlace copiado al portapapeles");
        });
    };
    if(btnNota) btnNota.onclick = () => {
        const titulo = `Nota de Maná: ${l.titulo}`;
        const ref = `mana&id=${l.id}`;
        window.location.href = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&ref=${ref}`;
    };
}

document.addEventListener('DOMContentLoaded', cargarLectura);

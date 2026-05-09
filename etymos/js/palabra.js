// --- CONFIGURACIÓN ---
const URL_BASE = '../data/etymos/';

// --- ELEMENTOS DEL DOM ---
const contentDom = document.getElementById('palabra-content');

async function cargarPalabra() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const respuesta = await fetch(`${URL_BASE}lexico.json`);
        if (!respuesta.ok) throw new Error("Error al leer el códice.");
        const lexico = await respuesta.json();

        const palabra = lexico.find(p => p.id == id);

        if (palabra) {
            renderizarPalabra(palabra);
            inicializarMejorasLector();
            verificarRetornoEstudio(); // <--- NUEVO: Retorno inteligente
        } else {
            throw new Error("Palabra no encontrada en el registro.");
        }

    } catch (e) {
        console.error(e);
        contentDom.innerHTML = `<p style="text-align:center; padding: 50px; color:#d4b483">⚠️ ${e.message}</p>`;
    }
}

// --- NUEVO: FUNCIÓN PARA BOTÓN DE REGRESO AL ESTUDIO ---
function verificarRetornoEstudio() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const rastroRaw = sessionStorage.getItem('rastro_estudio');

    if (ref === 'imagen' && rastroRaw) {
        try {
            const rastro = JSON.parse(rastroRaw);
            const nav = document.querySelector('.reading-nav');
            
            if (nav && rastro.url) {
                const btnBackStudy = document.createElement('a');
                btnBackStudy.href = rastro.url;
                btnBackStudy.className = 'btn-return-study';
                btnBackStudy.style.cssText = `
                    display: inline-block;
                    margin-left: 20px;
                    padding: 8px 15px;
                    background: rgba(212, 180, 131, 0.1);
                    border: 1px solid #d4b483;
                    color: #d4b483;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                `;
                btnBackStudy.innerHTML = `<i class="fas fa-book-open"></i> Volver al Estudio: ${rastro.nombrePersonaje || 'Anterior'}`;
                
                btnBackStudy.onmouseover = () => {
                    btnBackStudy.style.background = '#d4b483';
                    btnBackStudy.style.color = '#0f172a';
                };
                btnBackStudy.onmouseout = () => {
                    btnBackStudy.style.background = 'rgba(212, 180, 131, 0.1)';
                    btnBackStudy.style.color = '#d4b483';
                };

                nav.appendChild(btnBackStudy);
            }
        } catch (e) {
            console.error("Error al procesar el rastro de retorno:", e);
        }
    }
}

function renderizarPalabra(p) {
    const idiomaClass = p.idioma.toLowerCase();
    
    // 1. Iniciar HTML del Pergamino
    let html = `
        <article class="pergamino-detalle ${idiomaClass}">
            <div class="lang-watermark-large">${p.original.charAt(0)}</div>
            
            <header class="detalle-header">
                <span class="detalle-idioma-tag">${p.idioma} ${p.strong ? `[${p.strong}]` : ''}</span>
                <h1 class="detalle-original">${p.original}</h1>
                <p class="detalle-transliteracion">/ ${p.transliteracion} /</p>
                <h2 class="detalle-espanol">${p.palabra_espanol}</h2>
            </header>

            <div class="detalle-cuerpo">
                <!-- 2. Significado Primario -->
                <div class="seccion-bloque">
                    <h3 class="seccion-label">Significado Primario</h3>
                    <p class="texto-definicion">${p.definicion_corta}</p>
                </div>

                <!-- 3. Luz Espiritual (Perla) -->
                <div class="seccion-bloque quote-bloque">
                    <h3 class="seccion-label">Luz Espiritual</h3>
                    <p class="perla-texto">"${p.perla_espiritual}"</p>
                </div>

                <!-- 4. Contexto Cultural -->
                ${p.contexto_cultural ? `
                <div class="seccion-bloque">
                    <h3 class="seccion-label">Trasfondo Arqueológico</h3>
                    <p class="texto-definicion">${p.contexto_cultural}</p>
                </div>
                ` : ''}

                <!-- 5. Referencia Bíblica Principal -->
                ${p.ejemplo_biblico ? `
                <div class="seccion-bloque">
                    <h3 class="seccion-label">Sintonía Bíblica</h3>
                    <div class="referencias-grid">
                        <div class="ref-item">
                            <i class="fas fa-bookmark" style="color: #8b6d2a; margin-bottom: 10px; display: block;"></i>
                            <p class="perla-contexto">${p.ejemplo_biblico}</p>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- 6. Raíz y Morfología -->
                ${p.raiz ? `
                <div class="seccion-bloque" style="opacity: 0.8; border-top: 1px solid rgba(139, 109, 42, 0.1); padding-top: 1.5rem;">
                    <h3 class="seccion-label">Raíz de Identidad</h3>
                    <p style="font-size: 0.9rem; font-style: italic; color: #4a4136;">
                        ${p.raiz}
                    </p>
                </div>
                ` : ''}
            </div>
        </article>
    `;
    
    contentDom.innerHTML = html;
    document.title = `${p.palabra_espanol} | Etymos`;

    // Configurar botones de compartir
    configurarBotonesCompartir(p);
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

    let currentSize = parseInt(localStorage.getItem('etymos_font_size')) || 18;
    document.documentElement.style.setProperty('--reading-size', currentSize + 'px');

    btnToggle.onclick = (e) => {
        e.stopPropagation();
        fontPanel.classList.toggle('active');
    };

    document.getElementById('btn-font-up').onclick = () => {
        if (currentSize < 32) {
            currentSize += 2;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('etymos_font_size', currentSize);
        }
    };

    document.getElementById('btn-font-down').onclick = () => {
        if (currentSize > 14) {
            currentSize -= 2;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('etymos_font_size', currentSize);
        }
    };

    document.addEventListener('click', () => fontPanel.classList.remove('active'));
    fontPanel.onclick = (e) => e.stopPropagation();
}

function configurarBotonesCompartir(p) {
    const btnWa = document.getElementById('btn-wa');
    const btnFb = document.getElementById('btn-fb');
    const btnCopy = document.getElementById('btn-copy');
    const btnNota = document.getElementById('btn-nota-etymos');

    const currentUrl = window.location.href;
    const text = `🔍 Descifrando la raíz de: "${p.palabra_espanol}" (${p.original}). Descúbrelo aquí:`;

    if(btnWa) btnWa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`, '_blank');
    if(btnFb) btnFb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
    if(btnCopy) btnCopy.onclick = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert("Enlace copiado al portapapeles");
        });
    };
    if(btnNota) btnNota.onclick = () => {
        const titulo = `Nota de Etymos: ${p.palabra_espanol} (${p.original})`;
        const ref = `etymos&id=${p.id}`;
        window.location.href = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&ref=${ref}`;
    };
}

document.addEventListener('DOMContentLoaded', cargarPalabra);

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
        // Intentar cargar del Diccionario Maestro primero
        const resMaestro = await fetch(`${URL_BASE}etymos_maestro.json?v=${Date.now()}`);
        const maestro = await resMaestro.json();
        let palabra = maestro.find(p => p.id == id);

        if (!palabra) {
            // Fallback al léxico antiguo por si acaso
            const resLexico = await fetch(`${URL_BASE}lexico.json`);
            const lexico = await resLexico.json();
            palabra = lexico.find(p => p.id == id);
        }

        if (palabra) {
            renderizarPalabra(palabra);
            inicializarMejorasLector();
            verificarRetornoEstudio();
        } else {
            throw new Error("Código no encontrado en el registro.");
        }

    } catch (e) {
        console.error(e);
        contentDom.innerHTML = `<p style="text-align:center; padding: 50px; color:#d4b483">⚠️ ${e.message}</p>`;
    }
}

// --- FUNCIÓN PARA BOTÓN DE REGRESO AL ESTUDIO ---
function verificarRetornoEstudio() {
    const params = new URLSearchParams(window.location.search);
    const idRetorno = params.get('retorno');
    const rastroRaw = localStorage.getItem('rastro_estudio');

    if (idRetorno) {
        try {
            const nav = document.querySelector('.reading-nav') || document.body;
            
            const btnBackStudy = document.createElement('a');
            btnBackStudy.href = `../onomastiko/nombre.html?id=${idRetorno}`;
            btnBackStudy.className = 'btn-return-study';
            btnBackStudy.style.cssText = `
                display: inline-block;
                margin: 20px;
                padding: 10px 20px;
                background: rgba(212, 180, 131, 0.1);
                border: 1px solid #d4b483;
                color: #d4b483;
                border-radius: 30px;
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
                transition: all 0.3s ease;
                z-index: 1000;
                position: relative;
            `;
            btnBackStudy.innerHTML = `<i class="fas fa-id-card"></i> Regresar al Perfil`;
            
            btnBackStudy.onmouseover = () => {
                btnBackStudy.style.background = '#d4b483';
                btnBackStudy.style.color = '#0f172a';
            };
            btnBackStudy.onmouseout = () => {
                btnBackStudy.style.background = 'rgba(212, 180, 131, 0.1)';
                btnBackStudy.style.color = '#d4b483';
            };

            // Insertar al inicio del contenido
            const container = document.getElementById('palabra-content');
            if (container) container.prepend(btnBackStudy);
        } catch (e) {
            console.error("Error al procesar el rastro de retorno:", e);
        }
    }
}

function renderizarPalabra(p) {
    const idiomaClass = p.idioma.toLowerCase();
    const isMaestro = !!p.revelacion_cristo; // Corregido: Detección de formato nuevo por revelacion_cristo

    let html = `
        <article class="pergamino-detalle ${idiomaClass}">
            <div class="lang-watermark-large">${p.original.charAt(0)}</div>
            
            <header class="detalle-header">
                <span class="detalle-idioma-tag">${p.idioma}</span>
                <h1 class="detalle-original">${p.original}</h1>
                <p class="detalle-transliteracion">/ ${p.transliteracion} /</p>
                <h2 class="detalle-espanol">${p.termino || p.palabra_espanol}</h2>
            </header>

            <div class="detalle-cuerpo">
                ${isMaestro ? renderMaestroContent(p) : renderLegacyContent(p)}
            </div>
        </article>
    `;
    
    contentDom.innerHTML = html;
    document.title = `${p.termino || p.palabra_espanol} | Etymos Maestro`;

    // --- GUARDAR RASTRO PERSISTENTE ---
    localStorage.setItem('rastro_estudio', JSON.stringify({
        nombrePersonaje: p.termino || p.palabra_espanol,
        url: window.location.href
    }));
}

function renderMaestroContent(p) {
    return `
        <!-- 1. Esencia y Sentido -->
        <div class="seccion-bloque">
            <h3 class="seccion-label">Esencia Antigua</h3>
            <p class="texto-definicion" style="font-weight: 700; color: #8b6d2a; margin-bottom: 0.5rem;">${p.esencia_antigua}</p>
            <p class="texto-definicion">${p.sentido_verdad}</p>
        </div>

        <!-- 2. Eco de la Escritura (RVR 1960) -->
        <div class="seccion-bloque">
            <h3 class="seccion-label">El Eco de la Escritura</h3>
            <div class="quote-bloque">
                <p class="perla-texto">"${p.eco_escritura.texto}"</p>
                <span class="aplicacion-cita" style="display: block; text-align: right; margin-top: 10px; font-weight: 800;">— ${p.eco_escritura.cita} (RVR1960)</span>
            </div>
        </div>

        <!-- 3. Revelación de Cristo -->
        <div class="seccion-bloque">
            <h3 class="seccion-label">Revelación de Cristo</h3>
            <div class="revelacion-box">
                <p class="revelacion-texto">${p.revelacion_cristo}</p>
            </div>
        </div>

        <!-- 4. Reflejo en la Tierra (Parábola) -->
        <div class="seccion-bloque">
            <h3 class="seccion-label">El Reflejo en la Tierra</h3>
            <div class="aplicacion-item" style="border-left: 4px solid var(--accent); background: rgba(255,255,255,0.5);">
                <p class="aplicacion-ejemplo" style="font-style: italic; font-size: 1.1rem; color: #4a4136;">
                    ${p.reflejo_tierra}
                </p>
            </div>
        </div>

        <!-- 5. Declaración Final -->
        <div class="activacion-box">
            <h4>Decreto de Sintonía</h4>
            <p class="activacion-texto">${p.activacion}</p>
        </div>

        <!-- 6. Raíz e Idioma -->
        <div class="seccion-bloque" style="opacity: 0.6; margin-top: 4rem; text-align: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px;">
            <span class="seccion-label" style="border:none">Fuente: ${p.idioma}</span>
        </div>
    `;
}

function renderLegacyContent(p) {
    return `
        <div class="seccion-bloque">
            <h3 class="seccion-label">Significado</h3>
            <p class="texto-definicion">${p.definicion_corta}</p>
        </div>
        <div class="seccion-bloque quote-bloque">
            <h3 class="seccion-label">Luz Espiritual</h3>
            <p class="perla-texto">"${p.perla_espiritual}"</p>
        </div>
        ${p.raiz ? `
        <div class="seccion-bloque">
            <h3 class="seccion-label">Raíz</h3>
            <p class="texto-definicion">${p.raiz}</p>
        </div>` : ''}
    `;
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

document.addEventListener('DOMContentLoaded', cargarPalabra);

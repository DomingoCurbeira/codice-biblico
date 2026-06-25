// --- CONFIGURACIÓN ---
const URL_BASE = '../data/mana/';
const URL_INDICE = '../data/indices/indice_mana.json';

// --- ELEMENTOS DEL DOM ---
const contentDom = document.getElementById('lectura-content');

// --- VARIABLES GLOBALES DE AUDIO CONTEMPLATIVO ---
let isPlaying = false;
let audioBg = document.getElementById('audio-bg-music');

async function cargarLectura() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 1. Buscamos en qué archivo está este ID usando el índice premium
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        let metaData = null;
        for (const fecha in indice) {
            const item = indice[fecha].find(i => i.id == id);
            if (item) {
                metaData = item;
                break;
            }
        }

        if (!metaData) throw new Error("Lectura no localizada");

        // 2. Cargamos el archivo del mes/grupo correspondiente
        const resData = await fetch(`${URL_BASE}${metaData.grupo}.json`);
        const data = await resData.json();
        const lectura = data.find(d => d.id == id);

        if (lectura) {
            renderizarLectura(lectura);
            inicializarMejorasLector();
            inicializarAudioPlayer(lectura);
        } else {
            throw new Error("Contenido de lectura no encontrado en la base de datos");
        }

    } catch (e) {
        console.error(e);
        contentDom.innerHTML = `
            <div style="text-align:center; padding: 80px 20px; font-family: var(--font-serif); color: var(--wine);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>⚠️ Error al cargar el Maná Visual Premium: ${e.message}</p>
                <a href="index.html" style="color: var(--gold-bronze); font-weight: bold; text-decoration: none; margin-top: 20px; display: inline-block;">
                    Volver al Dashboard
                </a>
            </div>
        `;
    }
}

function renderizarLectura(l) {
    const esNT = l.testamento === 'nuevo';
    const sub = esNT ? 'Nuevo Testamento' : 'Antiguo Testamento';

    let html = `
        <div class="hero-lectura">
            <div class="bg-title-fade">${l.titulo.split(' ')[0]}</div>
            <p class="tema-subtitle">${sub}</p>
            <h1 class="main-title">${l.titulo}</h1>
        </div>
    `;

    // 1. Pregunta Gancho (Hook Question)
    if (l.pregunta_gancho) {
        html += `
            <div class="pregunta-gancho-container">
                <h4>Enfoque del Día</h4>
                <div class="pregunta-gancho-text">
                    "${l.pregunta_gancho}"
                </div>
            </div>
        `;
    }

    // 2. Introducción con Letra Capitular (Drop Cap)
    if (l.introduccion) {
        html += `
            <section class="seccion-introduccion">
                <h3 class="introduccion-titulo">I. Introducción</h3>
                <div class="mensaje-introduccion">
                    ${l.introduccion}
                </div>
            </section>
        `;
    }

    // 3. Desarrollo (Las 3 vetas de oro / explicaciones)
    const perlas = l.explicacion || l.perlas || [];
    if (perlas.length > 0) {
        html += `
            <section class="desarrollo-contenedor">
                <h3 class="desarrollo-header">II. Revelación en la Palabra</h3>
                <div class="perlas-grid">
        `;

        perlas.forEach((p, idx) => {
            html += `
                <div class="perla-card">
                    <h3>Punto ${idx + 1}: ${p.titulo || p.titulo_perla}</h3>
                    ${(p.texto || p.contexto) ? `<p class="perla-contexto">"${p.texto || p.contexto}"</p>` : ''}
                    <div class="perla-revelacion">
                        <strong>Aplicación Devocional:</strong>
                        ${p.mensaje || p.revelacion}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </section>
        `;
    }

    // 4. Conclusión
    if (l.conclusion) {
        html += `
            <section class="seccion-conclusion">
                <h3 class="conclusion-titulo">III. Conclusión</h3>
                <div class="conclusion-texto">
                    ${l.conclusion}
                </div>
            </section>
        `;
    }

    // 5. Desafío Diario
    if (l.desafio_dia) {
        html += `
            <section class="seccion-desafio">
                <h3 class="desafio-titulo"><i class="fas fa-fire"></i> Desafío Diario</h3>
                <div class="desafio-texto">
                    ${l.desafio_dia}
                </div>
            </section>
        `;
    }

    contentDom.innerHTML = html;
    document.title = `${l.titulo} | Maná Visual Premium`;

    // Actualizar datos del reproductor de audio flotante
    const audioTrackTitle = document.getElementById('audio-track-title');
    if (audioTrackTitle) {
        audioTrackTitle.innerText = `Ambiente: ${l.tema}`;
    }

    // Guardar el rastro persistente en localStorage
    localStorage.setItem('rastro_estudio', JSON.stringify({
        nombrePersonaje: l.titulo,
        url: window.location.href
    }));
}

function inicializarMejorasLector() {
    // 1. Barra de Progreso de Lectura de la Página
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const bar = document.getElementById("reading-progress");
        if (bar) bar.style.width = scrolled + "%";
    });

    // 2. Widget de Control de Tamaño de Fuente
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

    let currentSize = parseInt(localStorage.getItem('mana_font_size')) || 19;
    document.documentElement.style.setProperty('--reading-size', currentSize + 'px');

    btnToggle.onclick = (e) => {
        e.stopPropagation();
        fontPanel.classList.toggle('active');
    };

    document.getElementById('btn-font-up').onclick = () => {
        if (currentSize < 32) {
            currentSize += 1;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('mana_font_size', currentSize);
        }
    };

    document.getElementById('btn-font-down').onclick = () => {
        if (currentSize > 14) {
            currentSize -= 1;
            document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
            localStorage.setItem('mana_font_size', currentSize);
        }
    };

    document.addEventListener('click', () => fontPanel.classList.remove('active'));
    fontPanel.onclick = (e) => e.stopPropagation();
}

// --- CONTROLES DE AUDIO CONTEMPLATIVO ---

function inicializarAudioPlayer(lectura) {
    const btnPlayPause = document.getElementById('btn-play-pause');
    const playIcon = document.getElementById('play-icon');
    const audioTrackStatus = document.getElementById('audio-track-status');
    const audioPulse = document.getElementById('audio-pulse');
    const linkVolver = document.getElementById('link-volver');

    // Manejo de Reproducción / Pausa
    btnPlayPause.onclick = () => {
        togglePlayState();
    };

    function togglePlayState() {
        if (isPlaying) {
            // Pausar
            isPlaying = false;
            playIcon.className = "fas fa-play";
            audioPulse.classList.remove('playing');
            audioTrackStatus.innerText = "Música Pausada";
            
            if (audioBg) {
                audioBg.pause();
            }
        } else {
            // Reproducir
            isPlaying = true;
            playIcon.className = "fas fa-pause";
            audioPulse.classList.add('playing');
            audioTrackStatus.innerText = "Sintonía de Paz Activa";

            // Sintonizar música de fondo contemplativa a un volumen óptimo de estudio
            if (audioBg) {
                audioBg.volume = 0.25; 
                audioBg.play().catch(err => {
                    console.log("Interacción de usuario requerida para reproducir audio de fondo contemplativo", err);
                    audioTrackStatus.innerText = "Haz clic en Play de nuevo";
                    isPlaying = false;
                    playIcon.className = "fas fa-play";
                    audioPulse.classList.remove('playing');
                });
            }
        }
    }

    // Detener música al salir de la página
    window.addEventListener('beforeunload', () => {
        if (audioBg) audioBg.pause();
    });

    if (linkVolver) {
        linkVolver.onclick = () => {
            if (audioBg) audioBg.pause();
        };
    }
}

document.addEventListener('DOMContentLoaded', cargarLectura);

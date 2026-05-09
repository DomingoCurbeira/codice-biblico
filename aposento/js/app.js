// VARIABLES GLOBALES
let datosOraciones = {}; 
let oracionActual = null;
let currentSize = parseInt(localStorage.getItem('codice_font_size')) || 18; 
let synth = window.speechSynthesis;
let estaReproduciendo = false;
let currentUtterance = null; 
const musicaDom = document.getElementById('musica-fondo');

// CONFIGURACIÓN DE RUTAS
const URL_INDICE = '../data/indices/indice_oraciones.json';
const URL_BASE_DATA = '../data/aposento/';

// ELEMENTOS DEL DOM
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaOracion = document.getElementById('pantalla-oracion');
const tituloDom = document.getElementById('titulo-oracion');
const citaDom = document.getElementById('cita-biblica');
const textoDom = document.getElementById('texto-oracion');
const playerContainer = document.getElementById('player-container');
const btnPlay = document.getElementById('btn-play');
const estadoAudio = document.getElementById('estado-audio');

// 1. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("🙏🏻 Conectando Aposento con Códice...");

        // --- RETORNO INTELIGENTE ---
        checkRetornoOrigen(); 
        
        // A) CARGAR ÍNDICE
        const resIndice = await fetch(URL_INDICE);
        if(!resIndice.ok) throw new Error("No se pudo cargar el índice");
        const indice = await resIndice.json();

        // B) CARGAR ARCHIVOS
        const archivos = Object.values(indice);
        const promesas = archivos.map(archivo => 
            fetch(`${URL_BASE_DATA}${archivo}.json`).then(r => r.json())
        );
        const resultados = await Promise.all(promesas);

        // C) UNIFICAR DATOS
        resultados.forEach(dataArchivo => {
            if (dataArchivo.temas) {
                Object.assign(datosOraciones, dataArchivo.temas);
            }
        });

        // RENDERIZAR FILTROS Y MENÚ
        renderizarFiltros();
        renderizarMenu();

        // D) DETECTAR URL
        const urlParams = new URLSearchParams(window.location.search);
        const paramTema = urlParams.get('tema'); 

       if (paramTema) {
            buscarYCargarOracion(paramTema);
        } else {
            pantallaInicio.classList.remove('hidden');
        }

    } catch (error) {
        console.error("❌ Error:", error);
        if(tituloDom) tituloDom.innerText = "Error de conexión";
    }
});

// 2. BUSCADOR INTELIGENTE
function buscarYCargarOracion(busqueda) {
    if (datosOraciones[busqueda]) {
        cargarOracion(busqueda);
        return;
    }
    const busquedaNormalizada = busqueda.toLowerCase().trim();
    const idEncontrado = Object.keys(datosOraciones).find(key => {
        const oracion = datosOraciones[key];
        return oracion.titulo.toLowerCase().trim() === busquedaNormalizada;
    });

    if (idEncontrado) cargarOracion(idEncontrado);
    else pantallaInicio.classList.remove('hidden'); 
}

// 3. CARGAR ORACIÓN
window.cargarOracion = function(id) {
    oracionActual = datosOraciones[id];
    if (!oracionActual) return;

    const nuevaUrl = `?tema=${id}`;
    window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);

    pantallaInicio.classList.add('hidden');
    pantallaOracion.classList.remove('hidden');
    if(playerContainer) playerContainer.classList.remove('hidden');

    if(tituloDom) tituloDom.innerText = oracionActual.titulo;
    if(citaDom) citaDom.innerText = oracionActual.cita || oracionActual.cita_base || ""; 
    
    if(textoDom) {
        const textoVisual = oracionActual.contenido.replace(/\[SELAH\]/g, '<div class="selah-visual">Selah</div>');
        textoDom.innerHTML = textoVisual;
        if (oracionActual.contenido.length > 50) textoDom.classList.add('has-dropcap');
        else textoDom.classList.remove('has-dropcap');
    }

    inicializarUXLectura();
    inyectarBotonesCompartir(oracionActual); 
    detenerAudio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 4. VOLVER AL INICIO
window.volverInicio = function() {
    detenerAudio();
    if(playerContainer) playerContainer.classList.add('hidden');
    pantallaOracion.classList.add('hidden');
    pantallaInicio.classList.remove('hidden');
    window.history.pushState({}, document.title, window.location.pathname);
};

// 5. REPRODUCTOR DE AUDIO
if(btnPlay) {
    btnPlay.addEventListener('click', () => {
        if (estaReproduciendo) detenerAudio();
        else comenzarLectura();
    });
}

async function comenzarLectura() {
    if (!oracionActual) return;
    estaReproduciendo = true;
    actualizarBoton(true);

    if(musicaDom) {
        musicaDom.volume = 0.15; 
        musicaDom.play().catch(e => console.log("Audio autoplay bloqueado"));
    }

    const fragmentos = oracionActual.contenido.split('[SELAH]');

    for (let i = 0; i < fragmentos.length; i++) {
        if (!estaReproduciendo) break; 
        if(estadoAudio) {
            estadoAudio.innerText = "Ministrando...";
            estadoAudio.style.color = "var(--gold)";
        }
        await leerTexto(fragmentos[i]);

        if (i < fragmentos.length - 1 && estaReproduciendo) {
            if(estadoAudio) {
                estadoAudio.innerText = "Selah... (Tiempo de oración)";
                estadoAudio.style.color = "#fff";
            }
            if(musicaDom) fadeVolume(musicaDom, 0.4); 
            await esperar(8000); 
            if(musicaDom) fadeVolume(musicaDom, 0.15);
        }
    }
    detenerAudio();
}

function leerTexto(texto) {
    return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(texto.replace(/\n/g, '. '));
        utter.lang = 'es-ES'; 
        utter.rate = 0.85; 
        const voces = synth.getVoices();
        const vozGoogle = voces.find(v => v.name.includes('Google') && v.lang.includes('es'));
        if (vozGoogle) utter.voice = vozGoogle;
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        currentUtterance = utter;
        synth.speak(utter);
    });
}

function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

function fadeVolume(audio, target) {
    if (!audio) return;
    const step = 0.05;
    const interval = setInterval(() => {
        if (Math.abs(audio.volume - target) < step) {
            audio.volume = target;
            clearInterval(interval);
        } else if (audio.volume < target) audio.volume += step;
        else audio.volume -= step;
    }, 100);
}

function detenerAudio() {
    synth.cancel(); 
    estaReproduciendo = false;
    currentUtterance = null;
    if(musicaDom) { musicaDom.pause(); musicaDom.currentTime = 0; }
    actualizarBoton(false);
    if(estadoAudio) { estadoAudio.innerText = "Listo para orar"; estadoAudio.style.color = "var(--text-muted)"; }
}

function actualizarBoton(reproduciendo) {
    if (reproduciendo) {
        btnPlay.innerHTML = `⏹ Detener`;
        btnPlay.style.background = "rgba(239, 68, 68, 0.2)"; 
        btnPlay.style.color = "#fca5a5";
        btnPlay.style.borderColor = "#ef4444";
    } else {
        btnPlay.innerHTML = `▶ Escuchar Ministración`;
        btnPlay.style.background = "var(--gold)"; 
        btnPlay.style.color = "#0a0c14";
        btnPlay.style.borderColor = "var(--gold)";
    }
}

// 6. FILTROS Y MENÚ
function renderizarFiltros() {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    const categorias = [
        { id: 'todos', label: 'Todos', icono: '✨' },
        { id: 'mañana', label: 'Mañana', icono: '🌅' },
        { id: 'noche', label: 'Noche', icono: '🌙' },
        { id: 'guerra', label: 'Guerra', icono: '⚔️' },
        { id: 'familia', label: 'Familia', icono: '👨‍👩‍👧‍👦' },
        { id: 'identidad', label: 'Identidad', icono: '👑' },
        { id: 'sanidad', label: 'Sanidad', icono: '🏥' },
        { id: 'paz', label: 'Paz', icono: '🕊️' }
    ];
    bar.innerHTML = categorias.map(cat => `<button class="filter-chip ${cat.id === 'todos' ? 'active' : ''}" onclick="filtrarPorCategoria('${cat.id}', this)">${cat.icono} ${cat.label}</button>`).join('');
}

window.filtrarPorCategoria = function(categoria, element) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    renderizarMenu(categoria);
};

function renderizarMenu(filtro = 'todos') {
    const contenedor = document.getElementById('lista-temas');
    if (!contenedor) return;
    contenedor.innerHTML = ''; 

    Object.entries(datosOraciones).forEach(([id, oracion]) => {
        const tit = oracion.titulo.toLowerCase();
        if (filtro !== 'todos') {
            const coincide = (filtro === 'mañana' && (tit.includes("mañana") || tit.includes("despertar"))) ||
                             (filtro === 'noche' && (tit.includes("noche") || tit.includes("dormir"))) ||
                             (filtro === 'guerra' && (tit.includes("guerra") || tit.includes("batalla"))) ||
                             (filtro === 'familia' && (tit.includes("familia") || tit.includes("hijos"))) ||
                             (filtro === 'identidad' && (tit.includes("identidad"))) ||
                             (filtro === 'sanidad' && (tit.includes("sanidad") || tit.includes("enfermo"))) ||
                             (filtro === 'paz' && (tit.includes("paz") || tit.includes("ansiedad")));
            if (!coincide) return;
        }

        const btn = document.createElement('button');
        btn.className = 'btn-tema-card'; 
        let icono = "🔥";
        if(tit.includes("mañana") || tit.includes("despertar")) icono = "🌅";
        else if(tit.includes("noche") || tit.includes("dormir")) icono = "🌙";
        else if(tit.includes("familia")) icono = "👨‍👩‍👧‍👦";
        else if(tit.includes("guerra") || tit.includes("batalla")) icono = "⚔️";
        else if(tit.includes("identidad")) icono = "👑";
        else if(tit.includes("sanidad") || tit.includes("enfermo")) icono = "🏥";
        else if(tit.includes("paz") || tit.includes("ansiedad")) icono = "🕊️";

        btn.innerHTML = `<span class="icono-grande">${icono}</span><span class="titulo-tema">${oracion.titulo}</span>`;
        btn.onclick = () => cargarOracion(id);
        contenedor.appendChild(btn);
    });
}

function inyectarBotonesCompartir(oracion) {
    const containerExistente = document.querySelector('.study-share-section');
    if (containerExistente) containerExistente.remove();

    const shareHTML = `
        <div class="study-share-section" style="text-align: center;">
            <h3 style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 20px; letter-spacing: 2px; text-transform: uppercase;">Guardar y Compartir</h3>
            <div class="share-actions">
                <button id="btn-nota-aposento" class="btn-share" style="background-color: var(--gold); color: #0a0c14;" aria-label="Crear Nota"><i class="fas fa-pen-nib"></i></button>
                <button id="btn-wa" class="btn-share wa" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></button>
                <button id="btn-fb" class="btn-share fb" aria-label="Facebook"><i class="fab fa-facebook"></i></button>
                <button id="btn-copy" class="btn-share copy" aria-label="Copiar Link"><i class="fas fa-link"></i></button>
            </div>
        </div>`;

    pantallaOracion.insertAdjacentHTML('beforeend', shareHTML);

    setTimeout(() => {
        const btnNota = document.getElementById('btn-nota-aposento');
        if (btnNota) {
            btnNota.onclick = () => {
                const url = `../notas/index.html?titulo=${encodeURIComponent('Oración: ' + oracion.titulo)}&ref=aposento`;
                window.open(url, '_blank');
            };
        }
        const currentUrl = window.location.href;
        const shareText = `🙏🏻 Me uní a orar en El Aposento por: *${oracion.titulo}*. Únete aquí:`;
        document.getElementById('btn-wa').onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
        document.getElementById('btn-fb').onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        document.getElementById('btn-copy').onclick = () => {
            navigator.clipboard.writeText(currentUrl).then(() => alert("Enlace de oración copiado"));
        };
    }, 100);
}

function inicializarUXLectura() {
    if (!document.getElementById('reading-progress')) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        progressContainer.innerHTML = '<div id="reading-progress" class="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const bar = document.getElementById("reading-progress");
            if (bar) bar.style.width = scrolled + "%";
        });
    }

    if (!document.getElementById('btn-font-toggle')) {
        const fontWrapper = document.createElement('div');
        fontWrapper.className = 'font-control-wrapper';
        fontWrapper.innerHTML = `
            <button id="btn-font-toggle" class="btn-font-toggle" title="Ajustar texto"><i class="fas fa-font"></i></button>
            <div id="font-panel" class="font-control-panel">
                <button id="btn-font-up" class="btn-font-action">A+</button>
                <button id="btn-font-down" class="btn-font-action">A-</button>
            </div>
        `;
        document.body.appendChild(fontWrapper);
        const btnToggle = document.getElementById('btn-font-toggle');
        const fontPanel = document.getElementById('font-panel');

        document.documentElement.style.setProperty('--bio-size', currentSize + 'px');
        btnToggle.addEventListener('click', (e) => { e.stopPropagation(); fontPanel.classList.toggle('active'); });
        document.getElementById('btn-font-up').addEventListener('click', () => {
            if (currentSize < 30) { currentSize += 2; document.documentElement.style.setProperty('--bio-size', currentSize + 'px'); localStorage.setItem('codice_font_size', currentSize); }
        });
        document.getElementById('btn-font-down').addEventListener('click', () => {
            if (currentSize > 14) { currentSize -= 2; document.documentElement.style.setProperty('--bio-size', currentSize + 'px'); localStorage.setItem('codice_font_size', currentSize); }
        });
        document.addEventListener('click', () => fontPanel.classList.remove('active'));
        fontPanel.addEventListener('click', (e) => e.stopPropagation());
    }
}

function checkRetornoOrigen() {
    const rastroRaw = sessionStorage.getItem('rastro_estudio');
    if (rastroRaw) {
        try {
            const rastro = JSON.parse(rastroRaw);
            if (rastro.url) {
                const btnRetorno = document.createElement('button');
                btnRetorno.id = 'btn-retorno-origen';
                btnRetorno.innerHTML = `<i class="fas fa-arrow-left"></i> Volver al Estudio: ${rastro.nombrePersonaje || 'Origen'}`;
                btnRetorno.onclick = () => { sessionStorage.removeItem('rastro_estudio'); window.location.href = rastro.url; };
                
                // Estilo minimalista santuario
                btnRetorno.style.cssText = `position: fixed; top: 20px; right: 80px; z-index: 5000; background: rgba(15, 23, 42, 0.9); border: 1px solid var(--gold); color: var(--gold); padding: 10px 18px; border-radius: 30px; cursor: pointer; font-size: 0.8rem; font-weight: 600; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 8px; transition: 0.3s;`;
                
                btnRetorno.onmouseover = () => { btnRetorno.style.background = "var(--gold)"; btnRetorno.style.color = "#0a0c14"; };
                btnRetorno.onmouseout = () => { btnRetorno.style.background = "rgba(15, 23, 42, 0.9)"; btnRetorno.style.color = "var(--gold)"; };
                
                document.body.appendChild(btnRetorno);
            }
        } catch (e) {}
    }
}

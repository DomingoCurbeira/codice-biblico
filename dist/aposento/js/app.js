// VARIABLES GLOBALES
let datosOraciones = {}; 
let oracionActual = null;
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

        // --- NUEVO: REVISAR SI VENIMOS DE OTRO MÓDULO ---
        checkRetornoOrigen(); 
        // ------------------------------------------------
        
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

        console.log("📖 Oraciones cargadas:", Object.keys(datosOraciones).length);

        // RENDERIZAR MENÚ DE INICIO
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

    if (idEncontrado) {
        cargarOracion(idEncontrado);
    } else {
        pantallaInicio.classList.remove('hidden'); 
    }
}

// 3. CARGAR ORACIÓN (CAMBIA PANTALLA Y URL)
window.cargarOracion = function(id) {
    oracionActual = datosOraciones[id];
    if (!oracionActual) return;

    // Actualizar URL
    const nuevaUrl = `?tema=${id}`;
    window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);

    // Cambiar Pantalla
    pantallaInicio.classList.add('hidden');
    pantallaOracion.classList.remove('hidden');
    if(playerContainer) playerContainer.classList.remove('hidden');

    // Inyectar Datos
    if(tituloDom) tituloDom.innerText = oracionActual.titulo;
    if(citaDom) citaDom.innerText = oracionActual.cita || oracionActual.cita_base || ""; 
    
    // Formato Selah
    if(textoDom) {
        const textoVisual = oracionActual.contenido.replace(/\[SELAH\]/g, '<div class="selah-visual">--- Selah (Pausa para orar) ---</div>');
        textoDom.innerHTML = textoVisual;
    }

    // --- NUEVO: INYECTAR BOTONES DE COMPARTIR ---
    inyectarBotonesCompartir(oracionActual); 
    // ---------------------------------------------

    detenerAudio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
// 4. VOLVER AL INICIO
window.volverInicio = function() {
    detenerAudio();
    if(playerContainer) playerContainer.classList.add('hidden');
    pantallaOracion.classList.add('hidden');
    pantallaInicio.classList.remove('hidden');
    
    // Limpiar URL
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
            estadoAudio.style.color = "#d4b483";
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
        const textoLimpio = texto.replace(/\n/g, '. '); 
        const utter = new SpeechSynthesisUtterance(textoLimpio);
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
        } else if (audio.volume < target) {
            audio.volume += step;
        } else {
            audio.volume -= step;
        }
    }, 100);
}

function detenerAudio() {
    synth.cancel(); 
    estaReproduciendo = false;
    currentUtterance = null;
    if(musicaDom) {
        musicaDom.pause();
        musicaDom.currentTime = 0;
    }
    actualizarBoton(false);
    if(estadoAudio) {
        estadoAudio.innerText = "Listo para orar";
        estadoAudio.style.color = "#9ca3af";
    }
}

function actualizarBoton(reproduciendo) {
    if (reproduciendo) {
        btnPlay.innerHTML = `⏹ Detener`;
        btnPlay.style.background = "rgba(239, 68, 68, 0.2)"; 
        btnPlay.style.color = "#fca5a5";
        btnPlay.style.borderColor = "#ef4444";
    } else {
        btnPlay.innerHTML = `▶ Escuchar Ministración`;
        btnPlay.style.background = "rgba(212, 180, 131, 0.1)"; 
        btnPlay.style.color = "#d4b483";
        btnPlay.style.borderColor = "#d4b483";
    }
}

// 6. RENDERIZAR MENÚ
function renderizarMenu() {
    const contenedor = document.getElementById('lista-temas');
    if (!contenedor) return;
    contenedor.innerHTML = ''; 

    Object.entries(datosOraciones).forEach(([id, oracion]) => {
        const btn = document.createElement('button');
        btn.className = 'btn-tema-card'; 
        
        let icono = "🔥";
        if(oracion.titulo.includes("Mañana")) icono = "🌅";
        if(oracion.titulo.includes("Noche")) icono = "🌙";
        if(oracion.titulo.includes("Familia")) icono = "👨‍👩‍👧‍👦";
        if(oracion.titulo.includes("Guerra")) icono = "⚔️";
        if(oracion.titulo.includes("Identidad")) icono = "👑";
        if(oracion.titulo.includes("Cansancio")) icono = "🔋";
        if(oracion.titulo.includes("Visión")) icono = "🔭";

        btn.innerHTML = `
            <span class="icono-grande">${icono}</span>
            <span class="titulo-tema">${oracion.titulo}</span>
        `;
        btn.onclick = () => cargarOracion(id);
        contenedor.appendChild(btn);
    });
}

// 7. ✅ LÓGICA DEL BOTÓN DE 9 PUNTOS (LAUNCHER)
const btnLauncher = document.getElementById('btn-launcher');
const ecoMenu = document.getElementById('eco-menu');

if (btnLauncher && ecoMenu) {
    btnLauncher.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Alternamos la clase active
        ecoMenu.classList.toggle('active');
        
        // Si usas la clase 'hidden' en el HTML, asegúrate de quitarla
        if (ecoMenu.classList.contains('hidden')) {
            ecoMenu.classList.remove('hidden');
        } else if (!ecoMenu.classList.contains('active')) {
            // Si cerramos y no es active, volvemos a poner hidden (opcional, depende de tu CSS)
            setTimeout(() => ecoMenu.classList.add('hidden'), 300); // Espera la animación
        }
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
            ecoMenu.classList.remove('active');
            setTimeout(() => ecoMenu.classList.add('hidden'), 300);
        }
    });
}

// 8. ✅ BOTONES DE COMPARTIR (CORREGIDO POSICIÓN FOOTER)
function inyectarBotonesCompartir(oracion) {
    // 1. Limpiar botones anteriores
    const containerExistente = document.querySelector('.study-share-section');
    if (containerExistente) containerExistente.remove();

    // 2. HTML de botones (SIN el padding exagerado abajo, ahora el padding lo tendrá el footer)
    const shareHTML = `
        <div class="study-share-section" style="margin-top: 40px; margin-bottom: 40px; text-align: center;">
            <h3 class="share-title" style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 15px; letter-spacing: 1px;">COMPARTIR ESTA ORACIÓN</h3>
            <div class="share-actions">

                <button id="btn-nota-aposento" class="btn-share" style="background-color: #d4b483; color: #0f172a;" aria-label="Crear Nota">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>

                <button id="btn-wa" class="btn-share wa" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button id="btn-fb" class="btn-share fb" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button id="btn-copy" class="btn-share copy" aria-label="Copiar Link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
        </div>`;

    // 3. Buscar el footer actual en la pantalla de oración
    const footerExistente = pantallaOracion.querySelector('.app-footer');

    // 4. Estrategia de Inserción:
    if (footerExistente) {
        // Si el footer YA existe, insertamos los botones ANTES del footer
        footerExistente.insertAdjacentHTML('beforebegin', shareHTML);
    } else {
        // Si no existe, los ponemos al final (como antes)
        pantallaOracion.insertAdjacentHTML('beforeend', shareHTML);
    }

    // 5. Activar los botones
    setTimeout(() => {


        const btnNota = document.getElementById('btn-nota-aposento'); // Asegúrate de ponerle este ID en el HTML
        if (btnNota) {
            btnNota.onclick = () => {
                const titulo = `Oración: ${oracion.titulo}`;
                const cuerpo = `Estuve orando en Aposento sobre este tema.\nCita: ${oracion.cita || ''}\n\nSentir:\n`;
                
                const url = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
                window.open(url, '_blank');
            };
        }


        const btnWa = document.getElementById('btn-wa');
        const btnFb = document.getElementById('btn-fb');
        const btnCopy = document.getElementById('btn-copy');
        
        const currentUrl = window.location.href;
        const shareText = `🙏🏻 Me uní a orar por: *${oracion.titulo}*. Únete aquí:`;

        if(btnWa) btnWa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
        if(btnFb) btnFb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        if(btnCopy) {
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    const originalIcon = btnCopy.innerHTML;
                    btnCopy.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
                    btnCopy.style.background = "#10b981";
                    btnCopy.style.borderColor = "#10b981";
                    setTimeout(() => { 
                        btnCopy.innerHTML = originalIcon; 
                        btnCopy.style.background = ""; 
                        btnCopy.style.borderColor = ""; 
                    }, 2000);
                });
            };
        }
    }, 100);
}

// --- FOOTER GLOBAL (CORREGIDO PARA APOSENTO) ---
function renderizarFooter() {
    const nombreDesarrollador = "Domingo Curbeira"; // <--- CAMBIA ESTO
    const year = new Date().getFullYear();

    // HTML del Footer
    const footerHTML = `
        <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; text-align: center;">
            <div class="footer-content">
                <a href="../index.html" class="footer-brand" style="text-decoration: none; color: #e2e8f0; display: inline-block; margin-bottom: 5px; cursor: pointer;">
                    <span style="font-size: 1.1em;">📜</span> Códice Bíblico
                </a>
                
                <p class="footer-dev" style="color: #64748b; margin: 0;">
                    Desarrollado por <span style="color:#d4b483">${nombreDesarrollador}</span>
                </p>
                <p class="footer-year" style="color:#475569; margin: 0; font-size: 0.7rem;">© ${year}</p>
            </div>
        </footer>
    `;

    // 1. Inyectar en Pantalla de Inicio (al final de la lista)
    const pInicio = document.getElementById('pantalla-inicio');
    // Verificamos si ya tiene footer para no duplicar
    if (pInicio && !pInicio.querySelector('.app-footer')) {
        pInicio.insertAdjacentHTML('beforeend', footerHTML);
    }

    // 2. Inyectar en Pantalla de Oración (al final del texto)
    const pOracion = document.getElementById('pantalla-oracion');
    if (pOracion && !pOracion.querySelector('.app-footer')) {
        pOracion.insertAdjacentHTML('beforeend', footerHTML);
    }
}

// Ejecutar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarFooter);
} else {
    renderizarFooter();
}


// --- 9. SISTEMA DE RETORNO AL ECOSISTEMA ---

function checkRetornoOrigen() {
    const rastroRaw = sessionStorage.getItem('rastro_estudio');
    
    if (rastroRaw) {
        try {
            const rastro = JSON.parse(rastroRaw);

            if (rastro.url) {
                let btnRetorno = document.getElementById('btn-retorno-origen');

                // LÓGICA BLINDADA: Si el botón no existe en el HTML, lo creamos con JavaScript
                if (!btnRetorno) {
                    btnRetorno = document.createElement('button');
                    btnRetorno.id = 'btn-retorno-origen';
                    btnRetorno.onclick = window.retornarAOrigen;
                    // Estilos incorporados directamente
                    btnRetorno.style.cssText = "background: #334155; color: #fcd34d; border: 1px solid #d4b483; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin: 10px 0 20px 0; font-weight: bold; display: inline-flex; align-items: center; gap: 8px; font-family: monospace; width: fit-content;";
                    
                    // Lo inyectamos directamente dentro de la pantalla de oración (arriba del todo)
                    const pantallaOracion = document.getElementById('pantalla-oracion');
                    if (pantallaOracion) {
                        pantallaOracion.insertBefore(btnRetorno, pantallaOracion.firstChild);
                    }
                }

                // Le insertamos el texto dinámicamente
                btnRetorno.innerHTML = `⬅️ Volver al Estudio: <b style="color: #e2e8f0;">${rastro.nombrePersonaje || 'Origen'}</b>`;
                btnRetorno.style.display = 'inline-flex';
            }
        } catch (error) {
            console.error("Error leyendo el rastro de Códice:", error);
        }
    }
}

// Función que se ejecuta al darle clic al botón
window.retornarAOrigen = function() {
    const rastroRaw = sessionStorage.getItem('rastro_estudio');
    if (rastroRaw) {
        const rastro = JSON.parse(rastroRaw);
        
        // 1. Limpiamos la memoria para que el botón desaparezca en futuras visitas directas
        sessionStorage.removeItem('rastro_estudio'); 
        
        // 2. Viajamos de vuelta a la página exacta de donde vinimos
        window.location.href = rastro.url; 
    }
};
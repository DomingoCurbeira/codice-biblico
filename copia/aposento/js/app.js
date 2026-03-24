// VARIABLES GLOBALES
let datosOraciones = {};
let oracionActual = null;
let synth = window.speechSynthesis;
let estaReproduciendo = false;
const musicaDom = document.getElementById('musica-fondo');

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
        const respuesta = await fetch('data/oraciones.json');
        const data = await respuesta.json();
        datosOraciones = data.temas;

        // Estrategia Mocking para URL (ej: ?tema=perdon)
        const urlParams = new URLSearchParams(window.location.search);
        const temaURL = urlParams.get('tema');

        if (temaURL && datosOraciones[temaURL]) {
            cargarOracion(temaURL);
        } else {
            pantallaInicio.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Error cargando oraciones:", error);
        tituloDom.innerText = "Error al cargar datos";
    }
});

// 2. FUNCIÓN PARA CARGAR UNA ORACIÓN
window.cargarOracion = function(tema) {
    oracionActual = datosOraciones[tema];
    
    pantallaInicio.classList.add('hidden');
    pantallaOracion.classList.remove('hidden');
    playerContainer.classList.remove('hidden');

    tituloDom.innerText = oracionActual.titulo;
    citaDom.innerText = oracionActual.cita;
    
    // Formatear texto visualmente
    const textoVisual = oracionActual.contenido.replace(/\[SELAH\]/g, '<br><br><span style="color:#d4b483; font-size:0.8em">--- Selah (Pausa para orar) ---</span><br><br>');
    textoDom.innerHTML = textoVisual;

    detenerAudio();
};

window.volverInicio = function() {
    detenerAudio();
    playerContainer.classList.add('hidden');
    pantallaOracion.classList.add('hidden');
    pantallaInicio.classList.remove('hidden');
    window.history.pushState({}, document.title, window.location.pathname);
};

// 3. LÓGICA DE AUDIO (LA MAGIA DEL SELAH) 🔊

btnPlay.addEventListener('click', () => {
    if (estaReproduciendo) {
        detenerAudio();
    } else {
        comenzarLectura();
    }
});

async function comenzarLectura() {
    if (!oracionActual) return;

    estaReproduciendo = true;
    actualizarBoton(true);

    // --- MÚSICA DE FONDO ---
    if(musicaDom) {
        musicaDom.volume = 0.2; 
        musicaDom.play().catch(e => console.log("Audio bloqueado hasta interactuar"));
    }
    // -----------------------

    const fragmentos = oracionActual.contenido.split('[SELAH]');

    // AQUÍ ESTABA EL ERROR: FALTABA EL CÓDIGO DENTRO DEL BUCLE
    for (let i = 0; i < fragmentos.length; i++) {
        if (!estaReproduciendo) break; 

        // 1. Leemos el fragmento
        estadoAudio.innerText = "Ministrando...";
        await leerTexto(fragmentos[i]);

        // 2. Si no es el último, hacemos la PAUSA SELAH
        if (i < fragmentos.length - 1 && estaReproduciendo) {
            estadoAudio.innerText = "Selah... (Tu turno para orar)";
            await esperar(8000); // 8 segundos de silencio para orar
        }
    }

    detenerAudio();
}

function leerTexto(texto) {
    return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(texto);
        utter.lang = 'es-ES'; 
        utter.rate = 0.9;    
        utter.pitch = 1.0;

        // Intentar buscar voz de Google
        const voces = synth.getVoices();
        const vozSuave = voces.find(v => v.name.includes('Google') && v.lang.includes('es'));
        if (vozSuave) utter.voice = vozSuave;

        utter.onend = () => resolve();
        synth.speak(utter);
    });
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function detenerAudio() {
    synth.cancel(); 
    estaReproduciendo = false;
    
    // Parar música
    if(musicaDom) {
        musicaDom.pause();
        musicaDom.currentTime = 0;
    }

    actualizarBoton(false);
    estadoAudio.innerText = "Listo para orar";
}

function actualizarBoton(reproduciendo) {
    if (reproduciendo) {
        btnPlay.innerHTML = "⏹ Detener";
        btnPlay.style.background = "#ef4444"; 
        btnPlay.style.color = "white";
    } else {
        btnPlay.innerHTML = "▶ Escuchar Ministración";
        btnPlay.style.background = "#d4b483"; 
        btnPlay.style.color = "#1a1a1a";
    }
}
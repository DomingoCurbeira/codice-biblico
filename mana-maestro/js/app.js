/**
 * js/app.js - MANÁ MAESTRO (Premium Edition)
 */

const URL_BASE = '../data/mana-maestro/';
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Banco de Atmósferas (Mapas de imágenes WEBP optimizadas)
const ATMOSFERAS = {
    "templo": "../img/mana/templo.webp", // Temporal hasta tener la carpeta de atmosferas
    "jardin": "../img/mana/jardin.webp",
    "desierto": "../img/mana/desierto.webp",
    "cumbre": "../img/mana/cumbre.webp",
    "trono": "../img/mana/trono.webp",
    "aguas": "../img/mana/aguas.webp",
    "camino": "../img/mana/camino.webp",
    "huerto": "../img/mana/huerto.webp",
    "fuego": "../img/mana/fuego.webp",
    "ciudad": "../img/mana/ciudad.webp"
};

let fechaActual = new Date(); // Hoy por defecto

document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

async function inicializarApp() {
    const params = new URLSearchParams(window.location.search);
    const fechaParam = params.get('fecha');

    if (fechaParam) {
        fechaActual = new Date(fechaParam + 'T00:00:00');
    }

    await cargarProvision(fechaActual);
}

window.seleccionarFecha = function(valor) {
    if (valor) {
        fechaActual = new Date(valor + 'T00:00:00');
        const fechaIso = fechaActual.toISOString().split('T')[0];
        window.history.pushState({}, '', `?fecha=${fechaIso}`);
        cargarProvision(fechaActual);
    }
};

window.abrirCalendario = function(btn) {
    const input = btn.querySelector('input');
    if (input) {
        if (typeof input.showPicker === 'function') {
            input.showPicker();
        } else {
            // Fallback para navegadores antiguos
            input.focus();
            input.click();
        }
    }
};

async function cargarProvision(fecha) {
    // Normalizamos el mes para la URL (siempre minúsculas)
    const mesNombreRaw = MESES[fecha.getMonth()];
    const mesUrl = mesNombreRaw.toLowerCase();
    
    // Normalizamos la fecha de búsqueda para el JSON (Formato: "21 de Mayo")
    const mesTitleCase = mesNombreRaw.charAt(0).toUpperCase() + mesNombreRaw.slice(1).toLowerCase();
    const fechaTextoBusqueda = `${fecha.getDate()} de ${mesTitleCase}`;
    
    const container = document.querySelector('.maestro-container');
    container.style.opacity = '0';

    try {
        const response = await fetch(`${URL_BASE}${mesUrl}.json?v=${Date.now()}`);
        const data = await response.json();
        
        // Búsqueda insensible a mayúsculas/minúsculas dentro del JSON
        const provision = data.find(d => {
            if (!d.fecha) return false;
            return d.fecha.toLowerCase() === fechaTextoBusqueda.toLowerCase();
        });

        if (provision) {
            renderizarProvision(provision);
            container.classList.remove('fade-in');
            void container.offsetWidth; 
            container.classList.add('fade-in');
            container.style.opacity = '1';
        } else {
            container.innerHTML = `
                <div style="text-align:center; padding: 100px 20px; color: var(--gold);">
                    <i class="fas fa-seedling" style="font-size:3rem; margin-bottom:20px; opacity:0.5;"></i>
                    <p>La provisión para el ${fechaTextoBusqueda} está siendo preparada en el consejo del Cielo.</p>
                    <button onclick="cambiarDia(-1)" class="maestro-badge" style="margin-top:20px; cursor:pointer;">Regresar al Ayer</button>
                </div>
            `;
            container.style.opacity = '1';
        }
    } catch (e) {
        console.error("Error cargando Maná Maestro:", e);
        container.style.opacity = '1';
    }
}

function renderizarProvision(p) {
    // 1. Hero e Imagen
    document.getElementById('display-fecha').innerText = p.fecha;
    document.getElementById('display-titulo-dia').innerText = p.titulo_dia;
    
    const heroBg = document.getElementById('hero-bg');
    const imgUrl = ATMOSFERAS[p.atmosfera] || ATMOSFERAS["templo"];
    heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(5,6,8,0.2) 0%, rgba(5,6,8,1) 100%), url('${imgUrl}')`;

    // 2. Llave Maestra
    document.getElementById('display-llave-titulo').innerText = p.llave_maestra.titulo;
    document.getElementById('display-llave-texto').innerText = p.llave_maestra.texto;

    // 3. Díptico (AT y NT)
    document.getElementById('at-referencia').innerText = p.porciones.antiguo.referencia;
    document.getElementById('at-titulo').innerText = p.porciones.antiguo.titulo_porcion;
    document.getElementById('at-misterio').innerText = p.porciones.antiguo.misterio_escudrinado;

    document.getElementById('nt-referencia').innerText = p.porciones.nuevo.referencia;
    document.getElementById('nt-titulo').innerText = p.porciones.nuevo.titulo_porcion;
    document.getElementById('nt-misterio').innerText = p.porciones.nuevo.misterio_escudrinado;

    // 4. Transferencia de Herencia (Con Texto Bíblico)
    const container = document.getElementById('herencia-container');
    container.innerHTML = p.transferencia_herencia.map(h => `
        <div class="herencia-item">
            <strong>${h.punto}</strong>
            <span class="herencia-eco">${h.eco} (RVR1960)</span>
            <p class="herencia-texto-biblico">"${h.texto_biblico}"</p>
            <p class="herencia-reflejo">${h.reflejo}</p>
        </div>
    `).join('');

    // 5. Decreto
    document.getElementById('display-decreto').innerText = p.decreto_maestria;

    // Rastro persistente
    localStorage.setItem('rastro_estudio', JSON.stringify({
        nombrePersonaje: `Maná: ${p.titulo_dia}`,
        url: window.location.href
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.cambiarDia = function(delta) {
    fechaActual.setDate(fechaActual.getDate() + delta);
    const fechaIso = fechaActual.toISOString().split('T')[0];
    window.history.pushState({}, '', `?fecha=${fechaIso}`);
    cargarProvision(fechaActual);
};

window.abrirCalendario = function() {
    document.getElementById('fecha-picker').showPicker();
};

function configurarCalendario() {
    const btn = document.getElementById('btn-calendario');
    const picker = document.getElementById('fecha-picker');

    btn.onclick = () => picker.showPicker();

    picker.onchange = (e) => {
        if (e.target.value) {
            fechaActual = new Date(e.target.value + 'T00:00:00');
            const fechaIso = fechaActual.toISOString().split('T')[0];
            window.history.pushState({}, '', `?fecha=${fechaIso}`);
            cargarProvision(fechaActual);
        }
    };
}

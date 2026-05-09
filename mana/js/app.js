// --- CONFIGURACIÓN ---
const URL_INDICE = '../data/indices/indice_mana.json';
const URL_BASE = '../data/mana/';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const VERSICULOS_MANA = [
    { texto: "No solo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.", cita: "Mateo 4:4" },
    { texto: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", cita: "Salmos 119:105" },
    { texto: "Tu palabra es la verdad.", cita: "Juan 17:17" },
    { texto: "Toda la Escritura es inspirada por Dios y útil para enseñar.", cita: "2 Timoteo 3:16" },
    { texto: "Sécase la hierba, marchítase la flor; mas la palabra del Dios nuestro permanece para siempre.", cita: "Isaías 40:8" }
];

let fechaSeleccionadaGlobal = new Date();

// --- FUNCIONES DE CARGA Y RENDERIZADO ---

async function iniciarMana() {
    actualizarHero(fechaSeleccionadaGlobal);
    renderDaysBar();
    await cargarProvision(fechaSeleccionadaGlobal);
}

function actualizarHero(fecha) {
    const labelDate = document.getElementById('hero-date-label');
    const labelDay = document.getElementById('hero-day-num');
    const labelMonth = document.getElementById('hero-month-label');
    const verseBox = document.getElementById('hero-verse-box');

    const diaSemana = DIAS_SEMANA[fecha.getDay()].toUpperCase();
    const diaMes = fecha.getDate();
    const mes = MESES[fecha.getMonth()].toUpperCase();

    if (labelDate) labelDate.innerText = `${diaSemana}, ${diaMes} DE ${mes}`;
    if (labelDay) labelDay.innerText = diaMes < 10 ? `0${diaMes}` : diaMes;
    if (labelMonth) labelMonth.innerText = mes;

    if (verseBox) {
        const v = VERSICULOS_MANA[diaMes % VERSICULOS_MANA.length];
        verseBox.innerHTML = `"${v.texto}"<br><small>${v.cita}</small>`;
    }
}

function renderDaysBar() {
    const slider = document.getElementById('days-slider');
    if (!slider) return;
    slider.innerHTML = '';

    // Generamos un rango de 7 días (hoy y los 6 anteriores)
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const isSelected = d.toDateString() === fechaSeleccionadaGlobal.toDateString();
        
        const item = document.createElement('div');
        item.className = `day-item ${isSelected ? 'active' : ''}`;
        
        const nombreDia = DIAS_SEMANA[d.getDay()].substring(0, 3);
        const numeroDia = d.getDate();

        item.innerHTML = `
            <span class="day-name">${nombreDia}</span>
            <span class="day-num">${numeroDia}</span>
        `;

        item.onclick = () => {
            fechaSeleccionadaGlobal = new Date(d);
            actualizarHero(fechaSeleccionadaGlobal);
            renderDaysBar();
            cargarProvision(fechaSeleccionadaGlobal);
        };

        slider.appendChild(item);
    }
}

async function cargarProvision(fecha) {
    const launcher = document.getElementById('app-launcher');
    launcher.innerHTML = '<div class="skeleton-loader">Buscando el pan de vida...</div>';

    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        const fechaKey = `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
        const archivos = indice[fechaKey]; 

        if (!archivos || archivos.length === 0) {
            launcher.innerHTML = `<p style="color:var(--gold); text-align:center; padding: 3rem;">No hay provisión programada para el ${fechaKey}.</p>`;
            return;
        }

        const promesas = archivos.map(async (item) => {
            const resData = await fetch(`${URL_BASE}${item.grupo}.json`);
            const data = await resData.json();
            return data.find(d => d.id == item.id);
        });

        const lecturas = (await Promise.all(promesas)).filter(l => l);
        renderDiptico(lecturas);

    } catch (e) {
        launcher.innerHTML = `<p style="color:var(--gold); text-align:center;">Hubo un error al servir la mesa.</p>`;
    }
}

function renderDiptico(mensajes) {
    const launcher = document.getElementById('app-launcher');
    launcher.innerHTML = ''; 

    mensajes.forEach(item => {
        const card = document.createElement('div');
        card.className = 'mini-card';
        
        const esNT = item.testamento === 'nuevo';
        const icon = esNT ? '✝️' : '📜';
        const label = esNT ? 'Nuevo Testamento' : 'Antiguo Testamento';

        card.innerHTML = `
            <div class="testamento-icon">${icon}</div>
            <span class="testamento-label">${label}</span>
            <h2 class="cinzel-font">${item.titulo}</h2>
            <p class="preview-text">${item.mensaje.substring(0, 120)}...</p>
            <div class="btn-read">
                Comenzar Lectura <i class="fas fa-chevron-right"></i>
            </div>
        `;
        
        card.onclick = () => window.location.href = `lectura.html?id=${item.id}`;
        launcher.appendChild(card);
    });
}

// --- INICIALIZACIÓN ---

function masterInit() {
    const contenedorBuscador = document.getElementById('abrir-calendario');
    const inputFecha = document.getElementById('fecha-buscada');

    if (contenedorBuscador && inputFecha) {
        contenedorBuscador.onclick = () => {
            if (typeof inputFecha.showPicker === 'function') inputFecha.showPicker();
            else inputFecha.focus();
        };

        inputFecha.onchange = (e) => {
            fechaSeleccionadaGlobal = new Date(e.target.value + 'T00:00:00');
            actualizarHero(fechaSeleccionadaGlobal);
            renderDaysBar();
            cargarProvision(fechaSeleccionadaGlobal);
        };
    }

    iniciarMana();
}

document.addEventListener('DOMContentLoaded', masterInit);

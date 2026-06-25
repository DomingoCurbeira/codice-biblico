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
    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        const hoyKey = `${fechaSeleccionadaGlobal.getDate()} de ${MESES[fechaSeleccionadaGlobal.getMonth()]}`;
        
        // Si la fecha actual no está en el índice premium (por ejemplo, fuera de la fecha piloto),
        // forzamos el inicio en el 22 de Junio de 2026 para que la demo piloto sea accesible.
        if (!indice[hoyKey]) {
            console.log(`Fecha actual (${hoyKey}) no encontrada en el nuevo índice. Cargando fecha piloto: 22 de Junio.`);
            fechaSeleccionadaGlobal = new Date("2026-06-22T00:00:00");
        }
    } catch(e) {
        console.error("Error al verificar el índice premium, usando fecha piloto.", e);
        fechaSeleccionadaGlobal = new Date("2026-06-22T00:00:00");
    }

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

    // Generamos un rango de 7 días alrededor de la fecha seleccionada o los últimos 7 días
    // Haremos un slider de 7 días (la fecha seleccionada y las 6 anteriores)
    for (let i = 0; i < 7; i++) {
        const d = new Date(fechaSeleccionadaGlobal);
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

        // Insertamos al principio para que queden cronológicamente ordenados de izquierda a derecha (pasado -> hoy/seleccionado)
        slider.insertBefore(item, slider.firstChild);
    }
}

async function cargarProvision(fecha) {
    const launcher = document.getElementById('app-launcher');
    launcher.innerHTML = '<div class="skeleton-loader">Buscando la provisión de hoy...</div>';

    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        const fechaKey = `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
        const lecturasIds = indice[fechaKey]; 

        if (!lecturasIds || lecturasIds.length === 0) {
            launcher.innerHTML = `<p style="color:var(--gold); text-align:center; padding: 4rem; grid-column: 1/-1; font-family: var(--font-serif);">No hay provisión premium programada para el ${fechaKey}.</p>`;
            return;
        }

        const promesas = lecturasIds.map(async (item) => {
            const resData = await fetch(`${URL_BASE}${item.grupo}.json`);
            const data = await resData.json();
            return data.find(d => d.id == item.id);
        });

        const lecturas = (await Promise.all(promesas)).filter(l => l);
        renderDiptico(lecturas);
        actualizarHeroBackground(lecturas);

    } catch (e) {
        console.error(e);
        launcher.innerHTML = `<p style="color:var(--gold); text-align:center; grid-column: 1/-1; font-family: var(--font-serif); padding: 4rem;">Hubo un error al servir la mesa premium.</p>`;
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
        
        // Clase fallback aleatoria basada en el ID
        const fallbackClass = `fallback-bg-${(item.id % 5) + 1}`;

        card.innerHTML = `
            <div class="card-bg-image ${fallbackClass}" ${item.imagen ? `style="background-image: url('${item.imagen}');"` : ''}></div>
            <div class="card-body-content">
                <div class="testamento-icon">${icon}</div>
                <span class="testamento-label">${label}</span>
                <h2 class="cinzel-font">${item.titulo}</h2>
                <div class="card-tema">${item.tema || ''}</div>
                ${item.pregunta_gancho ? `<div class="card-hook">"${item.pregunta_gancho}"</div>` : ''}
                <p class="preview-text">${item.mensaje ? item.mensaje.substring(0, 130) + '...' : ''}</p>
                <div class="btn-read">
                    Comenzar Lectura <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
        
        card.onclick = () => {
            window.location.href = `lectura.html?id=${item.id}`;
        };
        launcher.appendChild(card);
    });
}

function actualizarHeroBackground(lecturas) {
    const heroBg = document.getElementById('hero-background-active');
    if (!heroBg) return;

    // Si hay lecturas y alguna tiene imagen válida, la usamos para el fondo del Hero
    const lecturaConImagen = lecturas.find(l => l.imagen);
    if (lecturaConImagen && lecturaConImagen.imagen) {
        heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(10, 12, 16, 0.6) 0%, rgba(10, 12, 16, 0.95) 100%), url('${lecturaConImagen.imagen}')`;
    } else {
        // Fondo por defecto
        heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(10, 12, 16, 0.6) 0%, rgba(10, 12, 16, 0.95) 100%), url('../../img/hero/hero-mana.webp')`;
    }
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

// --- CONFIGURACIÓN ---
const URL_INDICE = '../data/indices/indice_mana.json';
const URL_BASE = '../data/mana/';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const launcher = document.getElementById('app-launcher');



async function iniciarMana() {
    try {
        // 1. Cargamos el índice (el mapa que nos dice dónde está cada cosa)
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        const hoy = new Date();
        const fechaBuscada = `${hoy.getDate()} de ${MESES[hoy.getMonth()]}`;

        // 2. Obtenemos el array de archivos para hoy (ej: [{grupo: "mateo", ...}])
        const archivosDeHoy = indice[fechaBuscada]; 

        if (!archivosDeHoy || archivosDeHoy.length === 0) {
            throw new Error("No hay lecturas para hoy");
        }

        let lecturasCompletas = [];

        // 3. ¡EL CAMBIO CLAVE!: Usamos for...of para poder usar await correctamente
        for (const item of archivosDeHoy) {
            // Usamos item.grupo para construir la ruta, ej: ../data/mana/mateo.json
            const resData = await fetch(`${URL_BASE}${item.grupo}.json`);
            const data = await resData.json();

            // Buscamos el objeto específico dentro de ese archivo por ID o Fecha
            const objetoFinal = data.find(d => d.id === item.id);
            if (objetoFinal) lecturasCompletas.push(objetoFinal);
        }

        // 4. Mandamos a renderizar (puede ser 1 o 2 cards)
        renderCards(lecturasCompletas);

    } catch (e) {
        console.error("Error en la logística:", e);
        launcher.innerHTML = `<p style="color:var(--gold)">Buscando el pan de hoy...</p>`;
    }
}

function renderCards(mensajes) {
    launcher.innerHTML = ''; 
    // 'mensajes' es el array que contiene el AT y el NT del día
    mensajes.forEach(item => {
        // const res =  fetch(URL_BASE+'/'+item.historicos+'.json');
        // console.log(res)
        //    const data =  res.json();
        const card = document.createElement('div');
        card.className = 'mini-card';
        card.innerHTML = `
            <span class="testamento-label">${item.testamento === 'nuevo' ? 'Nuevo Testamento' : 'Antiguo Testamento'}</span>
            <h2 class="cinzel-font">${item.titulo}</h2>
            <p class="preview-text">${item.mensaje.substring(0, 100)}...</p>
            <div style="margin-top:15px; font-size:0.7rem; color:var(--gold); letter-spacing:1px;">
                LEER MÁS →
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `lectura.html?id=${item.id}`;
        });

        launcher.appendChild(card);
        
    });
}
// --- LÓGICA DEL MENÚ ECOSISTEMA ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');

    if (btnLauncher && ecoMenu) {
        // Abrir / Cerrar al click
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el click se propague al documento
            ecoMenu.classList.toggle('active');
            
            // Efecto visual extra al hacer click
            btnLauncher.style.transform = ecoMenu.classList.contains('active') 
                ? 'rotate(90deg)' 
                : 'rotate(0deg)';
        });

        // Cerrar si hago click fuera del menú
        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
                btnLauncher.style.transform = 'rotate(0deg)'; // Regresa a su posición
            }
        });
    }

      // --- FOOTER GLOBAL AUTOMÁTICO ---
function renderizarFooter() {
    // Evitar duplicados
    if (document.querySelector('.app-footer')) return;

    const nombreDesarrollador = "Domingo Curbeira"; // <--- ¡PON TU NOMBRE AQUÍ!
    const year = new Date().getFullYear();

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

    // Insertar al final del cuerpo de la página
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

const contenedorBuscador = document.getElementById('abrir-calendario');
const inputFecha = document.getElementById('fecha-buscada');

// Al tocar el contenedor, forzamos el foco y el clic en el input de fecha
contenedorBuscador.addEventListener('click', () => {
    // showPicker() es el método moderno para abrir el calendario nativo
    if (typeof inputFecha.showPicker === 'function') {
        inputFecha.showPicker();
    } else {
        inputFecha.focus(); // Fallback para navegadores antiguos
    }
});

inputFecha.addEventListener('change', async (e) => {
    // 1. Formateo de fecha (esto se mantiene igual)
    const fechaSeleccionada = new Date(e.target.value + 'T00:00:00');
    const dia = fechaSeleccionada.getDate();
    const mes = MESES[fechaSeleccionada.getMonth()];
    const fechaBuscada = `${dia} de ${mes}`;
    
    // 2. CORRECCIÓN DEL ERROR:
    // Buscamos un elemento que SÍ exista. Por ejemplo, podemos poner la fecha 
    // en el texto del h1 o simplemente validar que no truene si no hay tagline.
    const brandTitle = document.querySelector('.brand h1');
    if (brandTitle) {
        // Opcional: branding visual dinámico
        console.log(`Cambiando vista a: ${fechaBuscada}`);
    }

    // 3. Llamada a la función de carga
    await cargarManaPorFecha(fechaBuscada);
});

async function cargarManaPorFecha(fecha) {
    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        // --- EL CAMBIO CLAVE ---
        // Usamos la 'fecha' que viene por parámetro (ej: "25 de Diciembre")
        // en lugar de calcular 'hoy' otra vez.
        const archivosDeEsaFecha = indice[fecha]; 

        if (!archivosDeEsaFecha || archivosDeEsaFecha.length === 0) {
            launcher.innerHTML = `<p style="color:var(--gold); text-align:center;">No hay lecturas registradas para el ${fecha}.</p>`;
            return;
        }

        let lecturasCompletas = [];

        for (const item of archivosDeEsaFecha) {
            const resData = await fetch(`${URL_BASE}${item.grupo}.json`);
            const data = await resData.json();

            const objetoFinal = data.find(d => d.id === item.id);
            if (objetoFinal) lecturasCompletas.push(objetoFinal);
        }

        renderCards(lecturasCompletas);

    } catch (e) {
        console.error("Error en la logística del buscador:", e);
        launcher.innerHTML = `<p style="color:var(--gold)">Error al buscar en el archivo.</p>`;
    }
}



iniciarMana();
renderizarFooter();


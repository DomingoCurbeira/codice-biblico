// --- CONFIGURACIÓN ---
const URL_INDICE = '../data/indices/indice_mana.json';
const URL_BASE = '../data/mana/';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// --- FUNCIONES DE CARGA Y RENDERIZADO ---

async function iniciarMana() {
    const launcher = document.getElementById('app-launcher');
    if (!launcher) return;

    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        const hoy = new Date();
        // Generamos la fecha exacta: "19 de Abril"
        const fechaBuscada = `${hoy.getDate()} de ${MESES[hoy.getMonth()]}`;
        console.log("Buscando provisión para:", fechaBuscada);

        const archivosDeHoy = indice[fechaBuscada]; 

        console.log(archivosDeHoy)

        if (!archivosDeHoy || !Array.isArray(archivosDeHoy) || archivosDeHoy.length === 0) {
            launcher.innerHTML = `<p style="color:var(--gold); text-align:center;">No hay provisión programada para hoy (${fechaBuscada}).</p>`;
            return;
            a
        }

        // Mapeamos los archivos de hoy para crear promesas de fetch simultáneas
        const promesas = archivosDeHoy.map(async (item) => {
            try {
                const resData = await fetch(`${URL_BASE}${item.grupo}.json`);
                const data = await resData.json();
                // Usamos == para evitar errores de tipo string vs number en el ID
                return data.find(d => d.id == item.id);
            } catch (err) {
                console.error(`Error cargando el grupo ${item.grupo}:`, err);
                return null;
            }
        });

        // Esperamos a que todas las lecturas (AT y NT) se resuelvan
        const lecturasCompletas = await Promise.all(promesas);

        // Filtramos resultados nulos (por si un archivo falló)
        const lecturasValidas = lecturasCompletas.filter(l => l !== null);

        if (lecturasValidas.length > 0) {
            renderCards(lecturasValidas);
        } else {
            throw new Error("No se encontraron los objetos en los archivos de datos");
        }

    } catch (e) {
        console.error("Error en la logística de Maná:", e);
        launcher.innerHTML = `<p style="color:var(--gold); text-align:center;">Hubo un problema al servir el pan de hoy.</p>`;
    }
}

async function cargarManaPorFecha(fecha) {
    const launcher = document.getElementById('app-launcher');
    try {
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        const archivosDeEsaFecha = indice[fecha]; 

        if (!archivosDeEsaFecha) {
            launcher.innerHTML = `<p style="color:var(--gold); text-align:center;">No hay lecturas para el ${fecha}.</p>`;
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
        launcher.innerHTML = `<p style="color:var(--gold)">Error al buscar en el archivo.</p>`;
    }
}

function renderCards(mensajes) {
    const launcher = document.getElementById('app-launcher');
    if (!launcher) return;
    launcher.innerHTML = ''; 

    mensajes.forEach(item => {
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

// --- UTILIDADES ---

function renderizarFooter() {
    if (document.querySelector('.app-footer')) return;
    const year = new Date().getFullYear();
    const footerHTML = `

        <div class="cb-semilla-container" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(212, 175, 55, 0.3); text-align: center;">
                <p style="color: #f8fafc; font-style: italic; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                    "Damos de gracia lo que de gracia recibimos. Si sientes el deseo de apoyar este servicio, tu colaboración permite apoyar el crecimiento y mantenimiento de Códice Bíblico."
                </p>
                <a href="https://ko-fi.com/codicebiblico" target="_blank" class="cb-btn-kofi" 
                style="display: inline-flex; align-items: center; gap: 10px; background: #000; color: #fff; border: 1px solid #D4AF37; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">
                    <i class="fas fa-gift" style="color: #D4AF37;"></i>
                    APOYAR EL PROYECTO
                </a>
            </div>

        <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; text-align: center;">
            <div class="footer-content">
                <p style="color: #64748b; margin: 0;">Desarrollado por <span style="color:#d4b483">Domingo Curbeira</span></p>
                <p style="color:#475569; margin: 0; font-size: 0.7rem;">© ${year} • Códice Bíblico</p>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// --- INICIALIZACIÓN SEGURA ---

function masterInit() {
    console.log("Mise en place lista: Iniciando Maná Visual...");
    
    // 1. Menú Ecosistema
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');
    if (btnLauncher && ecoMenu) {
        btnLauncher.onclick = (e) => {
            e.stopPropagation();
            ecoMenu.classList.toggle('active');
        };
        document.onclick = (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
            }
        };
    }

    // 2. Lógica del Buscador (Todo protegido con IFs)
    const contenedorBuscador = document.getElementById('abrir-calendario');
    const inputFecha = document.getElementById('fecha-buscada');

    if (contenedorBuscador && inputFecha) {
        contenedorBuscador.onclick = () => {
            if (typeof inputFecha.showPicker === 'function') inputFecha.showPicker();
            else inputFecha.focus();
        };

        inputFecha.onchange = async (e) => {
            const fechaSeleccionada = new Date(e.target.value + 'T00:00:00');
            const dia = fechaSeleccionada.getDate();
            const mes = MESES[fechaSeleccionada.getMonth()];
            const fechaBuscada = `${dia} de ${mes}`;
            await cargarManaPorFecha(fechaBuscada);
        };
    }

    // 3. Carga inicial
    iniciarMana();
    renderizarFooter();
}

// Ejecución controlada
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    masterInit();
} else {
    document.addEventListener('DOMContentLoaded', masterInit);
}


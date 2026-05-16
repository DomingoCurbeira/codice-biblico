// 1. Diccionario Maestro de Colores por Sección
const GRADIENTES_SECCION = {
    "pentateuco.json": "linear-gradient(135deg, #064e3b 0%, #111827 100%)",
    "historicos.json": "linear-gradient(135deg, #78350f 0%, #111827 100%)",
    "poeticos.json": "linear-gradient(135deg, #4c1d95 0%, #111827 100%)",
    "profetas.json": "linear-gradient(135deg, #7f1d1d 0%, #111827 100%)",
    "evangelios.json": "linear-gradient(135deg, #0c4a6e 0%, #111827 100%)",
    "apostolicos.json": "linear-gradient(135deg, #1e293b 0%, #111827 100%)"
};

// Variable global para el estado
let faseActual = 'anterior'; 

async function renderPersonaje() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const content = document.getElementById('perfil-content');
    const loader = document.getElementById('loading-state');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const resIndex = await fetch('../data/indices/indice_onomastiko.json');
        const index = await resIndex.json();
        const ref = index.identidades.find(i => i.id === id);

        if (!ref) throw new Error("Identidad no localizada");

        const resData = await fetch(`../data/onomastiko/${ref.archivo_fuente}`);
        const dataList = await resData.json();
        const p = dataList.find(item => item.id === id);

        if (p) {
            // Guardamos en el objeto global para el re-renderizado del switch
            window.personajeActual = p; 
            window.refActual = ref;

            // --- GUARDAR RASTRO PERSISTENTE ---
            const info = faseActual === 'nueva' ? p.fases.nueva : p.perfil_card;
            const nombreMostrar = info.nombre_principal || info.nombre || p.id;
            localStorage.setItem('rastro_estudio', JSON.stringify({
                nombrePersonaje: `Identidad: ${nombreMostrar}`,
                url: window.location.href
            }));

            renderCardHTML(p, ref);
            renderizarFooter();
        }
    } catch (err) {
        loader.innerHTML = `⚠️ Error: ${err.message}`;
        console.error(err);
    }
}

function renderCardHTML(p, ref) {
    const content = document.getElementById('perfil-content');
    const loader = document.getElementById('loading-state');
    const cardBackground = GRADIENTES_SECCION[ref.archivo_fuente] || "#1e293b";
    
    // Determinamos la fase
    const isNueva = p.tiene_transicion && faseActual === 'nueva';
    const info = isNueva ? p.fases.nueva : p.perfil_card;
    const avatar = isNueva ? p.fases.nueva.avatar : p.config_tarjeta.avatar_url;
    
    // Limpieza de UI
    loader.style.display = 'none';
    content.style.display = 'flex';

   // Generar Iconos (Actualizando ID si es Etymos y es fase nueva)
const iconosHtml = p.perfil_card.iconos_accion ? p.perfil_card.iconos_accion.map(icon => {
    let href = "#";
    
    // 1. Determinar el ID de referencia
    const refId = (icon.tipo === "etymos" && isNueva && p.fases.nueva.etymos_id) 
                ? p.fases.nueva.etymos_id 
                : icon.id;

    // 2. Construir el Href según el tipo
    switch (icon.tipo) {
        case "huellas":
            href = `../huellas/perfil.html?id=${refId}&retorno=${p.id}`;
            break;
            
        case "etymos":
            href = `../etymos/palabra.html?id=${refId}&retorno=${p.id}`;
            break;
            
        case "cronos":
            localStorage.setItem('last_onoma_id', p.id); 
            // Verificamos que refId exista para evitar enlaces rotos
            href = refId ? `../cronos/index.html?lugar=${refId}&retorno=${p.id}` : "#";
            break;

        case "rutas":
            localStorage.setItem('last_onoma_id', p.id);
            // IMPORTANTE: Aquí enviamos el ID de la ruta (icon.id)
            href = `../cronos/index.html?ruta=${refId}&retorno=${p.id}`;
            break;
            
        default:
            href = "#";
    }

    // Retornar el HTML del botón (asegúrate de que el render use este href)
//     return `<a href="${href}" class="btn-icono">${icon.tipo}</a>`; 
// }).join('') : '';

    return `
        <a href="${href}" class="action-btn ${icon.tipo}" title="${icon.tooltip}">
            <span class="icon-symbol">${getIconSymbol(icon.tipo)}</span>
            <span class="icon-label">${icon.tooltip}</span>
        </a>
    `;
}).join('') : '';

    const switchHtml = p.tiene_transicion ? `
        <div class="transicion-container">
            <span class="switch-label">${isNueva ? 'Diseño Transformado' : 'Diseño Original'}</span>
            <label class="switch">
                <input type="checkbox" id="toggle-transicion" ${isNueva ? 'checked' : ''}>
                <span class="slider round" style="background-color: ${p.config_tarjeta.color_acento}"></span>
            </label>
        </div>
    ` : '';

    // Inyectamos el contenido principal
    content.innerHTML = `
        <article class="virtual-card-full transition-fade" style="--card-accent: ${p.config_tarjeta.color_acento}; border-color: ${p.config_tarjeta.color_acento};">
            ${switchHtml}
            
            <img src="../${avatar}" alt="${info.nombre_principal || info.nombre}" class="profile-avatar">
            
            <h2 style="color: ${p.config_tarjeta.color_acento}; margin: 0; font-family: 'Merriweather', serif; font-size: 2.5rem;">
                ${info.nombre_principal || info.nombre}
            </h2>
            <p style="text-transform: uppercase; letter-spacing: 3px; opacity: 0.8; margin-top: 8px; font-size: 0.8rem; font-weight: 800;">
                ${info.subtitulo_rol || info.titulo}
            </p>
            
            <p style="margin: 25px 0; line-height: 1.8; font-size: 1.1rem; color: #cbd5e1; font-family: 'Inter', sans-serif;">
                ${info.bio_resumen || info.bio}
            </p>

            <div class="action-bar">${iconosHtml}</div>

            <div class="logro-box">
                <small style="color: ${p.config_tarjeta.color_acento}; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">Logro Destacado</small>
                <p style="margin-top: 5px; font-size: 0.95rem;">${p.perfil_card.logro_destacado || 'Registro Original'}</p>
            </div>
            
            <div class="perla-box">
                <p class="perla-original" style="--card-accent: ${p.config_tarjeta.color_acento}">${p.datos_identidad.original_idioma}</p>
                <p style="font-style: italic; opacity: 0.9; color: ${p.config_tarjeta.color_acento}; font-weight: 600; margin-bottom: 15px;">${p.datos_identidad.significado_core}</p>
                <hr style="opacity: 0.1; margin: 15px 0; border: none; border-top: 1px solid white;">
                <p style="font-size: 1rem; font-style: italic;">"${p.datos_identidad.perla_profunda}"</p>
            </div>
        </article>
       
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
            `;

    // Evento del Switch
    if (p.tiene_transicion) {
        document.getElementById('toggle-transicion').addEventListener('change', (e) => {
            const card = document.querySelector('.virtual-card-full');
            if (card) card.classList.add('transforming');
            
            faseActual = e.target.checked ? 'nueva' : 'anterior';
            
            setTimeout(() => {
                renderCardHTML(window.personajeActual, window.refActual);
                // La nueva card renderizada no tendrá la clase, la animación dura 1.5s en CSS
            }, 300);
        });
    }
}

function getIconSymbol(tipo) {
    switch(tipo) {
        case 'huellas': return '👣';
        case 'etymos': return '🔍';
        case 'cronos': return '🌎';
        case 'rutas': return '🗺️'; // Icono de camino/ruta
        default: return '✨';
    }
}

function renderizarFooter() {
    if (document.querySelector('.app-footer')) return;
    const footerHTML = `
        <footer class="app-footer" style="padding: 40px 0; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 50px; text-align: center;">
            <p style="color: #64748b; margin: 0;">Desarrollado por <span style="color:#d4b483">Domingo Curbeira</span></p>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.addEventListener('DOMContentLoaded', renderPersonaje);
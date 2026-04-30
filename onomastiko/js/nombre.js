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
        <article class="virtual-card-full transition-fade" style="background: ${cardBackground} !important; border: 2px solid ${p.config_tarjeta.color_acento};">
            ${switchHtml}
            
            <img src="../${avatar}" alt="${info.nombre_principal || info.nombre}" class="profile-avatar" style="border-color: ${p.config_tarjeta.color_acento}">
            
            <h2 style="color: ${p.config_tarjeta.color_acento}; margin: 0; font-family: 'Merriweather', serif;">
                ${info.nombre_principal || info.nombre}
            </h2>
            <p style="text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-top: 5px;">
                ${info.subtitulo_rol || info.titulo}
            </p>
            
            <p style="margin: 20px 0; line-height: 1.6; font-size: 1.05rem;">
                ${info.bio_resumen || info.bio}
            </p>

            <div class="action-bar">${iconosHtml}</div>

            <div class="logro-box" style="border: 1px dashed ${p.config_tarjeta.color_acento}88;">
                <small style="color: ${p.config_tarjeta.color_acento};">LOGRO DESTACADO</small>
                <p>${p.perfil_card.logro_destacado || 'Registro Original'}</p>
            </div>
            
            <div class="perla-box" style="border-left: 4px solid ${p.config_tarjeta.color_acento};">
                <p style="color: ${p.config_tarjeta.color_acento}; font-size: 1.4rem; margin: 0;">${p.datos_identidad.original_idioma}</p>
                <p style="font-style: italic; opacity: 0.7;">${p.datos_identidad.significado_core}</p>
                <hr style="opacity: 0.1; margin: 15px 0;">
                <p style="font-size: 0.95rem;">"${p.datos_identidad.perla_profunda}"</p>
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

    

    // Inyectar compartir después de renderizar el perfil
    inyectarAccionesCompartir(p, info);

    

    // Evento del Switch
    if (p.tiene_transicion) {
        document.getElementById('toggle-transicion').addEventListener('change', (e) => {
            faseActual = e.target.checked ? 'nueva' : 'anterior';
            renderCardHTML(window.personajeActual, window.refActual);
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

function inyectarAccionesCompartir(p, info) {
    const currentUrl = window.location.href;
    const nombreParaMostrar = info.nombre_principal || info.nombre;
    const msg = `Descubre el diseño original de ${nombreParaMostrar} en Onomastiko:`;
    const linkWA = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg + " " + currentUrl)}`;
    const linkFB = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

    const shareHTML = `
        <div class="onomastiko-share-section">
            <h3 class="share-title">COMPARTIR IDENTIDAD</h3>
            <div class="share-actions">
                <button id="btn-nota-onomastiko" class="btn-share-round nota"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                <a href="${linkWA}" target="_blank" class="btn-share-round wa"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
                <a href="${linkFB}" target="_blank" class="btn-share-round fb"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <button id="btn-copy-link" class="btn-share-round copy"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
            </div>
        </div>
        <div id="estudio-content"></div>
    `;

    document.getElementById('perfil-content').insertAdjacentHTML('beforeend', shareHTML);

    // Evento Copiar
    document.getElementById('btn-copy-link').addEventListener('click', () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            Swal.fire({
                toast: true, position: 'bottom-end', timer: 3000, showConfirmButton: false,
                background: '#1e293b', color: '#fff', icon: 'success', 
                iconColor: p.config_tarjeta.color_acento, title: 'Enlace copiado'
            });
        });
    });

    document.getElementById('btn-nota-onomastiko').addEventListener('click', () => {
        window.location.href = `../notas/index.html?ref=onomastiko&id=${p.id}`;
    });
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
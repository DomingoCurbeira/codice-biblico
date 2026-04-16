// 1. Diccionario Maestro de Colores por Sección
const GRADIENTES_SECCION = {
    "pentateuco.json": "linear-gradient(135deg, #064e3b 0%, #111827 100%)",
    "historicos.json": "linear-gradient(135deg, #78350f 0%, #111827 100%)",
    "poeticos.json": "linear-gradient(135deg, #4c1d95 0%, #111827 100%)",
    "profetas.json": "linear-gradient(135deg, #7f1d1d 0%, #111827 100%)",
    "evangelios.json": "linear-gradient(135deg, #0c4a6e 0%, #111827 100%)",
    "apostolicos.json": "linear-gradient(135deg, #1e293b 0%, #111827 100%)"
};

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
        // 1. Localizar en el índice
        const resIndex = await fetch('../data/indices/indice_onomastiko.json');
        const index = await resIndex.json();
        const ref = index.identidades.find(i => i.id === id);

        if (!ref) throw new Error("Identidad no localizada");

        // 2. Traer el archivo fuente
        const resData = await fetch(`../data/onomastiko/${ref.archivo_fuente}`);
        const dataList = await resData.json();
        const p = dataList.find(item => item.id === id);

        if (p) {
            const cardBackground = GRADIENTES_SECCION[ref.archivo_fuente] || "#1e293b";
            
           // 3. Generar HTML de Iconos de Acción (Enlaces dinámicos al ecosistema)
            const iconosHtml = p.perfil_card.iconos_accion ? p.perfil_card.iconos_accion.map(icon => {
                // Definimos la ruta base según el tipo de icono
                let href = "#";
                const refId = icon.id; // El ID que viene en el JSON (ej: "adan", "pneuma")

                if (icon.tipo === "huellas") {
                    href = `../huellas/perfil.html?id=${refId}`;
                } else if (icon.tipo === "etymos") {
                    href = `../etymos/palabra.html?id=${refId}`;
                } else if (icon.tipo === "cronos") {
                    href = `../cronos/index.html?lugar=${refId}`;
                }

                return `
                    <a href="${href}" class="action-btn ${icon.tipo}" title="${icon.tooltip}">
                        <span class="icon-symbol ${icon.tipo}">${getIconSymbol(icon.tipo)}</span>
                        <span class="icon-label">${icon.tooltip}</span>
                    </a>
                `;
            }).join('') : '';

            document.title = `${p.perfil_card.nombre_principal} | Onomastiko`;
            loader.style.display = 'none';
            content.style.display = 'flex';
            
            content.innerHTML = `
                <article class="virtual-card-full" style="background: ${cardBackground} !important; border: 2px solid ${p.config_tarjeta.color_acento};">
                    <img src="../${p.config_tarjeta.avatar_url}" alt="${p.perfil_card.nombre_principal}" style="width: 180px; height: 180px; border-radius: 50%; border: 4px solid white; object-fit: cover; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    
                    <h2 style="color: ${p.config_tarjeta.color_acento}; font-family: 'Merriweather', serif; font-size: 2.2rem; margin: 0;">${p.perfil_card.nombre_principal}</h2>
                    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; margin-top: 10px; font-weight: 600; opacity: 0.9;">${p.perfil_card.subtitulo_rol}</p>
                    
                    <p style="margin-top: 20px; font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.9);">${p.perfil_card.bio_resumen}</p>

                    <div class="action-bar">
                        ${iconosHtml}
                    </div>

                    <div class="logro-box" style="border: 1px dashed ${p.config_tarjeta.color_acento}88; padding: 15px; border-radius: 12px; margin-bottom: 25px; background: rgba(0,0,0,0.1);">
                        <small style="color: ${p.config_tarjeta.color_acento}; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px;">Logro Destacado</small>
                        <p style="margin: 5px 0 0; font-weight: 600;">${p.perfil_card.logro_destacado || 'Registro Original'}</p>
                    </div>
                    
                    <div class="perla-box" style="border-left: 4px solid ${p.config_tarjeta.color_acento}; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; text-align: left;">
                        <p style="color: ${p.config_tarjeta.color_acento}; font-size: 1.4rem; font-family: 'Merriweather', serif; margin: 0;">${p.datos_identidad.original_idioma}</p>
                        <p style="font-style: italic; margin: 5px 0 15px; opacity: 0.8;">${p.datos_identidad.significado_core}</p>
                        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                        <p style="font-size: 0.95rem; line-height: 1.5;">"${p.datos_identidad.perla_profunda}"</p>
                    </div>
                </article>
                `;
                inyectarAccionesCompartir(p);
            }
            renderizarFooter();
        } catch (err) {
            loader.innerHTML = `⚠️ Error: ${err.message}`;
            console.error(err);
        }

}

// Función auxiliar para los iconos (puedes usar SVGs o Emojis temporales)
function getIconSymbol(tipo) {
    const icons = {
        'huellas': '👣',
        'etymos': '🔍',
        'cronos': '🌎'
    };
    return icons[tipo] || '•';
}

// --- LÓGICA DE COMPARTIR Y NOTAS ---

function inyectarAccionesCompartir(personaje) {
    console.log(personaje.perfil_card.nombre_principal);
    const currentUrl = window.location.href;
    const msg = `Descubre el diseño original de ${personaje.perfil_card.nombre_principal} en Onomastiko (Códice Bíblico):`;
    const linkWA = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg + " " + currentUrl)}`;
    const linkFB = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

    const shareHTML = `
        <div class="onomastiko-share-section">
            <h3 class="share-title">COMPARTIR IDENTIDAD</h3>
            <div class="share-actions">
                <button id="btn-nota-onomastiko" class="btn-share-round nota" aria-label="Crear Nota">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <a href="${linkWA}" target="_blank" class="btn-share-round wa" aria-label="Compartir en WhatsApp">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="${linkFB}" target="_blank" class="btn-share-round fb" aria-label="Compartir en Facebook">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <button id="btn-copy-link" class="btn-share-round copy" aria-label="Copiar Enlace">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
        </div>
    `;

    document.getElementById('perfil-content').insertAdjacentHTML('beforeend', shareHTML);

    // Eventos
    document.getElementById('btn-copy-link').addEventListener('click', () => {
        const currentUrl = window.location.href;
        
        navigator.clipboard.writeText(currentUrl).then(() => {
            // Configuramos el Toast de SweetAlert2
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#fff',
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'success',
                iconColor: personaje.config_tarjeta.color_acento, // Usamos el color del personaje
                title: 'Enlace copiado',
                text: `La identidad de ${personaje.perfil_card.nombre_principal} está lista para compartir.`
            });
        });
    });

    document.getElementById('btn-nota-onomastiko').addEventListener('click', () => {
        // Redirige a la App de Notas pasando el ID del personaje
        window.location.href = `../notas/index.html?ref=onomastiko&id=${personaje.id}`;
    });
}

// --- FOOTER GLOBAL ---
function renderizarFooter() {
    if (document.querySelector('.app-footer')) return;
    const footerHTML = `
        <footer class="app-footer" style="padding: 40px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 50px; text-align: center; width: 100%;">
            <div class="footer-content">
                <a href="../index.html" class="footer-brand" style="text-decoration: none; color: #e2e8f0; display: inline-block; margin-bottom: 5px;">
                    <span style="font-size: 1.1em;">📜</span> Códice Bíblico
                </a>
                <p style="color: #64748b; margin: 0;">Desarrollado por <span style="color:#d4b483">Domingo Curbeira</span></p>
                <p style="color:#475569; margin: 0; font-size: 0.7rem;">© ${new Date().getFullYear()}</p>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// DENTRO DE TU FUNCIÓN renderPersonaje(), AL FINAL DEL bloque if(p) { ... }
// Añade estas dos llamadas:
// inyectarAccionesCompartir(p);
// renderizarFooter();

document.addEventListener('DOMContentLoaded', renderPersonaje);
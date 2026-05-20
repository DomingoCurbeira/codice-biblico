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
        const resIndex = await fetch(`../data/indices/indice_onomastiko.json?v=${Date.now()}`);
        const index = await resIndex.json();
        const ref = index.identidades.find(i => i.id === id);

        if (!ref) throw new Error("Identidad no localizada");

        const resData = await fetch(`../data/onomastiko/${ref.archivo_fuente}?v=${Date.now()}`);
        const dataList = await resData.json();
        const p = dataList.find(item => item.id === id);

        if (p) {
            console.log("Cargando Personaje:", p.id, "Conexiones:", p.conexiones);
            window.personajeActual = p; 
            window.refActual = ref;

            // --- GUARDAR RASTRO PERSISTENTE ---
            const nombreMostrar = p.identidad ? p.identidad.nombre_humano : (p.perfil_card ? p.perfil_card.nombre_principal : p.id);
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
    
    loader.style.display = 'none';
    content.style.display = 'flex';

    // Determinar si es formato Maestro o Antiguo
    const isMaestro = !!p.jurisdiccion || 
                      !!p.identidad || 
                      (p.fases && Array.isArray(p.fases) && p.fases.length > 0);

    if (isMaestro) {
        renderMaestroHTML(p, content);
    } else {
        renderLegacyHTML(p, content, ref);
    }
}

function renderMaestroHTML(p, container) {
    const accent = p.config_tarjeta.color_acento || "#d4af37";
    
    // 1. Lógica de Fases Robusta (Híbrida: Array de Fases o Identidad Única)
    let f;
    const hasPhases = p.fases && Array.isArray(p.fases) && p.fases.length > 0;
    const faseIdx = (hasPhases && p.fases.length > 1 && faseActual === 'nueva') ? 1 : 0;

    if (hasPhases) {
        f = p.fases[faseIdx];
    } else {
        // Fallback para personajes sin fases (Adán, Eva, Noé, etc.)
        f = {
            nombre: p.identidad.nombre_humano,
            titulo: p.identidad.nombre_diseno,
            jurisdiccion: p.jurisdiccion,
            avatar_url: p.config_tarjeta.avatar_url,
            etymos: p.identidad.etymos,
            misterio_escudrinado: p.misterio_escudrinado,
            transferencia_codigo: p.transferencia_codigo,
            eco_de_cristo: p.eco_de_cristo
        };
    }

    // 2. Generar Iconos de Acción (Desde el objeto 'conexiones')
    let iconosHtml = "";
    if (p.conexiones) {
        const portales = [
            { key: "huellas", label: "Huellas", symbol: "👣", path: "../huellas/perfil.html?id=" },
            { key: "etymos", label: "Étymos", symbol: "📜", path: "../etymos/palabra.html?id=" },
            { key: "cronos", label: "Cronos", symbol: "📍", path: "../cronos/index.html?lugar=" },
            { key: "rutas", label: "Viajes", symbol: "🧭", path: "../cronos/index.html?ruta=" }
        ];

        iconosHtml = portales.map(portal => {
            const refId = p.conexiones[portal.key];
            if (!refId) return ""; // Si no hay conexión para este tipo, no renderizamos el botón

            return `
                <a href="${portal.path}${refId}&retorno=${p.id}" class="action-btn ${portal.key}" title="${portal.label}">
                    <span class="icon-symbol">${portal.symbol}</span>
                    <span class="icon-label">${portal.label}</span>
                </a>
            `;
        }).join('');
    }

    // 3. Generar Switch si tiene 2 o más fases
    const switchHtml = (p.fases && p.fases.length > 1) ? `
        <div class="transicion-container maestro-switch-container">
            <span class="switch-label">${faseIdx === 1 ? 'FRECUENCIA DE DISEÑO' : 'FRECUENCIA HUMANA'}</span>
            <label class="switch">
                <input type="checkbox" id="toggle-transicion" ${faseIdx === 1 ? 'checked' : ''}>
                <span class="slider round" style="background-color: ${accent}"></span>
            </label>
        </div>
    ` : '';

    // 4. Construir HTML Maestro Dinámico
    container.innerHTML = `
        <article class="virtual-card-full premium-maestro transition-fade ${faseIdx === 1 ? 'phase-transformed' : 'phase-natural'}" style="--card-accent: ${accent}; border-color: ${accent};">
            
            ${switchHtml}

            <!-- CABECERA: IDENTIDAD Y JURISDICCIÓN -->
            <div class="maestro-header">
                <div class="jurisdiccion-badge" style="background: ${accent}22; color: ${accent}; border: 1px solid ${accent}44;">
                    <i class="fas fa-gavel"></i> ${(f.jurisdiccion || p.jurisdiccion || '').toUpperCase()}
                </div>
                <img src="../${f.avatar_url || p.config_tarjeta.avatar_url}" alt="${f.nombre}" class="profile-avatar maestro-avatar">
                <h2 class="maestro-name" style="color: ${accent}">${f.nombre}</h2>
                <p class="maestro-design-name">${f.titulo || ''}</p>
            </div>

            <!-- BLOQUE: ETIMOLOGÍA LEGAL -->
            <div class="etymos-legal-box">
                <div class="etymos-grid">
                    <div class="etymos-item">
                        <small>ORIGINAL</small>
                        <strong>${f.etymos.original}</strong>
                    </div>
                    <div class="etymos-item">
                        <small>TRANSLITERACIÓN</small>
                        <strong>${f.etymos.transliteracion}</strong>
                    </div>
                </div>
                <p class="legal-meaning"><strong>SENTIDO LEGAL:</strong> ${f.etymos.significado_legal}</p>
            </div>

            <!-- BLOQUE: EL MISTERIO ESCUDRIÑADO (WOW) -->
            <div class="mystery-box">
                <h3><i class="fas fa-microscope"></i> ${f.misterio_escudrinado.titulo}</h3>
                <p>${f.misterio_escudrinado.texto}</p>
            </div>

            <!-- BARRA DE ACCIONES -->
            <div class="action-bar maestro-actions">${iconosHtml}</div>

            <!-- BLOQUE: TRANSFERENCIA DE CÓDIGO (APLICACIÓN) -->
            <div class="transfer-section">
                <h3 class="section-divider"><span>EL CÓDIGO EN TU VIDA</span></h3>
                <div class="transfer-grid">
                    ${f.transferencia_codigo.puntos.map((item, index) => `
                        <div class="transfer-card">
                            <div class="transfer-num">${index + 1}</div>
                            <div class="transfer-content">
                                <strong>${item.concepto} ${item.cita ? `<span class="transfer-cite">(${item.cita})</span>` : ''}</strong>
                                <p>${item.ejemplo_real}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- BLOQUE: ECO DE CRISTO -->
            <div class="christ-echo-box">
                <span class="echo-label">✨ EL ECO DE CRISTO</span>
                <p>${f.eco_de_cristo || p.eco_de_cristo}</p>
            </div>

        </article>

        <!-- BOTÓN DE APOYO -->
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

    // 5. Vincular Evento del Switch
    if (p.fases && p.fases.length > 1) {
        const toggle = document.getElementById('toggle-transicion');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                const card = document.querySelector('.virtual-card-full');
                if (card) card.classList.add('transforming');
                
                faseActual = e.target.checked ? 'nueva' : 'anterior';
                
                setTimeout(() => {
                    renderCardHTML(window.personajeActual, window.refActual);
                }, 300);
            });
        }
    }
}

function renderLegacyHTML(p, content, ref) {
    // Variable global para el estado (se usa aquí por compatibilidad)
    const isNueva = p.tiene_transicion && faseActual === 'nueva';
    const info = isNueva ? (p.fases ? (Array.isArray(p.fases) ? p.fases[1] : p.fases.nueva) : p.perfil_card) : (p.perfil_card || p);
    const avatar = isNueva ? (p.fases ? (Array.isArray(p.fases) ? p.fases[1].avatar_url : p.fases.nueva.avatar) : p.config_tarjeta.avatar_url) : p.config_tarjeta.avatar_url;

    // Generar Iconos (Desde el objeto 'conexiones')
    let iconosHtml = "";
    if (p.conexiones) {
        const portales = [
            { key: "huellas", label: "Huellas", symbol: "👣", path: "../huellas/perfil.html?id=" },
            { key: "etymos", label: "Étymos", symbol: "📜", path: "../etymos/palabra.html?id=" },
            { key: "cronos", label: "Cronos", symbol: "📍", path: "../cronos/index.html?lugar=" },
            { key: "rutas", label: "Viajes", symbol: "🧭", path: "../cronos/index.html?ruta=" }
        ];

        iconosHtml = portales.map(portal => {
            const refId = p.conexiones[portal.key];
            if (!refId) return "";

            return `
                <a href="${portal.path}${refId}&retorno=${p.id}" class="action-btn ${portal.key}" title="${portal.label}">
                    <span class="icon-symbol">${portal.symbol}</span>
                    <span class="icon-label">${portal.label}</span>
                </a>
            `;
        }).join('');
    }

    const switchHtml = p.tiene_transicion ? `
        <div class="transicion-container">
            <span class="switch-label">${isNueva ? 'Diseño Transformado' : 'Diseño Original'}</span>
            <label class="switch">
                <input type="checkbox" id="toggle-transicion" ${isNueva ? 'checked' : ''}>
                <span class="slider round" style="background-color: ${p.config_tarjeta.color_acento}"></span>
            </label>
        </div>
    ` : '';

    content.innerHTML = `
        <article class="virtual-card-full transition-fade" style="--card-accent: ${p.config_tarjeta.color_acento}; border-color: ${p.config_tarjeta.color_acento};">
            ${switchHtml}
            <img src="../${avatar}" alt="${info.nombre_principal || info.nombre}" class="profile-avatar">
            <h2 style="color: ${p.config_tarjeta.color_acento}; margin: 0; font-family: 'Merriweather', serif; font-size: 2.5rem;">${info.nombre_principal || info.nombre}</h2>
            <p style="text-transform: uppercase; letter-spacing: 3px; opacity: 0.8; margin-top: 8px; font-size: 0.8rem; font-weight: 800;">${info.subtitulo_rol || info.titulo}</p>
            <p style="margin: 25px 0; line-height: 1.8; font-size: 1.1rem; color: #cbd5e1; font-family: 'Inter', sans-serif;">${info.bio_resumen || info.bio}</p>
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
            <p style="color: #f8fafc; font-style: italic; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">"Damos de gracia lo que de gracia recibimos..."</p>
            <a href="https://ko-fi.com/codicebiblico" target="_blank" class="cb-btn-kofi">APOYAR EL PROYECTO</a>
        </div>
    `;

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
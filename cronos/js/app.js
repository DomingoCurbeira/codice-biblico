/**
 * CRONOS 2.0 - Renderizado desde Códice/Data
 */

let map;
let todosLosLugares = [];
const markersById = {};
let capaRuta = null; // Para poder borrarla después
window.rutaActiva = null; // Seguimiento de la trayectoria activa para el visor Maestro

const COLORES_SECCION = {
    "pentateuco.json": "#10b981",   // Verde Esmeralda
    "historicos.json": "#f59e0b",    // Ámbar
    "poeticos.json": "#8b5cf6",      // Violeta
    "profetas.json": "#ef4444",      // Rojo
    "evangelios.json": "#0ea5e9",    // Azul Cielo
    "apostolicos.json": "#64748b"    // Pizarra
};

document.addEventListener('DOMContentLoaded', async () => {
    initMap();
    checkRetorno();
    
    // 1. Cargamos el archivo principal de puntos
    await cargarMapaBase(); 
    
    gestionarTabs();
    inicializarBuscador();
    inicializarTimeSlider();

    // --- LÓGICA DE RECEPCIÓN CORREGIDA ---
    const params = new URLSearchParams(window.location.search);
    const rutaId = params.get('ruta');
    const lugarId = params.get('lugar'); 
    
    // --- NUEVO: Ocultar slider si entramos por ruta (ej. desde Onomastiko) ---
    if (rutaId) {
        const slider = document.getElementById('time-slider-container');
        if (slider) slider.classList.add('hidden');
    }

    if (rutaId) {
        console.log("Chef, detectada ruta:", rutaId);
        setTimeout(() => window.cargarTrayectoria(rutaId), 300);
    } 
    else if (lugarId) {
        console.log("Chef, detectado lugar individual:", lugarId);
        // Usamos viajarA porque ya tienes esa función que abre el visor y vuela al punto
        setTimeout(() => viajarA(lugarId), 500);
    }
});



function initMap() {
    map = L.map('map', { zoomControl: false, attributionControl: false })
           .setView([31.7683, 35.2137], 7);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        pane: 'shadowPane', opacity: 0.8
    }).addTo(map);
}

// 2. RENDERIZAR PUNTOS
async function cargarMapaBase() {
    const RUTA_BASE = '../../data/lugares/';
    const ARCHIVOS = [
        "pentateuco", 
        "historicos", 
        "poeticos", 
        "profetas_mayores", 
        "profetas_menores", 
        "evangelios", 
        "hechos"
    ];

    const logElement = document.getElementById('status-log'); 

    try {
        const promesas = ARCHIVOS.map(nombre => 
            fetch(`${RUTA_BASE}${nombre}.json?v=${Date.now()}`).then(res => res.json())
        );

        const resultados = await Promise.all(promesas);
        
        // 1. Limpiar y aplanar correctamente
        todosLosLugares = [];

        resultados.forEach(data => {
            if (data[0] && data[0].lugares) {
                data.forEach(libro => {
                    todosLosLugares.push(...libro.lugares);
                });
            } else {
                todosLosLugares.push(...data);
            }
        });

        if (logElement) {
            logElement.innerHTML = `🔍 Carga completada: ${todosLosLugares.length} puntos.`;
        }

        // 2. Renderizado en el mapa
        todosLosLugares.forEach(lugar => {
            if (lugar.mapa && lugar.mapa.coords) {
                // --- NUEVO: Iconos Temáticos Inteligentes ---
                let iconSymbol = '📍'; 
                let iconColor = lugar.mapa.marcador_color || "#d4b483";
                
                const tagsStr = (lugar.tags || "").toLowerCase();
                const titleStr = (lugar.perfil?.titulo_corto || "").toLowerCase();
                const nombreStr = (lugar.perfil?.nombre || "").toLowerCase();
                const combo = tagsStr + " " + titleStr + " " + nombreStr;

                if (combo.includes('templo') || combo.includes('altar') || combo.includes('santuario') || combo.includes('tabernáculo')) iconSymbol = '🏛️';
                else if (combo.includes('campamento') || combo.includes('desierto') || combo.includes('valle')) iconSymbol = '⛺';
                else if (combo.includes('batalla') || combo.includes('conquista') || combo.includes('sangre') || combo.includes('jueces')) iconSymbol = '⚔️';
                else if (combo.includes('mar ') || combo.includes('lago') || combo.includes('rio') || combo.includes('río') || combo.includes('naufragio') || combo.includes('estanque')) iconSymbol = '🌊';
                else if (combo.includes('monte ') || combo.includes('cueva') || combo.includes('cumbre') || combo.includes('montaña')) iconSymbol = '⛰️';
                else if (combo.includes('pozo') || combo.includes('manantial')) iconSymbol = '💧';

                const customIcon = L.divIcon({
                    className: 'custom-map-marker',
                    html: `<div class="marker-pin"><span class="marker-icon">${iconSymbol}</span></div>`,
                    iconSize: [0, 0], // El tamaño real lo controla el CSS .marker-pin
                    iconAnchor: [0, 0]
                });

                const marker = L.marker(lugar.mapa.coords, {
                    icon: customIcon
                }).addTo(map);

                markersById[lugar.id] = marker;
                marker.on('click', () => abrirDetalleLugar(lugar));
            }
        });

        // 3. Ajustar la cámara para ver todos los puntos
        const group = new L.featureGroup(Object.values(markersById));
        if (Object.keys(markersById).length > 0) {
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }

    } catch (error) {
        console.error("Error cargando la base de datos de lugares:", error);
    }
}

// 3. MOSTRAR INFORMACIÓN
function abrirDetalleLugar(lugar) {
    if (!lugar || !lugar.mapa || !lugar.perfil) {
        console.error("Cronos Error: Objeto de lugar incompleto", lugar);
        return;
    }

    // 1. Registro en la URL (ID de ubicación)
    const nuevaUrl = `${window.location.pathname}?lugar=${lugar.id}`;
    window.history.pushState({ id: lugar.id }, lugar.perfil.nombre, nuevaUrl);

    // 2. Centrar mapa con coordenadas del objeto
    map.flyTo(lugar.mapa.coords, lugar.mapa.zoom, { duration: 1.5 });

    // 3. Guardar en memoria para las pestañas
    window.lugarActual = lugar;

    // --- GUARDAR RASTRO PERSISTENTE ---
    localStorage.setItem('rastro_estudio', JSON.stringify({
        nombrePersonaje: lugar.perfil.nombre,
        url: window.location.href
    }));

    // 4. Inyectar datos con validación de ID
    const nombreEl = document.getElementById('p-nombre');
    const subtituloEl = document.getElementById('p-subtitulo');
    const imgEl = document.getElementById('p-img');

    if (nombreEl) nombreEl.innerText = lugar.perfil.nombre;
    if (subtituloEl) subtituloEl.innerText = lugar.perfil.titulo_corto;
    
    if (imgEl) {
        const rutaImg = lugar.perfil.imagen_principal.startsWith('/')
                        ? `../..${lugar.perfil.imagen_principal}`
                        : lugar.perfil.imagen_principal;
        imgEl.src = rutaImg;
    }

    // 5. Gestión dinámica de Pestañas (Rastro Maestro)
    const tabsContainer = document.querySelector('.visor-tabs');
    const btnRastroExistente = document.querySelector('.tab-btn[data-tab="rastro"]');
    
    // Verificamos si el lugar actual pertenece a la ruta activa
    let hitoActual = null;
    if (window.rutaActiva) {
        hitoActual = window.rutaActiva.hitos.find(h => h.id_lugar === lugar.id);
    }

    if (hitoActual) {
        if (!btnRastroExistente) {
            const btnRastro = document.createElement('button');
            btnRastro.className = 'tab-btn rastro-maestro-btn';
            btnRastro.dataset.tab = 'rastro';
            btnRastro.innerText = 'Rastro Profético';
            btnRastro.onclick = () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btnRastro.classList.add('active');
                cambiarTab('rastro');
            };
            tabsContainer.appendChild(btnRastro);
        }
        cambiarTab('rastro');
        // Activar visualmente el botón de rastro
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="rastro"]').classList.add('active');
    } else {
        if (btnRastroExistente) btnRastroExistente.remove();
        cambiarTab('narrativa');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="narrativa"]').classList.add('active');
    }

    // 6. Gestión de visibilidad y animaciones
    const visor = document.getElementById('place-visor');
    const timeSlider = document.getElementById('time-slider-container');

    if (visor) {
        visor.classList.remove('hidden');
        setTimeout(() => {
            visor.classList.add('active');
            if (window.innerWidth <= 768 && timeSlider) {
                timeSlider.classList.add('hidden-by-sheet');
            }
        }, 10);
    }

    // 7. Renderizar Botón Volver
    window.renderizarBotonVolver();
}


// NO OLVIDES ACTUALIZAR TU FUNCIÓN DE CIERRE
window.cerrarVisor = function() {
    const visor = document.getElementById('place-visor');
    const timeSlider = document.getElementById('time-slider-container');

    if (visor) {
        visor.classList.remove('active');
        if (timeSlider) timeSlider.classList.remove('hidden-by-sheet');
        setTimeout(() => visor.classList.add('hidden'), 500); 
    }
    // Limpieza de URL
    const urlLimpia = window.location.pathname;
    window.history.pushState({}, '', urlLimpia);

    // Reseteamos el historial
    window.historialNavegacion = [];
    let btnAtras = document.getElementById('btn-volver-interno');
    if (btnAtras) btnAtras.style.display = 'none';
};

async function viajarA(id) {
    try {
        // 1. Buscamos en el array global que ya está en memoria
        const lugarExtenso = todosLosLugares.find(l => l.id === id);
        
        if (!lugarExtenso) {
            console.warn("Lugar no encontrado en la base de datos local:", id);
            return;
        }

        // 2. Usamos abrirDetalleLugar: 
        // Esta función ya hace el flyTo, llena los datos y abre el panel (visor)
        abrirDetalleLugar(lugarExtenso);

        // 3. Efecto visual de resaltado en el marcador del mapa
        const marker = markersById[id];
        if (marker && marker.getElement()) {
            const el = marker.getElement();
            el.classList.add('marker-highlight');
            setTimeout(() => {
                el.classList.remove('marker-highlight');
            }, 5000);
        }
        
        setTimeout(() => {
            window.renderizarBotonVolver();
        }, 200);
    } catch (error) {
        console.error("Error crítico en la navegación viajarA:", error);
    }
}

function renderizarVisor(lugar) {
    window.lugarActual = lugar;

    document.getElementById('p-nombre').innerText = lugar.perfil.nombre;
    document.getElementById('p-subtitulo').innerText = lugar.perfil.titulo_corto;
    
    // Corregimos ruta de imagen: de /img/... a ../../img/...
    const imgRuta = lugar.perfil.imagen_principal.startsWith('/') 
                    ? `../..${lugar.perfil.imagen_principal}` 
                    : lugar.perfil.imagen_principal;
    
    document.getElementById('p-img').src = imgRuta;

    cambiarTab('narrativa');
}

// 5. GESTIÓN DE PESTAÑAS (TABS)
function gestionarTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cambiarTab(btn.dataset.tab);
        });
    });
}

function cambiarTab(tabName) {
    const container = document.getElementById('tab-content');
    const lugar = window.lugarActual;
    if (!lugar) return;

    let html = "";

    switch(tabName) {
        case 'narrativa':
            html = `
                <div class="section-block">
                    <span class="section-title">Resumen Épico</span>
                    <p>${lugar.narrativa.resumen_epico}</p>
                </div>
                <div class="selah-text">${lugar.narrativa.conexion_jesus}</div>
                <div class="section-block">
                    <span class="section-title">Dato Curioso</span>
                    <p>💡 ${lugar.narrativa.dato_curioso}</p>
                </div>
            `;
            break;
            
        case 'analisis':
            html = `
                <div class="section-block">
                    <span class="section-title">Perfil Espiritual</span>
                    <p>${lugar.analisis_profundo.perfil_emocional}</p>
                </div>
                <span class="section-title">Simbología</span>
                <div class="symbols-grid">
                    ${lugar.analisis_profundo.simbologia.map(s => `
                        <div class="symbol-item">
                            <strong style="color:var(--gold-bright)">${s.objeto}:</strong> 
                            <span>${s.significado}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            break;

        case 'rastro':
            if (window.rutaActiva) {
                const hito = window.rutaActiva.hitos.find(h => h.id_lugar === lugar.id);
                if (hito && hito.revelacion) {
                    html = `
                        <div class="maestro-revelation-box" style="border-left: 3px solid var(--gold); padding-left: 20px; margin-bottom: 2rem;">
                            <span class="section-title" style="color: var(--gold); font-weight: 800; letter-spacing: 2px;">⚖️ Transacción Legal</span>
                            <p style="font-size: 1.1rem; line-height: 1.6; color: #f8fafc; margin-top: 8px;">${hito.revelacion.transaccion_legal}</p>
                        </div>
                        <div class="maestro-mystery-box" style="background: rgba(212, 180, 131, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(212, 180, 131, 0.1); margin-bottom: 2rem;">
                            <span class="section-title" style="color: var(--gold-bright); font-size: 0.75rem; text-transform: uppercase;">🔍 Misterio del Camino</span>
                            <p style="font-style: italic; color: #cbd5e1; margin-top: 10px;">${hito.revelacion.misterio_camino}</p>
                        </div>
                        <div class="maestro-transfer-box">
                            <span class="section-title" style="color: var(--accent); font-size: 0.75rem; text-transform: uppercase;">🌿 Transferencia Territorial</span>
                            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 10px; border: 1px dashed rgba(255,255,255,0.1);">
                                <p style="font-size: 0.95rem; color: #94a3b8; margin: 0;">${hito.revelacion.transferencia_territorial}</p>
                            </div>
                        </div>
                    `;
                }
            }
            break;

        case 'contexto':
            // 1. Lógica de Galería
            let galeriaHtml = "";
            if (lugar.perfil.galeria && lugar.perfil.galeria.length > 0) {
                galeriaHtml = `
                    <div class="section-block">
                        <span class="section-title">Galería Arqueológica</span>
                        <div class="galeria-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                            ${lugar.perfil.galeria.map(img => {
                                const rutaGaleria = img.startsWith('/') ? `../..${img}` : img;
                                return `
                                    <img src="${rutaGaleria}" 
                                         onclick="abrirLightbox('${rutaGaleria}')" 
                                         style="width: 100%; height: 70px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 1px solid rgba(212,180,131,0.3);"
                                         alt="Evidencia">`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            // 2. Lógica de Vínculos Relacionados
            let vinculosHtml = "";
            if (lugar.vinculos) {
                let tagsLugares = "";
                let tagsPersonajes = "";

                if (lugar.vinculos.lugares_relacionados && lugar.vinculos.lugares_relacionados.length > 0) {
                    tagsLugares = `
                        <div style="margin-bottom: 10px;">
                            <span style="font-size: 0.85em; color: var(--text-muted); display: block; margin-bottom: 4px;">Lugares Relacionados:</span>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                ${lugar.vinculos.lugares_relacionados.map(v => 
                                    `<button onclick="navegarA('lugar', '${v}')" class="link-badge">📍 <span style="text-transform: capitalize;">${v.replace(/-/g, ' ')}</span></button>`
                                ).join('')}
                            </div>
                        </div>
                    `;
                }

                if (lugar.vinculos.personajes_relacionados && lugar.vinculos.personajes_relacionados.length > 0) {
                    tagsPersonajes = `
                        <div>
                            <span style="font-size: 0.85em; color: var(--text-muted); display: block; margin-bottom: 4px;">Personajes:</span>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                ${lugar.vinculos.personajes_relacionados.map(p => 
                                    `<button onclick="navegarA('personaje', '${p}')" class="link-badge">👤 <span style="text-transform: capitalize;">${p.replace(/-/g, ' ')}</span></button>`
                                ).join('')}
                            </div>
                        </div>
                    `;
                }

                if (tagsLugares || tagsPersonajes) {
                    vinculosHtml = `
                        <div class="section-block">
                            <span class="section-title">Conexiones</span>
                            ${tagsLugares}
                            ${tagsPersonajes}
                        </div>
                    `;
                }
            }

            html = `
                <div class="section-block">
                    <span class="section-title">Evidencia Arqueológica</span>
                    <p>🏛️ <strong>${lugar.evidencia_arqueologica?.hallazgo_clave || 'Pendiente'}:</strong> ${lugar.evidencia_arqueologica?.descripcion || 'Datos en investigación.'}</p>
                </div>
                
                ${galeriaHtml}

                <div class="section-block">
                    <span class="section-title">Aplicación Personal</span>
                    <p><strong>${lugar.aplicacion_personal?.leccion_clave || 'Reflexión en proceso.'}</strong></p>
                    <ul style="margin-top:10px; padding-left:20px; color:var(--text-muted)">
                        ${(lugar.aplicacion_personal?.preguntas_reflexion || []).map(pregunta => `
                            <li style="margin-bottom:8px">${pregunta}</li>
                        `).join('')}
                    </ul>
                </div>
                
                ${vinculosHtml}
            `;
            break;
    }
    
    container.innerHTML = html;
    
    // IMPORTANTE: Resetear scroll
    const visorContent = document.querySelector('.visor-content');
    if (visorContent) visorContent.scrollTop = 0;
}

// 6. RETORNO INTELIGENTE
function checkRetorno() {
    const rastro = JSON.parse(localStorage.getItem('rastro_estudio'));
    const btnRetorno = document.getElementById('btn-retorno-estudio');
    
    if (rastro && rastro.url) {
        btnRetorno.classList.remove('hidden');
        document.getElementById('nombre-origen').innerText = rastro.nombrePersonaje;
    }
}

window.retornarAOrigen = function() {
    const rastro = JSON.parse(localStorage.getItem('rastro_estudio'));
    if (rastro) {
        window.location.href = rastro.url;
    }
}

window.abrirLightbox = function(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');

    if (lb && lbImg) {
        lbImg.src = src;
        let lbCaption = document.getElementById('lightbox-caption');
        if (!lbCaption) {
            lbCaption = document.createElement('div');
            lbCaption.id = 'lightbox-caption';
            lbImg.parentNode.appendChild(lbCaption);
        }

        if (window.lugarActual) {
            let nombreArchivo = src.split('/').pop().split('.')[0].replace(/-/g, ' ');
            let tituloImagen = nombreArchivo.replace(/\b\w/g, char => char.toUpperCase());
            lbCaption.innerHTML = `<strong>${tituloImagen}</strong><br><span style="font-size:0.85em; opacity:0.8;">${window.lugarActual.perfil.nombre}</span>`;
        }
        lb.classList.remove('hidden');
    }
};

window.compartir = function(plataforma) {
    const lugar = window.lugarActual;
    if (!lugar) return;
    const urlLugar = `${window.location.origin}${window.location.pathname}?lugar=${lugar.id}`;
    const textoCompartir = `📖 Mira lo que estoy estudiando en Cronos: *${lugar.perfil.nombre}* - ${lugar.perfil.titulo_corto}\n\n`;
    switch(plataforma) {
        case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(textoCompartir + urlLugar)}`, '_blank'); break;
        case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlLugar)}`, '_blank'); break;
        case 'copiar': navigator.clipboard.writeText(urlLugar).then(() => alert("✅ Enlace copiado al portapapeles")); break;
    }
};

window.irAEscriba = function() {
    const lugar = window.lugarActual;
    if (!lugar) return;
    const titulo = `Estudio: ${lugar.perfil.nombre}`;
    const cuerpo = `Ubicación: ${lugar.perfil.ubicacion_geografica}\nLección Clave: ${lugar.aplicacion_personal.leccion_clave}\n\nMis reflexiones:\n`;
    const urlNotas = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
    window.location.href = urlNotas;
};

function inicializarBuscador() {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term.length < 2) { resultsContainer.classList.add('hidden'); return; }
        const filtrados = todosLosLugares.filter(l => {
            const nombre = l.perfil?.nombre?.toLowerCase() || "";
            const era = l.contexto?.era_biblica?.toLowerCase() || "";
            const titulo = l.perfil?.titulo_corto?.toLowerCase() || "";
            return nombre.includes(term) || era.includes(term) || titulo.includes(term);
        });
        renderizarSugerencias(filtrados);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) resultsContainer.classList.add('hidden');
    });
}

function renderizarSugerencias(lista) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    if (lista.length === 0) {
        container.innerHTML = '<div class="search-item"><span class="sub">No se encontraron lugares</span></div>';
    } else {
        lista.forEach(l => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <div class="info">
                    <span class="name">${l.perfil.nombre}</span>
                    <span class="sub">${l.perfil.titulo_corto} | ${l.contexto.era_biblica}</span>
                </div>
            `;
            div.onclick = () => {
                const lugarEncontrado = todosLosLugares.find(item => item.id === l.id);
                if (lugarEncontrado) {
                    abrirDetalleLugar(lugarEncontrado); 
                    document.getElementById('search-input').value = l.perfil.nombre;
                    container.classList.add('hidden');
                }
            };
            container.appendChild(div);
        });
    }
    container.classList.remove('hidden');
}

window.onpopstate = function(event) {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('lugar')) {
        const visor = document.getElementById('place-visor');
        if (visor && visor.classList.contains('active')) {
            visor.classList.remove('active');
            setTimeout(() => visor.classList.add('hidden'), 500);
        }
    }
};

window.historialNavegacion = [];
window.navegarA = function(tipo, id) {
    const lugarActual = window.lugarActual;
    if (tipo === 'lugar') {
        if (lugarActual) window.historialNavegacion.push({ id: lugarActual.id, nombre: lugarActual.perfil.nombre });
        viajarA(id);
    } 
    else if (tipo === 'personaje') {
        if (lugarActual) localStorage.setItem('rastro_estudio', JSON.stringify({ url: window.location.href, nombrePersonaje: lugarActual.perfil.nombre }));
        window.location.href = `../huellas/perfil.html?id=${id}`;
    }
};

window.renderizarBotonVolver = function() {
    const params = new URLSearchParams(window.location.search);
    const rastroImagenDeDios = localStorage.getItem('rastro_estudio');
    const retornoId = rastroImagenDeDios ? null : (params.get('retorno') || localStorage.getItem('last_onoma_id'));
    const tituloLugar = document.getElementById('p-nombre');
    const panelPrincipal = document.getElementById('place-visor');
    if (!retornoId || (!tituloLugar && !panelPrincipal) || document.getElementById('btn-volver-onomastiko-fijo')) return;

    const btn = document.createElement('button');
    btn.id = 'btn-volver-onomastiko-fijo';
    btn.innerHTML = `<span>🆔</span> Regresar al Perfil`;
    btn.style.cssText = `background: #1e293b; color: #fbbf24; border: 1px solid #fbbf24; padding: 10px 18px; border-radius: 25px; cursor: pointer; margin-bottom: 20px; font-weight: bold; display: inline-flex; align-items: center; gap: 8px; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 9999; position: relative;`;
    if (tituloLugar) tituloLugar.parentNode.insertBefore(btn, tituloLugar);
    else panelPrincipal.prepend(btn);
    btn.onclick = () => window.location.href = `../onomastiko/nombre.html?id=${retornoId}`;
};

window.cargarTrayectoria = async function(id) {
    try {
        const response = await fetch('../data/rutas/rutas_personajes.json');
        const data = await response.json();
        const infoRuta = data[id];
        if (!infoRuta) return;
        window.rutaActiva = infoRuta;
        const idsRuta = infoRuta.hitos.map(h => h.id_lugar);
        Object.keys(markersById).forEach(lugarId => {
            const marker = markersById[lugarId];
            if (idsRuta.includes(lugarId)) {
                if (!map.hasLayer(marker)) marker.addTo(map);
                marker.getElement().style.opacity = "1";
                marker.getElement().style.filter = "drop-shadow(0 0 8px var(--gold))"; 
            } else {
                marker.getElement().style.opacity = "0.3"; 
                marker.getElement().style.filter = "grayscale(100%) blur(1px)"; 
            }
        });
        const colorReferencia = COLORES_SECCION[infoRuta.archivo_fuente] || "#d4b483";
        const panelRuta = document.getElementById('control-ruta');
        if (panelRuta) { panelRuta.classList.remove('hidden'); panelRuta.style.borderLeft = `5px solid ${colorReferencia}`; }
        document.getElementById('ruta-personaje-nombre').innerText = infoRuta.nombre_ruta;
        const timeline = document.getElementById('timeline-ruta');
        const container = document.getElementById('hitos-container');
        if (container) container.innerHTML = ''; 
        const puntosCoords = [];
        infoRuta.hitos.forEach((hito, index) => {
            const lugar = todosLosLugares.find(l => l.id === hito.id_lugar);
            if (lugar) {
                puntosCoords.push(lugar.mapa.coords);
                const item = document.createElement('div');
                item.className = 'hito-item';
                item.innerHTML = `<div class="hito-numero" style="background:${colorReferencia}">${index + 1}</div><span>${lugar.perfil.nombre}</span>`;
                item.onclick = () => { viajarA(lugar.id); document.querySelectorAll('.hito-item').forEach(el => el.classList.remove('active')); item.classList.add('active'); };
                container.appendChild(item);
            }
        });
        if (timeline) timeline.classList.remove('hidden');
        if (window.capaRuta) map.removeLayer(window.capaRuta);
        window.capaRuta = L.polyline(puntosCoords, { color: colorReferencia, weight: 5, dashArray: '12, 15', lineCap: 'round', opacity: 0.9, shadowBlur: 5, shadowColor: 'black' }).addTo(map);
        if (puntosCoords.length > 0) map.fitBounds(window.capaRuta.getBounds(), { padding: [80, 80] });
        const hitosOrdenados = [...infoRuta.hitos].sort((a, b) => a.orden - b.orden);
        window.actualizarDistanciaVisual(hitosOrdenados);
    } catch (error) { console.error("Error en la cocina de rutas:", error); }
};

window.cerrarModoRuta = function() {
    window.rutaActiva = null;
    const btnRastro = document.querySelector('.tab-btn[data-tab="rastro"]');
    if (btnRastro) btnRastro.remove();
    Object.values(markersById).forEach(marker => {
        const el = marker.getElement();
        if (el) { el.style.opacity = "1"; el.style.filter = "none"; }
    });
    if (window.capaRuta) map.removeLayer(window.capaRuta);
    document.getElementById('control-ruta').classList.add('hidden');
    document.getElementById('timeline-ruta').classList.add('hidden');
    const slider = document.getElementById('time-slider-container');
    if (slider) slider.classList.remove('hidden');
    const params = new URLSearchParams(window.location.search);
    const idRetorno = params.get('retorno') || params.get('ruta');
    if (idRetorno) window.location.href = `../onomastiko/nombre.html?id=${idRetorno}`;
    else { const url = new URL(window.location); url.searchParams.delete('ruta'); url.searchParams.delete('retorno'); window.history.replaceState({}, '', url); }
};

window.actualizarDistanciaVisual = function(hitos) {
    let metrosTotales = 0;
    for (let i = 0; i < hitos.length - 1; i++) {
        const marcadorA = markersById[hitos[i].id_lugar];
        const marcadorB = markersById[hitos[i+1].id_lugar];
        if (marcadorA && marcadorB) metrosTotales += marcadorA.getLatLng().distanceTo(marcadorB.getLatLng());
    }
    const kilometros = (metrosTotales / 1000).toFixed(1);
    const display = document.getElementById('distancia-ruta');
    if (display) display.innerText = `${kilometros} km`;
};

const ERAS_MAP = {
    0: { label: "Todas las Eras", keywords: [] },
    1: { label: "Orígenes y Patriarcas", keywords: ["orígenes", "patriarca", "antediluviana", "post-diluviana"] },
    2: { label: "Éxodo y Conquista", keywords: ["éxodo", "peregrinación", "conquista", "jueces", "esclavitud"] },
    3: { label: "Reino y Exilio", keywords: ["monarquía", "reinado", "reino", "exilio", "profeta", "profética", "babilónico", "persa"] },
    4: { label: "Vida de Cristo", keywords: ["jesús", "mesías", "evangelios", "nacimiento", "ministerio", "pasión", "resurrección"] },
    5: { label: "Iglesia Apostólica", keywords: ["iglesia", "apostólica", "viaje misionero", "pablo", "hechos", "apocalipsis", "escatológica"] }
};

window.inicializarTimeSlider = function() {
    const slider = document.getElementById('era-slider');
    const label = document.getElementById('slider-era-label');
    const btnReset = document.getElementById('btn-reset-slider');
    if (!slider) return;
    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        const eraData = ERAS_MAP[val];
        label.innerText = eraData.label;
        if (val === 0) { btnReset.classList.add('hidden'); mostrarTodosLosMarcadores(); }
        else { btnReset.classList.remove('hidden'); filtrarMarcadoresPorEra(eraData.keywords); }
    });
};

window.filtrarMarcadoresPorEra = function(keywords) {
    Object.keys(markersById).forEach(lugarId => {
        const marker = markersById[lugarId];
        const lugar = todosLosLugares.find(l => l.id === lugarId);
        const eraLugar = (lugar?.contexto?.era_biblica || lugar?.era || "").toLowerCase();
        let coincide = false;
        if (eraLugar) coincide = keywords.some(kw => eraLugar.includes(kw));
        if (coincide) { marker.getElement().style.opacity = "1"; marker.getElement().style.pointerEvents = "auto"; marker.getElement().style.filter = "none"; }
        else { marker.getElement().style.opacity = "0.15"; marker.getElement().style.pointerEvents = "none"; marker.getElement().style.filter = "grayscale(100%)"; }
    });
};

window.mostrarTodosLosMarcadores = function() {
    Object.values(markersById).forEach(marker => {
        const el = marker.getElement();
        if (el) { el.style.opacity = "1"; el.style.pointerEvents = "auto"; el.style.filter = "none"; }
    });
};

window.resetSlider = function() {
    const slider = document.getElementById('era-slider');
    if (slider) {
        slider.value = 0;
        document.getElementById('slider-era-label').innerText = ERAS_MAP[0].label;
        document.getElementById('btn-reset-slider').classList.add('hidden');
        mostrarTodosLosMarcadores();
    }
};

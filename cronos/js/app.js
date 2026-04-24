/**
 * CRONOS 2.0 - Renderizado desde Códice/Data
 */

let map;
let todosLosLugares = [];
const markersById = {};
let capaRuta = null; // Para poder borrarla después

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
    
    // 1. Cargamos el archivo principal de puntos (OBLIGATORIO ESPERAR)
    await cargarMapaBase(); 
    
    gestionarTabs();
    inicializarBuscador();

    const params = new URLSearchParams(window.location.search);
    const rutaId = params.get('ruta');

    if (rutaId) {
        // Le damos un pequeño respiro al mapa para que se asiente
       setTimeout(() => window.cargarTrayectoria(rutaId), 300);
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
                const marker = L.circleMarker(lugar.mapa.coords, {
                    radius: 9,
                    fillColor: lugar.mapa.marcador_color || "#d4b483",
                    color: "#0f172a",
                    weight: 2,
                    fillOpacity: 1
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

        // =========================================================
        // --- 4. SISTEMA: LUGAR RECOMENDADO DEL DÍA (CRONOS) ---
        // =========================================================
       setTimeout(() => {
            const hoyStr = new Date().toDateString();
            const toastVistoHoy = localStorage.getItem('cronos_toast_dia'); 

            if (toastVistoHoy === hoyStr) return;
            
            // Usamos tu arreglo global 'todosLosLugares'
            if (!todosLosLugares || todosLosLugares.length === 0) return;

            const hoy = new Date();
            const inicioAno = new Date(hoy.getFullYear(), 0, 0);
            const diff = hoy - inicioAno;
            const diaDelAno = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            // Rotación diaria basada en el total de lugares cargados
            const indice = diaDelAno % todosLosLugares.length;
            const lugarDelDia = todosLosLugares[indice];

            // ==========================================
            // 1. BUSCADOR INTELIGENTE DE NOMBRES
            // ==========================================
            const nombreLugar = lugarDelDia.perfil.nombre || lugarDelDia.lugar || lugarDelDia.titulo || "Descubrir lugar";

            // ==========================================
            // 2. BUSCADOR INTELIGENTE DE IMÁGENES
            // ==========================================
            let rutaImg = lugarDelDia.perfil.imagen_principal  || '../img/ui/placeholder.webp';
            if (typeof rutaImg === 'string' && rutaImg.startsWith('./')) {
                rutaImg = rutaImg.replace('./', '../');
            }

            console.log(lugarDelDia.id);
            console.log(nombreLugar);

            const toast = document.createElement('div');
            toast.className = 'codice-daily-toast';
            toast.innerHTML = `
                <img src="${rutaImg}" alt="${nombreLugar}" onerror="this.src='../img/ui/placeholder.webp'">
                <div class="toast-info" onclick="window.location.href='index.html?lugar=${lugarDelDia.id}'">
                    <h4 style="color:#f59e0b">Lugar del Día 🌍</h4>
                    <p>${nombreLugar}</p>
                    <small style="color:#94a3b8; font-size:0.75rem">${lugarDelDia.perfil.ubicacion_geografica || 'Explorar en el mapa'}</small>
                </div>
                <button class="cerrar-btn" aria-label="Cerrar">&times;</button>
            `;

            const btnCerrar = toast.querySelector('.cerrar-btn');
            btnCerrar.onclick = (e) => {
                e.stopPropagation();
                toast.classList.remove('mostrar');
                localStorage.setItem('cronos_toast_dia', hoyStr); 
                setTimeout(() => toast.remove(), 600);
            };

            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('mostrar'), 2000);

        }, 800);

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

    // 5. Gestión de visibilidad y animaciones
    cambiarTab('narrativa');
    // Disparamos la función varias veces para ganar la carrera al renderizado
    window.renderizarBotonVolver(); // Intento inmediato
    setTimeout(window.renderizarBotonVolver, 300); // Intento tras 300ms
    setTimeout(window.renderizarBotonVolver, 1000);
    
    const visor = document.getElementById('place-visor');
    if (visor) {
        visor.classList.remove('hidden');
        // El pequeño delay de 10ms es vital para que la transición CSS 'active' funcione
        setTimeout(() => visor.classList.add('active'), 10);
    }
}



// NO OLVIDES ACTUALIZAR TU FUNCIÓN DE CIERRE
window.cerrarVisor = function() {
    const visor = document.getElementById('place-visor');
    if (visor) {
        visor.classList.remove('active');
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

// ... (El resto de funciones: gestionarTabs, cambiarTab, compartir, etc., se mantienen igual)

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

            // 2. NUEVO: Lógica de Vínculos Relacionados
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
    const rastro = JSON.parse(sessionStorage.getItem('rastro_estudio'));
    const btnRetorno = document.getElementById('btn-retorno-estudio');
    
    if (rastro && rastro.url) {
        btnRetorno.classList.remove('hidden');
        document.getElementById('nombre-origen').innerText = rastro.nombrePersonaje;
    }
}

window.retornarAOrigen = function() {
    const rastro = JSON.parse(sessionStorage.getItem('rastro_estudio'));
    if (rastro) {
        window.location.href = rastro.url;
    }
}



window.abrirLightbox = function(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');

    if (lb && lbImg) {
        lbImg.src = src;

        // --- LÓGICA A PRUEBA DE FALLOS ---
        // Buscamos el contenedor del texto. Si no existe en el HTML, lo creamos.
        let lbCaption = document.getElementById('lightbox-caption');
        if (!lbCaption) {
            lbCaption = document.createElement('div');
            lbCaption.id = 'lightbox-caption';
            // Lo insertamos justo después de la imagen en el DOM
            lbImg.parentNode.appendChild(lbCaption);
        }

        // Si tenemos un lugar actual cargado, generamos el texto
        if (window.lugarActual) {
            let nombreArchivo = src.split('/').pop().split('.')[0].replace(/-/g, ' ');
            let tituloImagen = nombreArchivo.replace(/\b\w/g, char => char.toUpperCase());
            
            lbCaption.innerHTML = `<strong>${tituloImagen}</strong><br><span style="font-size:0.85em; opacity:0.8;">${window.lugarActual.perfil.nombre}</span>`;
        }

        lb.classList.remove('hidden');
    }
};

window.cerrarVisor = function() {
    document.getElementById('place-visor').classList.add('hidden');
}

// Función para compartir el lugar actual
window.compartir = function(plataforma) {
    const lugar = window.lugarActual;
    if (!lugar) return;

    // Generamos la URL del lugar (asegúrate de que la URL apunte a tu dominio real)
    const urlLugar = `${window.location.origin}${window.location.pathname}?lugar=${lugar.id}`;
    const textoCompartir = `📖 Mira lo que estoy estudiando en Cronos: *${lugar.perfil.nombre}* - ${lugar.perfil.titulo_corto}\n\n`;

    switch(plataforma) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(textoCompartir + urlLugar)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlLugar)}`, '_blank');
            break;
        case 'copiar':
            navigator.clipboard.writeText(urlLugar).then(() => {
                alert("✅ Enlace copiado al portapapeles");
            });
            break;
    }
};

// Función para enviar datos a Escriba
window.irAEscriba = function() {
    const lugar = window.lugarActual;
    if (!lugar) return;

    const titulo = `Estudio: ${lugar.perfil.nombre}`;
    const cuerpo = `Ubicación: ${lugar.perfil.ubicacion_geografica}\nLección Clave: ${lugar.aplicacion_personal.leccion_clave}\n\nMis reflexiones:\n`;
    
    // Asumiendo que Escriba está en la carpeta hermana ../escriba/
    const urlNotas = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
    window.location.href = urlNotas;
};

// --- LÓGICA DEL BUSCADOR ---
function inicializarBuscador() {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    if (!input || !resultsContainer) return; // Seguridad

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (term.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        // Filtrar con validación de seguridad (por si hay nulos)
        const filtrados = todosLosLugares.filter(l => {
            const nombre = l.perfil?.nombre?.toLowerCase() || "";
            const era = l.contexto?.era_biblica?.toLowerCase() || "";
            const titulo = l.perfil?.titulo_corto?.toLowerCase() || "";
            
            return nombre.includes(term) || era.includes(term) || titulo.includes(term);
        });

        renderizarSugerencias(filtrados);
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            resultsContainer.classList.add('hidden');
        }
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
                // Buscamos el objeto completo en nuestro arreglo global usando el ID
                const lugarEncontrado = todosLosLugares.find(item => item.id === l.id);
                
                if (lugarEncontrado) {
                    // En lugar de llamar a viajarA (que hace un fetch), 
                    // llamamos directamente a abrirDetalleLugar que ya tiene los datos.
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
        // Si no hay parámetro lugar en la URL, cerramos el visor
        const visor = document.getElementById('place-visor');
        if (visor && visor.classList.contains('active')) {
            // Llamamos a la lógica de cierre (sin el pushState para no crear bucles)
            visor.classList.remove('active');
            setTimeout(() => visor.classList.add('hidden'), 500);
        }
    }
};



// Variable global para recordar nuestros pasos
window.historialNavegacion = [];

// --- CONTROLADOR DE TRÁFICO (VÍNCULOS) ---
window.navegarA = function(tipo, id) {
    const lugarActual = window.lugarActual;

    if (tipo === 'lugar') {
        // 1. Guardamos el lugar de donde venimos en el historial
        if (lugarActual) {
            window.historialNavegacion.push({
                id: lugarActual.id,
                nombre: lugarActual.perfil.nombre
            });
        }
        // 2. Viajamos al nuevo lugar
        viajarA(id);
    } 
    else if (tipo === 'personaje') {
        // 1. Guardamos el rastro en el navegador para volver desde Huellas
        if (lugarActual) {
            sessionStorage.setItem('rastro_estudio', JSON.stringify({
                url: window.location.href,
                nombrePersonaje: lugarActual.perfil.nombre
            }));
        }
        // 2. Saltamos a la plataforma de Huellas
        window.location.href = `../huellas/perfil.html?id=${id}`;
    }
};

// --- DIBUJAR BOTÓN DE REGRESO (INTERNO Y EXTERNO) ---
window.renderizarBotonVolver = function() {
    // 1. OBTENER PARÁMETROS Y RASTROS
    const params = new URLSearchParams(window.location.search);
    
    // --- AQUÍ VA EL CAMBIO ---
    const rastroImagenDeDios = sessionStorage.getItem('rastro_estudio');
    
    // Si existe rastro de Imagen de Dios, anulamos retornoId para que no se pinte el botón dorado
    const retornoId = rastroImagenDeDios ? null : (params.get('retorno') || localStorage.getItem('last_onoma_id'));
    // -------------------------

    // 2. BUSQUEDA DEL CONTENEDOR (Igual que antes)
    const tituloLugar = document.getElementById('p-nombre') || 
                        document.querySelector('.p-nombre') || 
                        document.querySelector('.narrativa-box h2') ||
                        document.querySelector('.panel-informacion h2');

    const panelPrincipal = document.getElementById('visor-lugar') || 
                           document.querySelector('.panel-informacion') ||
                           document.querySelector('.narrativa-box');

    // 3. VALIDACIÓN DE SALIDA
    // Si no hay retornoId (porque venimos de Imagen de Dios o no hay memoria), salimos.
    if (!retornoId) {
        console.log("No se inyecta botón de Onomastiko (Prioridad Imagen de Dios o sin rastro)");
        return;
    }

    // Si el panel no existe todavía, el setTimeout de viajarA volverá a intentarlo
    if (!tituloLugar && !panelPrincipal) {
        console.log("Sigo buscando un lugar donde poner el botón...");
        return;
    }

    // 3. Evitar duplicados
    if (document.getElementById('btn-volver-onomastiko-fijo')) return;

    // 4. CREACIÓN DEL BOTÓN
    const btn = document.createElement('button');
    btn.id = 'btn-volver-onomastiko-fijo';
    btn.innerHTML = `<span>🆔</span> Regresar al Perfil`;
    
    btn.style.cssText = `
        background: #1e293b; 
        color: #fbbf24; 
        border: 1px solid #fbbf24; 
        padding: 10px 18px; 
        border-radius: 25px; 
        cursor: pointer; 
        margin-bottom: 20px; 
        font-weight: bold; 
        display: inline-flex; 
        align-items: center; 
        gap: 8px; 
        font-size: 0.9rem; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        z-index: 9999;
        position: relative;
    `;

    // 5. INYECCIÓN (Donde sea que encuentre espacio)
    if (tituloLugar) {
        tituloLugar.parentNode.insertBefore(btn, tituloLugar);
    } else {
        panelPrincipal.prepend(btn);
    }

    btn.onclick = () => {
        // No borramos el localStorage aquí para permitir que el usuario 
        // regrese si vuelve a entrar a otro lugar del mapa
        window.location.href = `../onomastiko/nombre.html?id=${retornoId}`;
    };
    
    console.log("🚀 ¡BOTÓN INYECTADO!");
};

// Función auxiliar para crear la estructura base del botón
function crearBotonBase() {
    const btn = document.createElement('button');
    btn.id = 'btn-volver-interno';
    btn.style.cssText = `
        background: #1e293b; 
        color: #fcd34d; 
        border: 1px solid #d4b483; 
        padding: 6px 12px; 
        border-radius: 20px; 
        cursor: pointer; 
        margin-bottom: 15px; 
        font-weight: bold; 
        display: flex; 
        align-items: center; 
        gap: 8px; 
        font-size: 0.85em;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    return btn;
}

// Función auxiliar para inyectar el botón en el panel lateral
function inyectarBoton(btn) {
    const titulo = document.getElementById('p-nombre');
    if (titulo && titulo.parentNode) {
        titulo.parentNode.insertBefore(btn, titulo);
    }
}



// ==========================================
// LÓGICA DEL MENÚ ECOSISTEMA (LAUNCHER)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');

    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Alternamos la clase active
            ecoMenu.classList.toggle('active');
            
            // Lógica para que la animación CSS funcione con display:none (hidden)
            if (ecoMenu.classList.contains('hidden')) {
                ecoMenu.classList.remove('hidden');
                // Pequeño delay para que la transición de opacidad funcione
                setTimeout(() => ecoMenu.classList.add('active'), 10); 
            } else if (!ecoMenu.classList.contains('active')) {
                // Si cerramos, quitamos active y esperamos a que termine la animación para ocultar
                setTimeout(() => ecoMenu.classList.add('hidden'), 300); 
            }

            // Rotación visual del icono de 9 puntos
            btnLauncher.style.transform = ecoMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        // Cerrar el menú si hacemos clic fuera de él (en el mapa o en otro lado)
        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
                setTimeout(() => ecoMenu.classList.add('hidden'), 300);
                btnLauncher.style.transform = 'rotate(0deg)';
            }
        });
    }
});


// --- FUNCIONES GLOBALES (ACCESIBLES DESDE EL HTML) ---

window.cargarTrayectoria = async function(id) {
    console.log("Chef, montando ruta interactiva para:", id);
    try {
        const response = await fetch('../data/rutas/rutas_personajes.json');
        const data = await response.json();
        const infoRuta = data[id];

        if (!infoRuta) return;

        // 1. EXTRAER IDS DE LA RUTA
        const idsRuta = infoRuta.hitos.map(h => h.id_lugar);

        // 2. MODO ENFOQUE: Filtrar Marcadores
        // Recorremos todos los marcadores que guardaste en markersById
        Object.keys(markersById).forEach(lugarId => {
            if (idsRuta.includes(lugarId)) {
                // Si el punto es de la ruta, lo aseguramos en el mapa
                if (!map.hasLayer(markersById[lugarId])) {
                    markersById[lugarId].addTo(map);
                }
                // Opcional: Podrías cambiarle el color al icono aquí para que resalte más
            } else {
                // En lugar de borrar, cambiamos opacidad
                Object.keys(markersById).forEach(lugarId => {
                    const marker = markersById[lugarId];
                    if (idsRuta.includes(lugarId)) {
                        marker.getElement().style.opacity = "1";
                        marker.getElement().style.filter = "drop-shadow(0 0 5px var(--gold))"; // Brillo especial
                    } else {
                        marker.getElement().style.opacity = "0.5"; // Casi invisible pero da contexto
                        marker.getElement().style.filter = "grayscale(100%)"; // En blanco y negro
                    }
                });
            }
        });

        const colorReferencia = COLORES_SECCION[infoRuta.archivo_fuente] || "#d4b483";

        // 1. Panel de Control (Cabecera)
        const panelRuta = document.getElementById('control-ruta');
        if (panelRuta) {
            panelRuta.classList.remove('hidden');
            panelRuta.style.borderLeftColor = colorReferencia;
        }
        document.getElementById('ruta-personaje-nombre').innerText = infoRuta.nombre_ruta;

        // 2. Mapeo de coordenadas y Generación de Timeline
        const timeline = document.getElementById('timeline-ruta');
        const container = document.getElementById('hitos-container');
        if (container) container.innerHTML = ''; // Limpiamos mesa de trabajo

        const puntosCoords = [];

        infoRuta.hitos.forEach((hito, index) => {
            const lugar = todosLosLugares.find(l => l.id === hito.id_lugar);
            if (lugar) {
                puntosCoords.push(lugar.mapa.coords);

                // --- CREACIÓN DEL HITO INTERACTIVO ---
                if (container) {
                    const item = document.createElement('div');
                    item.className = 'hito-item';
                    item.innerHTML = `
                        <div class="hito-numero" style="background:${colorReferencia}">${index + 1}</div>
                        <span>${lugar.perfil.nombre}</span>
                    `;
                    
                    item.onclick = () => {
                        // Viajamos al punto exacto
                        viajarA(lugar.id);
                        // Feedback visual de "Activo"
                        document.querySelectorAll('.hito-item').forEach(el => el.classList.remove('active'));
                        item.classList.add('active');
                    };
                    container.appendChild(item);
                }
            }
        });

        

        // Mostramos el timeline
        if (timeline) timeline.classList.remove('hidden');

        // 3. Renderizado de la Polilínea
        if (window.capaRuta) map.removeLayer(window.capaRuta);
        
        window.capaRuta = L.polyline(puntosCoords, {
            color: colorReferencia,
            weight: 5,
            dashArray: '12, 15',
            lineCap: 'round',
            opacity: 0.9,
            shadowBlur: 5,
            shadowColor: 'black'
        }).addTo(map);

        // 4. Encuadre inicial
        if (puntosCoords.length > 0) {
            map.fitBounds(window.capaRuta.getBounds(), { padding: [60, 60] });
        }

        // Usamos infoRuta.hitos (que es lo que ya tienes definido arriba)
        const hitosOrdenados = infoRuta.hitos.sort((a, b) => a.orden - b.orden);
        
        // Llamamos a la función de distancia con los hitos reales
        window.actualizarDistanciaVisual(hitosOrdenados);

    } catch (error) {
        console.error("Error en la cocina de rutas:", error);
    }
};

window.cerrarModoRuta = function() {
    console.log("Chef, restaurando mapa y regresando a origen...");

    // 1. RESTAURAR VISIBILIDAD DE TODOS LOS MARCADORES
    Object.values(markersById).forEach(marker => {
        const elemento = marker.getElement();
        if (elemento) {
            elemento.style.opacity = "1";
            elemento.style.filter = "none";
            // Usamos una verificación de seguridad para el ZIndex
            if (typeof marker.setZIndexOffset === 'function') {
                marker.setZIndexOffset(0);
            }
        }
    });

    // 2. LIMPIAR CAPAS DE RUTA
    if (window.capaRuta) {
        map.removeLayer(window.capaRuta);
        window.capaRuta = null;
    }
    
    // 3. OCULTAR PANELES DE CRONOS
    document.getElementById('control-ruta').classList.add('hidden');
    document.getElementById('timeline-ruta').classList.add('hidden');

    // 4. LÓGICA DE RETORNO AL PERFIL (ONOMASTIKO)
    const params = new URLSearchParams(window.location.search);
    const idRetorno = params.get('retorno') || params.get('ruta'); // Buscamos quién nos envió aquí

    if (idRetorno) {
        // Redirigimos de vuelta a la ficha del personaje en Onomastiko
        // Ajusta la ruta según tu estructura de carpetas (ej: ../onomastiko/index.html)
        window.location.href = `../onomastiko/nombre.html?id=${idRetorno}`;
    } else {
        // Si no hay origen claro, solo limpiamos la URL de Cronos
        const url = new URL(window.location);
        url.searchParams.delete('ruta');
        url.searchParams.delete('retorno');
        window.history.replaceState({}, '', url);
    }
};

window.actualizarDistanciaVisual = function(hitos) {
    let metrosTotales = 0;
    
    // Necesitamos al menos 2 puntos para medir
    for (let i = 0; i < hitos.length - 1; i++) {
        const marcadorA = markersById[hitos[i].id_lugar];
        const marcadorB = markersById[hitos[i+1].id_lugar];
        
        if (marcadorA && marcadorB) {
            const puntoA = marcadorA.getLatLng();
            const puntoB = marcadorB.getLatLng();
            metrosTotales += puntoA.distanceTo(puntoB);
        }
    }

    const kilometros = (metrosTotales / 1000).toFixed(1);
    const display = document.getElementById('distancia-ruta');
    if (display) {
        display.innerText = `${kilometros} km`;
    }
    console.log(`Chef, recorrido total: ${kilometros} km`);
};
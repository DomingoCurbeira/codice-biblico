/**
 * CRONOS 2.0 - Renderizado desde Códice/Data
 */

let map;
let todosLosLugares = [];
const markersById = {};

document.addEventListener('DOMContentLoaded', async () => {
    initMap();
    checkRetorno();
    // 1. Cargamos el archivo principal de puntos
    await cargarMapaBase(); 
    gestionarTabs();
    
    const params = new URLSearchParams(window.location.search);
    const lugarId = params.get('lugar');
    if (lugarId) {
        viajarA(lugarId);
    } else {
        const panel = document.getElementById('panel-detalle');
        if (panel) panel.classList.add('hidden');
    }

    inicializarBuscador();
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
    renderizarBotonVolver();
    
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

// --- DIBUJAR BOTÓN DE REGRESO INTERNO ---
function renderizarBotonVolver() {
    let btnAtras = document.getElementById('btn-volver-interno');
    
    // Si hay historial acumulado, mostramos el botón
    if (window.historialNavegacion && window.historialNavegacion.length > 0) {
        const lugarAnterior = window.historialNavegacion[window.historialNavegacion.length - 1];

        // Si el botón no existe en el HTML, lo creamos mágicamente con JS
        if (!btnAtras) {
            btnAtras = document.createElement('button');
            btnAtras.id = 'btn-volver-interno';
            // Estilos del botón (lo hacemos parecer un tag pero más destacado)
            btnAtras.style.cssText = "background: #334155; color: #fcd34d; border: 1px solid #d4b483; padding: 4px 10px; border-radius: 4px; cursor: pointer; margin-bottom: 12px; font-weight: bold; font-family: monospace; display: flex; align-items: center; gap: 5px; font-size: 0.85em;";
            
            // Lo inyectamos justo antes del título principal
            const titulo = document.getElementById('p-nombre');
            titulo.parentNode.insertBefore(btnAtras, titulo);
        }
        
        btnAtras.innerHTML = `<span>⬅️ Volver a:</span> <b>${lugarAnterior.nombre}</b>`;
        btnAtras.style.display = 'inline-flex';
        
        // Al hacer clic, sacamos el último lugar del historial y volvemos a él
        btnAtras.onclick = function() {
            const destino = window.historialNavegacion.pop();
            viajarA(destino.id);
        };
    } else {
        // Si el historial está vacío (entramos directo desde el mapa), lo ocultamos
        if (btnAtras) btnAtras.style.display = 'none';
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
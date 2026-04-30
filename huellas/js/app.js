document.addEventListener('DOMContentLoaded', async () => {
    
    // VARIABLES DOM
    const filaAT = document.getElementById('fila-at');
    const filaNT = document.getElementById('fila-nt');
    const profileView = document.getElementById('profile-view');
    const inputBuscador = document.getElementById('buscador-input'); // <--- NUEVO: Input del buscador

    // VARIABLES GLOBALES
    let cachePersonajes = []; // <--- NUEVO: Aquí guardaremos todos los datos para buscar rápido

    // CONFIGURACIÓN DE RUTAS CENTRALIZADAS
    const URL_INDICE = '../data/indices/indice_personajes.json';
    const URL_BASE_DATOS = '../data/personajes/';

    // OBTENER ID DE LA URL
    const params = new URLSearchParams(window.location.search);
    const idSolicitado = params.get('id');

    // --- LÓGICA DE SELECCIÓN DE VISTA ---
    if (idSolicitado && profileView) {
        // ESTAMOS EN PERFIL.HTML
        if(inputBuscador) inputBuscador.parentElement.style.display = 'none'; // Ocultamos buscador en perfil
        await cargarPerfil(idSolicitado);
    } else if (filaAT || filaNT) {
        // ESTAMOS EN INDEX.HTML (PORTADA)
        await cargarPortada();
        inicializarBuscador(); // <--- NUEVO: Activamos la escucha del buscador
    }

    // --- FUNCIONES DE CARGA ---

    async function cargarPerfil(id) {
        try {
            const resIndice = await fetch(URL_INDICE);
            if (!resIndice.ok) throw new Error("Error cargando índice.");
            const indice = await resIndice.json();

            const grupo = indice[id];
            if (!grupo) throw new Error("Personaje no encontrado en el índice.");

            console.log(`🔍 Cargando perfil desde grupo: ${grupo}`);
            const resGrupo = await fetch(`${URL_BASE_DATOS}${grupo}.json`);
            if (!resGrupo.ok) throw new Error(`Error cargando grupo ${grupo}`);
            const datosGrupo = await resGrupo.json();

            const personaje = datosGrupo.find(p => p.id === id);
            
            if (personaje) {
                renderizarPerfil(personaje);
                // configurarBotonesCompartir(personaje);
            } else {
                throw new Error("El ID existe en índice pero no en el archivo de datos.");
            }

        } catch (e) {
            console.error(e);
            mostrarError(`No pudimos cargar el perfil.<br><small>${e.message}</small>`);
        }
    }

   // --- NUEVA FUNCIÓN DE CARGA CON FILTRADO POR ERAS ---
    async function cargarPortada() {
        try {
            console.log("🏠 Cargando catálogo por eras...");
            const resIndice = await fetch(URL_INDICE);
            if (!resIndice.ok) throw new Error("Error índice");
            const indice = await resIndice.json();

            // Obtenemos los nombres de los archivos .json únicos
            const gruposUnicos = [...new Set(Object.values(indice))];

            const promesas = gruposUnicos.map(g => 
                fetch(`${URL_BASE_DATOS}${g}.json`)
                    .then(r => r.json().then(data => ({ grupo: g, personajes: data }))) // Guardamos el nombre del grupo
                    .catch(err => {
                        console.warn(`Omitiendo grupo ${g}:`, err);
                        return { grupo: g, personajes: [] };
                    })
            );

            const resultados = await Promise.all(promesas);
            
            // APLANAR Y NORMALIZAR
            cachePersonajes = [];
            resultados.forEach(res => {
                const personajesNormalizados = res.personajes.map(p => {
                    const n = normalizarPersonaje(p);
                    n.era_grupo = res.grupo; // <--- NUEVO: Marcamos cada personaje con su archivo de origen
                    return n;
                });
                cachePersonajes = cachePersonajes.concat(personajesNormalizados);
            });

            // Renderizar todo al inicio
            renderizarListasPortada(cachePersonajes);
            inicializarFiltros(); // <--- NUEVO: Activamos los botones de las eras

            // =========================================================
            // --- SISTEMA: PERSONAJE RECOMENDADO DEL DÍA (HUELLAS) ---
            // =========================================================
            setTimeout(() => {
                const hoyStr = new Date().toDateString();
                const toastVistoHoy = localStorage.getItem('huellas_toast_dia'); // <-- CLAVE ÚNICA

                if (toastVistoHoy === hoyStr) return;
                
                // Usamos el caché de personajes que ya cargamos
                if (!cachePersonajes || cachePersonajes.length === 0) return;

                const hoy = new Date();
                const inicioAno = new Date(hoy.getFullYear(), 0, 0);
                const diff = hoy - inicioAno;
                const diaDelAno = Math.floor(diff / (1000 * 60 * 60 * 24));
                
                // Rotación diaria basada en el total de personajes
                const indice = diaDelAno % cachePersonajes.length;
                const personajeDelDia = cachePersonajes[indice];

                // Aseguramos la ruta de la imagen
                let rutaImg = personajeDelDia.imagen || '../img/ui/placeholder.webp';
                if (rutaImg.startsWith('./')) rutaImg = rutaImg.replace('./', '../');

                const toast = document.createElement('div');
                toast.className = 'codice-daily-toast';
                toast.innerHTML = `
                    <img src="${rutaImg}" alt="${personajeDelDia.nombre}" onerror="this.src='../img/ui/placeholder.webp'">
                    <div class="toast-info" onclick="window.location.href='perfil.html?id=${personajeDelDia.id}'">
                        <h4 style="color:#10b981">Personaje del Día 👣</h4>
                        <p>${personajeDelDia.nombre}</p>
                        <small style="color:#94a3b8; font-size:0.75rem">${personajeDelDia.titular || ''}</small>
                    </div>
                    <button class="cerrar-btn" aria-label="Cerrar">&times;</button>
                `;

                const btnCerrar = toast.querySelector('.cerrar-btn');
                btnCerrar.onclick = (e) => {
                    e.stopPropagation();
                    toast.classList.remove('mostrar');
                    localStorage.setItem('huellas_toast_dia', hoyStr); 
                    setTimeout(() => toast.remove(), 600);
                };

                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('mostrar'), 2000);

            }, 800);

        } catch (e) {
            console.error(e);
            mostrarError("Error cargando la galería.");
        }


    }

    // --- LÓGICA DE BOTONES DE FILTRO (TAGS) ---
    function inicializarFiltros() {
        const contenedorFiltros = document.querySelector('.filter-bar');
        if (!contenedorFiltros) return;

        contenedorFiltros.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // UI: Cambiar botón activo
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const grupoSeleccionado = e.target.getAttribute('data-grupo');
                
                // Si es "todos", mostrar caché completo, si no, filtrar por la era_grupo
                const filtrados = (grupoSeleccionado === 'todos') 
                    ? cachePersonajes 
                    : cachePersonajes.filter(p => p.era_grupo === grupoSeleccionado);

                // Si filtramos por era, ocultamos los títulos de AT/NT para que se vea como una sola galería limpia
                mostrarTitulos(grupoSeleccionado === 'todos');
                renderizarListasPortada(filtrados);
                
                // Scroll suave arriba al filtrar
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

   // --- 🔍 LÓGICA DEL BUSCADOR (CORREGIDA Y BLINDADA) ---
    function inicializarBuscador() {
        if (!inputBuscador) return;

        inputBuscador.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();

            if (termino === '') {
                // Si está vacío, mostramos todo
                renderizarListasPortada(cachePersonajes);
                mostrarTitulos(true);
            } else {
                // Filtramos
                const filtrados = cachePersonajes.filter(p => {
                    // 🛡️ PROTECCIÓN TOTAL DE TIPOS
                    // Convertimos todo a String() antes de usar toLowerCase()
                    // Así, si 'lugares' es un Array ["A", "B"], se convierte en texto "A,B" y no da error.
                    
                    const nombre = String(p.nombre || '').toLowerCase();
                    const titular = String(p.titular || '').toLowerCase();
                    const resumen = String(p.resumen || '').toLowerCase();
                    
                    // Aquí estaba el error:
                    const lugares = String(p.datos?.lugares || '').toLowerCase(); 
                    
                    // También buscamos en ocupación por si acaso
                    const ocupacion = String(p.datos?.ocupacion || '').toLowerCase();

                    return nombre.includes(termino) || 
                           titular.includes(termino) || 
                           lugares.includes(termino) ||
                           ocupacion.includes(termino) ||
                           resumen.includes(termino);
                });
                
                renderizarListasPortada(filtrados);
                mostrarTitulos(false); 
            }
        });
    }

    function mostrarTitulos(visible) {
        // Oculta/Muestra los H2 de las secciones
        const titulos = document.querySelectorAll('.section-title'); 
        titulos.forEach(t => t.style.display = visible ? 'block' : 'none');
    }

    // --- RENDERIZADO DE PORTADA ---
    function renderizarListasPortada(lista) {
        console.log(`📥 Procesando ${lista.length} personajes...`);
        
        if(filaAT) filaAT.innerHTML = '';
        if(filaNT) filaNT.innerHTML = '';

        if (lista.length === 0) {
            if(filaAT) filaAT.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:2rem; color:#94a3b8;">No se encontraron personajes con ese nombre.</div>';
            return;
        }

        lista.forEach(p => {
            // Nota: Ya vienen normalizados desde cargarPortada, pero por seguridad:
            // const p = normalizarPersonaje(itemOriginal); <--- Ya no es necesario aquí si usamos caché normalizada

            // FILTRO ANTI-FANTASMAS
            if (!p || !p.id || !p.nombre) return;

            const card = document.createElement('div');
            card.className = 'poster-card';
            card.style.animation = "fadeIn 0.5s ease";
            card.onclick = () => window.location.href = `perfil.html?id=${p.id}`;
            
            // IMAGEN Y RUTAS
            let rutaImagen = p.imagen || '';
            if (rutaImagen.startsWith('/')) {
                rutaImagen = '..' + rutaImagen;
            } else if (rutaImagen.startsWith('./')) {
                rutaImagen = rutaImagen.replace('./', '../');
            }
            
            const rutaPlaceholder = '../img/ui/placeholder.webp'; 
            if (!rutaImagen) rutaImagen = rutaPlaceholder;

            card.innerHTML = `
                <img src="${rutaImagen}" 
                     class="poster-img" 
                     loading="lazy" 
                     alt="${p.nombre}" 
                     onerror="this.onerror=null; this.src='${rutaPlaceholder}'"> 
                <div class="poster-overlay">
                    <div class="poster-name">${p.nombre}</div>
                    
                </div>
            `;

            const testamento = (p.testamento || '').toLowerCase();
            
            if (testamento.includes('antiguo')) {
                if(filaAT) filaAT.appendChild(card);
            } else {
                if(filaNT) filaNT.appendChild(card);
            }
        });
    }

    // --- RENDERIZADO DE PERFIL (CON LIGHTBOX) ---
    function renderizarPerfil(itemOriginal) {
        // 1. APLICAR EL TRADUCTOR
        const p = normalizarPersonaje(itemOriginal);

        // 2. HEADER Y DATOS BÁSICOS
        setText('p-nombre', p.nombre);
        setText('p-role', p.titular);
        
        const resumenEl = document.getElementById('p-resumen');
        if (resumenEl) resumenEl.innerHTML = p.resumen;

        // 3. IMAGEN (CON ZOOM / LIGHTBOX)
        const imgEl = document.getElementById('p-foto');
        if(imgEl) {
            let rutaImagen = p.imagen || '';
            if (rutaImagen.startsWith('/')) rutaImagen = '..' + rutaImagen;
            else if (rutaImagen.startsWith('./')) rutaImagen = rutaImagen.replace('./', '../');
            console.log(rutaImagen.startsWith('./'));
            
            imgEl.src = rutaImagen;
            imgEl.onerror = () => { imgEl.src = '../img/ui/placeholder.webp'; };
            imgEl.alt = p.nombre;

            // --- NUEVO: ACTIVAR LIGHTBOX ---
            imgEl.style.cursor = "zoom-in"; // Cambia el cursor para indicar clic
            imgEl.title = "Clic para ampliar";
            imgEl.onclick = () => abrirLightbox(rutaImagen);
        }

        // 4. DATOS DE FICHA
        setText('p-ocupacion', p.datos?.ocupacion || "-");
        setText('p-origen', p.datos?.lugares || "-");
        setText('p-familia', p.datos?.familia || "-");

        // 5. LISTAS DE ANÁLISIS
        renderList('p-fortalezas', p.analisis?.fortalezas);
        renderList('p-debilidades', p.analisis?.debilidades);
        renderList('p-lecciones', p.analisis?.lecciones);

        // 6. TEXTOS EXTRA
        setText('p-curioso', p.dato_curioso || "No registrado.");
        setText('p-conexion', p.conexion_jesus || "Pendiente.");

        // 7. TIMELINE
        const timeline = document.getElementById('p-timeline');
        if (timeline) {
            timeline.innerHTML = '';
            if (p.hitos && p.hitos.length > 0) {
                p.hitos.forEach(h => {
                    timeline.innerHTML += `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-year">${h.anio}</span>
                                <p>${h.evento}</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                timeline.innerHTML = "<p style='color:#666; font-style:italic; padding:10px'>Sin hitos registrados.</p>";
            }
        }

        // 8. VERSÍCULO
        if (p.versiculo) {
            setText('p-versiculo-txt', `"${p.versiculo.texto}"`);
            setText('p-versiculo-cita', p.versiculo.cita);
        } else {
            setText('p-versiculo-txt', '');
            setText('p-versiculo-cita', '');
        }

        // 9. RELACIONADOS
        const contenedorRelacionados = document.getElementById('p-relacionados-container');
        if (!contenedorRelacionados) {
            const nuevoDiv = document.createElement('div');
            nuevoDiv.id = 'p-relacionados-container';
            nuevoDiv.style.marginTop = '2rem';
            nuevoDiv.style.paddingTop = '1rem';
            nuevoDiv.style.borderTop = '1px solid #334155';
            const container = document.getElementById('profile-view');
            if (container) container.appendChild(nuevoDiv);
        }

        const divRel = document.getElementById('p-relacionados-container');
        if (divRel) {
            divRel.innerHTML = ''; 
            if (p.relacionados && p.relacionados.length > 0) {
                divRel.innerHTML = `<h3 style="color:#94a3b8; margin-bottom:10px; font-size:1rem;">🔗 Conexiones:</h3>`;
                const listaBtns = document.createElement('div');
                listaBtns.style.display = 'flex';
                listaBtns.style.gap = '8px';
                listaBtns.style.flexWrap = 'wrap';

                p.relacionados.forEach(idRel => {
                    const idLimpio = idRel.toLowerCase().replace(/ /g, '-');
                    const btn = document.createElement('button');
                    btn.innerText = idRel.replace(/[-_]/g, ' ').toUpperCase();
                    btn.style.padding = '6px 12px';
                    btn.style.background = '#1e293b';
                    btn.style.border = '1px solid #475569';
                    btn.style.color = '#e2e8f0';
                    btn.style.cursor = 'pointer';
                    btn.style.borderRadius = '20px';
                    btn.style.fontSize = '0.8rem';
                    btn.onclick = () => window.location.href = `perfil.html?id=${idLimpio}`;
                    listaBtns.appendChild(btn);
                });
                divRel.appendChild(listaBtns);
                divRel.style.display = 'block';
            } else {
                divRel.style.display = 'none';
            }
        }

        // 10. SEO Y COMPARTIR
        document.title = `${p.nombre} | Huellas de Fe`;
        if (typeof configurarBotonesCompartir === 'function') {
            configurarBotonesCompartir(p);
        }
        
    }

    // Función auxiliar para el mensaje flotante
    function mostrarNotificacionLogro(id, xp, extra = "") {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast visible'; // Asegúrate de tener el CSS que definimos
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">🏆</span>
                <div>
                    <small>LOGRO DESBLOQUEADO</small>
                    <strong>${id.replace(/-/g, ' ').toUpperCase()}</strong>
                    ${extra ? `<div style="font-size:0.7rem; color:#d4b483">${extra}</div>` : ''}
                </div>
                <span class="toast-xp">+${xp} XP</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 500); }, 4000);
    }

    // --- 📸 FUNCIÓN LIGHTBOX (PANTALLA COMPLETA) ---
    function abrirLightbox(src) {
        // 1. Crear el fondo oscuro
        const overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.95)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.cursor = 'zoom-out';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';

        // 2. Crear la imagen
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90vh';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 0 30px rgba(0,0,0,0.5)';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'transform 0.3s';

        // 3. Ensamblar y mostrar
        overlay.appendChild(img);
        document.body.appendChild(overlay);

        // Animación de entrada (pequeño delay para que funcione la transición CSS)
        setTimeout(() => {
            overlay.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 10);

        // 4. Cerrar al hacer clic
        overlay.onclick = () => {
            overlay.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };
    }

 // --- FUNCIÓN DE COMPARTIR DEFINITIVA (HUELLAS) ---
function configurarBotonesCompartir(p) {
    // 1. Buscamos el contenedor principal donde vamos a inyectar
    const containerPerfil = document.getElementById('profile-view');
    if (!containerPerfil) return;

    // 2. Limpiamos si ya existía una sección de compartir previa (para no duplicar al recargar)
    const shareExistente = document.getElementById('huellas-share-section');
    if (shareExistente) shareExistente.remove();

    // 3. HTML Estandarizado
    const shareHTML = `
        <div id="estudio-content"></div>
        <div id="huellas-share-section" class="study-share-section" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; padding-bottom: 60px;">
            <h3 class="share-title" style="color: #9ca3af; font-size: 0.9rem; margin-bottom: 15px; letter-spacing: 1px; text-transform: uppercase;">Compartir Historia</h3>
            
            <div class="share-actions" style="display: flex; justify-content: center; gap: 15px;">

                <button id="btn-nota-huellas" class="btn-share" style="background-color: #d4b483; color: #0f172a;" aria-label="Crear Nota">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                
                <button id="btn-wa" class="btn-share wa" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </button>

                <button id="btn-fb" class="btn-share fb" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </button>

                <button id="btn-copy" class="btn-share copy" aria-label="Copiar Enlace">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // 4. Inyección: Usamos 'beforeend' para asegurar que vaya al FINAL de todo el contenido
    containerPerfil.insertAdjacentHTML('beforeend', shareHTML);

    // 5. Lógica de los botones
    setTimeout(() => {


        const btnNota = document.getElementById('btn-nota-huellas');
        if (btnNota) {
            btnNota.onclick = () => {
                const titulo = `Personaje: ${p.nombre}`;
                const cuerpo = `Estudiando a ${p.nombre} en Huellas.\nTexto clave: "${p.versiculo ? p.versiculo.texto : ''}"\n\nLo que aprendí:\n`;
                
                const url = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
                window.open(url, '_blank');
            };
        }


        const btnWa = document.getElementById('btn-wa');
        const btnFb = document.getElementById('btn-fb');
        const btnCopy = document.getElementById('btn-copy');
        
        const shareUrl = window.location.href;
        const shareText = `📖 Estoy leyendo la historia de *${p.nombre}* en Huellas de Fe. ¡Descúbrela aquí!`;
        console.log(p.nombre);

        if (btnWa) {
            btnWa.onclick = (e) => { 
                e.preventDefault(); 
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank'); 
            };
        }

        if (btnFb) {
            btnFb.onclick = (e) => { 
                e.preventDefault(); 
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'); 
            };
        }

        if (btnCopy) {
            btnCopy.onclick = (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(shareUrl).then(() => {
                    const originalIcon = btnCopy.innerHTML;
                    btnCopy.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
                    btnCopy.style.background = "#10b981";
                    btnCopy.style.borderColor = "#10b981";
                    setTimeout(() => { 
                        btnCopy.innerHTML = originalIcon; 
                        btnCopy.style.background = ""; 
                        btnCopy.style.borderColor = ""; 
                    }, 2000);
                });
            };
        }
    }, 100);
}

    // --- HELPERS ---

    function setText(id, txt) { const el = document.getElementById(id); if (el) el.innerText = txt; }

    function renderList(id, items) {
        const el = document.getElementById(id); if (!el) return;
        el.innerHTML = '';
        if (items && items.length > 0) {
            items.forEach(item => { const li = document.createElement('li'); li.innerHTML = item; el.appendChild(li); });
        } else { el.innerHTML = "<li class='empty-list'>-</li>"; }
    }

    function mostrarError(msg) {
        const container = profileView || document.body;
        container.innerHTML = `<div style="text-align: center; padding: 4rem 1rem; color: #ef4444;"><h2 style="font-size: 2rem;">⚠️ Ups</h2><p>${msg}</p><button onclick="window.history.back()" style="margin-top:2rem; padding:0.5rem; cursor:pointer;">Volver</button></div>`;
    }

    // --- MENÚ ECOSISTEMA ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');
    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => { e.stopPropagation(); ecoMenu.classList.toggle('active'); btnLauncher.style.transform = ecoMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)'; });
        document.addEventListener('click', (e) => { if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) { ecoMenu.classList.remove('active'); btnLauncher.style.transform = 'rotate(0deg)'; }});
    }

    // --- 🧬 NORMALIZADOR MAESTRO (V3.0) ---
    function normalizarPersonaje(p) {
        if (p.nombre && !p.perfil) return p;
        if (p.perfil) {
            const hitosAdaptados = p.linea_tiempo ? p.linea_tiempo.map(item => ({
                anio: item.fase || item.anio || "Etapa",
                evento: item.evento + (item.referencia ? ` <span style="color:#fcd34d; font-size:0.85em">(${item.referencia})</span>` : '')
            })) : [];

            let versiculoAdaptado = null;
            if (p.versiculo) versiculoAdaptado = p.versiculo;
            else if (p.aplicacion_personal?.leccion_clave) versiculoAdaptado = { texto: p.aplicacion_personal.leccion_clave, cita: "Lección Clave" };

            const simbologiaTexto = p.analisis_profundo?.simbologia ? p.analisis_profundo.simbologia.map(s => `🔮 ${s.objeto}: ${s.significado}`) : [];
            let resumenFinal = p.narrativa?.resumen_epico || "Sin biografía.";
            if (p.analisis_profundo?.perfil_emocional) resumenFinal = `<strong style="color:#94a3b8; display:block; margin-bottom:8px;">🧠 Perfil: ${p.analisis_profundo.perfil_emocional}</strong>` + resumenFinal;
            const librosTexto = p.contexto?.libros_aparicion ? p.contexto.libros_aparicion.join(", ") : (p.libro_origen || "-");

            return {
                id: p.id,
                nombre: p.perfil.nombre,
                titular: `${p.perfil.titulo_corto} ${p.perfil.significado_nombre ? `• "${p.perfil.significado_nombre}"` : ''}`,
                imagen: p.perfil.imagen,
                resumen: resumenFinal,
                dato_curioso: p.narrativa?.dato_curioso,
                conexion_jesus: p.narrativa?.conexion_jesus,
                analisis: {
                    fortalezas: p.analisis_profundo?.fortalezas || [],
                    debilidades: p.analisis_profundo?.debilidades || [],
                    lecciones: [...simbologiaTexto, ...(p.analisis_profundo?.lecciones || []), ...(p.aplicacion_personal?.preguntas_reflexion || [])]
                },
                datos: {
                    ocupacion: `${p.perfil.ocupacion} ${p.contexto?.era_biblica ? `(${p.contexto.era_biblica})` : ''}`,
                    lugares: librosTexto + " | " + (p.vinculos?.lugares ? p.vinculos.lugares.join(", ") : ""),
                    familia: typeof p.perfil.familia === 'object' ? Object.entries(p.perfil.familia).map(([k, v]) => `${k}: ${v}`).join(" | ") : p.perfil.familia
                },
                hitos: hitosAdaptados,
                versiculo: versiculoAdaptado,
                testamento: p.contexto?.testamento?.toLowerCase() || 'antiguo',
                relacionados: p.vinculos?.personajes_relacionados || []
            };
        }
        return p;
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

// Ejecutamos la función automáticamente al cargar
// (Si ya tienes un addEventListener DOMContentLoaded, puedes llamar a renderizarFooter() dentro,
// o dejar esta línea suelta al final del archivo para que se ejecute sola)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarFooter);
} else {
    renderizarFooter();
}
});

function manejarNavegacionRetorno() {
    const params = new URLSearchParams(window.location.search);
    const retornoId = params.get('retorno'); // Caso A: Viene de Onomastiko (URL)
    const rastroRaw = sessionStorage.getItem('rastro_estudio'); // Caso B: Viene de Cronos (Session)

    // 1. Prioridad: Retorno a Onomastiko (el que estamos creando hoy)
    if (retornoId) {
        crearBotonNavegacion(`🆔 Volver al Perfil`, `../onomastiko/nombre.html?id=${retornoId}`, "#fbbf24");
        return; // Si venimos de Onomastiko, priorizamos este regreso
    }

    // 2. Segundo caso: Retorno a Cronos (tu sistema anterior)
    if (rastroRaw) {
        try {
            const rastro = JSON.parse(rastroRaw);
            if (rastro.url) {
                crearBotonNavegacion(`⬅ Volver a: ${rastro.nombrePersonaje || 'Mapa'}`, rastro.url, "#d4b483", true);
            }
        } catch (e) { console.error("Error rastro:", e); }
    }
}

// Función auxiliar para no repetir código de creación de botones
function crearBotonNavegacion(texto, url, colorAcento, esCronos = false) {
    const btn = document.createElement('button');
    btn.innerHTML = texto;
    // Estilo unificado para que no tape el contenido
    btn.style = `
        position: fixed; top: 20px; left: 20px; z-index: 1100; 
        background: #1e293b; color: ${colorAcento}; border: 1px solid ${colorAcento}; 
        padding: 10px 18px; border-radius: 25px; cursor: pointer; 
        font-weight: bold; box-shadow: 0 10px 25px rgba(0,0,0,0.5); 
        transition: all 0.3s ease; font-family: 'Merriweather', serif;
    `;
    
    btn.onmouseover = () => {
        btn.style.background = colorAcento;
        btn.style.color = "#0f172a";
        btn.style.transform = "translateY(-2px)";
    };
    btn.onmouseout = () => {
        btn.style.background = "#1e293b";
        btn.style.color = colorAcento;
        btn.style.transform = "translateY(0)";
    };

    btn.onclick = () => {
        if (esCronos) sessionStorage.removeItem('rastro_estudio');
        window.location.href = url;
    };
    
    document.body.appendChild(btn);
}
// =====================================================================
// --- SISTEMA INTEGRAL DE ECOSISTEMA Y GAMIFICACIÓN (HUELLAS) ---
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    manejarNavegacionRetorno();
    // 1. BOTÓN DE RETORNO UNIVERSAL
    const rastroGuardado = sessionStorage.getItem('rastro_estudio');
    
    if (rastroGuardado) {
        try {
            const rastro = JSON.parse(rastroGuardado);
            
            if (rastro.url) {
                const btnVolver = document.createElement('button');
                btnVolver.innerHTML = `⬅ Volver a: ${rastro.nombrePersonaje}`;
                btnVolver.style = "position: fixed; top: 20px; left: 20px; z-index: 1000; background: #d4b483; color: #0f172a; border: none; padding: 10px 15px; border-radius: 20px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;";
                
                btnVolver.onmouseover = () => btnVolver.style.transform = "scale(1.05)";
                btnVolver.onmouseout = () => btnVolver.style.transform = "scale(1)";

                btnVolver.onclick = () => {
                    sessionStorage.removeItem('rastro_estudio');
                    window.location.href = rastro.url; 
                };
                
                document.body.appendChild(btnVolver);
            }
        } catch (error) {
            console.error("Error leyendo el rastro del ecosistema:", error);
        }
    }

    // 2. SISTEMA DE LOGROS Y AUDIO AL LEER EL PERFIL (HUELLAS)
    setTimeout(() => {
        const targetElement = document.getElementById('huellas-share-section') || document.getElementById('p-relacionados-container');
        
        if (targetElement) {
            const achievementObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        try {
                            const params = new URLSearchParams(window.location.search);
                            const idPersonaje = params.get('id');

                            if (idPersonaje) {
                                let perfilUsuario = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
                                
                                if (!perfilUsuario.logros.includes(idPersonaje)) {
                                    // 1. Guardamos los puntos
                                    perfilUsuario.xp += 100; // 100 XP por leer el personaje
                                    perfilUsuario.logros.push(idPersonaje);
                                    localStorage.setItem('codice_perfil', JSON.stringify(perfilUsuario));
                                    
                                    console.log(`✨ ¡Logro de Huellas obtenido!: ${idPersonaje}`);

                                    // 2. REPRODUCIR AUDIO CORREGIDO
                                    const audioRecompensa = new Audio('../assets/levelup.mp3');
                                    audioRecompensa.volume = 0.5;
                                    audioRecompensa.play().catch(e => console.log("El navegador requiere interacción previa para el audio"));

                                    // 3. Notificación visual (si tienes la función declarada)
                                    if (typeof mostrarNotificacionLogro === 'function') {
                                        mostrarNotificacionLogro(idPersonaje, 100, "¡Personaje descubierto!");
                                    }
                                }
                            }
                        } catch (errorGamificacion) {
                            console.warn("Error procesando el logro del personaje:", errorGamificacion);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            achievementObserver.observe(targetElement);
        }
    }, 1000); 
});
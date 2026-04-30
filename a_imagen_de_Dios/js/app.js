let estudios = [];

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. CONFIGURACIÓN DEL CEREBRO CENTRAL ---
    const URL_INDICE = '../data/indices/indice_estudios.json';
    const URL_BASE = '../data/estudios/';
    
    // Elementos del DOM
    const listaDom = document.getElementById('lista-estudios'); // Para index.html
    const readerHeader = document.getElementById('reader-header'); // Para leer.html
    
    // --- 2. LÓGICA DEL MODAL (VENTANA DE VERSÍCULOS) ---
    const modal = document.getElementById('modal-biblia');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const modalClose = document.querySelector('.modal-close');

    window.abrirModal = function(cita, texto) {
        if(!modal) return;
        if(modalTitulo) modalTitulo.innerText = cita;
        if(modalTexto) modalTexto.innerText = `"${texto}"`;
        modal.classList.add('active'); 
        modal.classList.remove('hidden'); 
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300); 
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                modal.classList.remove('active');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        });
    }

    // --- 3. CARGA DE DATOS INTELIGENTE ---
    try {
        console.log("📖 Cargando A Imagen...");
        
        const params = new URLSearchParams(window.location.search);
        const idSolicitado = params.get('id');

        const resIndice = await fetch(URL_INDICE);
        if(!resIndice.ok) throw new Error("No se pudo cargar el índice");
        const indice = await resIndice.json();

        if (idSolicitado && indice[idSolicitado]) {
            const categoria = indice[idSolicitado];
            const resGrupo = await fetch(`${URL_BASE}${categoria}.json`);
            estudios = await resGrupo.json(); 
        } else {
            const categorias = [...new Set(Object.values(indice))];
            const promesas = categorias.map(c => fetch(`${URL_BASE}${c}.json`).then(r => r.json()));
            const resultados = await Promise.all(promesas);
            estudios = resultados.flat();
        }

    } catch (error) {
        console.error("❌ Error Fatal:", error);
        if(listaDom || readerHeader) {
             document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:20%'>Error de conexión con Códice.</h1>";
        }
        return;
    }

    // --- 4. RENDERIZADO VISUAL ---

    // A) SI ESTAMOS EN LA PORTADA (Buscador, XP y Paginación)
    // A) SI ESTAMOS EN LA PORTADA (Buscador, XP y Paginación)
    // A) SI ESTAMOS EN LA PORTADA (Buscador, XP, Paginación y Filtro de Activos)
    if (listaDom) {
        const msgCargando = document.getElementById('loading-msg');
        if (msgCargando) {
            msgCargando.style.opacity = '0';
            setTimeout(() => msgCargando.remove(), 500);
        }

        const perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
        const rangos = [
            "Neófito", "Buscador de Verdad", "Discípulo", "Valiente", 
            "Guerrero de Oración", "Escriba del Reino", "Lumbrera", 
            "Atalaya", "Embajador", "Maestro del Códice"
        ];
        
        const nivelCalculado = Math.floor(perfil.xp / 500); 
        const nombreRango = rangos[nivelCalculado] || "Patriarca del Códice"; 

        // --- FILTRO MAESTRO: Separamos solo los estudios activos ---
        // --- FILTRO MAESTRO: Activos + Publicación Programada ---
        const estudiosActivos = estudios.filter(est => {
            // 1. Si el estudio tiene una fecha programada, verificamos si ya llegó
            if (est.fecha_programada) {
                // Convertimos la fecha del JSON y la fecha actual en objetos de tiempo
                // Añadimos 'T00:00:00' para que evalúe desde la medianoche exacta
                const fechaLanzamiento = new Date(est.fecha_programada + 'T00:00:00');
                const hoy = new Date();
                
                // Si hoy es mayor o igual a la fecha de lanzamiento, lo mostramos
                if (hoy >= fechaLanzamiento) {
                    return true; 
                }
            }
            
            // 2. Si NO tiene fecha (o la fecha aún no llega), respetamos la regla del "activo"
            return est.activo !== false && est.activo !== "false";
        });
    
        // 1. EXTRAER TAGS ÚNICOS (Solo de los estudios activos)
        const todosLosTags = new Set();
        estudiosActivos.forEach(est => {
            if (est.tags) {
                est.tags.forEach(tag => todosLosTags.add(tag));
            }
        });
        const tagsOrdenados = Array.from(todosLosTags).sort();

        // 2. CREAR EL HTML CON EL BUSCADOR Y EL SELECT DE TAGS
        const headerIndex = document.createElement('div');
        headerIndex.className = 'index-header-tools';
        headerIndex.innerHTML = `
            <div class="search-container" style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="text" id="input-busqueda" placeholder="🔍 Buscar enseñanza..." 
                    style="flex: 1; min-width: 200px; padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(212, 180, 131, 0.3); background: rgba(15, 23, 42, 0.8); color: white; outline: none; font-family: inherit;">
                
                <select id="select-tags" style="padding: 12px 20px; border-radius: 25px; border: 1px solid rgba(212, 180, 131, 0.3); background: rgba(15, 23, 42, 0.8); color: white; outline: none; font-family: inherit; cursor: pointer;">
                    <option value="todos">🏷️ Todos los temas</option>
                    ${tagsOrdenados.map(tag => `<option value="${tag.toLowerCase()}">${tag}</option>`).join('')}
                </select>
            </div>
            <div class="user-stats-banner">
                <div class="stat-item">
                    <span class="stat-label">RANGO ACTUAL</span>
                    <span class="stat-value" style="color: #f59e0b; font-size: 0.9rem;">${nombreRango.toUpperCase()}</span>
                    <small style="color: #94a3b8; display: block; font-size: 0.6rem;">NIVEL ${nivelCalculado + 1}</small>
                </div>
                <div class="stat-item">
                    <span class="stat-label">TOTAL XP</span>
                    <span class="stat-value">${perfil.xp}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">LOGROS</span>
                    <span class="stat-value">🏆 ${perfil.logros.length}</span>
                </div>
            </div>
        `;
        const placeholder = document.getElementById('header-tools-placeholder');
        if (placeholder) {
            placeholder.appendChild(headerIndex);
        }

        const ESTUDIOS_POR_PAGINA = 6;
        let cantidadMostrada = 0;
        
        // Iniciamos la lista visual usando solo los activos
        let estudiosFiltrados = [...estudiosActivos].reverse();

        const renderizarBloque = (limpiarLista = false) => {
            if (limpiarLista) {
                listaDom.innerHTML = '';
                cantidadMostrada = 0;
            }

            const siguienteBloque = estudiosFiltrados.slice(cantidadMostrada, cantidadMostrada + ESTUDIOS_POR_PAGINA);
            
            if (estudiosFiltrados.length === 0) {
                listaDom.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 2rem;">No se encontraron resultados para tu búsqueda.</p>';
                actualizarBotonVerMas();
                return;
            }

            siguienteBloque.forEach((estudio, index) => {
                let etiquetaNuevo = (cantidadMostrada === 0 && index === 0) ? '<span class="badge-new">NOVEDAD</span>' : '';
                const card = document.createElement('article');
                card.className = 'card-estudio';
                const tagsHtml = (estudio.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
                const imgCover = estudio.imagen_portada || 'https://via.placeholder.com/400x200';

                card.innerHTML = `
                    <div class="card-img" style="background-image: url('${imgCover}'); height: 180px; background-size: cover; background-position: center;"></div>
                    <div class="card-content" style="padding: 1.5rem;">
                        <div class="card-meta"><span>${estudio.fecha_publicacion || estudio.fecha}</span><span>⏱ ${estudio.tiempo_lectura}</span></div>
                        <h2 class="card-title">${estudio.titulo} ${etiquetaNuevo}</h2>
                        <p class="card-excerpt">${estudio.subtitulo}</p>
                        <div class="tags">${tagsHtml}</div>
                    </div>
                `;
                card.addEventListener('click', () => window.location.href = `leer.html?id=${estudio.id}`);
                listaDom.appendChild(card);
            });

            cantidadMostrada += siguienteBloque.length;
            actualizarBotonVerMas();
        };

        const actualizarBotonVerMas = () => {
            const btnPrevio = document.getElementById('btn-load-more');
            if(btnPrevio) btnPrevio.remove();
            if (cantidadMostrada < estudiosFiltrados.length) {
                const btnMore = document.createElement('button');
                btnMore.id = 'btn-load-more';
                btnMore.className = 'btn-primary-outline';
                btnMore.innerText = 'Cargar más enseñanzas';
                btnMore.style = "display: block; margin: 2rem auto; padding: 1rem 2rem; cursor: pointer;";
                btnMore.onclick = () => renderizarBloque();
                listaDom.after(btnMore);
            }
        };

        // 3. LÓGICA DE FILTRADO COMBINADO (Input + Select)
        const inputBusqueda = document.getElementById('input-busqueda');
        const selectTags = document.getElementById('select-tags');

        const aplicarFiltros = () => {
            const termino = inputBusqueda.value.toLowerCase();
            const tagSeleccionado = selectTags.value.toLowerCase();

            // Filtramos siempre sobre la base de 'estudiosActivos'
            estudiosFiltrados = [...estudiosActivos].reverse().filter(est => {
                // Filtro 1: Texto
                const coincideTexto = est.titulo.toLowerCase().includes(termino) || 
                                      est.subtitulo.toLowerCase().includes(termino) ||
                                      (est.tags && est.tags.some(t => t.toLowerCase().includes(termino)));
                
                // Filtro 2: Tag del Select
                const coincideTag = tagSeleccionado === 'todos' || 
                                    (est.tags && est.tags.some(t => t.toLowerCase() === tagSeleccionado));

                return coincideTexto && coincideTag;
            });
            renderizarBloque(true);
        };

        if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltros);
        if (selectTags) selectTags.addEventListener('change', aplicarFiltros);

        renderizarBloque();

        // =========================================================
        // --- SISTEMA: ENSEÑANZA RECOMENDADA DEL DÍA (TOAST) ---
        // =========================================================
        setTimeout(() => {
            const hoyStr = new Date().toDateString(); // Ej: "Wed Mar 11 2026"
            const toastVistoHoy = localStorage.getItem('codice_toast_dia');

            // 1. Si ya lo cerró hoy, no lo molestamos más
            if (toastVistoHoy === hoyStr) return;

            // 2. Filtramos SOLO los estudios que ya son públicos hoy
            const hoy = new Date();
            const estudiosPublicados = estudios.filter(est => {
                if (est.fecha_programada) {
                    const fechaLanzamiento = new Date(est.fecha_programada + 'T00:00:00-06:00');
                    if (hoy < fechaLanzamiento) return false;
                }
                return est.activo !== false && est.activo !== "false";
            });

            if (estudiosPublicados.length === 0) return;

            // 3. Calculamos qué día del año es para ir rotando (del 1 al 365)
            const inicioAno = new Date(hoy.getFullYear(), 0, 0);
            const diff = hoy - inicioAno;
            const diaDelAno = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            // 4. Seleccionamos el estudio del día rotativamente
            const indice = diaDelAno % estudiosPublicados.length;
            const estudioDelDia = estudiosPublicados[indice];

            // 5. Construimos el HTML del Toast
            const toast = document.createElement('div');
            toast.className = 'codice-daily-toast';
            toast.innerHTML = `
                <img src="${estudioDelDia.imagen_portada}" alt="Sugerencia" onerror="this.src='https://via.placeholder.com/60'">
                <div class="toast-info" onclick="window.location.href='leer.html?id=${estudioDelDia.id}'">
                    <h4>Sugerencia del Día 💡</h4>
                    <p>${estudioDelDia.titulo}</p>
                </div>
                <button class="cerrar-btn" aria-label="Cerrar">&times;</button>
            `;

            // 6. Lógica de cierre y guardado
            const btnCerrar = toast.querySelector('.cerrar-btn');
            btnCerrar.onclick = (e) => {
                e.stopPropagation(); // Evita que se dispare el clic de ir al estudio
                toast.classList.remove('mostrar');
                localStorage.setItem('codice_toast_dia', hoyStr); // Guardamos que ya lo vio HOY
                setTimeout(() => toast.remove(), 600);
            };

            // 7. Lo inyectamos en la pantalla y lo mostramos a los 2 segundos
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('mostrar');
            }, 2000);

        }, 500); // Pequeño delay para no saturar la carga inicial
    }

    // B) SI ESTAMOS LEYENDO (Lector de un estudio específico)
    if (readerHeader) {
        const params = new URLSearchParams(window.location.search);
        const idBuscado = params.get('id');
        
        const estudio = estudios.find(e => e.id === idBuscado);
        console.log(estudios)
        if (estudio) {
            readerHeader.innerHTML = `
                <div class="card-meta">${estudio.fecha_publicacion || estudio.fecha} • ${estudio.autor}</div>
                <h1 class="reader-title">${estudio.titulo}</h1>
                <p style="color:var(--text-muted); font-size: 1.2rem; margin-top: 0.5rem;">${estudio.subtitulo}</p>
            `;

            const contentDom = document.getElementById('reader-content');
            let htmlContent = ''; 

            if (estudio.versiculo_clave) {
                htmlContent += `
                    <div class="key-verse-box">
                        <p class="key-verse-text">"${estudio.versiculo_clave.texto}"</p>
                        <span class="key-verse-cite">— ${estudio.versiculo_clave.cita}</span>
                    </div>
                `;
            }

            const diccionario = estudio.diccionario || estudio.palabras_clave;
            if (diccionario && diccionario.length > 0) {
                htmlContent += `<div class="roots-section"><h3 class="section-title">Profundizando en el Original</h3><div class="roots-grid">`;
                diccionario.forEach(palabra => {
                    htmlContent += `
                        <div class="root-card">
                            <div class="root-word">${palabra.palabra}</div>
                            <span class="root-origin">${palabra.origen}</span>
                            <p class="root-meaning">${palabra.significado}</p>
                        </div>
                    `;
                });
                htmlContent += `</div></div>`;
            }

            if (estudio.contenido) {
                estudio.contenido.forEach(bloque => {
                    if (bloque.tipo === 'parrafo' || bloque.tipo === 'intro') {
                        htmlContent += `<p>${bloque.texto}</p>`;
                    } else if (bloque.tipo === 'subtitulo') {
                        htmlContent += `<h3>${bloque.texto}</h3>`;
                    } else if (bloque.tipo === 'destacado') {
                        htmlContent += `
                            <div class="challenge-box">
                                <p class="challenge-text">${bloque.texto}</p>
                            </div>
                        `;
                    } else if (bloque.tipo === 'cita_biblica' || bloque.tipo === 'versiculo') {
                        htmlContent += `
                            <blockquote class="biblical-quote">
                                "${bloque.texto}"
                                <span class="biblical-cite">— ${bloque.referencia || bloque.cita}</span>
                            </blockquote>
                        `;
                    } else if (bloque.tipo === 'lista') {
                        htmlContent += `<ul class="study-list">`;
                        if (bloque.items && bloque.items.length > 0) {
                            bloque.items.forEach(item => {
                                htmlContent += `<li>${item}</li>`;
                            });
                        }
                        htmlContent += `</ul>`;
                    } else if (bloque.tipo === 'imagen') {
                        htmlContent += `
                            <figure class="study-figure">
                                <img src="${bloque.url}" alt="${bloque.descripcion || 'Ilustración del estudio'}" loading="lazy" class="study-img">
                                ${bloque.descripcion ? `<figcaption>${bloque.descripcion}</figcaption>` : ''}
                            </figure>
                        `;
                    }
                });
            }

            // 5. CONEXIONES DEL ECOSISTEMA
            if (estudio.conexiones) {
                const perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { logros: [] };
                const huellasRelacionadas = estudio.conexiones.huellas || [];
                const logrosObtenidos = huellasRelacionadas.filter(p => perfil.logros.includes(p.id));

                let mensajeCompletado = "";
                if (huellasRelacionadas.length > 0 && logrosObtenidos.length === huellasRelacionadas.length) {
                    mensajeCompletado = `
                        <div class="master-research-badge" style="background: rgba(212, 180, 131, 0.15); border: 1px dashed #d4b483; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; animation: pulse 2s infinite;">
                            <span style="font-size: 1.3rem; display: block; margin-bottom: 5px;">🌟</span> 
                            <strong style="color: #d4b483; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase;">Investigación Maestra Completada</strong>
                        </div>
                    `;
                }

                htmlContent += `
                <div class="ecosystem-connections" style="margin-top: 3rem;">
                    <h3 class="section-title">Conectando los Puntos del Códice</h3>
                    ${mensajeCompletado}
                    <div class="investigation-tracker" style="background: rgba(212, 180, 131, 0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid rgba(212, 180, 131, 0.1);">
                        <p style="font-size: 0.8rem; margin-bottom: 8px; color: #94a3b8;">
                            Investiga los personajes: <strong>${logrosObtenidos.length} / ${huellasRelacionadas.length}</strong>
                        </p>
                        <div class="progress-mini-bar" style="height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden;">
                            <div class="fill" style="height: 100%; background: #d4b483; width: ${(huellasRelacionadas.length > 0 ? (logrosObtenidos.length / huellasRelacionadas.length) * 100 : 0)}%; transition: width 1s ease;"></div>
                        </div>
                    </div>
                    <div class="connections-grid">`;

                // A) Huellas (Personajes con RETORNO INTELIGENTE)
                if (huellasRelacionadas.length > 0) {
                    huellasRelacionadas.forEach(p => {
                        const textoVisto = `<span style="font-size: 0.65rem; font-weight: 800; color: #10b981; letter-spacing: 0.5px;">VISTO</span>`;
                        const estaCompletado = perfil.logros.includes(p.id) ? textoVisto : '👣';
                        const nombreOrigen = estudio.titulo;
                        
                        htmlContent += `
                            <div class="connect-card huellas1" 
                                style="cursor:pointer;"
                                onclick="irAHuellas('${p.id}', '${nombreOrigen}')">
                                <span class="connect-icon huellas">${estaCompletado}</span>
                                <div class="connect-info">
                                    <strong>${p.nombre}</strong>
                                    <span>${p.razon}</span>
                                </div>
                            </div>`;
                    });
                }

                // B) Cronos (Lugares con RETORNO INTELIGENTE)
                if (estudio.conexiones.cronos) {
                    estudio.conexiones.cronos.forEach(c => {
                        const nombreOrigen = estudio.titulo; 
                        
                        htmlContent += `
                        <div class="connect-card cronos" 
                            style="cursor:pointer;" 
                            onclick="irAlMapa('${c.id}', '${nombreOrigen}')">
                            <span class="connect-icon" style="color:#3b82f6;">🌍</span>
                            <div class="connect-info">
                                <strong>${c.nombre || c.lugar}</strong>
                                <span>${c.razon}</span>
                            </div>
                        </div>`;
                    });
                }
                
                // C) Aposento (Oración con RETORNO INTELIGENTE)
                if (estudio.conexiones.aposento) {
                    estudio.conexiones.aposento.forEach(a => {
                        const linkParam = a.id_oracion || encodeURIComponent(a.tema);
                        const nombreOrigen = estudio.titulo; // Guardamos el nombre del estudio actual
                        
                        htmlContent += `
                        <div class="connect-card aposento" 
                            style="cursor:pointer;"
                            onclick="irAAposento('${linkParam}', '${nombreOrigen}')">
                            <span class="connect-icon" style="color:#8b5cf6;">🔥</span>
                            <div class="connect-info">
                                <strong>${a.tema}</strong>
                                <span>${a.accion}</span>
                            </div>
                        </div>`;
                    });
                }
                htmlContent += `</div></div>`;
            }

            if (estudio.desafio_practico) {
                htmlContent += `
                    <div class="challenge-box" style="margin-top:2rem;">
                        <span class="challenge-icon">🔥</span>
                        <p class="challenge-text"><strong>Desafío:</strong> "${estudio.desafio_practico}"</p>
                    </div>
                    
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
            }

            // GAMIFICACIÓN (Caja Visual)
            if (estudio.gamificacion) {
                const g = estudio.gamificacion;
                htmlContent += `
                    <div class="gamification-card">
                        <div class="gamification-header">
                            <span class="xp-badge">+${g.xp_lectura} XP</span>
                            <span class="achievement-label">LOGRO DESBLOQUEADO</span>
                        </div>
                        <div class="gamification-body">
                            <div class="achievement-icon">🏆</div>
                            <div class="achievement-info">
                                <h4 class="achievement-title">${g.logro_id.replace(/-/g, ' ').toUpperCase()}</h4>
                                <p class="achievement-desc">Has completado con éxito este estudio profundo.</p>
                            </div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 100%"></div>
                        </div>
                    </div>
                `;
            }

            // INYECTAR TODO AL DOM
            contentDom.innerHTML = htmlContent;
            document.title = `${estudio.titulo} | A Imagen`;

            // 7. SECCIÓN DE COMPARTIR
            const shareSection = `
            
                <div class="study-share-section">
                    <h3 class="share-title">COMPARTIR ESTE ESTUDIO</h3>
                    <div class="share-actions">
                        <button id="btn-nota-imagen" class="btn-share" style="background-color: #d4b483; color: #0f172a;" aria-label="Crear Nota">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button id="btn-wa" class="btn-share wa" aria-label="Compartir en WhatsApp">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>
                        <button id="btn-fb" class="btn-share fb" aria-label="Compartir en Facebook">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </button>
                        <button id="btn-copy" class="btn-share copy" aria-label="Copiar Enlace">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                </div>`;
            
            contentDom.insertAdjacentHTML('beforeend', shareSection);

            // ACTIVAR BOTONES DE COMPARTIR Y NOTAS
            const btnNota = document.getElementById('btn-nota-imagen');
            if (btnNota) {
                btnNota.onclick = () => {
                    const titulo = `Estudio: ${estudio.titulo}`;
                    const cuerpo = `Estuve leyendo en "A Imagen de Dios" una enseñanza basada en ${estudio.versiculo_clave?.cita || 'la Biblia'}.\n\nMis reflexiones:\n`;
                    const url = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
                    window.location.href = url;
                };
            }

            const btnWa = document.getElementById('btn-wa');
            const btnFb = document.getElementById('btn-fb');
            const btnCopy = document.getElementById('btn-copy');
            const currentUrl = window.location.href;
            const shareText = `Te comparto: "${estudio.titulo}". Léelo aquí:`;

            if(btnWa) btnWa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
            if(btnFb) btnFb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
            if(btnCopy) btnCopy.onclick = () => {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    btnCopy.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
                    setTimeout(() => btnCopy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`, 2000);
                });
            };

            // --- 8. LÓGICA DE GAMIFICACIÓN EXACTA (UNIFICADA Y LIMPIA) ---
            if (estudio.gamificacion) {
                const audioRecompensa = new Audio('../assets/levelup.mp3');
                audioRecompensa.volume = 0.5;

                const achievementObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const card = entry.target;
                            
                            if (!card.classList.contains('unlocked')) {
                                card.classList.add('unlocked');
                                audioRecompensa.play().catch(e => console.log("Audio requiere interacción previa"));

                                const xpGanada = estudio.gamificacion.xp_lectura;
                                const idLogro = estudio.gamificacion.logro_id;

                                let perfilUsuario = JSON.parse(localStorage.getItem('codice_perfil')) || {
                                    xp: 0, logros: []
                                };

                                if (!perfilUsuario.logros.includes(idLogro)) {
                                    perfilUsuario.xp += xpGanada;
                                    perfilUsuario.logros.push(idLogro);
                                    
                                    localStorage.setItem('codice_perfil', JSON.stringify(perfilUsuario));
                                    console.log(`✨ ¡Puntos guardados! Total: ${perfilUsuario.xp} XP`);
                                }

                                observer.unobserve(card);
                            }
                        }
                    });
                }, { threshold: 0.5 });

                const targetCard = document.querySelector('.gamification-card');
                if (targetCard) achievementObserver.observe(targetCard);
            }

        } else {
            readerHeader.innerHTML = `<h1>Estudio no encontrado 😕</h1>`;
        }
    }

    // --- LÓGICA DEL MENÚ ECOSISTEMA (LAUNCHER) ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');

    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation();
            ecoMenu.classList.toggle('active');
            btnLauncher.style.transform = ecoMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
                btnLauncher.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- FOOTER GLOBAL AUTOMÁTICO ---
    function renderizarFooter() {
        if (document.querySelector('.app-footer')) return;
        const nombreDesarrollador = "Domingo Curbeira";
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
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
    renderizarFooter();

    // --- 9. FUNCIÓN GLOBAL PARA LA GALERÍA DE LOGROS ---
    window.renderizarGaleriaLogros = function() {
        const perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
        const contenedorLogros = document.getElementById('contenedor-logros');
        const listaLogros = document.getElementById('lista-logros');
        
        if (!contenedorLogros || !listaLogros) return;

        if (contenedorLogros.style.display === 'block') {
            contenedorLogros.style.display = 'none';
            return;
        }

        contenedorLogros.style.display = 'block';
        listaLogros.innerHTML = '';

        if (perfil.logros.length === 0) {
            listaLogros.innerHTML = '<p style="color:#94a3b8; grid-column: 1/-1; text-align:center; padding: 1rem;">Aún no tienes trofeos. ¡Sigue explorando!</p>';
            return;
        }

        perfil.logros.forEach(logroId => {
            const card = document.createElement('div');
            card.className = 'logro-trofeo'; 
            card.style = "background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(212, 180, 131, 0.3); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 15px;";
            card.innerHTML = `
                <div style="font-size: 2rem;">🏆</div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: bold; font-size: 0.8rem; color: #f8fafc;">${logroId.replace(/-/g, ' ').toUpperCase()}</span>
                    <span style="font-size: 0.65rem; color: #d4b483; text-transform: uppercase;">OBTENIDO ✅</span>
                </div>
            `;
            listaLogros.appendChild(card);
        });
    }

    const btnGaleria = document.getElementById('btn-galeria');
    if (btnGaleria) btnGaleria.onclick = window.renderizarGaleriaLogros;

});

// --- FUNCIONES DE NAVEGACIÓN Y RETORNO (VÍNCULOS DE ECOSISTEMA) ---

// 1. Navegar a Cronos (Lugares)
window.irAlMapa = function(lugarId, nombreEstudio) {
    // 1. LIMPIEZA CRÍTICA: Borramos el rastro de Onomastiko 
    // para que no aparezca el botón dorado de Abraham/Jacob
    localStorage.removeItem('last_onoma_id');

    // 2. Creamos el rastro para Imagen de Dios (Cronos -> Imagen de Dios)
    const rastro = {
        nombrePersonaje: nombreEstudio,
        url: window.location.href 
    };
    
    sessionStorage.setItem('rastro_estudio', JSON.stringify(rastro));
    
    // 3. Viajamos al mapa
    window.location.href = `../cronos/index.html?lugar=${lugarId}`;
};

// 2. Navegar a Huellas (Personajes) - NUEVO
window.irAHuellas = function(personajeId, nombreEstudio) {
    const rastro = {
        nombrePersonaje: nombreEstudio,
        url: window.location.href 
    };
    // Usamos 'rastro_estudio' exactamente igual que Cronos
    sessionStorage.setItem('rastro_estudio', JSON.stringify(rastro));
    window.location.href = `../huellas/perfil.html?id=${personajeId}`;
};

// 3. Navegar a Aposento (Oración) - NUEVO
window.irAAposento = function(temaParam, nombreEstudio) {
    const rastro = {
        nombrePersonaje: nombreEstudio, // Usamos la misma propiedad para estandarizar
        url: window.location.href 
    };
    sessionStorage.setItem('rastro_estudio', JSON.stringify(rastro));
    window.location.href = `../aposento/index.html?tema=${temaParam}`;
};
// Códice Bíblico - v1.1 Premium Build
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
    let indice = {};
    try {
        const params = new URLSearchParams(window.location.search);
        const idSolicitado = params.get('id');

        const resIndice = await fetch(URL_INDICE);
        if(!resIndice.ok) throw new Error("No se pudo cargar el índice");
        indice = await resIndice.json();

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

        // --- ORDENAMIENTO POR PRIORIDAD EDITORIAL (Índice Primero) ---
        // El orden definido en indice_estudios.json manda sobre la fecha.
        // Esto permite que el usuario decida manualmente qué es "Novedad" moviendo el ID al principio del índice.
        const ordenIndice = Object.keys(indice);
        estudiosActivos.sort((a, b) => {
            const indexA = ordenIndice.indexOf(a.id);
            const indexB = ordenIndice.indexOf(b.id);
            
            // Si ambos están en el índice, respetamos ese orden estrictamente
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            
            // Si alguno no está en el índice (por seguridad), ordenamos por fecha
            const dateA = new Date((a.fecha_programada || "2000-01-01") + 'T00:00:00');
            const dateB = new Date((b.fecha_programada || "2000-01-01") + 'T00:00:00');
            return dateB - dateA;
        });
    
        // 1. EXTRAER TAGS ÚNICOS (Solo de los estudios activos)
        const todosLosTags = new Set();
        estudiosActivos.forEach(est => {
            if (est.tags) {
                est.tags.forEach(tag => todosLosTags.add(tag));
            }
        });
        const tagsOrdenados = Array.from(todosLosTags).sort();

        // 2. CREAR EL HTML CON EL BUSCADOR
        const searchWrapper = document.getElementById('search-wrapper');
        if (searchWrapper) {
            searchWrapper.innerHTML = `
                <div class="search-container">
                    <input type="text" id="input-busqueda" placeholder="🔍 Buscar por título o código (ej: Mishkan)..." style="width: 100%;">
                </div>
            `;
        }

        // --- BANNER DE ESTADÍSTICAS ---
        const statsBanner = document.createElement('div');
        statsBanner.className = 'user-stats-banner';
        statsBanner.innerHTML = `
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
        `;
        
        const toolsPlaceholder = document.getElementById('search-wrapper'); // Reutilizamos el wrapper para insertar el banner debajo
        if (toolsPlaceholder) {
            toolsPlaceholder.after(statsBanner);
        }

        // --- SELECTOR DE CATEGORÍAS ---
        let categoriaSeleccionada = 'todos';
        const categoriasData = [
            { id: 'todos', label: 'Todos', icon: 'fas fa-th-large', class: 'cat-todos' },
            { id: 'huellas', label: 'Hilo Rojo', icon: 'fas fa-route', class: 'cat-huellas' },
            { id: 'mitos', label: 'Mitos', icon: 'fas fa-hammer', class: 'cat-mitos' },
            { id: 'etimologia', label: 'Étymos', icon: 'fas fa-language', class: 'cat-etymos' },
            { id: 'historia', label: 'Historia', icon: 'fas fa-monument', class: 'cat-historia' },
            { id: 'sermones', label: 'Sermones', icon: 'fas fa-microphone-lines', class: 'cat-sermones' }
        ];

        const catWrapper = document.getElementById('category-selector-wrapper');
        if (catWrapper) {
            const catSelector = document.createElement('div');
            catSelector.className = 'category-selector';
            catSelector.innerHTML = categoriasData.map(cat => `
                <div class="category-chip ${cat.id === 'todos' ? 'active' : ''} ${cat.class}" data-id="${cat.id}">
                    <div class="category-icon-wrapper"><i class="${cat.icon}"></i></div>
                    <span class="category-label">${cat.label}</span>
                </div>
            `).join('');
            catWrapper.appendChild(catSelector);

            // Event listener para clics en categorías
            catSelector.querySelectorAll('.category-chip').forEach(chip => {
                chip.onclick = () => {
                    catSelector.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    categoriaSeleccionada = chip.dataset.id;
                    aplicarFiltros();
                    // Scroll suave hacia los resultados
                    catWrapper.scrollIntoView({ behavior: 'smooth' });
                };
            });
        }

        // --- LÓGICA DE PAGINACIÓN NUMÉRICA ---
        const ESTUDIOS_POR_PAGINA = 8; // Aumentamos un poco por la grilla magazine
        let paginaActual = 1;
        let estudiosFiltrados = [...estudiosActivos];

        const renderizarPagina = () => {
            listaDom.innerHTML = '';
            
            if (estudiosFiltrados.length === 0) {
                listaDom.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 2rem; grid-column: 1/-1;">No se encontraron resultados para tu búsqueda.</p>';
                renderizarPaginacion(0);
                return;
            }

            // Calcular rango
            const inicio = (paginaActual - 1) * ESTUDIOS_POR_PAGINA;
            const fin = inicio + ESTUDIOS_POR_PAGINA;
            const bloque = estudiosFiltrados.slice(inicio, fin);

            bloque.forEach((estudio, index) => {
                // El primer elemento de la primera página es la "novedad"
                let etiquetaNuevo = (paginaActual === 1 && index === 0) ? '<span class="badge-new">NOVEDAD</span>' : '';
                const card = document.createElement('article');
                card.className = 'card-estudio';
                const tagsHtml = (estudio.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('');
                const imgCover = estudio.imagen_portada || 'https://via.placeholder.com/400x200';

                card.innerHTML = `
                    <div class="card-img" style="background-image: url('${imgCover}')"></div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span>${estudio.fecha_publicacion || estudio.fecha}</span>
                            <span>⏱ ${estudio.tiempo_lectura}</span>
                        </div>
                        <h2 class="card-title">${estudio.titulo} ${etiquetaNuevo}</h2>
                        <p class="card-excerpt">${estudio.subtitulo}</p>
                        <div class="tags">${tagsHtml}</div>
                    </div>
                `;
                card.addEventListener('click', () => window.location.href = `leer.html?id=${estudio.id}`);
                listaDom.appendChild(card);
            });

            renderizarPaginacion(estudiosFiltrados.length);
            // window.scrollTo({ top: 0, behavior: 'smooth' }); // Comentado para no saltar al cambiar categoría
        };

        const renderizarPaginacion = (totalItems) => {
            const totalPaginas = Math.ceil(totalItems / ESTUDIOS_POR_PAGINA);
            
            // Eliminar paginador anterior si existe
            const paginadorPrevio = document.querySelector('.pagination-container');
            if (paginadorPrevio) paginadorPrevio.remove();

            if (totalPaginas <= 1) return;

            const container = document.createElement('div');
            container.className = 'pagination-container';

            // Botón Anterior
            const btnPrev = document.createElement('button');
            btnPrev.className = 'page-btn';
            btnPrev.innerHTML = '<span class="page-arrow">❮</span>';
            btnPrev.disabled = paginaActual === 1;
            btnPrev.onclick = () => { paginaActual--; renderizarPagina(); };
            container.appendChild(btnPrev);

            // Botones de Números
            for (let i = 1; i <= totalPaginas; i++) {
                // Lógica para no mostrar demasiados números si hay muchas páginas
                if (totalPaginas > 7) {
                    if (i > 1 && i < totalPaginas && (i < paginaActual - 1 || i > paginaActual + 1)) {
                        if (i === paginaActual - 2 || i === paginaActual + 2) {
                            const dots = document.createElement('span');
                            dots.innerText = '...';
                            dots.style.color = 'var(--text-muted)';
                            container.appendChild(dots);
                        }
                        continue;
                    }
                }

                const btn = document.createElement('button');
                btn.className = `page-btn ${i === paginaActual ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => { paginaActual = i; renderizarPagina(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
                container.appendChild(btn);
            }

            // Botón Siguiente
            const btnNext = document.createElement('button');
            btnNext.className = 'page-btn';
            btnNext.innerHTML = '<span class="page-arrow">❯</span>';
            btnNext.disabled = paginaActual === totalPaginas;
            btnNext.onclick = () => { paginaActual++; renderizarPagina(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
            container.appendChild(btnNext);

            listaDom.after(container);
        };

        // 3. LÓGICA DE FILTRADO COMBINADO
        const inputBusqueda = document.getElementById('input-busqueda');

        const aplicarFiltros = () => {
            const termino = inputBusqueda.value.toLowerCase();

            estudiosFiltrados = [...estudiosActivos].filter(est => {
                const coincideTexto = est.titulo.toLowerCase().includes(termino) || 
                                      est.subtitulo.toLowerCase().includes(termino) ||
                                      (est.tags && est.tags.some(t => t.toLowerCase().includes(termino)));
                
                const coincideCategoria = categoriaSeleccionada === 'todos' || est.tipo === categoriaSeleccionada;

                return coincideTexto && coincideCategoria;
            });
            
            paginaActual = 1; // Resetear a la primera página al filtrar
            renderizarPagina();
        };

        if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltros);

        renderizarPagina();
    }

    // --- 5. RENDERIZADO DEL BANNER "REVELACIÓN DE HOY" ---
    const bannerContainer = document.getElementById('today-revelation-banner');
    if (bannerContainer && estudios.length > 0) {
        // Obtener fecha actual en formato YYYY-MM-DD
        const hoyStr = new Date().toISOString().split('T')[0];
        
        // Buscar el estudio que coincida con la fecha de hoy
        const estudioHoy = estudios.find(e => e.fecha_programada === hoyStr);

        if (estudioHoy) {
            bannerContainer.innerHTML = `
                <div class="today-banner" style="background-image: url('${estudioHoy.imagen_portada || '../../img/hero/hero-imagen.webp'}');">
                    <div class="today-banner-overlay"></div>
                    <div class="today-banner-content">
                        <span class="today-badge">✨ Revelación de Hoy</span>
                        <h2 class="today-title">${estudioHoy.titulo}</h2>
                        <p class="today-subtitle">${estudioHoy.subtitulo}</p>
                        <button class="btn-today-action" onclick="window.location.href='leer.html?id=${estudioHoy.id}'">
                            <i class="fas fa-play"></i> Comenzar Revelación
                        </button>
                    </div>
                </div>
            `;
        } else {
            bannerContainer.style.display = 'none';
        }
    }

    // B) SI ESTAMOS LEYENDO (Lector de un estudio específico)
    if (readerHeader) {
        const params = new URLSearchParams(window.location.search);
        const idBuscado = params.get('id');
        
        const estudio = estudios.find(e => e.id === idBuscado);
        if (estudio) {
            const imgHTML = estudio.imagen_portada ? `
                <div class="reader-hero-wrapper" style="margin-bottom: 2rem; border-radius: 20px; overflow: hidden; height: 350px; border: 1px solid rgba(212, 180, 131, 0.2); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    <img src="${estudio.imagen_portada}" 
                         alt="${estudio.titulo}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.src='../../img/hero/hero-imagen.webp';">
                </div>
            ` : '';

            readerHeader.innerHTML = `
                ${imgHTML}
                <div class="card-meta">${estudio.fecha_publicacion || estudio.fecha} • ${estudio.author || 'Códice Bíblico'}</div>
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
                    } else if (bloque.tipo === 'seccion_titulo') {
                        htmlContent += `<h2 class="section-master-title">${bloque.texto}</h2>`;
                    } else if (bloque.tipo === 'contexto_historico') {
                        htmlContent += `
                            <div class="context-box">
                                <span class="context-label">📜 Contexto Histórico y Cultural</span>
                                ${bloque.genero_literario ? `<div style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 0.8rem; font-style: italic; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;"><strong>Género Literario:</strong> ${bloque.genero_literario}</div>` : ''}
                                ${bloque.titulo ? `<h4 style="color:var(--primary); margin-bottom:0.5rem;">${bloque.titulo}</h4>` : ''}
                                <p class="context-text">${bloque.texto}</p>
                            </div>
                        `;
                    } else if (bloque.tipo === 'lexico_profundo') {
                        htmlContent += `
                            <div class="lexicon-deep-card">
                                <div class="lexicon-deep-header">
                                    <div>
                                        <span class="lex-term">${bloque.termino}</span>
                                        <span class="lex-root">${bloque.raiz || ''}</span>
                                    </div>
                                    <span class="lex-lang">${bloque.idioma}</span>
                                </div>
                                <span class="lex-meaning-title">Significado Revelado</span>
                                <span class="lex-meaning-text">${bloque.significado}</span>
                                ${bloque.revelacion ? `
                                    <div class="lex-revelation-box">
                                        <p class="lex-revelation-text"><strong>Revelación:</strong> ${bloque.revelacion}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    } else if (bloque.tipo === 'revelacion_atributo') {
                        htmlContent += `
                            <div class="pastoral-bridge" style="border-left-color: #f59e0b;">
                                <div class="bridge-icon" style="color:#f59e0b;">✨</div>
                                <div class="bridge-content">
                                    <strong style="color:#f59e0b; display:block; margin-bottom:5px; text-transform:uppercase; font-size:0.8rem;">Atributo de Dios: ${bloque.atributo}</strong>
                                    ${bloque.texto}
                                </div>
                            </div>
                        `;
                    } else if (bloque.tipo === 'cristocentrico') {
                        htmlContent += `
                            <div class="christ-centric-box">
                                <span class="christ-label">✝ Conexión Cristocéntrica</span>
                                <h4 class="christ-title">${bloque.titulo}</h4>
                                <p class="christ-text">${bloque.texto}</p>
                            </div>
                        `;
                    } else if (bloque.tipo === 'alerta_doctrinal') {
                        htmlContent += `
                            <div class="doctrinal-alert">
                                <div class="alert-header">⚠️ Alerta Doctrinal</div>
                                <p class="alert-text"><strong>${bloque.titulo}:</strong> ${bloque.texto}</p>
                            </div>
                        `;
                    } else if (bloque.tipo === 'mapa_intertextual') {
                        htmlContent += `
                            <div class="intertextual-box" style="background: rgba(30, 41, 59, 0.3); padding: 1.5rem; border-radius: 12px; margin: 2rem 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                                <h4 class="section-title" style="border:none; margin-bottom:1.5rem; color: var(--primary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px;">📖 Mapa Intertextual</h4>
                                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                                    ${bloque.referencias.map(ref => {
                                        let vText = ref.versiculo || "";
                                        let rText = ref.revelacion || "";

                                        if (!vText && ref.texto) {
                                            if (ref.texto.includes('REVELACIÓN:')) {
                                                const parts = ref.texto.split('REVELACIÓN:');
                                                vText = parts[0].replace('📖', '').trim();
                                                rText = parts[1].trim();
                                            } else {
                                                vText = ref.texto;
                                            }
                                        }

                                        const displayExplicacion = rText || ref.explicacion || "";

                                        return `
                                            <div class="inter-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;">
                                                <span class="inter-cite" style="color: var(--primary); font-weight: bold; font-size: 1rem; display: block; margin-bottom: 5px;">${ref.cita}</span>
                                                ${vText ? `<p style="font-family: var(--font-book); font-style: italic; color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 8px;">"${vText.replace(/^"|"$/g, '')}"</p>` : ''}
                                                <p class="inter-desc" style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.4;">${displayExplicacion}</p>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    } else if (bloque.tipo === 'revelacion_progresiva') {
                        htmlContent += `
                            <div class="progressive-revelation-box" style="background: linear-gradient(145deg, rgba(56, 189, 248, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: var(--radius); padding: 1.5rem; margin: 1.5rem 0; position: relative; overflow: hidden;">
                                <div style="position: absolute; top: -10px; right: -10px; font-size: 5rem; opacity: 0.05; user-select: none;">📈</div>
                                <span style="display:inline-block; background:rgba(56,189,248,0.1); color:#38bdf8; padding:4px 10px; border-radius:4px; font-size:0.8rem; font-weight:bold; letter-spacing:1px; margin-bottom:1rem; text-transform:uppercase;">🧬 Hilo de Revelación Progresiva</span>
                                ${bloque.titulo ? `<h4 style="color: var(--text-light); margin-bottom: 1rem; font-size: 1.2rem;">${bloque.titulo}</h4>` : ''}
                                ${bloque.descripcion ? `<p style="color: var(--text-muted); margin-bottom: 1.2rem; font-size: 0.95rem; line-height: 1.5;">${bloque.descripcion}</p>` : ''}
                                <div class="progression-steps" style="display: flex; flex-direction: column; gap: 1rem;">
                                    ${bloque.pasos.map((paso, index) => `
                                        <div class="progression-step" style="display: flex; gap: 1rem; align-items: flex-start;">
                                            <div style="background: #38bdf8; color: #0f172a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; flex-shrink: 0; margin-top: 3px;">${index + 1}</div>
                                            <div>
                                                <strong style="color: var(--text-light); display: block; margin-bottom: 0.2rem;">${paso.concepto}</strong>
                                                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">${paso.explicacion}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else if (bloque.tipo === 'aplicacion_leche') {
                        const itemsHtml = bloque.items ? `
                            <ul class="app-list">
                                ${bloque.items.map(item => `
                                    <li>
                                        <strong>${item.punto}</strong>
                                        ${item.ejemplo ? `<small style="color:var(--text-muted); display:block; margin-top:8px; font-style:italic; border-left: 2px solid rgba(255,255,255,0.1); padding-left:12px; line-height:1.4;">Suposición: ${item.ejemplo}</small>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : `<p style="color: #cbd5e1; line-height:1.6;">${bloque.texto || ''}</p>`;

                        htmlContent += `
                            <div class="app-card leche">
                                <span class="app-badge">🍼 Leche Espiritual</span>
                                <h4 class="app-title">${bloque.titulo}</h4>
                                ${itemsHtml}
                            </div>
                        `;
                    } else if (bloque.tipo === 'aplicacion_solida') {
                        const itemsHtml = bloque.items ? `
                            <ul class="app-list">
                                ${bloque.items.map(item => `
                                    <li>
                                        <strong>${item.punto}</strong>
                                        ${item.ejemplo ? `<small style="color:var(--primary); display:block; margin-top:8px; font-style:italic; border-left: 2px solid rgba(34,211,238,0.2); padding-left:12px; line-height:1.4;">Escenario de Madurez: ${item.ejemplo}</small>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : `<p style="color: #cbd5e1; line-height:1.6;">${bloque.texto || ''}</p>`;

                        htmlContent += `
                            <div class="app-card solido">
                                <span class="app-badge">🥩 Alimento Sólido</span>
                                <h4 class="app-title">${bloque.titulo}</h4>
                                ${itemsHtml}
                            </div>
                        `;
                    } else if (bloque.tipo === 'lexico') {
                        const etymosBtn = bloque.etymos_id ? `
                            <button class="btn-etymos-link" onclick="irAEtymos('${bloque.etymos_id}', '${estudio.titulo}')">
                                <i class="fas fa-search"></i> Ver en Etymos
                            </button>
                        ` : '';

                        htmlContent += `
                            <div class="lexicon-card">
                                <div class="lexicon-header">
                                    <span class="lexicon-term">${bloque.termino}</span>
                                    <span class="lexicon-lang">${bloque.idioma}</span>
                                </div>
                                <p class="lexicon-meaning">${bloque.significado}</p>
                                ${etymosBtn}
                            </div>
                        `;
                    } else if (bloque.tipo === 'puente') {
                        htmlContent += `
                            <div class="pastoral-bridge">
                                <div class="bridge-icon">💡</div>
                                <div class="bridge-content">${bloque.texto}</div>
                            </div>
                        `;
                    } else if (bloque.tipo === 'concordancia') {
                        htmlContent += `
                            <div class="concordance-box" style="background: rgba(15, 23, 42, 0.4); border-radius: 16px; padding: 2rem; margin: 2rem 0; border: 1px solid rgba(212, 180, 131, 0.1);">
                                <h4 class="concordance-title" style="color: var(--gold); font-family: var(--font-ui); text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(212, 180, 131, 0.2); padding-bottom: 10px;">📖 Concordancia y Revelación</h4>
                                <div class="concordance-items" style="display: flex; flex-direction: column; gap: 2rem;">
                                    ${bloque.referencias.map(ref => {
                                        // Lógica de extracción inteligente para compatibilidad
                                        let vText = ref.versiculo || "";
                                        let rText = ref.revelacion || "";
                                        
                                        if (!vText && ref.texto) {
                                            if (ref.texto.includes('REVELACIÓN:')) {
                                                const parts = ref.texto.split('REVELACIÓN:');
                                                vText = parts[0].replace('📖', '').trim();
                                                rText = parts[1].trim();
                                            } else {
                                                vText = ref.texto;
                                            }
                                        }

                                        if (!vText && ref.explicacion && ref.explicacion.includes('📖')) {
                                            const parts = ref.explicacion.split('REVELACIÓN:');
                                            vText = parts[0].replace('📖', '').trim();
                                            rText = parts[1] ? parts[1].trim() : "";
                                        }

                                        const displayExplicacion = rText || ref.explicacion || "";

                                        return `
                                            <div class="concordance-item" style="border-left: 2px solid var(--gold); padding-left: 1.5rem; position: relative;">
                                                <strong style="color: var(--gold); display: block; margin-bottom: 0.8rem; font-size: 1.1rem; letter-spacing: 0.5px;">${ref.cita}</strong>
                                                ${vText ? `<p style="font-family: var(--font-book); font-style: italic; color: #cbd5e1; line-height: 1.7; margin-bottom: 1rem; font-size: 1.05rem;">"${vText.replace(/^"|"$/g, '')}"</p>` : ''}
                                                <div style="background: rgba(212, 180, 131, 0.05); padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(212, 180, 131, 0.1);">
                                                    <span style="color: var(--gold); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">🗝️ Revelación</span>
                                                    <p style="font-size: 0.95rem; color: #94a3b8; margin: 0; line-height: 1.5;">${displayExplicacion.replace(/<br>/g, '')}</p>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    } else if (bloque.tipo === 'aplicacion') {
                        htmlContent += `
                            <div class="application-section">
                                <h4 class="application-title">🎯 Pasos de Aplicación</h4>
                                <ul class="application-list">
                                    ${bloque.items.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }
                });
            }

            // 5. CONEXIONES DEL ECOSISTEMA
            const conexiones = estudio.connections || estudio.conexiones;
            if (conexiones) {
                const perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { logros: [] };
                const huellasRelacionadas = conexiones.huellas || [];
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
                                    ${p.paralelismo ? `<small style="color:var(--primary); font-size:0.7rem; margin-top:4px; font-style:italic;">${p.paralelismo}</small>` : ''}
                                </div>
                            </div>`;                    });
                }

                // B) Cronos (Lugares con RETORNO INTELIGENTE)
                if (conexiones.cronos) {
                    conexiones.cronos.forEach(c => {
                        const nombreOrigen = estudio.titulo; 
                        
                        htmlContent += `
                        <div class="connect-card cronos" 
                            style="cursor:pointer;" 
                            onclick="irAlMapa('${c.id}', '${nombreOrigen}')">
                            <span class="connect-icon" style="color:#3b82f6;">🌍</span>
                            <div class="connect-info">
                                <strong>${c.nombre || c.lugar}</strong>
                                <span>${c.razon}</span>
                                ${c.simbolismo ? `<small style="color:#3b82f6; font-size:0.7rem; margin-top:4px; font-style:italic;">${c.simbolismo}</small>` : ''}
                            </div>
                        </div>`;                    });
                }

                // C) Etymos (Etimología con RETORNO INTELIGENTE)
                if (conexiones.etymos) {
                    conexiones.etymos.forEach(e => {
                        const nombreOrigen = estudio.titulo;
                        htmlContent += `
                        <div class="connect-card etymos" 
                            style="cursor:pointer;" 
                            onclick="irAEtymos('${e.id}', '${nombreOrigen}')">
                            <span class="connect-icon" style="color:#22d3ee;">🔍</span>
                            <div class="connect-info">
                                <strong>${e.nombre}</strong>
                                <span>${e.razon}</span>
                                ${e.familia ? `<small style="color:#22d3ee; font-size:0.7rem; margin-top:4px; font-style:italic;">${e.familia}</small>` : ''}
                            </div>
                        </div>`;                    });
                }
                
                // D) Aposento (Oración con RETORNO INTELIGENTE)
                if (conexiones.aposento) {
                    conexiones.aposento.forEach(a => {
                        const linkParam = a.id_oracion || encodeURIComponent(a.tema);
                        const nombreOrigen = estudio.titulo; // Guardamos el nombre del estudio actual
                        
                        htmlContent += `
                        <div class="connect-card aposento" 
                            style="cursor:pointer;"
                            onclick="irAAposento('${linkParam}', '${nombreOrigen}')">
                            <span class="connect-icon" style="color:#8b5cf6;">🔥</span>
                            <div class="connect-info">
                                <strong>${a.tema}</strong>
                                ${a.declaracion ? `<span>${a.declaracion}</span>` : `<span>Hacia el cuarto de guerra</span>`}
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

            // --- GUARDAR RASTRO PERSISTENTE ---
            localStorage.setItem('rastro_estudio', JSON.stringify({
                nombrePersonaje: estudio.titulo,
                url: window.location.href
            }));

            // ACTIVAR BOTONES DE COMPARTIR Y NOTAS
            // Eliminamos la inyección local de botones porque ahora están en el footer global
            
        } else {
            readerHeader.innerHTML = `<h1>Estudio no encontrado 😕</h1>`;
        }

        // --- 10. MEJORAS DE UX LECTOR: BARRA DE PROGRESO Y CONTROL DE FUENTE ---
        
        // A) Inyectar Barra de Progreso
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        progressContainer.innerHTML = '<div id="reading-progress" class="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const bar = document.getElementById("reading-progress");
            if (bar) bar.style.width = scrolled + "%";
        });

        // B) Inyectar Control de Fuente
        const fontWrapper = document.createElement('div');
        fontWrapper.className = 'font-control-wrapper';
        fontWrapper.innerHTML = `
            <button id="btn-font-toggle" class="btn-font-toggle" title="Ajustar texto">
                <i class="fas fa-font"></i>
            </button>
            <div id="font-panel" class="font-control-panel">
                <button id="btn-font-up" class="btn-font-action" title="Aumentar">A+</button>
                <button id="btn-font-down" class="btn-font-action" title="Disminuir">A-</button>
            </div>
        `;
        document.body.appendChild(fontWrapper);

        const btnToggle = document.getElementById('btn-font-toggle');
        const fontPanel = document.getElementById('font-panel');
        const readerBody = document.getElementById('reader-content');

        // Aplicamos tamaño guardado o base
        let currentSize = parseInt(localStorage.getItem('codice_font_size')) || 18; 
        if (readerBody) readerBody.style.fontSize = currentSize + 'px';

        btnToggle.onclick = (e) => {
            e.stopPropagation();
            fontPanel.classList.toggle('active');
        };

        document.getElementById('btn-font-up').onclick = () => {
            if (currentSize < 30) {
                currentSize += 2;
                readerBody.style.fontSize = currentSize + 'px';
                localStorage.setItem('codice_font_size', currentSize);
            }
        };

        document.getElementById('btn-font-down').onclick = () => {
            if (currentSize > 14) {
                currentSize -= 2;
                readerBody.style.fontSize = currentSize + 'px';
                localStorage.setItem('codice_font_size', currentSize);
            }
        };

        document.addEventListener('click', () => fontPanel.classList.remove('active'));
        fontPanel.onclick = (e) => e.stopPropagation();
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

/**
 * Función unificada para navegar entre módulos guardando el rastro
 * para permitir el retorno inteligente al estudio actual.
 */
window.navegarConRastro = function(urlDestino, nombreOrigen, esMapa = false) {
    if (esMapa) {
        // Limpieza específica para el módulo Cronos/Onomastiko
        localStorage.removeItem('last_onoma_id');
    }

    const rastro = {
        nombrePersonaje: nombreOrigen, // Estandarizado como 'nombrePersonaje' para compatibilidad
        url: window.location.href 
    };
    
    localStorage.setItem('rastro_estudio', JSON.stringify(rastro));
    window.location.href = urlDestino;
};

window.irAlMapa = (lugarId, nombreEstudio) => 
    window.navegarConRastro(`../cronos/index.html?lugar=${lugarId}`, nombreEstudio, true);

window.irAHuellas = (personajeId, nombreEstudio) => 
    window.navegarConRastro(`../huellas/perfil.html?id=${personajeId}`, nombreEstudio);

window.irAAposento = (temaParam, nombreEstudio) => 
    window.navegarConRastro(`../aposento/index.html?tema=${temaParam}`, nombreEstudio);

window.irAEtymos = (palabraId, nombreEstudio) => 
    window.navegarConRastro(`../etymos/palabra.html?id=${palabraId}&ref=imagen`, nombreEstudio);
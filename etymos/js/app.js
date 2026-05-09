document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // --- 1. VARIABLES GLOBALES Y ELEMENTOS DEL DOM ---
    // =========================================================
    let lexicoCompleto = [];
    let palabrasFiltradas = []; 
    
    // Variables de Paginación
    let paginaActual = 1;
    const itemsPorPagina = 10; // Aumentado para el diseño revista

    const contenedorLista = document.getElementById('lista-etymos');
    const contenedorPaginacion = document.getElementById('paginacion-etymos');
    const inputBusqueda = document.getElementById('busqueda-etymos');
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    // =========================================================
    // --- 2. CARGA Y ORDENAMIENTO DE DATOS ---
    // =========================================================
    async function cargarLexico() {
        try {
            const respuesta = await fetch('../data/etymos/lexico.json');
            if (!respuesta.ok) throw new Error("Error al cargar el diccionario");
            
            const datosCrudos = await respuesta.json();
            
            // Ordenar alfabéticamente
            lexicoCompleto = datosCrudos.sort((a, b) => 
                a.palabra_espanol.localeCompare(b.palabra_espanol, 'es', { sensitivity: 'base' })
            );

            palabrasFiltradas = [...lexicoCompleto];
            renderizarTarjetas(); 
            seleccionarPalabraDelDia(lexicoCompleto); // <--- NUEVO: Hero Místico

        } catch (error) {
            console.error(error);
            contenedorLista.innerHTML = `<p style="color:#ef4444; text-align:center;">Error cargando las raíces de la palabra.</p>`;
        }
    }

    // =========================================================
    // --- 3. RENDERIZADO DE TARJETAS (ESTILO REVISTA) ---
    // =========================================================
    function renderizarTarjetas() {
        contenedorLista.innerHTML = '';
        contenedorPaginacion.innerHTML = '';

        if (palabrasFiltradas.length === 0) {
            contenedorLista.innerHTML = `<p style="text-align:center; color:#94a3b8; grid-column: 1 / -1; margin-top: 50px;">No se hallaron tesoros con ese nombre.</p>`;
            return;
        }

        const totalPaginas = Math.ceil(palabrasFiltradas.length / itemsPorPagina);
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const palabrasPagina = palabrasFiltradas.slice(inicio, fin);

        palabrasPagina.forEach((palabra, index) => {
            const idiomaClass = palabra.idioma.toLowerCase();
            
            const tarjeta = document.createElement('article');
            tarjeta.className = `card-lexico ${idiomaClass}`;
            
            tarjeta.onclick = () => {
                window.location.href = `palabra.html?id=${palabra.id}`;
            };

            tarjeta.innerHTML = `
                <div class="lang-watermark">${palabra.original.charAt(0)}</div>
                
                <div class="lexico-header">
                    <span class="lexico-espanol">${palabra.palabra_espanol}</span>
                    <span class="lexico-idioma-badge">${palabra.idioma}</span>
                </div>
                
                <div class="lexico-original">${palabra.original}</div>
                <span class="lexico-transliteracion">${palabra.transliteracion}</span>
                
                <p class="lexico-definicion">${palabra.definicion_corta}</p>
                
                <div class="btn-profundizar">
                    Profundizar <i class="fas fa-arrow-right"></i>
                </div>
            `;
            contenedorLista.appendChild(tarjeta);
        });

        if (totalPaginas > 1) renderizarPaginacion(totalPaginas);
    }

    // --- NUEVO: FUNCIÓN PARA HERO DINÁMICO (PALABRA DEL DÍA) ---
    function seleccionarPalabraDelDia(lista) {
        if (!lista || lista.length === 0) return;
        
        // 1. Elegimos una palabra al azar
        const hoy = lista[Math.floor(Math.random() * lista.length)];

        // 2. Elementos DOM
        const hOrig = document.getElementById('hero-word-original');
        const hTrans = document.getElementById('hero-word-translit');
        const hSpan = document.getElementById('hero-word-spanish');
        const hBadge = document.getElementById('hero-lang-badge');
        const hBtn = document.getElementById('btn-hero-word');

        // 3. Aplicar Cambios
        if (hOrig) hOrig.innerText = hoy.original;
        if (hTrans) hTrans.innerText = `/ ${hoy.transliteracion} /`;
        if (hSpan) hSpan.innerText = hoy.palabra_espanol;
        if (hBadge) hBadge.innerText = `RAÍZ ${hoy.idioma.toUpperCase()}`;
        
        if (hBtn) {
            hBtn.onclick = () => window.location.href = `palabra.html?id=${hoy.id}`;
        }
    }

    // =========================================================
    // --- 4. PAGINACIÓN NUMÉRICA ---
    // =========================================================
    function renderizarPaginacion(totalPaginas) {
        const container = contenedorPaginacion;
        
        // Botón Anterior
        const btnPrev = document.createElement('button');
        btnPrev.className = 'page-btn';
        btnPrev.innerHTML = '❮';
        btnPrev.disabled = paginaActual === 1;
        btnPrev.onclick = () => { paginaActual--; renderizarTarjetas(); window.scrollTo({top:0, behavior:'smooth'}); };
        container.appendChild(btnPrev);

        // Números
        for (let i = 1; i <= totalPaginas; i++) {
            if (totalPaginas > 8) {
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
            btn.onclick = () => { paginaActual = i; renderizarTarjetas(); window.scrollTo({top:0, behavior:'smooth'}); };
            container.appendChild(btn);
        }

        // Botón Siguiente
        const btnNext = document.createElement('button');
        btnNext.className = 'page-btn';
        btnNext.innerHTML = '❯';
        btnNext.disabled = paginaActual === totalPaginas;
        btnNext.onclick = () => { paginaActual++; renderizarTarjetas(); window.scrollTo({top:0, behavior:'smooth'}); };
        container.appendChild(btnNext);
    }

    // =========================================================
    // --- 5. BÚSQUEDA Y FILTROS ---
    // =========================================================
    function aplicarFiltros() {
        const textoBusqueda = inputBusqueda.value.toLowerCase();
        const botonActivo = document.querySelector('.btn-filtro.activo');
        const idiomaFiltro = botonActivo ? botonActivo.dataset.idioma : 'todos';

        palabrasFiltradas = lexicoCompleto.filter(p => {
            const matchText = p.palabra_espanol.toLowerCase().includes(textoBusqueda) || 
                              p.transliteracion.toLowerCase().includes(textoBusqueda) ||
                              p.original.toLowerCase().includes(textoBusqueda);
            const matchLang = idiomaFiltro === 'todos' || p.idioma.toLowerCase() === idiomaFiltro.toLowerCase();
            return matchText && matchLang;
        });

        paginaActual = 1; 
        renderizarTarjetas();
    }

    if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltros);
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            aplicarFiltros();
        });
    });

    cargarLexico();
});

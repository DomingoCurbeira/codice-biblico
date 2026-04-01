document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // --- 1. LÓGICA DEL MENÚ ECOSISTEMA (LAUNCHER) ---
    // =========================================================
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

    // =========================================================
    // --- 2. VARIABLES GLOBALES Y ELEMENTOS DEL DOM ---
    // =========================================================
    let lexicoCompleto = [];
    let palabrasFiltradas = []; // Almacena el resultado actual de la búsqueda/filtro
    
    // Variables de Paginación
    let paginaActual = 1;
    const itemsPorPagina = 12;

    const contenedorLista = document.getElementById('lista-etymos');
    const contenedorPaginacion = document.getElementById('paginacion-etymos');
    const inputBusqueda = document.getElementById('busqueda-etymos');
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    // =========================================================
    // --- 3. CARGA Y ORDENAMIENTO DE DATOS ---
    // =========================================================
    async function cargarLexico() {
        try {
            const respuesta = await fetch('../data/etymos/lexico.json');
            if (!respuesta.ok) throw new Error("Error al cargar el diccionario");
            
            const datosCrudos = await respuesta.json();
            
            // Ordenar alfabéticamente por la palabra en español antes de guardar
            lexicoCompleto = datosCrudos.sort((a, b) => 
                a.palabra_espanol.localeCompare(b.palabra_espanol, 'es', { sensitivity: 'base' })
            );

            palabrasFiltradas = [...lexicoCompleto];
            renderizarTarjetas(); 

        } catch (error) {
            console.error(error);
            contenedorLista.innerHTML = `<p style="color:#ef4444; text-align:center;">Error cargando las raíces de la palabra. Intenta más tarde.</p>`;
        }
    }

    // =========================================================
    // --- 4. RENDERIZADO DE TARJETAS (CON PAGINACIÓN) ---
    // =========================================================
    function renderizarTarjetas() {
        contenedorLista.innerHTML = ''; // Limpiar el contenedor
        contenedorPaginacion.innerHTML = ''; // Limpiar botones de página

        if (palabrasFiltradas.length === 0) {
            contenedorLista.innerHTML = `<p style="text-align:center; color:#94a3b8; grid-column: 1 / -1; margin-top: 20px;">No se encontraron palabras con ese término.</p>`;
            return;
        }

        // Matemática de paginación (Cortar el array)
        const totalPaginas = Math.ceil(palabrasFiltradas.length / itemsPorPagina);
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const palabrasPagina = palabrasFiltradas.slice(inicio, fin);

        // Renderizar solo las palabras de esta página
        palabrasPagina.forEach(palabra => {
            let tagsHTML = '';
            if (palabra.tags && palabra.tags.length > 0) {
                tagsHTML = `<div class="lexico-tags" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">
                    ${palabra.tags.map(tag => `<span class="lexico-tag" style="font-size: 0.7rem; color: #64748b; background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">${tag}</span>`).join('')}
                </div>`;
            }

            const strongStr = palabra.strong ? `<span style="font-size: 0.75rem; color: #64748b; margin-left: 8px;">[${palabra.strong}]</span>` : '';

            const tarjeta = document.createElement('div');
            tarjeta.className = 'card-lexico';
            tarjeta.style.cursor = 'pointer';
            
            tarjeta.onclick = () => {
                window.location.href = `palabra.html?id=${palabra.id}`;
            };

            tarjeta.innerHTML = `
                <div class="lexico-header">
                    <span class="lexico-espanol">${palabra.palabra_espanol}</span>
                    <span class="lexico-idioma">${palabra.idioma} ${strongStr}</span>
                </div>
                
                <div class="lexico-original">${palabra.original}</div>
                <span class="lexico-transliteracion">${palabra.transliteracion}</span>
                
                <p class="lexico-definicion">${palabra.definicion_corta}</p>
                
                ${tagsHTML}
                
                <div style="margin-top: auto; padding-top: 15px; display: flex; justify-content: flex-end; align-items: center; color: #d4b483; font-weight: bold; font-size: 0.9rem;">
                    <span class="btn-profundizar">Profundizar 🔍</span>
                </div>
            `;
            contenedorLista.appendChild(tarjeta);
        });

        // Generar botones de paginación si hay más de 1 página
        if (totalPaginas > 1) {
            renderizarControlesPaginacion(totalPaginas);
        }
    }

    // =========================================================
    // --- 5. CONTROLES DE PAGINACIÓN ---
    // =========================================================
    function renderizarControlesPaginacion(totalPaginas) {
        // Botón Anterior
        const btnAnterior = document.createElement('button');
        btnAnterior.className = 'btn-paginacion';
        btnAnterior.innerText = '← Anterior';
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.onclick = () => {
            paginaActual--;
            renderizarTarjetas();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio suavemente
        };

        // Texto de información
        const info = document.createElement('span');
        info.className = 'paginacion-info';
        info.innerText = `Página ${paginaActual} de ${totalPaginas}`;

        // Botón Siguiente
        const btnSiguiente = document.createElement('button');
        btnSiguiente.className = 'btn-paginacion';
        btnSiguiente.innerText = 'Siguiente →';
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.onclick = () => {
            paginaActual++;
            renderizarTarjetas();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio suavemente
        };

        contenedorPaginacion.appendChild(btnAnterior);
        contenedorPaginacion.appendChild(info);
        contenedorPaginacion.appendChild(btnSiguiente);
    }

    // =========================================================
    // --- 6. LÓGICA DE BÚSQUEDA Y FILTROS ---
    // =========================================================
    function aplicarFiltros() {
        const textoBusqueda = inputBusqueda.value.toLowerCase();
        const botonActivo = document.querySelector('.btn-filtro.activo');
        const idiomaFiltro = botonActivo ? botonActivo.dataset.idioma : 'todos';

        palabrasFiltradas = lexicoCompleto.filter(palabra => {
            const coincideTexto = 
                (palabra.palabra_espanol && palabra.palabra_espanol.toLowerCase().includes(textoBusqueda)) ||
                (palabra.transliteracion && palabra.transliteracion.toLowerCase().includes(textoBusqueda)) ||
                (palabra.original && palabra.original.toLowerCase().includes(textoBusqueda)) ||
                (palabra.definicion_corta && palabra.definicion_corta.toLowerCase().includes(textoBusqueda)) ||
                (palabra.perla_espiritual && palabra.perla_espiritual.toLowerCase().includes(textoBusqueda));

            const coincideIdioma = idiomaFiltro === 'todos' || palabra.idioma.toLowerCase() === idiomaFiltro.toLowerCase();

            return coincideTexto && coincideIdioma;
        });

        // Al filtrar o buscar, siempre regresamos a la página 1
        paginaActual = 1; 
        renderizarTarjetas();
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', aplicarFiltros);
    }

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            aplicarFiltros();
        });
    });

    // Inicializar
    cargarLexico();
});
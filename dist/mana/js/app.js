document.addEventListener('DOMContentLoaded', async () => {

    // --- CONFIGURACIÓN ---
    const URL_INDICE = '../data/indices/indice_mana.json';
    const URL_BASE = '../data/mana/';
    
    // Nombres de meses exactos como en tu JSON
    const MESES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // ESTADO GLOBAL
    let state = {
        fecha: new Date(),
        testamentoActivo: 'antiguo', // 'antiguo' o 'nuevo'
        datosDia: [] // Aquí guardamos LOS DOS devocionales del día
    };

    // DOM ELEMENTS
    const displayFecha = document.getElementById('current-date-display');
    const heroImage = document.getElementById('hero-image');
    
    // UI Textos
    const uiTema = document.getElementById('dev-tema');
    const uiTitulo = document.getElementById('dev-titulo');
    const uiCita = document.getElementById('dev-cita');
    const uiMensaje = document.getElementById('dev-mensaje');
    const uiGrid = document.getElementById('dev-explicacion');

    // UI Botones
    const btnAt = document.getElementById('btn-at');
    const btnNt = document.getElementById('btn-nt');

    // --- FUNCIONES ---

    function formatearFechaKey(date) {
        const dia = date.getDate();
        const mesIndex = date.getMonth();
        return `${dia} de ${MESES[mesIndex]}`;
    }

    // CARGAR DATOS (Busca en el índice y descarga los JSONs)
    async function cargarDia(date) {
        const keyFecha = formatearFechaKey(date);
        displayFecha.innerText = keyFecha;
        
        // Reset UI visual
        heroImage.style.opacity = 0.5;
        uiTitulo.innerText = "Cargando...";

        try {
            // 1. Cargar Índice
            const resIndice = await fetch(URL_INDICE);
            const indice = await resIndice.json();

            // 2. Buscar entrada en el índice (Ahora es un Array)
            const metaDatosArray = indice[keyFecha]; 

            if (!metaDatosArray || metaDatosArray.length === 0) {
                mostrarVacio(keyFecha);
                return;
            }

            console.log(`📅 Fecha: ${keyFecha} | Encontrados: ${metaDatosArray.length} devocionales`);

            // 3. Descargar los devocionales reales
            // Puede que uno esté en 'pentateuco.json' y otro en 'evangelios.json'
            // Usamos Promise.all para bajarlos rápido
            const promesas = metaDatosArray.map(async (meta) => {
                const resGrupo = await fetch(`${URL_BASE}${meta.grupo}.json`);
                const datosGrupo = await resGrupo.json();
                return datosGrupo.find(d => d.id === meta.id);
            });

            const resultados = await Promise.all(promesas);
            
            // Guardamos en estado global (filtramos nulos por si acaso)
            state.datosDia = resultados.filter(d => d);

            // 4. Renderizar el testamento activo
            renderizarTestamentoActual();

        } catch (error) {
            console.error(error);
            uiTitulo.innerText = "Error";
            uiMensaje.innerText = "No se pudo conectar con Códice.";
        } finally {
            heroImage.style.opacity = 1;
        }
    }

    // RENDERIZAR SEGÚN ESTADO
    function renderizarTestamentoActual() {
        // Buscar el devocional correcto en lo que descargamos
        const devocional = state.datosDia.find(d => d.testamento === state.testamentoActivo);

        // Actualizar estado de botones (Tabs)
        if (state.testamentoActivo === 'antiguo') {
            btnAt.classList.add('active');
            btnNt.classList.remove('active');
        } else {
            btnAt.classList.remove('active');
            btnNt.classList.add('active');
        }

        if (devocional) {
            pintarUI(devocional);
        } else {
            // Si hoy solo hay Antiguo pero el usuario pidió Nuevo (o viceversa)
            uiTitulo.innerText = "Lectura no disponible";
            uiMensaje.innerText = `No hay lectura del ${state.testamentoActivo === 'antiguo' ? 'Antiguo' : 'Nuevo'} Testamento para hoy.`;
            uiCita.innerText = "";
            uiGrid.innerHTML = "";
            heroImage.style.backgroundImage = "none";
        }
    }

    function pintarUI(data) {
        uiTema.innerText = data.tema || "Devocional";
        uiTitulo.innerText = data.titulo;
        
        // --- IMAGEN ---
        if (data.imagen) {
            // Corrección de rutas inteligente
            let rutaFinal = data.imagen;
            if (rutaFinal.startsWith('/')) rutaFinal = '..' + rutaFinal; 
            else if (!rutaFinal.startsWith('../')) rutaFinal = '../' + rutaFinal;
            
            // Limpieza de dobles barras
            rutaFinal = rutaFinal.replace('//', '/');

            heroImage.style.backgroundImage = `url('${rutaFinal}')`;
        } else {
            heroImage.style.backgroundImage = "linear-gradient(to right, #0f172a, #334155)";
        }

        // --- REFERENCIA BÍBLICA (LÓGICA INTELIGENTE) ---
        if (data.referencia_biblica) {
            const ref = data.referencia_biblica;

            // CASO 1: Es un rango de versículos (Ej: Lucas 1:57-80)
            if (ref.versiculo_inicio && ref.versiculo_fin) {
                uiCita.innerText = `${ref.libro} ${ref.inicio}:${ref.versiculo_inicio}-${ref.versiculo_fin}`;
            } 
            // CASO 2: Es un rango de capítulos (Ej: Génesis 1-3)
            else if (ref.fin) {
                uiCita.innerText = `${ref.libro} ${ref.inicio}-${ref.fin}`;
            } 
            // CASO 3: Es un solo capítulo completo (Ej: Salmos 23)
            else {
                uiCita.innerText = `${ref.libro} ${ref.inicio}`;
            }
        }

        uiMensaje.innerText = data.mensaje;

        // --- PUNTOS DE EXPLICACIÓN ---
        uiGrid.innerHTML = '';
        if (data.explicacion) {
            data.explicacion.forEach(punto => {
                const card = document.createElement('div');
                card.className = 'point-card';
                card.innerHTML = `
                    <h3 class="point-title">${punto.titulo}</h3>
                    <p>${punto.texto}</p>
                   <p class="divine-intro">Lo que Dios te dice hoy:</p>
                    <p style="margin-top:0.5rem; font-style:italic; color:#f8fafc; border-left:2px solid #334155; padding-left:10px;">
                        ${punto.mensaje}
                    </p>
                `;
                uiGrid.appendChild(card);
            });
        }

        // --- 🔥 NUEVO: BOTONES DE COMPARTIR ---
        const shareContainer = document.getElementById('share-container');
        if (shareContainer) {
            // 1. Generar HTML
            shareContainer.innerHTML = `
                <h3 class="share-title">COMPARTIR ESTE ESTUDIO</h3>
                <div class="share-actions">

                    <button id="btn-nota-mana" class="btn-share" style="background-color: #d4b483; color: #0f172a;" aria-label="Crear Nota">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>

                    <button id="btn-wa" class="btn-share wa" aria-label="WhatsApp">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                    <button id="btn-fb" class="btn-share fb" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </button>
                    <button id="btn-copy" class="btn-share copy" aria-label="Copiar Link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>`;


                const btnNota = document.getElementById('btn-nota-mana');
                if (btnNota) {
                    btnNota.onclick = () => {
                        console.log(data);
                        const titulo = `Devocional del ${data.fecha}`;
                        const cuerpo = `Estudiando a ${data.titulo} en Maná Visual.\nTexto clave: "${data.mensaje }"\n\nLo que aprendí:\n`;
                        
                         const url = `../notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
                        window.open(url, '_blank');
                     };
                }

            // 2. Preparar Datos
            const currentUrl = window.location.href; // Captura la URL actual
            // Creamos un texto bonito para compartir
            const textoShare = `🍞 *Maná: Alimento Diario* \n\nHoy estuve meditando en: *${data.titulo}*.\n"${data.mensaje}"\n\nLee el devocional completo aquí: `;

            // 3. Activar Eventos
            document.getElementById('btn-wa').onclick = () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(textoShare + " " + currentUrl)}`, '_blank');
            };

            document.getElementById('btn-fb').onclick = () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
            };

            document.getElementById('btn-copy').onclick = function() {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    // Feedback visual temporal
                    const originalIcon = this.innerHTML;
                    this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`; // Check mark
                    setTimeout(() => {



                        this.innerHTML = originalIcon;
                    }, 2000);
                });
            };
        }
    }

    function mostrarVacio(fecha) {
        uiTitulo.innerText = "Descanso";
        uiMensaje.innerText = `No hay lecturas programadas para el ${fecha}.`;
        state.datosDia = [];
    }

    // --- EVENTOS ---
    
    // Botones de Navegación Fecha
    document.getElementById('btn-prev').addEventListener('click', () => {
        state.fecha.setDate(state.fecha.getDate() - 1);
        cargarDia(state.fecha);
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        state.fecha.setDate(state.fecha.getDate() + 1);
        cargarDia(state.fecha);
    });

    // Exponer función global para los botones onclick del HTML
    window.cambiarTestamento = function(tipo) {
        state.testamentoActivo = tipo;
        renderizarTestamentoActual();
    };

    // ... (Tu código existente) ...

    // --- LÓGICA DEL MENÚ ECOSISTEMA ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');

    if (btnLauncher && ecoMenu) {
        // Abrir / Cerrar al click
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el click se propague al documento
            ecoMenu.classList.toggle('active');
            
            // Efecto visual extra al hacer click
            btnLauncher.style.transform = ecoMenu.classList.contains('active') 
                ? 'rotate(90deg)' 
                : 'rotate(0deg)';
        });

        // Cerrar si hago click fuera del menú
        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
                btnLauncher.style.transform = 'rotate(0deg)'; // Regresa a su posición
            }
        });
    }

    // ... (Tu código existente de compartir y menús) ...

    // --- LÓGICA DEL LIGHTBOX (VISOR DE IMAGEN) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnCerrarLightbox = document.getElementById('btn-cerrar-lightbox');

    if (heroImage && lightbox) {
        
        // 1. ABRIR: Al hacer clic en la imagen grande
        heroImage.addEventListener('click', () => {
            // Truco: Obtenemos la URL del background-image
            const estilo = window.getComputedStyle(heroImage);
            const bgImage = estilo.backgroundImage; // Devuelve algo como: url(".../img/foto.webp")

            // Limpiamos la cadena para obtener solo la URL limpia
            // Quitamos 'url("' al principio y '")' al final
            const urlLimpia = bgImage.slice(4, -1).replace(/"/g, "");

            // Si no hay imagen (es un degradado), no abrimos nada
            if (urlLimpia.includes('linear-gradient') || urlLimpia === 'none') return;

            lightboxImg.src = urlLimpia;
            
            // Mostrar
            lightbox.classList.remove('hidden');
            setTimeout(() => lightbox.classList.add('active'), 10);
        });

        // 2. CERRAR
        const cerrar = () => {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        };

        btnCerrarLightbox.addEventListener('click', cerrar);
        
        // Cerrar con click fuera o ESC
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) cerrar();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && lightbox.classList.contains('active')) cerrar();
        });
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

    // --- INICIO ---
    cargarDia(state.fecha);
});
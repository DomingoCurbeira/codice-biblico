// Ajustamos las URLs para subir DOS niveles hasta la raíz del proyecto
const URL_INDICE = '../../data/indices/indice_personajes.json';
const URL_BASE_DATOS = '../../data/personajes/';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        cargarPerfil(id);
    } else {
        console.log("Esperando carga masiva o selección de ID.");
    }
});

async function cargarPerfil(id) {
    try {
        const resIndice = await fetch(URL_INDICE);
        if (!resIndice.ok) throw new Error("No se pudo cargar el índice de personajes.");
        const indice = await resIndice.json();

        // 1. En este índice, el "grupo" (archivo) se obtiene directamente por la llave ID
        const nombreArchivo = indice[id]; 
        
        if (!nombreArchivo) {
            throw new Error(`El personaje "${id}" no existe en el índice.`);
        }

        console.log(`🔍 Buscando en el grupo: ${nombreArchivo}.json`);

        // 2. Cargamos el archivo del grupo correspondiente
        const resGrupo = await fetch(`${URL_BASE_DATOS}${nombreArchivo}.json`);
        if (!resGrupo.ok) throw new Error(`No se encontró el archivo de datos: ${nombreArchivo}.json`);
        
        const datosGrupo = await resGrupo.json();

        // 3. Buscamos al personaje específico dentro del array del archivo
        const personaje = datosGrupo.find(p => p.id === id);
        
        if (personaje) {
            renderizarPerfil(personaje);
        } else {
            throw new Error(`El ID "${id}" no está dentro del archivo ${nombreArchivo}.json`);
        }

    } catch (e) {
        console.error("❌ Error:", e);
        document.getElementById('master-container').innerHTML = `
            <div style="color:white; text-align:center; padding:50px; font-family:sans-serif;">
                <h2 style="color:var(--gold);">⚠️ Fallo de Sincronización</h2>
                <p>${e.message}</p>
                <small style="opacity:0.5;">Verifica que el archivo existas en: data/huellas/${indice[id]}.json</small>
            </div>`;
    }
}

function renderizarPerfil(h) {
    const container = document.getElementById('master-container');
    const selectedTheme = document.getElementById('theme-selector').value;
    
    // Limpiamos y creamos la página
    container.innerHTML = "";
    const div = document.createElement('div');
    div.className = `page-a4 ${selectedTheme === 'papel' ? 'print-mode-light' : ''}`;
    
    // Inyectamos la estructura épica
    div.innerHTML = generarContenidoInterno(h);
    container.appendChild(div);
}

function generarContenidoInterno(h) {
    const fixPath = (url) => url.replace('/img/', '../../img/');
    
    // Aptitudes (Fortalezas)
    const aptitudesHTML = h.analisis_profundo.fortalezas
        .map(f => `<li class="skill-item"><span>✔</span> ${f}</li>`).join('');

    // Experiencia (Línea de tiempo)
    const experienciaHTML = h.linea_tiempo.map(item => `
        <div class="exp-card">
            <div class="exp-dot"></div>
            <div class="exp-info">
                <h4>${item.fase}</h4>
                <h5>${item.referencia}</h5>
                <p>${item.evento}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="page-a4">
            <div class="linkedin-banner"></div>
            
            <header class="profile-header">
                <div class="avatar-container">
                    <div class="avatar-circle" style="background-image: url('${fixPath(h.perfil.imagen)}')"></div>
                </div>
                <div class="profile-main-info">
                    <h1>${h.perfil.nombre}</h1>
                    <p class="headline">${h.perfil.titulo_corto} | ${h.perfil.ocupacion}</p>
                    <p class="location">${h.contexto.era_biblica} • ${h.perfil.significado_nombre}</p>
                </div>
            </header>

            <main class="profile-body">
                <section class="profile-section">
                    <p class="about-text">${h.narrativa.resumen_epico}</p>
                    <div class="leccion-clave-box">
                        <strong>Lección Clave:</strong> ${h.aplicacion_personal.leccion_clave}
                    </div>
                </section>

                <div class="profile-grid">
                    <section class="profile-section col-left">
                        <h3>Experiencia Histórica</h3>
                        <div class="timeline">
                            ${experienciaHTML}
                        </div>
                    </section>

                    <aside class="col-right">
                        <section class="profile-section">
                            <h3>Aptitudes Destacadas</h3>
                            <ul class="skills-list">${aptitudesHTML}</ul>
                        </section>
                        
                        <section class="profile-section">
                            <h3>Simbología</h3>
                            ${h.analisis_profundo.simbologia.map(s => `
                                <div class="simbolo-mini">
                                    <strong>${s.objeto}:</strong> <span>${s.significado}</span>
                                </div>
                            `).join('')}
                        </section>
                    </aside>
                </div>
            </main>

            <footer class="profile-footer">
                <p>Perfil generado por Códice Bíblico • Tu Ecosistema Espiritual</p>
            </footer>
        </div>
    `;
}

// Funciones para los botones del panel
function changeTheme(theme) {
    const pages = document.querySelectorAll('.page-a4');
    pages.forEach(p => theme === 'papel' ? p.classList.add('print-mode-light') : p.classList.remove('print-mode-light'));
}

function imprimirConNombre() {
    const h1 = document.querySelector('h1');
    const nombre = h1 ? h1.innerText : "Perfil";
    // Cambiamos el título para el "Guardar como"
    document.title = `Perfil_${nombre.replace(/\s+/g, '_')}`;
    window.print();
}

async function generarLoteCompleto() {
    const container = document.getElementById('master-container');
    const selectedTheme = document.getElementById('theme-selector').value;
    
    // 1. Limpiamos el contenedor y ponemos un mensaje de carga
    container.innerHTML = `
        <div style="color:var(--gold); text-align:center; padding:100px; font-family:'Cinzel', serif;">
            <h2>📜 Forjando el Códice Completo...</h2>
            <p style="color:white;">Esto puede tardar unos segundos dependiendo de la cantidad de personajes.</p>
        </div>`;

    try {
        // 2. Cargamos el índice (el objeto plano que me pasaste)
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();
        
        container.innerHTML = ""; // Limpiamos para empezar a inyectar hojas

        // 3. Recorremos el índice (cada llave es un ID de personaje)
        for (const id in indice) {
            const nombreArchivo = indice[id];
            
            try {
                // Cargamos el archivo del grupo
                const resGrupo = await fetch(`${URL_BASE_DATOS}${nombreArchivo}.json`);
                if (!resGrupo.ok) continue; // Si un archivo falta, saltamos al siguiente
                
                const datosGrupo = await resGrupo.json();
                const personaje = datosGrupo.find(p => p.id === id);
                
                if (personaje) {
                    // Creamos la hoja con el estilo LinkedIn
                    const div = document.createElement('div');
                    div.className = `page-a4 ${selectedTheme === 'papel' ? 'print-mode-light' : ''}`;
                    div.innerHTML = generarContenidoInterno(personaje);
                    container.appendChild(div);
                }
            } catch (err) {
                console.warn(`No se pudo cargar el personaje: ${id}`, err);
            }
        }

        console.log("✅ ¡Lote Completo Cargado!");
        
        // Opcional: Auto-scroll al inicio para que veas el resultado
        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Fallo masivo:", err);
        container.innerHTML = `<div class="error">Error al cargar el lote: ${err.message}</div>`;
    }
}
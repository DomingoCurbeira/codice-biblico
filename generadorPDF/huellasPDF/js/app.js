// Actualizamos a los nombres reales de tus archivos
const URL_INDICE = '../../data/indices/indice_personajes.json';
const URL_DATA_BASE = '../../data/personajes/'; 

function generarHTML(p) {
    const fixPath = (url) => url ? url.replace('../', '../../').replace('/img/', '../../img/') : '';
    
    // Extraer simbología (primeros 2 objetos)
    const simbolos = p.analisis_profundo?.simbologia || [];
    const fortalezas = p.analisis_profundo?.fortalezas || [];

    return `
        <div class="pdf-page">
            <div class="cv-container">
                <header class="cv-header">
                    <div class="profile-img" style="background-image: url('${fixPath(p.perfil.imagen)}')"></div>
                    <div class="header-info">
                        <span style="font-size: 0.7rem; letter-spacing: 2px; opacity: 0.8;">CÓDICE BÍBLICO MASTER v3.0</span>
                        <h1>${p.perfil.nombre}</h1>
                        <h2>${p.perfil.titulo_corto}</h2>
                        <div class="meta-chips">
                            <span class="chip">📍 ${p.contexto.era_biblica}</span>
                            <span class="chip">📖 ${p.contexto.testamento} Testamento</span>
                            <span class="chip">🛠️ ${p.perfil.ocupacion}</span>
                        </div>
                    </div>
                </header>

                <div class="cv-body">
                    <div class="main-col">
                        <section>
                            <div class="section-title">Resumen Épico</div>
                            <p class="resumen-text">${p.narrativa.resumen_epico}</p>
                        </section>

                        <section>
                            <div class="section-title">Análisis Emocional y Perfil</div>
                            <p class="resumen-text" style="font-style: italic;">${p.analisis_profundo.perfil_emocional}</p>
                        </section>

                        <section>
                            <div class="section-title">Lección Clave del Reino</div>
                            <div class="lesson-box">
                                "${p.aplicacion_personal.leccion_clave}"
                            </div>
                        </section>
                        
                        <section>
                            <div class="section-title">Dato Curioso (Escriba)</div>
                            <p class="resumen-text" style="font-size: 0.8rem; color: #555;">${p.narrativa.dato_curioso}</p>
                        </section>
                    </div>

                    <div class="side-col">
                        <section>
                            <div class="section-title">Fortalezas</div>
                            <ul class="item-list">
                                ${fortalezas.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </section>

                        <section>
                            <div class="section-title">Simbología</div>
                            ${simbolos.map(s => `
                                <div class="symbol-box">
                                    <strong>${s.objeto}</strong>
                                    <p>${s.significado}</p>
                                </div>
                            `).join('')}
                        </section>

                        <section>
                            <div class="section-title">Entorno y Alianzas</div>
                            <div style="font-size: 0.75rem; line-height: 1.4;">
                                <strong>Aliado:</strong> ${p.perfil.familia.aliado_principal}<br>
                                <strong>Discípulo:</strong> ${p.perfil.familia.discipulo}<br>
                                <strong>Origen:</strong> ${p.perfil.familia.origen}
                            </div>
                        </section>

                        <section style="margin-top: auto;">
                            <div class="section-title">Apariciones</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                ${p.contexto.libros_aparicion.map(libro => `<span class="chip" style="color: #666; border: 1px solid #ccc; background: none;">${libro}</span>`).join('')}
                            </div>
                        </section>
                    </div>
                </div>

                <footer>
                    Codice Bíblico — Tu Ecosistema Espiritual | XP: ${p.gamificacion.xp_lectura} | Logro: ${p.gamificacion.logro_id}
                </footer>
            </div>
        </div>
    `;
}

async function vistaPrevia() {
    const status = document.getElementById('status');
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('preview-content');
    
    status.innerText = "Analizando mapa de personajes...";
    try {
        const res = await fetch(URL_INDICE);
        const dataIndex = await res.json(); // Esto es el objeto { aaron: '...', ... }

        // Convertimos las llaves del objeto en un arreglo para tomar el primero
        const llaves = Object.keys(dataIndex);
        
        if (llaves.length === 0) throw new Error("El índice está vacío.");

        // Tomamos el primer ID y su archivo correspondiente
        const primerID = llaves[0];
        const archivoFuente = dataIndex[primerID];

        status.innerText = `Cargando ${primerID} desde ${archivoFuente}.json...`;

        // Cargamos el archivo de datos (añadiendo .json si no lo tiene)
        const nombreArchivo = archivoFuente.endsWith('.json') ? archivoFuente : `${archivoFuente}.json`;
        const resData = await fetch(`${URL_DATA_BASE}${nombreArchivo}`);
        const personajes = await resData.json();

        // Buscamos el personaje por ID
        const p = personajes.find(item => item.id.toLowerCase() === primerID.toLowerCase());

        if (p) {
            previewContent.innerHTML = generarHTML(p);
            previewContainer.style.display = 'block';
            status.innerText = "Muestra de Huellas lista.";
        } else {
            throw new Error(`No se encontró el contenido de ${primerID}`);
        }
    } catch (e) {
        status.innerText = "❌ Error: " + e.message;
        console.error(e);
    }
}

async function iniciarMasivo() {
    const status = document.getElementById('status');
    const renderArea = document.getElementById('render-area');
    
    try {
        const res = await fetch(URL_INDICE);
        const dataIndex = await res.json();
        const llaves = Object.keys(dataIndex);

        if(!confirm(`¿Descargar los ${llaves.length} archivos de Huellas?`)) return;

        for (const id of llaves) {
            const archivoFuente = dataIndex[id];
            status.innerText = `Procesando: ${id}...`;

            const nombreArchivo = archivoFuente.endsWith('.json') ? archivoFuente : `${archivoFuente}.json`;
            const resData = await fetch(`${URL_DATA_BASE}${nombreArchivo}`);
            const personajes = await resData.json();
            
            const p = personajes.find(item => item.id.toLowerCase() === id.toLowerCase());

            if (p) {
                renderArea.innerHTML = generarHTML(p);
                await new Promise(r => setTimeout(r, 400));

                const opt = {
                    margin: 0,
                    filename: `Huella_${id}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, width: 794, height: 1122 },
                    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
                };

                const element = renderArea.querySelector('.pdf-page');
                await html2pdf().set(opt).from(element).save();
                await new Promise(r => setTimeout(r, 600));
            }
        }
        status.innerText = "✅ ¡Imprenta de Huellas completada!";
    } catch (e) {
        status.innerText = "❌ Error en la descarga masiva.";
    }
}
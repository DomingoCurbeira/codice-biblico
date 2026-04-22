const URL_INDICE = '../../data/indices/indice_estudios.json';
const URL_DATA = '../../data/estudios/tematicos.json';

function generarHTML(e) {
    // Filtramos el contenido para dejar solo lo más potente
    const contenidoFiltrado = e.contenido.filter(bloque => 
        ['intro', 'subtitulo', 'parrafo', 'destacado'].includes(bloque.tipo) && 
        bloque.texto !== "Reflexión Personal"
    );

    const contenidoHTML = contenidoFiltrado.map(bloque => {
        console.log(bloque)
        switch (bloque.tipo) {
            
            case 'intro': 
            case 'parrafo': return `<p class="parrafo-estudio">${bloque.texto}</p>`;
            case 'subtitulo': return `<h3 class="subtitulo-estudio">${bloque.texto}</h3>`;
           
            case 'destacado': return `<div class="destacado-estudio">${bloque.texto}
            
            </div>`;
            default: return '';
        }
    }).join('');
console.log(e)
    return `
        <div class="pdf-page">
            <header class="study-header">
                <h1>${e.titulo}</h1>
                <h2>${e.subtitulo}</h2>
                <div class="study-meta">
                    <span>✍️ ${e.autor}</span>
                    <span>⏱️ ${e.tiempo_lectura}</span>
                    <span>📍 ESTUDIO TEMÁTICO</span>
                </div>
            </header>

            <div class="key-verse">
                <p>"${e.versiculo_clave.texto}"</p>
                <span>— ${e.versiculo_clave.cita}</span>
            </div>

            <div class="content-body">
                ${contenidoHTML}
            </div>
    
            

            <footer>
                <span>Códice Bíblico </span>
                <span>Fecha: ${e.fecha_programada}</span>
                
            </footer>
        </div>
    `;
}

async function vistaPrevia() {
    const status = document.getElementById('status');
    const preview = document.getElementById('preview-content');
    
    status.innerText = "Preparando la Quintaesencia...";
    try {
        const res = await fetch(URL_DATA);
        const estudios = await res.json();
        // Buscamos el de la Quintaesencia o el primero
        const estudio = estudios.find(item => item.id === "quintaesencia-amor-sustancia") || estudios[0];
        
        preview.innerHTML = generarHTML(estudio);
        document.getElementById('preview-container').style.display = 'block';
        status.innerText = "Enseñanza lista para revisión.";
    } catch (e) {
        status.innerText = "❌ Error cargando enseñanza.";
    }
}

async function iniciarMasivo() {
    const status = document.getElementById('status');
    const renderArea = document.getElementById('render-area');
    
    try {
        status.innerText = "Accediendo al mapa de enseñanzas...";
        const resIndex = await fetch(URL_INDICE);
        if (!resIndex.ok) throw new Error("No se encontró indice_estudios.json");
        
        const dataIndex = await resIndex.json(); // Esto es el objeto { "id": "tematicos", ... }
        
        // --- CORRECCIÓN CLAVE: Convertimos el objeto en una lista de IDs ---
        const llaves = Object.keys(dataIndex);

        if(!confirm(`¿Deseas exportar las ${llaves.length} enseñanzas a PDF?`)) return;

        // Cargamos el archivo de datos temáticos completo
        const resData = await fetch(URL_DATA);
        const estudios = await resData.json();

        // Ahora iteramos sobre las llaves del objeto
        for (const idBusqueda of llaves) {
            status.innerText = `Maquetando: ${idBusqueda}...`;

            // Buscamos el contenido completo en tematicos.json por el ID (la llave)
            const estudioCompleto = estudios.find(e => e.id === idBusqueda);

            if (estudioCompleto) {
                renderArea.innerHTML = generarHTML(estudioCompleto);
                
                // Pausa técnica para asegurar el renderizado en el M4
                await new Promise(r => setTimeout(r, 800));

                const opt = {
                    margin: 0,
                    filename: `Estudio_${idBusqueda}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, width: 794, height: 1122 },
                    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
                };

                const element = renderArea.querySelector('.pdf-page');
                await html2pdf().set(opt).from(element).save();
                
                // Respiro para el sistema de descargas
                await new Promise(r => setTimeout(r, 1000));
            } else {
                console.warn(`⚠️ No se halló el contenido para: ${idBusqueda}`);
            }
        }
        status.innerText = "✅ ¡Lote de enseñanzas completado con éxito!";
    } catch (e) {
        status.innerText = "❌ Error: " + e.message;
        console.error("Detalle técnico:", e);
    }
}
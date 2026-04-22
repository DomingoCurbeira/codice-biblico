const URL_INDICE = '../../data/indices/indice_lexico.json';
const URL_DATA_BASE = '../../data/etymos/lexico.json';

function generarHTMLPagina(cuarteto) {
    const cardsHTML = cuarteto.map(p => {
        return `
            <div class="etymos-card">
                <header>
                    <span class="lang-tag">${p.idioma}</span>
                    <h1 class="word-main">${p.palabra_espanol}</h1>
                    <div class="original-script">${p.original} <span style="font-size:0.7rem; color:#999;">(${p.transliteracion})</span></div>
                </header>

                <span class="section-label">Raíz y Definición</span>
                <p class="content-text"><strong>${p.raiz}</strong> ${p.definicion_corta}</p>

                <span class="section-label">Contexto Cultural</span>
                <p class="content-text">${p.contexto_cultural}</p>

                <div class="perla-etymos">
                    <strong>PERLA:</strong> "${p.perla_spiritual}"
                </div>

                <div class="footer-card">
                    <span>${p.ejemplo_biblico}</span>
                    <span>#${p.id}</span>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="pdf-page">${cardsHTML}</div>`;
}

async function vistaPrevia() {
    const status = document.getElementById('status');
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('preview-content');
    
    status.innerText = "Sincronizando raíces por ID...";
    try {
        const resIndex = await fetch(URL_INDICE);
        const dataIndex = await resIndex.json(); 
        
        // Obtenemos las llaves (IDs como 'aaron-he')
        const llaves = Object.keys(dataIndex);
        const primerCuarteto = llaves.slice(0, 4);
        const grupoDatos = [];

        for (const id of primerCuarteto) {
            // El nombre del archivo es el ID + .json
            // const nombreArchivo = `${id}.json`;
            const rutaFinal = `${URL_DATA_BASE}`;
            console.log(`Buscando ingrediente: ${rutaFinal}`);
            
            try {
                const resData = await fetch(rutaFinal);
                console.log(resData)
                
                
                // Verificamos que sea un JSON válido y no un error HTML
                if (!resData.ok || resData.headers.get("content-type").includes("text/html")) {
                    console.warn(`⚠️ No se encontró el archivo: ${nombreArchivo}`);
                    continue;
                }

                const palabras = await resData.json();
                
                // Buscamos la palabra dentro del array que devuelve el JSON
                const p = palabras.find(item => item.id === id);
                
                if (p) {
                    grupoDatos.push(p);
                } else {
                    console.warn(`❌ ID ${id} no hallado dentro de ${nombreArchivo}`);
                }

            } catch (err) {
                console.error(`Error procesando ${id}:`, err);
            }
        }

        if (grupoDatos.length > 0) {
            previewContent.innerHTML = generarHTMLPagina(grupoDatos);
            previewContainer.style.display = 'block';
            status.innerText = "¡Página 1 de Etymos emplatada con éxito!";
        } else {
            throw new Error("No se pudo cargar ningún JSON. Verifica que los archivos .json se llamen igual que los IDs del índice.");
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
        const resIndex = await fetch(URL_INDICE);
        const dataIndex = await resIndex.json();
        const llaves = Object.keys(dataIndex);

        if(!confirm(`¿Iniciar la impresión de ${llaves.length} términos?`)) return;

        for (let i = 0; i < llaves.length; i += 4) {
            const grupoLlaves = llaves.slice(i, i + 4);
            const grupoDatos = [];

            for (const id of grupoLlaves) {
                // CORRECCIÓN: Buscamos por ID.json
                // const nombreArchivo = `${id}.json`;
                
                try {
                    const resData = await fetch(`${URL_DATA_BASE}`);
                    if (!resData.ok) continue;
                    
                    const palabras = await resData.json();
                    const p = palabras.find(item => item.id === id);
                    if (p) grupoDatos.push(p);
                } catch (err) {
                    console.error(`Error cargando ${id}:`, err);
                }
            }

            if (grupoDatos.length === 0) continue;

            status.innerText = `Horneando página ${Math.floor(i/4) + 1}...`;
            renderArea.innerHTML = generarHTMLPagina(grupoDatos);
            
            await new Promise(r => setTimeout(r, 500));

            const opt = {
                margin: 0,
                filename: `Etymos_Pagina_${Math.floor(i/4) + 1}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, width: 794, height: 1122 },
                jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
            };

            const element = renderArea.querySelector('.pdf-page');
            await html2pdf().set(opt).from(element).save();
            await new Promise(r => setTimeout(r, 600));
        }
        status.innerText = "✅ ¡Diccionario completo descargado!";
    } catch (e) {
        status.innerText = "❌ Error en la generación masiva.";
    }
}
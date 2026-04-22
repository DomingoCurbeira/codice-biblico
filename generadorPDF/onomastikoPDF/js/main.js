const URL_INDICE = '../../data/indices/indice_onomastiko.json';
const URL_DATA_BASE = '../../data/onomastiko/';

function generarHTML(p) {
    const fixPath = (url) => url ? url.replace('../', '../../') : '';
    
    return `
        <div class="pdf-page">
            <div class="ficha-onomastiko">
                <header>
                    <span class="brand">CÓDICE BÍBLICO — ONOMASTIKO</span>
                    <h1 class="nombre-p">${p.perfil_card.nombre_principal}</h1>
                    <div class="significado">"${p.datos_identidad.significado_core}"</div>
                </header>

                <main class="dual-concept">
                    <div class="glass-card">
                        <div class="image-frame" style="background-image: url('${fixPath(p.config_tarjeta?.avatar_url || p.fases?.inicial?.avatar)}')">
                            <div class="label-badge">EL ORIGEN</div>
                        </div>
                        <h3>${p.perfil_card.subtitulo_rol}</h3>
                        <p>${p.perfil_card.bio_resumen}</p>
                    </div>

                    <div class="glass-card">
                        <div class="image-frame" style="background-image: url('${fixPath(p.fases?.nueva?.avatar)}')">
                            <div class="label-badge gold-badge">LA REVELACIÓN</div>
                        </div>
                        <h3>${p.fases.nueva.titulo}</h3>
                        <p>${p.fases.nueva.bio}</p>
                    </div>
                </main>

                <section class="common-footer">
                    <div class="achievement-banner">
                        <span class="achievement-title">LOGRO DESTACADO</span>
                        <div class="achievement-text">"${p.perfil_card.logro_destacado || 'Hito de fe no registrado.'}"</div>
                    </div>

                    <div class="perla-box">
                        "${p.datos_identidad.perla_profunda}"
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.75rem; color: #64748b; font-weight: bold;">
                        <span>ETYMOS: ${p.fases?.nueva?.etymos_id || 'N/A'}</span>
                        <span>IDIOMA: ${p.datos_identidad?.original_idioma?.toUpperCase() || 'BÍBLICO'}</span>
                        <span>SISTEMA: V.04-2026</span>
                    </div>
                </section>

                <footer>Tu Ecosistema Espiritual — Documento Oficial de Identidad</footer>
            </div>
        </div>
    `;
}

async function vistaPrevia() {
    const status = document.getElementById('status');
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('preview-content');
    
    status.innerText = "Cocinando muestra...";
    try {
        const res = await fetch(URL_INDICE);
        const index = await res.json();
        const ref = index.identidades[0];

        const resData = await fetch(`${URL_DATA_BASE}${ref.archivo_fuente}`);
        const data = await resData.json();
        const p = data.find(i => i.id === ref.id);

        previewContent.innerHTML = generarHTML(p);
        previewContainer.style.display = 'block';
        status.innerText = "Vista previa lista. Revisa el emplatado.";
    } catch (e) {
        status.innerText = "Error: Revisa las rutas de los JSON.";
    }
}

async function iniciarMasivo() {
    const status = document.getElementById('status');
    const renderArea = document.getElementById('render-area');
    
    try {
        const resIndex = await fetch(URL_INDICE);
        const index = await resIndex.json();
        const identidades = index.identidades;

        if(!confirm(`¿Iniciar impresión de ${identidades.length} personajes?`)) return;

        for (const ref of identidades) {
            status.innerText = `Imprimiendo: ${ref.id}...`;
            const resData = await fetch(`${URL_DATA_BASE}${ref.archivo_fuente}`);
            const data = await resData.json();
            const p = data.find(i => i.id === ref.id);

            if (p) {
                renderArea.innerHTML = generarHTML(p);
                await new Promise(r => setTimeout(r, 400)); // Espera a imágenes

                const opt = {
                    margin: 0,
                    filename: `Onomastiko_${p.perfil_card.nombre_principal.replace(/\s+/g, '_')}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, width: 794, height: 1122 },
                    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
                };

                const element = renderArea.querySelector('.pdf-page');
                await html2pdf().set(opt).from(element).save();
                await new Promise(r => setTimeout(r, 600));
            }
        }
        status.innerText = "¡Misión cumplida! Toda la biblioteca descargada.";
    } catch (e) {
        status.innerText = "Error en la descarga masiva.";
    }
}
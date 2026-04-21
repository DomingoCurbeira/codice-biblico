document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        prepararImprenta(id);
    } else {
        console.log("Esperando acción del usuario.");
    }
});

async function prepararImprenta(id) {
    try {
        const resIndex = await fetch('../../data/indices/indice_onomastiko.json');
        const index = await resIndex.json();
        
        // En Onomastiko, el índice suele ser un array llamado 'identidades'
        const ref = index.identidades.find(i => i.id === id);
        if (!ref) throw new Error(`ID ${id} no encontrado en el índice.`);

        const resData = await fetch(`../../data/onomastiko/${ref.archivo_fuente}`);
        const dataList = await resData.json();
        const p = dataList.find(item => item.id === id);

        if (p) {
            renderizarEnContenedor(p);
        } else {
            throw new Error("Datos no hallados dentro del JSON.");
        }
    } catch (err) {
        console.error("❌ Fallo en Onomastiko:", err);
    }
}

function renderizarEnContenedor(p) {
    const container = document.getElementById('master-container');
    if (!container) return;
    
    const selectedTheme = document.getElementById('theme-selector').value;
    
    // Creamos la página y le inyectamos los datos con validación
    const div = document.createElement('div');
    div.className = `page-a4 ${selectedTheme === 'papel' ? 'print-mode-light' : ''}`;
    div.id = "documento"; 
    
    div.innerHTML = generarHTMLHoja(p);
    container.innerHTML = ""; // Limpiamos lo anterior
    container.appendChild(div);
}

function generarHTMLHoja(p) {
    const fixPath = (url) => url ? url.replace('../', '../../') : '';
    
    // VALIDACIÓN DE DATOS (Para evitar que salga "Subtítulo" o "Bio...")
    const nombre = p.perfil_card?.nombre_principal || "Nombre no definido";
    const significado = p.datos_identidad?.significado_core || "Significado pendiente";
    
    // FASE ORIGEN
    const imgIni = fixPath(p.config_tarjeta?.avatar_url || p.fases?.inicial?.avatar);
    const subIni = p.perfil_card?.subtitulo_rol || "Origen";
    const bioIni = p.perfil_card?.bio_resumen || "Relato inicial no disponible";

    // FASE REVELACIÓN
    const imgNva = fixPath(p.fases?.nueva?.avatar);
    const subNva = p.fases?.nueva?.titulo || "Revelación";
    const bioNva = p.fases?.nueva?.bio || "Relato de transformación no disponible";

    return `
        <div class="aura"></div>
        <header class="main-header">
            <span class="brand">CÓDICE BÍBLICO</span>
            <h1>${nombre}</h1>
            <p class="motto">${significado}</p>
        </header>

        <main class="dual-concept">
            <div class="glass-card left-wing">
                <div class="image-frame">
                    <div class="hero-img" style="background-image: url('${imgIni}')"></div>
                    <div class="label-badge">EL ORIGEN</div>
                </div>
                <h2>${subIni}</h2>
                <p>${bioIni}</p>
            </div>

            <div class="glass-card right-wing">
                <div class="image-frame">
                    <div class="hero-img" style="background-image: url('${imgNva}')"></div>
                    <div class="label-badge gold-badge">LA REVELACIÓN</div>
                </div>
                <h2>${subNva}</h2>
                <p>${bioNva}</p>
            </div>
        </main>

        <section class="identity-footer">
            <div class="tech-row">
                <div class="tech-item"><strong>IDIOMA:</strong> ${p.datos_identidad?.original_idioma || 'S/N'}</div>
                <div class="tech-item"><strong>TRANSLITERACIÓN:</strong> ${p.datos_identidad?.transliteracion || 'S/N'}</div>
                <div class="tech-item"><strong>ETYMOS:</strong> ${p.fases?.nueva?.etymos_id?.toUpperCase() || 'S/N'}</div>
            </div>
            <div class="perla-box">
                <p>${p.datos_identidad?.perla_profunda || 'Perla no disponible.'}</p>
            </div>
        </section>

        <footer>
            <div class="footer-line"></div>
            <p>Material exclusivo de Códice Bíblico - Tu Ecosistema Espiritual</p>
        </footer>
    `;
}

// Botones de lote e impresión
async function generarLoteCompleto() {
    const container = document.getElementById('master-container');
    const selectedTheme = document.getElementById('theme-selector').value;
    container.innerHTML = "<div style='color:var(--gold); text-align:center; padding:100px;'>⚙️ Procesando Onomastiko...</div>";

    try {
        const resIndex = await fetch('../../data/indices/indice_onomastiko.json');
        const index = await resIndex.json();
        container.innerHTML = ""; 

        for (const ref of index.identidades) {
            const resData = await fetch(`../../data/onomastiko/${ref.archivo_fuente}`);
            const dataList = await resData.json();
            const p = dataList.find(item => item.id === ref.id);
            
            if (p) {
                const div = document.createElement('div');
                div.className = `page-a4 ${selectedTheme === 'papel' ? 'print-mode-light' : ''}`;
                div.id = "documento";
                div.innerHTML = generarHTMLHoja(p);
                container.appendChild(div);
            }
        }
    } catch (err) { console.error(err); }
}

function changeTheme(theme) {
    const pages = document.querySelectorAll('.page-a4');
    pages.forEach(p => theme === 'papel' ? p.classList.add('print-mode-light') : p.classList.remove('print-mode-light'));
}

function imprimirConNombre() {
    const h1 = document.querySelector('h1');
    const nombre = h1 ? h1.innerText : "Onomastiko";
    document.title = `Onomastiko_${nombre.replace(/\s+/g, '_')}`;
    window.print();
}
const URL_INDICE = '/data/indices/indice_mana.json';
const URL_BASE = '../data/mana/';

async function cargarLectura() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('lectura-content');

    try {
        // 1. Buscamos en el índice en qué archivo está este ID
        const resIndice = await fetch(URL_INDICE);
        const indice = await resIndice.json();

        // Buscamos el registro que coincida con el ID dentro de los valores del índice
        let infoArchivo = null;
        for (const dia in indice) {
            const registro = indice[dia].find(r => r.id == id);
            if (registro) {
                infoArchivo = registro;
                break;
            }
        }

        if (!infoArchivo) throw new Error("Lectura no encontrada");

        // 2. Cargamos el archivo específico (ej. mateo.json)
        const resData = await fetch(`${URL_BASE}${infoArchivo.grupo}.json`);
        const data = await resData.json();
        const devocional = data.find(d => d.id == id);

        renderVistaEpica(devocional, container);

    } catch (e) {
        container.innerHTML = `<p style="text-align:center; color:var(--gold); margin-top:50px;">Error al abrir el Códice.</p>`;
    }
}

const nombreDesarrollador = "Domingo Curbeira"; // <--- ¡PON TU NOMBRE AQUÍ!
    const year = new Date().getFullYear();

function renderVistaEpica(obj, container) {
    
    container.innerHTML = `
        <article class="hero-lectura">
            <div class="bg-title-fade">${obj.referencia_biblica.libro}</div>
            <h1 class="main-title">${obj.titulo}</h1>
            <p class="tema-subtitle">${obj.tema}</p>
        </article>

        <section class="mensaje-central">
            <p>${obj.mensaje}</p>
        </section>

        <section class="perlas-grid">
            ${obj.explicacion.map(perla => `
                <div class="perla-card">
                    <h3>${perla.titulo}</h3>
                    <p class="perla-contexto">${perla.texto}</p>
                    <div class="perla-revelacion">
                        <span>💎</span> ${perla.mensaje}
                    </div>
                </div>
            `).join('')}
        </section>
        
         <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; text-align: center;">
            <div class="footer-content">
                <a href="../index.html" class="footer-brand" style="text-decoration: none; color: #060606; display: inline-block; margin-bottom: 5px; cursor: pointer;">
                    <span style="font-size: 1.1em;">📜</span> Códice Bíblico
                </a>
                
                <p class="footer-dev" style="color: #64748b; margin: 0;">
                    Desarrollado por <span style="color:#d4b483">${nombreDesarrollador}</span>
                </p>
                <p class="footer-year" style="color:#475569; margin: 0; font-size: 0.7rem;">© ${year}</p>
            </div>
        </footer>
    `;

configurarBotonesCompartir(obj)
    
}

function configurarBotonesCompartir(obj) {
    const urlLink = window.location.href;
    const textoCompartir = `📖 Maná Visual: ${obj.titulo} - "${obj.tema}"\n\nLee este estudio aquí: `;
    
    console.log(obj)
    // WhatsApp
    document.getElementById('btn-wa').onclick = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoCompartir + urlLink)}`, '_blank');
    };
    
    // Facebook
    document.getElementById('btn-fb').onclick = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlLink)}`, '_blank');
    };
    
    // Copiar Enlace
    document.getElementById('btn-copy').onclick = (e) => {
        navigator.clipboard.writeText(urlLink);
        const btn = e.currentTarget;
        btn.style.color = "#4ade80"; // Verde éxito
        setTimeout(() => btn.style.color = "", 2000);
    };
    
   

const btnNota = document.getElementById('btn-nota-mana');

if (btnNota) {
    btnNota.onclick = () => {
        const titulo = `Provisión: ${obj.titulo}`;
        const cuerpo = `Estuve meditando en "Maná Visual" sobre ${obj.tema}.\n\nMensaje: "${obj.mensaje}"\n\nMis reflexiones:\n`;

        // USAMOS RUTA ABSOLUTA: Esto evita errores de navegación entre carpetas
        const baseUrl = window.location.origin; // Esto detecta si estás en 127.0.0.1 o en Netlify
        const urlFinal = `${baseUrl}/notas/index.html?titulo=${encodeURIComponent(titulo)}&cuerpo=${encodeURIComponent(cuerpo)}`;
        
        console.log("Navegando a Escriba:", urlFinal);
        window.location.href = urlFinal;
    };
}

    
}

cargarLectura();
let identidadesGlobal = [];

// 1. Definición del Orden Jerárquico (Peso de las secciones)
const ORDEN_SECCIONES = {
    "pentateuco.json": 1,
    "historicos.json": 2,
    "poeticos.json": 3,
    "profetas.json": 4,
    "evangelios.json": 5,
    "apostolicos.json": 6
};

const COLORES_SECCION = {
    "pentateuco.json": "#10b981", // Verde
    "historicos.json": "#f59e0b",  // Ámbar
    "poeticos.json": "#8b5cf6",    // Violeta
    "profetas.json": "#ef4444",    // Rojo
    "evangelios.json": "#3b82f6",  // Azul
    "apostolicos.json": "#64748b"  // Gris/Indigo
};

// 2. Inicialización de Datos
async function initOnomastiko() {
    try {
        const response = await fetch('../data/indices/indice_onomastiko.json');
        const data = await response.json();
        
        // Aplicamos el ORDEN JERÁRQUICO antes de guardar en el global
        identidadesGlobal = data.identidades.sort((a, b) => {
            const pesoA = ORDEN_SECCIONES[a.archivo_fuente] || 99;
            const pesoB = ORDEN_SECCIONES[b.archivo_fuente] || 99;
            return pesoA - pesoB;
        });
        
        renderAlphabet();
        renderGrid(identidadesGlobal);
    } catch (err) {
        document.getElementById('main-grid').innerHTML = 
            `<div class="error" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                ⚠️ Error sintonizando identidades: ${err.message}
            </div>`;
    }
}

// 3. Render de Cuadrícula (Versión Única y Optimizada)
function renderGrid(lista) {
    const grid = document.getElementById('main-grid');
    
    if (!lista || lista.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #94a3b8;">No se hallaron registros en este cuadrante.</div>';
        return;
    }

    grid.innerHTML = lista.map(item => {
        const colorBorder = COLORES_SECCION[item.archivo_fuente] || "#d4b483";

        return `
        <article class="mini-card" 
                 onclick="openDetails('${item.id}')" 
                 style="border-left: 5px solid ${colorBorder}">
            <img src="../${item.imagen}" alt="${item.nombre}" style="border-color: ${colorBorder}">
            <div class="mini-card-info">
                <h3 style="margin:0; color:${colorBorder}; font-size:1.1rem;">${item.nombre}</h3>
                <p style="margin:5px 0 0; font-size:0.8rem; color:#94a3b8;">${item.subtitulo}</p>
            </div>
        </article>
        `;
    }).join('');
}

// 4. Buscador en Tiempo Real (Mantiene el orden jerárquico al filtrar)
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = identidadesGlobal.filter(p => 
        p.nombre.toLowerCase().includes(query) || 
        p.subtitulo.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    renderGrid(filtered);
});

// 5. Navegación Alfabética
function renderAlphabet() {
    const container = document.getElementById('alphabet-container');
    if (!container) return;
    
    const abc = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
    container.innerHTML = abc.map(l => `
        <button class="letter-btn" onclick="filterByLetter('${l}', this)">${l}</button>
    `).join('');
}

function filterByLetter(letter, btn) {
    const active = document.querySelector('.letter-btn.active');
    if (active) active.classList.remove('active');
    btn.classList.add('active');

    // Filtramos manteniendo el orden de la sección
    const filtered = identidadesGlobal.filter(p => p.nombre.startsWith(letter));
    renderGrid(filtered);
}

// 6. Navegación a Detalle
function openDetails(id) {
    window.location.href = `nombre.html?id=${id}`;
}

// 7. Launcher Logic (Eco-Menu)
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

// Arrancar App
initOnomastiko();
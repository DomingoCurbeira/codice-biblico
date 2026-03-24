const fs = require('fs');
const path = require('path');

// --- RUTAS ---
const ORIGEN = 'cronos/data/libros.json';
const DESTINO_DIR = 'codice/data/lugares';
const DESTINO_INDICE = 'codice/data/indices/indice_lugares.json';

// --- EL CEREBRO DE LA CLASIFICACIÓN ---
// Asignamos cada ID a su carpeta teológica correcta
const CLASIFICACION = {
    // PENTATEUCO
    'genesis': 'pentateuco', 'exodo': 'pentateuco', 'levitico': 'pentateuco',
    'numeros': 'pentateuco', 'deuteronomio': 'pentateuco',

    // HISTÓRICOS
    'josue': 'historicos', 'jueces': 'historicos', 'rut': 'historicos',
    '1samuel': 'historicos', '2samuel': 'historicos', '1reyes': 'historicos',
    '2reyes': 'historicos', '1cronicas': 'historicos', '2cronicas': 'historicos',
    'esdras': 'historicos', 'nehemias': 'historicos', 'ester': 'historicos',

    // POÉTICOS
    'job': 'poeticos', 'salmos': 'poeticos', 'proverbios': 'poeticos',
    'eclesiastes': 'poeticos', 'cantares': 'poeticos',

    // PROFETAS MAYORES (Incluye Lamentaciones por tradición)
    'isaias': 'profetas_mayores', 'jeremias': 'profetas_mayores',
    'lamentaciones': 'profetas_mayores', 'ezequiel': 'profetas_mayores',
    'daniel': 'profetas_mayores',

    // PROFETAS MENORES
    'oseas': 'profetas_menores', 'joel': 'profetas_menores', 'amos': 'profetas_menores',
    'abdias': 'profetas_menores', 'jonas': 'profetas_menores', 'miqueas': 'profetas_menores',
    'nahum': 'profetas_menores', 'habacuc': 'profetas_menores', 'sofonias': 'profetas_menores',
    'hageo': 'profetas_menores', 'zacarias': 'profetas_menores', 'malaquias': 'profetas_menores',

    // EVANGELIOS
    'mateo': 'evangelios', 'marcos': 'evangelios', 'lucas': 'evangelios', 'juan': 'evangelios',

    // HECHOS Y EPÍSTOLAS (Nuevo Testamento Restante)
    'hechos': 'hechos_epistolas', 'romanos': 'hechos_epistolas',
    '1_corintios': 'hechos_epistolas', '2_corintios': 'hechos_epistolas',
    'galatas': 'hechos_epistolas', 'efesios': 'hechos_epistolas',
    'filipenses': 'hechos_epistolas', 'colosenses': 'hechos_epistolas',
    '1_tesalonicenses': 'hechos_epistolas', '2_tesalonicenses': 'hechos_epistolas',
    '1_timoteo': 'hechos_epistolas', '2_timoteo': 'hechos_epistolas',
    'tito': 'hechos_epistolas', 'filemon': 'hechos_epistolas',
    'hebreos': 'hechos_epistolas', 'santiago': 'hechos_epistolas',
    '1_pedro': 'hechos_epistolas', '2_pedro': 'hechos_epistolas',
    '1_juan': 'hechos_epistolas', // Cubre las 3 cartas según tu ID
    'judas': 'hechos_epistolas', 'apocalipsis': 'hechos_epistolas'
};

function migrarCronos() {
    console.log('🌍 INICIANDO MIGRACIÓN DE MAPAS (CRONOS)...');

    if (!fs.existsSync(ORIGEN)) {
        console.error('❌ No encuentro cronos/data/libros.json');
        return;
    }

    const raw = fs.readFileSync(ORIGEN);
    const data = JSON.parse(raw);
    // Aseguramos que sea un array
    const libros = Array.isArray(data) ? data : (data.libros || []);

    const grupos = {};
    const indice = {};

    // Crear carpetas
    fs.mkdirSync(DESTINO_DIR, { recursive: true });
    
    // Procesar libros
    libros.forEach(libro => {
        const id = libro.id;
        const grupo = CLASIFICACION[id] || 'otros'; // Si alguno falla, va a 'otros'

        if (!grupos[grupo]) grupos[grupo] = [];
        
        // Añadimos el libro al grupo
        grupos[grupo].push(libro);
        
        // Añadimos al índice
        indice[id] = grupo;
    });

    // Escribir Archivos de Grupo
    Object.keys(grupos).forEach(g => {
        fs.writeFileSync(path.join(DESTINO_DIR, `${g}.json`), JSON.stringify(grupos[g], null, 2));
        console.log(`   ✅ Generado: ${g}.json`);
    });

    // Escribir Índice
    // Aseguramos que la carpeta indices exista (por si acaso no corriste la de personajes)
    fs.mkdirSync(path.dirname(DESTINO_INDICE), { recursive: true });
    fs.writeFileSync(DESTINO_INDICE, JSON.stringify(indice, null, 2));
    
    console.log(`   🗺️  Índice de Lugares creado exitosamente.`);
    console.log('\n✨ MIGRACIÓN CRONOS FINALIZADA ✨');
}

migrarCronos();
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
// ⚠️ ASEGÚRATE DE QUE ESTA RUTA SEA CORRECTA EN TU ORDENADOR
const ORIGEN_DIR = 'mana/data/meses'; 
const DESTINO_DIR = 'codice/data/mana';
const DESTINO_INDICE = 'codice/data/indices/indice_mana.json';

// Diccionario Teológico (Clasificación por Libros)
const CLASIFICACION = {
    // PENTATEUCO
    'Génesis': 'pentateuco', 'Éxodo': 'pentateuco', 'Levítico': 'pentateuco',
    'Números': 'pentateuco', 'Deuteronomio': 'pentateuco',

    // HISTÓRICOS
    'Josué': 'historicos', 'Jueces': 'historicos', 'Rut': 'historicos',
    '1 Samuel': 'historicos', '2 Samuel': 'historicos', '1 Reyes': 'historicos',
    '2 Reyes': 'historicos', '1 Crónicas': 'historicos', '2 Crónicas': 'historicos',
    'Esdras': 'historicos', 'Nehemías': 'historicos', 'Ester': 'historicos',

    // POÉTICOS
    'Job': 'poeticos', 'Salmos': 'poeticos', 'Proverbios': 'poeticos',
    'Eclesiastés': 'poeticos', 'Cantares': 'poeticos',

    // PROFETAS MAYORES
    'Isaías': 'profetas_mayores', 'Jeremías': 'profetas_mayores',
    'Lamentaciones': 'profetas_mayores', 'Ezequiel': 'profetas_mayores',
    'Daniel': 'profetas_mayores',

    // PROFETAS MENORES
    'Oseas': 'profetas_menores', 'Joel': 'profetas_menores', 'Amós': 'profetas_menores',
    'Abdías': 'profetas_menores', 'Jonás': 'profetas_menores', 'Miqueas': 'profetas_menores',
    'Nahúm': 'profetas_menores', 'Habacuc': 'profetas_menores', 'Sofonías': 'profetas_menores',
    'Hageo': 'profetas_menores', 'Zacarías': 'profetas_menores', 'Malaquías': 'profetas_menores',

    // EVANGELIOS
    'Mateo': 'evangelios', 'Marcos': 'evangelios', 'Lucas': 'evangelios', 'Juan': 'evangelios',

    // HECHOS
    'Hechos': 'hechos',

    // EPÍSTOLAS Y REVELACIÓN
    'Romanos': 'epistolas', '1 Corintios': 'epistolas', '2 Corintios': 'epistolas',
    'Gálatas': 'epistolas', 'Efesios': 'epistolas', 'Filipenses': 'epistolas',
    'Colosenses': 'epistolas', '1 Tesalonicenses': 'epistolas', '2 Tesalonicenses': 'epistolas',
    '1 Timoteo': 'epistolas', '2 Timoteo': 'epistolas', 'Tito': 'epistolas', 'Filemón': 'epistolas',
    'Hebreos': 'epistolas', 'Santiago': 'epistolas', '1 Pedro': 'epistolas', '2 Pedro': 'epistolas',
    '1 Juan': 'epistolas', '2 Juan': 'epistolas', '3 Juan': 'epistolas', 'Judas': 'epistolas',
    'Apocalipsis': 'epistolas' 
};

function migrarMana() {
    console.log('🥖 INICIANDO MIGRACIÓN DE MANÁ (MESES -> BLOQUES)...');

    if (!fs.existsSync(ORIGEN_DIR)) {
        console.error(`❌ No encuentro la carpeta origen: ${ORIGEN_DIR}`);
        console.error('   Por favor, verifica que la carpeta "mana/data/meses" existe.');
        return;
    }

    // 1. Leer todos los archivos de meses y juntarlos
    const archivos = fs.readdirSync(ORIGEN_DIR).filter(f => f.endsWith('.json'));
    let todosLosDevocionales = [];

    archivos.forEach(archivo => {
        const ruta = path.join(ORIGEN_DIR, archivo);
        try {
            const raw = fs.readFileSync(ruta, 'utf8');
            const data = JSON.parse(raw);
            // Soportar array directo o estructura { devocionales: [...] }
            const lista = Array.isArray(data) ? data : (data.devocionales || []);
            todosLosDevocionales = todosLosDevocionales.concat(lista);
            console.log(`   📂 Leído: ${archivo} (${lista.length} items)`);
        } catch (e) {
            console.error(`   ⚠️ Error leyendo ${archivo}: ${e.message}`);
        }
    });

    console.log(`   ⚡ Total procesados: ${todosLosDevocionales.length} devocionales.`);

    // 2. Clasificar y Generar Índice
    const grupos = {};
    const indice = {}; 

    // Asegurar que existan carpetas destino
    fs.mkdirSync(DESTINO_DIR, { recursive: true });
    fs.mkdirSync(path.dirname(DESTINO_INDICE), { recursive: true });

    todosLosDevocionales.forEach(dev => {
        // Validar datos mínimos
        const libro = dev.referencia_biblica?.libro;
        const fecha = dev.fecha; // ej: "1 de Enero"
        const id = dev.id;

        if (!libro || !fecha) return;

        // A) Determinar a qué bloque pertenece (Pentateuco, Evangelios, etc.)
        const grupo = CLASIFICACION[libro] || 'otros';

        // B) Guardar el devocional completo en su archivo de bloque
        if (!grupos[grupo]) grupos[grupo] = [];
        grupos[grupo].push(dev);

        // C) Guardar la referencia en el índice (Calendario)
        // IMPORTANTE: Ahora usamos un ARRAY para permitir múltiples lecturas por día
        if (!indice[fecha]) {
            indice[fecha] = [];
        }

        indice[fecha].push({
            grupo: grupo,          // Dónde buscar el archivo (ej: 'pentateuco')
            id: id,                // Cuál es el ID único
            testamento: dev.testamento || 'antiguo' // Para saber si es AT o NT
        });
    });

    // 3. Escribir Archivos de Grupo (pentateuco.json, etc.)
    Object.keys(grupos).forEach(nombreGrupo => {
        const rutaArchivo = path.join(DESTINO_DIR, `${nombreGrupo}.json`);
        fs.writeFileSync(rutaArchivo, JSON.stringify(grupos[nombreGrupo], null, 2));
        console.log(`   ✅ Generado: ${nombreGrupo}.json`);
    });

    // 4. Escribir Índice Calendario
    fs.writeFileSync(DESTINO_INDICE, JSON.stringify(indice, null, 2));
    
    console.log(`   📅 Índice Calendario creado: indice_mana.json`);
    console.log('\n✨ MIGRACIÓN MANÁ FINALIZADA CON ÉXITO ✨');
}

// Ejecutar script
migrarMana();
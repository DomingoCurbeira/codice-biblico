const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
// Aquí le decimos qué archivo leer y dónde guardar los resultados
const TAREAS = [
    {
        origen: 'huellas/data/personajes_para_editar.json', // Tu archivo editado con los grupos
        destinoDir: 'codice/data/personajes',   // Donde se guardarán los archivos divididos
        destinoIndice: 'codice/data/indices',   // Donde se guardará el índice
        nombreIndice: 'indice_personajes.json', // Nombre del archivo índice
        campoID: 'id',                          // El campo único (ej: "adan")
        campoGrupo: 'grupo'                     // La etiqueta que acabas de poner
    }
    // En el futuro puedes agregar aquí lugares.json o estudios.json
];

// --- FUNCIÓN MAESTRA ---
function ejecutarMigracion() {
    console.log('🚀 INICIANDO MIGRACIÓN AUTOMATIZADA DE CÓDICE...');

    TAREAS.forEach(tarea => {
        // 1. Verificar si el archivo origen existe
        if (!fs.existsSync(tarea.origen)) {
            console.error(`❌ Error: No encuentro el archivo origen en: ${tarea.origen}`);
            return;
        }

        console.log(`\n📂 Procesando: ${tarea.origen}...`);
        
        // 2. Leer el archivo JSON original
        const rawData = fs.readFileSync(tarea.origen);
        let data;
        try {
            data = JSON.parse(rawData);
            // Si tu JSON empieza con { "personajes": [...] }, ajusta esto.
            // Si es un array directo [ ... ], lo dejamos así.
            if (!Array.isArray(data) && data.personajes) data = data.personajes;
        } catch (e) {
            console.error(`❌ Error leyendo JSON: ${e.message}`);
            return;
        }

        // 3. Preparar objetos para la división
        const grupos = {};      // Aquí guardaremos los arrays separados (patriarcas: [], monarquia: []...)
        const indice = {};      // Aquí guardaremos el mapa (adan: "patriarcas")

        // 4. Asegurar que las carpetas destino existan
        fs.mkdirSync(tarea.destinoDir, { recursive: true });
        fs.mkdirSync(tarea.destinoIndice, { recursive: true });

        // 5. Bucle principal: Clasificar cada item
        data.forEach(item => {
            const id = item[tarea.campoID];
            // Si se te olvidó poner grupo a alguno, lo mandamos a "sin_categoria"
            const grupo = item[tarea.campoGrupo] || 'sin_categoria';

            if (!id) return; // Ignorar items rotos sin ID

            // Agregar al grupo correspondiente
            if (!grupos[grupo]) grupos[grupo] = [];
            grupos[grupo].push(item);

            // Agregar al índice maestro
            indice[id] = grupo;
        });

        // 6. Escribir los archivos divididos (patriarcas.json, etc.)
        Object.keys(grupos).forEach(nombreGrupo => {
            const rutaArchivo = path.join(tarea.destinoDir, `${nombreGrupo}.json`);
            fs.writeFileSync(rutaArchivo, JSON.stringify(grupos[nombreGrupo], null, 2));
            console.log(`   ✅ Generado: ${nombreGrupo}.json (${grupos[nombreGrupo].length} items)`);
        });

        // 7. Escribir el archivo Índice
        const rutaIndice = path.join(tarea.destinoIndice, tarea.nombreIndice);
        fs.writeFileSync(rutaIndice, JSON.stringify(indice, null, 2));
        console.log(`   🗺️  Índice Maestro creado: ${tarea.nombreIndice}`);
    });

    console.log('\n✨ MIGRACIÓN COMPLETADA ✨');
}

// Ejecutar
ejecutarMigracion();
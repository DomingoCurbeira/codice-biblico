const fs = require('fs');
const path = require('path');

// ESTAMOS EN: codice/data/personajes
const DIR_ACTUAL = __dirname;
// VAMOS A: codice/data/indices/indice_personajes.json
const RUTA_INDICE = path.join(DIR_ACTUAL, '../indices/indice_personajes.json');

function regenerar() {
    console.log("🗺️  REGENERANDO ÍNDICE MAESTRO DESDE CERO...\n");

    const nuevoIndice = {};
    const archivos = fs.readdirSync(DIR_ACTUAL);
    let totalPersonajes = 0;
    let archivosProcesados = 0;

    // 1. ESCANEAR TODOS LOS JSONs DE LA CARPETA
    archivos.forEach(archivo => {
        // Ignorar scripts y archivos ocultos
        if (!archivo.endsWith('.json')) return;
        // Ignorar el propio sin_categoria si está vacío o quieres borrarlo
        // if (archivo === 'sin_categoria.json') return; 

        const nombreGrupo = path.basename(archivo, '.json'); // ej: "patriarcas"
        
        try {
            const rutaCompleta = path.join(DIR_ACTUAL, archivo);
            const contenido = fs.readFileSync(rutaCompleta, 'utf-8');
            const data = JSON.parse(contenido);

            // Algunos archivos tienen estructura { "personajes": [] } y otros son array directo []
            const lista = Array.isArray(data) ? data : (data.personajes || []);

            if (lista.length > 0) {
                console.log(`   📂 Procesando: ${archivo} (${lista.length} personajes)`);
                
                lista.forEach(p => {
                    if (p.id) {
                        // AQUÍ ESTÁ LA CLAVE: Asignamos el ID al nombre del archivo actual
                        nuevoIndice[p.id] = nombreGrupo;
                        totalPersonajes++;
                    }
                });
                archivosProcesados++;
            }

        } catch (err) {
            console.error(`   ❌ Error leyendo ${archivo}: ${err.message}`);
        }
    });

    // 2. GUARDAR EL NUEVO ÍNDICE
    try {
        // Asegurarnos que la carpeta indices existe
        const dirIndices = path.dirname(RUTA_INDICE);
        if (!fs.existsSync(dirIndices)) fs.mkdirSync(dirIndices, { recursive: true });

        fs.writeFileSync(RUTA_INDICE, JSON.stringify(nuevoIndice, null, 2));
        
        console.log('\n---------------------------------------------------');
        console.log(`✅ ÍNDICE REGENERADO CON ÉXITO.`);
        console.log(`   - Archivos leídos: ${archivosProcesados}`);
        console.log(`   - Personajes indexados: ${totalPersonajes}`);
        console.log(`   - Ubicación: ${RUTA_INDICE}`);
        console.log('---------------------------------------------------');
        console.log("👉 Ahora recarga tu página web (Ctrl + F5). Deberían salir todos.");

    } catch (err) {
        console.error(`❌ Error guardando el índice: ${err.message}`);
    }
}

regenerar();
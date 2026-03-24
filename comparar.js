const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN DE RUTAS ---
const rutaArchivo1 = path.join(__dirname, 'data', 'personajes','patriarcas.json');
const rutaArchivo2 = path.join(__dirname, 'data','personajes', 'sin_categoria.json');

// --- FUNCIÓN PRINCIPAL ---
function compararArchivos() {
    console.log("🔍 Iniciando comparación...\n");

    try {
        // 1. Leer y parsear los archivos
        if (!fs.existsSync(rutaArchivo1)) throw new Error(`No encuentro el archivo: ${rutaArchivo1}`);
        if (!fs.existsSync(rutaArchivo2)) throw new Error(`No encuentro el archivo: ${rutaArchivo2}`);

        const datos1 = JSON.parse(fs.readFileSync(rutaArchivo1, 'utf-8'));
        const datos2 = JSON.parse(fs.readFileSync(rutaArchivo2, 'utf-8'));

        console.log(`📂 Archivo 1 (Patriarcas): ${datos1.length} registros`);
        console.log(`📂 Archivo 2 (Sin Categoría): ${datos2.length} registros`);
        console.log('---------------------------------------------------');

        // 2. Extraer los IDs para comparar
        const ids1 = new Set(datos1.map(item => item.id));
        const ids2 = new Set(datos2.map(item => item.id));

        // 3. Buscar diferencias
        const soloEn1 = datos1.filter(item => !ids2.has(item.id));
        const soloEn2 = datos2.filter(item => !ids1.has(item.id));

        // 4. Mostrar Resultados
        if (soloEn1.length === 0 && soloEn2.length === 0) {
            console.log("\n✅ ¡ÉXITO! Ambos archivos contienen exactamente los mismos registros (por ID).");
        } else {
            console.log("\n⚠️  SE ENCONTRARON DIFERENCIAS:\n");

            if (soloEn1.length > 0) {
                console.log(`🔴 Registros que están en 'patriarcas.json' pero NO en 'sin_categoria.json' (${soloEn1.length}):`);
                soloEn1.forEach(item => console.log(`   - [${item.id}] ${item.titulo || item.nombre || 'Sin título'}`));
            }

            if (soloEn2.length > 0) {
                console.log(`\n🔵 Registros que están en 'sin_categoria.json' pero NO en 'patriarcas.json' (${soloEn2.length}):`);
                soloEn2.forEach(item => console.log(`   - [${item.id}] ${item.titulo || item.nombre || 'Sin título'}`));
            }
        }

        // 5. Comparación profunda (opcional: si quieres saber si el CONTENIDO cambió)
        // Descomenta esto si también quieres ver si los datos internos son diferentes
        /*
        console.log('\n---------------------------------------------------');
        console.log("🔍 Verificando contenido exacto...");
        let diferenciasContenido = 0;
        datos1.forEach(d1 => {
            const d2 = datos2.find(item => item.id === d1.id);
            if (d2 && JSON.stringify(d1) !== JSON.stringify(d2)) {
                console.log(`📝 El registro [${d1.id}] existe en ambos pero tiene contenido diferente.`);
                diferenciasContenido++;
            }
        });
        if(diferenciasContenido === 0) console.log("✨ El contenido de los registros coincidentes es idéntico.");
        */

    } catch (error) {
        console.error("\n❌ Error fatal:", error.message);
    }
}

// Ejecutar
compararArchivos();
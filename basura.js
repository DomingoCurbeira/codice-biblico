const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const DIR_PERSONAJES = path.join(__dirname, '/data/personajes');
const ARCHIVO_SOSPECHOSO = 'sin_categoria.json';

function auditar() {
    console.log('🕵🏻‍♂️ INICIANDO AUDITORÍA DE DUPLICADOS...\n');

    const rutaSospechosa = path.join(DIR_PERSONAJES, ARCHIVO_SOSPECHOSO);
    
    // 1. Validar que exista el archivo sospechoso
    if (!fs.existsSync(rutaSospechosa)) {
        console.log(`✅ ¡Buenas noticias! No existe el archivo '${ARCHIVO_SOSPECHOSO}'. Tu carpeta está limpia.`);
        return;
    }

    // 2. Cargar los personajes "BUENOS" (de todos los archivos menos el sospechoso)
    const idsSeguros = new Set();
    const archivos = fs.readdirSync(DIR_PERSONAJES);

    console.log('📂 Cargando base de datos segura...');
    archivos.forEach(archivo => {
        if (archivo !== ARCHIVO_SOSPECHOSO && archivo.endsWith('.json')) {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(DIR_PERSONAJES, archivo)));
                const lista = Array.isArray(data) ? data : (data.personajes || []);
                lista.forEach(p => {
                    if (p.id) idsSeguros.add(p.id);
                });
                console.log(`   - Leído: ${archivo} (${lista.length} personajes)`);
            } catch (e) { console.error(`   ❌ Error leyendo ${archivo}`); }
        }
    });
    console.log(`\n🛡️  Total de personajes seguros: ${idsSeguros.size}`);

    // 3. Analizar el archivo SOSPECHOSO
    console.log(`\n🗑️  Analizando '${ARCHIVO_SOSPECHOSO}'...`);
    const dataBasura = JSON.parse(fs.readFileSync(rutaSospechosa));
    const listaBasura = Array.isArray(dataBasura) ? dataBasura : (dataBasura.personajes || []);

    const duplicados = [];
    const unicos = [];

    listaBasura.forEach(p => {
        if (!p.id) return;
        if (idsSeguros.has(p.id)) {
            duplicados.push(p.id);
        } else {
            unicos.push(p);
        }
    });

    // 4. RESULTADOS
    console.log('---------------------------------------------------');
    if (duplicados.length > 0) {
        console.log(`✅ CONFIRMADO: ${duplicados.length} personajes son DUPLICADOS (ya existen en otros archivos).`);
        console.log(`   (Ejemplos: ${duplicados.slice(0, 3).join(', ')}...)`);
        console.log('   -> Estos son seguros de borrar.');
    } else {
        console.log('   No se encontraron duplicados exactos por ID.');
    }

    if (unicos.length > 0) {
        console.log(`\n⚠️  ATENCIÓN: Se encontraron ${unicos.length} personajes ÚNICOS en sin_categoria.json:`);
        unicos.forEach(p => console.log(`   - [${p.id}] ${p.nombre} (Grupo sugerido: ${p.grupo || '???'})`));
        console.log('\n   -> ¡NO BORRES EL ARCHIVO AÚN! Estos personajes se perderían.');
        console.log('   -> Mueve estos personajes manualmente a su archivo correspondiente.');
    } else {
        console.log('\n✨ ¡EXCELENTE! Todos los personajes de sin_categoria.json ya están a salvo.');
        console.log('   -> Puedes borrar sin_categoria.json tranquilamente.');
        
        // Opcional: Borrado automático
        // fs.unlinkSync(rutaSospechosa);
        // console.log('   -> Archivo borrado automáticamente.');
    }
    console.log('---------------------------------------------------');
}

auditar();

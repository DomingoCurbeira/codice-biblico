const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN DE RUTAS ---
// Ajusta estas rutas según tu estructura exacta
const DIR_RAIZ = __dirname; 
const DIR_PERSONAJES = path.join(DIR_RAIZ, 'data/personajes');
const DIR_INDICES = path.join(DIR_RAIZ, 'data/indices');
const ARCHIVO_INDICE = 'indice_personajes.json';

// --- FUNCIÓN MAESTRA ---
function reorganizarBaseDeDatos() {
    console.log('🚀 INICIANDO REORGANIZACIÓN Y LIMPIEZA DE CÓDICE...\n');

    // 1. VALIDACIÓN INICIAL
    if (!fs.existsSync(DIR_PERSONAJES)) {
        console.error(`❌ Error: No encuentro la carpeta de personajes en: ${DIR_PERSONAJES}`);
        return;
    }

    // --- FASE 1: LECTURA Y DEDUPLICACIÓN (EN MEMORIA) ---
    console.log('📥 Leyendo archivos actuales...');
    
    // Usamos un MAP para evitar duplicados automáticamente. 
    // La clave será el ID. Si ya existe, se sobrescribe (actualiza).
    const mapaPersonajes = new Map(); 

    try {
        const archivos = fs.readdirSync(DIR_PERSONAJES);

        archivos.forEach(archivo => {
            if (path.extname(archivo) === '.json') {
                const rutaCompleta = path.join(DIR_PERSONAJES, archivo);
                const contenido = fs.readFileSync(rutaCompleta, 'utf-8');
                
                try {
                    const datos = JSON.parse(contenido);
                    
                    // Normalizar: si es un array lo usamos, si es objeto buscamos la propiedad
                    const lista = Array.isArray(datos) ? datos : (datos.personajes || []);

                    lista.forEach(p => {
                        if (p.id) {
                            // AQUÍ OCURRE LA MAGIA DE DEDUPLICACIÓN
                            if (mapaPersonajes.has(p.id)) {
                                console.warn(`   ⚠️  Duplicado detectado y unificado: [${p.id}] en ${archivo}`);
                            }
                            // Guardamos/Sobrescribimos en el mapa
                            mapaPersonajes.set(p.id, p);
                        }
                    });

                } catch (errJson) {
                    console.error(`   ❌ Error parseando ${archivo}: ${errJson.message}`);
                }
            }
        });

        console.log(`✅ Lectura completada. Total de personajes únicos recuperados: ${mapaPersonajes.size}`);

    } catch (err) {
        console.error(`❌ Error crítico leyendo directorio: ${err.message}`);
        return;
    }

    // --- FASE 2: REAGRUPACIÓN ---
    console.log('\n🔄 Reorganizando grupos...');
    
    const grupos = {};
    const indiceMaestro = {};

    for (const [id, personaje] of mapaPersonajes) {
        // Obtenemos el grupo (o 'sin_categoria' si falta)
        const nombreGrupo = personaje.grupo || 'sin_categoria';

        // Inicializar array del grupo si no existe
        if (!grupos[nombreGrupo]) {
            grupos[nombreGrupo] = [];
        }

        // Añadir personaje al grupo
        grupos[nombreGrupo].push(personaje);

        // Añadir al índice
        indiceMaestro[id] = nombreGrupo;
    }

    // --- FASE 3: ESCRITURA (DESTRUCTIVA Y CONSTRUCTIVA) ---
    console.log('\n💾 Escribiendo nueva estructura...');

    // A) LIMPIEZA: Borramos la carpeta vieja para que no queden archivos basura
    // (Solo lo hacemos porque ya tenemos todos los datos seguros en la variable 'grupos')
    try {
        fs.rmSync(DIR_PERSONAJES, { recursive: true, force: true });
        fs.mkdirSync(DIR_PERSONAJES, { recursive: true });
        fs.mkdirSync(DIR_INDICES, { recursive: true }); // Asegurar que indices existe
    } catch (e) {
        console.error(`❌ Error recreando carpetas: ${e.message}`);
        return;
    }

    // B) GUARDAR ARCHIVOS DE GRUPO
    const nombresGrupos = Object.keys(grupos);
    nombresGrupos.forEach(nombre => {
        const rutaArchivo = path.join(DIR_PERSONAJES, `${nombre}.json`);
        const dataJson = JSON.stringify(grupos[nombre], null, 2); // Formato bonito
        fs.writeFileSync(rutaArchivo, dataJson);
        console.log(`   📂 Creado: ${nombre}.json (${grupos[nombre].length} personajes)`);
    });

    // C) GUARDAR ÍNDICE MAESTRO
    const rutaIndice = path.join(DIR_INDICES, ARCHIVO_INDICE);
    fs.writeFileSync(rutaIndice, JSON.stringify(indiceMaestro, null, 2));
    console.log(`   🗺️  Índice actualizado en: ${ARCHIVO_INDICE}`);

    console.log('\n✨ PROCESO FINALIZADO CON ÉXITO ✨');
}

// Ejecutar
reorganizarBaseDeDatos();
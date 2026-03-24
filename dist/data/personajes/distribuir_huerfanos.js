const fs = require('fs');
const path = require('path');

// ESTAMOS DENTRO DE LA CARPETA PERSONAJES
const DIR_ACTUAL = __dirname;
const ARCHIVO_ORIGEN = 'sin_categoria.json';
const ARCHIVO_INDICE = '../indices/indice_personajes.json'; // Ajusta si la ruta es diferente

// --- 🗺️ EL MAPA DEL TESORO ---
// Aquí he clasificado tus 38 huérfanos manualmente:
const MAPA_DESTINOS = {
    // PATRIARCAS
    "jose_egipto": "patriarcas",
    "tamar_genesis": "patriarcas",
    "amigos_job": "patriarcas", // Van con Job

    // ÉXODO Y JUECES
    "hija_faraon": "exodo_jueces",
    "nadab_abiu": "exodo_jueces",
    "hijas_zelofehad": "exodo_jueces",
    "comandante_ejercito": "exodo_jueces", // Josué 5
    "adoni_zedec": "exodo_jueces",

    // MONARQUÍA
    "reina-saba": "monarquia",
    "viuda-sarepta": "monarquia",
    "la-sunamita": "monarquia",
    "ebed-melec": "monarquia",
    "tamar-david": "monarquia",
    "atalia": "monarquia",
    "hulda": "monarquia",
    "senaquerib": "monarquia",
    "itay-el-geteo": "monarquia",
    "benaia": "monarquia",
    "herodes_grande": "monarquia", // Contexto histórico/Mateo 2
    
    // PROFETAS
    "tres_hebreos": "profetas", // Daniel
    "gomer": "profetas", // Oseas

    // EVANGELIOS
    "juan_bautista": "evangelios",
    "juan_apostol": "evangelios",
    "felipe_apostol": "evangelios",
    "jacobo_menor": "evangelios",
    "simon_zelote": "evangelios",
    "judas_tadeo": "evangelios",
    "judas_iscariote": "evangelios",
    "maria_magdalena": "evangelios",
    "poncio_pilato": "evangelios",
    "jose_padre": "evangelios",
    "herodes-antipas": "evangelios",
    "simeon-ana": "evangelios", // Lucas 2

    // APOSTÓLICOS (HECHOS / CARTAS)
    "santiago_justo": "apostolicos",
    "priscila_aquila": "apostolicos",
    "juan_patmos": "apostolicos", // Apocalipsis
    "juan_marcos": "apostolicos",
    "herodes-agripa-ii": "apostolicos" // Hechos 25
};

async function distribuir() {
    console.log("🚚 INICIANDO MUDANZA AUTOMÁTICA...\n");

    const rutaOrigen = path.join(DIR_ACTUAL, ARCHIVO_ORIGEN);
    
    if (!fs.existsSync(rutaOrigen)) {
        console.error("❌ No encuentro sin_categoria.json");
        return;
    }

    // 1. LEER LOS HUÉRFANOS
    const rawData = fs.readFileSync(rutaOrigen);
    let huerfanos = JSON.parse(rawData);
    if (!Array.isArray(huerfanos)) huerfanos = huerfanos.personajes || [];

    // 2. PREPARAR CARGA DE ARCHIVOS DE DESTINO (Para no leer/escribir mil veces)
    const cacheArchivos = {}; // { "monarquia": [...], "patriarcas": [...] }
    const nuevosIndices = {}; // { "id": "grupo" }
    let movidos = 0;
    let ignorados = 0;

    // Función auxiliar para leer archivo si no está en caché
    function obtenerGrupo(nombreGrupo) {
        if (!cacheArchivos[nombreGrupo]) {
            const ruta = path.join(DIR_ACTUAL, `${nombreGrupo}.json`);
            if (fs.existsSync(ruta)) {
                cacheArchivos[nombreGrupo] = JSON.parse(fs.readFileSync(ruta));
            } else {
                cacheArchivos[nombreGrupo] = []; // Si no existe, lo creamos en memoria
            }
        }
        return cacheArchivos[nombreGrupo];
    }

    // 3. PROCESAR CADA HUÉRFANO
    huerfanos.forEach(p => {
        const id = p.id;
        const grupoDestino = MAPA_DESTINOS[id];

        if (grupoDestino) {
            // A) Asignar el grupo al objeto
            p.grupo = grupoDestino;
            
            // B) Añadirlo al array correspondiente en memoria
            const listaGrupo = obtenerGrupo(grupoDestino);
            
            // Evitar duplicados si ya existe en el destino
            const existe = listaGrupo.find(item => item.id === id);
            if (!existe) {
                listaGrupo.push(p);
                nuevosIndices[id] = grupoDestino;
                movidos++;
                console.log(`   ✅ ${p.nombre || id} -> ${grupoDestino}.json`);
            } else {
                console.log(`   ⚠️  ${id} ya existía en ${grupoDestino}.json (Ignorado)`);
            }
        } else {
            console.log(`   ❓ NO SÉ DÓNDE PONER A: [${id}] (Falta en el mapa)`);
            ignorados++;
        }
    });

    // 4. GUARDAR CAMBIOS EN LOS ARCHIVOS JSON
    console.log("\n💾 Guardando archivos actualizados...");
    Object.keys(cacheArchivos).forEach(grupo => {
        const ruta = path.join(DIR_ACTUAL, `${grupo}.json`);
        fs.writeFileSync(ruta, JSON.stringify(cacheArchivos[grupo], null, 2));
    });

    // 5. ACTUALIZAR EL ÍNDICE MAESTRO
    // Intentamos leer el índice actual para no borrar lo que ya hay
    const rutaIndice = path.join(DIR_ACTUAL, ARCHIVO_INDICE);
    let indiceGlobal = {};
    
    if (fs.existsSync(rutaIndice)) {
        try {
            indiceGlobal = JSON.parse(fs.readFileSync(rutaIndice));
        } catch (e) { console.error("Error leyendo índice, se creará uno nuevo."); }
    }

    // Mezclar nuevos índices
    Object.assign(indiceGlobal, nuevosIndices);
    
    // Guardar Índice
    // Asegurarse que la carpeta indices exista (subimos un nivel y entramos a indices)
    const dirIndices = path.dirname(rutaIndice);
    if (!fs.existsSync(dirIndices)) fs.mkdirSync(dirIndices, { recursive: true });
    
    fs.writeFileSync(rutaIndice, JSON.stringify(indiceGlobal, null, 2));
    console.log(`   🗺️  Índice actualizado con ${movidos} personajes nuevos.`);

    // 6. LIMPIEZA FINAL
    if (movidos > 0 && ignorados === 0) {
        fs.unlinkSync(rutaOrigen);
        console.log("\n✨ ¡ÉXITO TOTAL! sin_categoria.json ha sido vaciado y eliminado.");
    } else {
        console.log(`\n⚠️  Proceso terminado. Se movieron ${movidos}. Quedaron ${ignorados} sin mover.`);
        console.log("   (Si quedaron sin mover, edita el script y agrégalos al MAPA_DESTINOS)");
    }
}

distribuir();
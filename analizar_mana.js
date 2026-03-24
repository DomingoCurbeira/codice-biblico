const fs = require('fs');
const path = require('path');

// Intentamos adivinar el nombre del archivo
const carpetaMana = 'mana/data';
const posiblesArchivos = ['devocionales.json', 'data.json', 'mana.json', 'frases.json'];

console.log("🕵️ BUSCANDO EL ALIMENTO (MANÁ)...");

let archivoEncontrado = null;

// 1. Buscar el archivo
if (fs.existsSync(carpetaMana)) {
    const archivos = fs.readdirSync(carpetaMana);
    console.log(`📂 Archivos en ${carpetaMana}:`, archivos);
    
    // Ver si alguno coincide
    archivoEncontrado = archivos.find(f => f.endsWith('.json'));
} else {
    console.error(`❌ La carpeta ${carpetaMana} no existe.`);
}

// 2. Leer estructura si encontramos algo
if (archivoEncontrado) {
    const ruta = path.join(carpetaMana, archivoEncontrado);
    console.log(`✅ Analizando: ${archivoEncontrado}`);
    
    try {
        const raw = fs.readFileSync(ruta, 'utf8');
        const data = JSON.parse(raw);
        
        // Detectar si es array o objeto
        const lista = Array.isArray(data) ? data : (data.devocionales || data.items || []);

        if (lista.length > 0) {
            console.log("\n⚡ ESTRUCTURA DE UN DEVOCIONAL:");
            console.log(lista[0]); // Muestra el primer item
            
            // Ver si tienen fecha para agrupar por meses
            if (lista[0].fecha) {
                console.log("📅 Dato detectado: Tienen campo 'fecha'. ¡Podemos dividir por MESES!");
            } else if (lista[0].tema || lista[0].categoria) {
                console.log("🏷️ Dato detectado: Tienen 'tema' o 'categoria'.");
            }
        } else {
            console.log("⚠️ El archivo JSON está vacío.");
        }

    } catch (e) {
        console.error("❌ Error leyendo el JSON:", e.message);
    }
} else {
    console.log("❌ No encontré ningún archivo .json en mana/data/");
}
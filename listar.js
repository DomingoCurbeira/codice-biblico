const fs = require('fs');

// Ruta a tu archivo de personajes
const ruta = 'data/personajes/sin_categoria.json'; 

try {
    if (!fs.existsSync(ruta)) {
        console.error(`❌ No encuentro el archivo en: ${ruta}`);
        process.exit(1);
    }

    const raw = fs.readFileSync(ruta, 'utf8');
    const personajes = JSON.parse(raw);

    // Imprimir solo los nombres, uno por línea
    personajes.forEach(p => {
        console.log(p.nombre);
    });

} catch (error) {
    console.error("❌ Ocurrió un error:", error.message);
}
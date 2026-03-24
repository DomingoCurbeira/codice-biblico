const fs = require('fs');

// Ruta a tus estudios
const ruta = 'a_imagen_de_Dios/data/estudios.json'; 

try {
    const raw = fs.readFileSync(ruta, 'utf8');
    const data = JSON.parse(raw);
    
    // Detectar si es array o objeto
    const lista = Array.isArray(data) ? data : (data.estudios || []);

    if (lista.length > 0) {
        console.log("\n🕵️ ESTRUCTURA DE UN ESTUDIO:");
        console.log(lista[0]); // Muestra el primero para ver sus campos
        
        console.log("\n📚 TEMAS/CATEGORÍAS ENCONTRADAS:");
        // Intentamos listar las categorías únicas si existen
        const categorias = [...new Set(lista.map(e => e.categoria || e.tema || "Sin Categoría"))];
        console.log(categorias);
    } else {
        console.log("⚠️ El archivo está vacío.");
    }

} catch (error) {
    console.error("❌ Error:", error.message);
}
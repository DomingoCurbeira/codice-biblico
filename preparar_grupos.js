const fs = require('fs');
const path = require('path');

// RUTAS
const archivoOrigen = 'huellas/data/personajes.json';
const archivoDestino = 'huellas/data/personajes_para_editar.json'; // Crea uno nuevo para no romper nada

try {
    // 1. Leer
    const raw = fs.readFileSync(archivoOrigen, 'utf8');
    const personajes = JSON.parse(raw);

    // 2. Transformar (Agregar la etiqueta automáticamente)
    const personajesListos = personajes.map(p => {
        // Ponemos 'grupo' justo después del 'id' para que sea fácil de ver
        return {
            id: p.id,
            grupo: "PENDIENTE_CLASIFICAR", // <--- Aquí es donde editarás luego
            nombre: p.nombre,
            ...p // Mantiene el resto de datos (historia, imagen, etc.)
        };
    });

    // 3. Guardar el nuevo archivo
    fs.writeFileSync(archivoDestino, JSON.stringify(personajesListos, null, 2));

    console.log(`\n✅ ¡Éxito! Hemos creado un nuevo archivo: ${archivoDestino}`);
    console.log(`👉 Ahora ábrelo y cambia los "PENDIENTE_CLASIFICAR" por tus grupos (patriarcas, profetas, etc.)`);
    console.log(`👉 Cuando termines, renómbralo a 'personajes.json' y corre la migración.\n`);

} catch (error) {
    console.error("❌ Error leyendo el archivo:", error.message);
}
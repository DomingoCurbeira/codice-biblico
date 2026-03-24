const fs = require('fs');
const datos = JSON.parse(fs.readFileSync('cronos/data/libros.json', 'utf8'));
const lista = Array.isArray(datos) ? datos : (datos.libros || []);

console.log("📚 LIBROS ENCONTRADOS:");
lista.forEach(libro => console.log(`- ID: ${libro.id} | Título: ${libro.titulo}`));
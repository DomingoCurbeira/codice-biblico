const fs = require('fs');
const path = require('path');

// COLORES PARA LA CONSOLA (Añadí el red que faltaba)
const c = { 
    green: "\x1b[32m", 
    cyan: "\x1b[36m", 
    yellow: "\x1b[33m", 
    red: "\x1b[31m",
    reset: "\x1b[0m" 
};

console.log(`${c.cyan}📦 EMPAQUETANDO PROYECTO CÓDICE...${c.reset}\n`);

// 1. CONFIGURACIÓN
const distName = 'dist';
const rootDir = __dirname;
const distPath = path.join(rootDir, distName);

// Lista de lo que queremos copiar
const archivos = ['index.html', 'manifest.json', 'sw.js'];
// (Nota: Quité 'data' de la lista si aún no creamos esa carpeta, 
// pero si ya la tienes, agrégala de nuevo al array)
const carpetas = ['img', 'css', 'js', 'aposento', 'cronos', 'huellas', 'a_imagen_de_Dios', 'data', 'mana', 'notas', 'juego', 'assets', 'guia']; 

try {
    // 2. LIMPIEZA: Borrar la carpeta dist si ya existe
    if (fs.existsSync(distPath)) {
        console.log(`🗑️  Borrando carpeta "${distName}" antigua...`);
        fs.rmSync(distPath, { recursive: true, force: true });
    }

    // 3. CREACIÓN: Crear la carpeta nueva
    fs.mkdirSync(distPath);
    console.log(`📂 Carpeta "${distName}" creada.`);

    // 4. COPIAR ARCHIVOS SUELTOS
    archivos.forEach(archivo => {
        const origen = path.join(rootDir, archivo);
        const destino = path.join(distPath, archivo);

        if (fs.existsSync(origen)) {
            fs.copyFileSync(origen, destino);
            console.log(`📄 Copiado: ${archivo}`);
        } else {
            console.warn(`${c.yellow}⚠️  Aviso: No se encontró el archivo "${archivo}"${c.reset}`);
        }
    });

    // 5. COPIAR CARPETAS COMPLETAS
    carpetas.forEach(carpeta => {
        const origen = path.join(rootDir, carpeta);
        const destino = path.join(distPath, carpeta);

        if (fs.existsSync(origen)) {
            // cpSync copia recursivamente (Requiere Node.js v16.7+)
            fs.cpSync(origen, destino, { recursive: true });
            console.log(`📂 Carpeta copiada: ${carpeta}/`);
        } else {
            console.warn(`${c.yellow}⚠️  Aviso: No se encontró la carpeta "${carpeta}"${c.reset}`);
        }
    });

    console.log(`\n${c.green}✅ ¡ÉXITO! Carpeta "${distName}" lista.${c.reset}`);
    console.log(`${c.cyan}👉 Arrastra la carpeta "dist" a Netlify.${c.reset}`);

} catch (error) {
    console.error(`\n${c.red}❌ ERROR AL EMPAQUETAR:${c.reset}`, error.message);
}
const fs = require('fs');
const path = require('path');

const c = { 
    green: "\x1b[32m", 
    cyan: "\x1b[36m", 
    yellow: "\x1b[33m", 
    red: "\x1b[31m",
    reset: "\x1b[0m" 
};

console.log(`${c.cyan}📦 EMPAQUETANDO PROYECTO CÓDICE (v1.1 Premium)...${c.reset}\n`);

const distName = 'dist';
const rootDir = __dirname;
const distPath = path.join(rootDir, distName);

const archivos = ['index.html', 'manifest.json', 'sw.js'];
const carpetas = ['img', 'css', 'js', 'aposento', 'cronos', 'huellas', 'a_imagen_de_Dios', 'data', 'mana', 'notas', 'juego', 'assets', 'guia', 'etymos', 'onomastiko', 'rhema']; 

try {
    if (fs.existsSync(distPath)) {
        console.log(`🗑️  Borrando carpeta "${distName}" antigua...`);
        fs.rmSync(distPath, { recursive: true, force: true });
    }

    fs.mkdirSync(distPath);
    console.log(`📂 Carpeta "${distName}" creada.`);

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

    carpetas.forEach(carpeta => {
        const origen = path.join(rootDir, carpeta);
        const destino = path.join(distPath, carpeta);

        if (fs.existsSync(origen)) {
            fs.cpSync(origen, destino, { recursive: true });
            console.log(`📂 Carpeta copiada: ${carpeta}/`);
        } else {
            console.warn(`${c.yellow}⚠️  Aviso: No se encontró la carpeta "${carpeta}"${c.reset}`);
        }
    });

    console.log(`\n${c.green}✅ ¡ÉXITO! Proyecto empaquetado correctamente.${c.reset}`);

} catch (error) {
    console.error(`\n${c.red}❌ ERROR CRÍTICO EN LA CONSTRUCCIÓN:${c.reset}`, error.message);
    process.exit(1); // Esto detendrá el despliegue en Netlify si algo falla
}

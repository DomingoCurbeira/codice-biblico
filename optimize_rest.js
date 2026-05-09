const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const configs = [
    { dir: 'img/lugares', size: 800 },
    { dir: 'img/estudios', size: 800 }
];

async function optimizeFolder({ dir, size }) {
    const directory = path.join(__dirname, dir);
    if (!fs.existsSync(directory)) {
        console.warn(`Directorio no encontrado: ${dir}`);
        return;
    }

    const files = fs.readdirSync(directory);
    let count = 0;
    let totalSaved = 0;

    console.log(`\nOptimización en ${dir} (${files.length} archivos, max ${size}px)...`);

    for (const file of files) {
        if (file.endsWith('.webp')) {
            const filePath = path.join(directory, file);
            const tempPath = path.join(directory, 'temp_' + file);
            
            try {
                const stats = fs.statSync(filePath);
                const originalSize = stats.size;

                await sharp(filePath)
                    .resize(size, size, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({ quality: 75 })
                    .toFile(tempPath);

                const newStats = fs.statSync(tempPath);
                const newSize = newStats.size;

                if (newSize < originalSize) {
                    fs.renameSync(tempPath, filePath);
                    totalSaved += (originalSize - newSize);
                    count++;
                } else {
                    fs.unlinkSync(tempPath);
                }
            } catch (err) {
                console.error(`Error procesando ${file}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }

    console.log(`Hecho. Optimizados: ${count} | Ahorro: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

async function run() {
    for (const config of configs) {
        await optimizeFolder(config);
    }
    console.log('\n--- Optimización masiva completada ---');
}

run();

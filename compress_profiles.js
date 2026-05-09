const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'img/perfiles');

async function compressImages() {
    const files = fs.readdirSync(directory);
    let count = 0;
    let totalSaved = 0;

    console.log(`Iniciando compresión de ${files.length} imágenes...`);

    for (const file of files) {
        if (file.endsWith('.webp')) {
            const filePath = path.join(directory, file);
            const tempPath = path.join(directory, 'temp_' + file);
            
            try {
                const stats = fs.statSync(filePath);
                const originalSize = stats.size;

                await sharp(filePath)
                    .resize(400, 400, {
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
                    if (count % 50 === 0) console.log(`Procesadas ${count} imágenes...`);
                } else {
                    fs.unlinkSync(tempPath);
                }
            } catch (err) {
                console.error(`Error procesando ${file}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }

    console.log(`¡Compresión terminada!`);
    console.log(`Imágenes optimizadas: ${count}`);
    console.log(`Espacio total ahorrado: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

compressImages();

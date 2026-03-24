const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. CONFIGURACIÓN
const CARPETA_ORIGEN = path.join(__dirname, 'descargas'); // Carpeta donde están las imágenes
const CALIDAD = 80; // Calidad del WebP (0 a 100). 80 es excelente balance.

// Extensiones permitidas para convertir
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];

async function convertirImagenes() {
    console.log(`🚀 Iniciando conversión en: ${CARPETA_ORIGEN}\n`);

    try {
        // Verificar que la carpeta existe
        if (!fs.existsSync(CARPETA_ORIGEN)) {
            throw new Error(`La carpeta '${CARPETA_ORIGEN}' no existe.`);
        }

        // Leer archivos de la carpeta
        const archivos = fs.readdirSync(CARPETA_ORIGEN);

        let convertidos = 0;
        let errores = 0;

        for (const archivo of archivos) {
            const rutaCompleta = path.join(CARPETA_ORIGEN, archivo);
            const ext = path.extname(archivo).toLowerCase();
            const nombreBase = path.basename(archivo, ext);

            // Si es una imagen válida y NO es ya un webp
            if (EXTENSIONES_PERMITIDAS.includes(ext)) {
                
                const rutaSalida = path.join(CARPETA_ORIGEN, `${nombreBase}.webp`);

                // Evitar reconvertir si ya existe (Opcional, comenta este IF si quieres sobrescribir)
                if (fs.existsSync(rutaSalida)) {
                    console.log(`⏭️  Saltando (ya existe): ${nombreBase}.webp`);
                    continue;
                }

                try {
                    await sharp(rutaCompleta)
                        .webp({ quality: CALIDAD })
                        .toFile(rutaSalida);

                    console.log(`✅ Convertido: ${archivo} -> ${nombreBase}.webp`);
                    convertidos++;
                    
                    // Opcional: ¿Quieres borrar el original después de convertir?
                    // Descomenta la siguiente línea con cuidado:
                    // fs.unlinkSync(rutaCompleta); 

                } catch (err) {
                    console.error(`❌ Error al convertir ${archivo}:`, err.message);
                    errores++;
                }
            }
        }

        console.log('\n---------------------------------------------------');
        console.log(`🎉 Proceso finalizado.`);
        console.log(`✨ Imágenes convertidas: ${convertidos}`);
        if (errores > 0) console.log(`⚠️  Errores: ${errores}`);
        console.log('---------------------------------------------------');

    } catch (error) {
        console.error("❌ Error fatal:", error.message);
    }
}

convertirImagenes();
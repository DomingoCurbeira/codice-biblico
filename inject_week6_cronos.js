const fs = require('fs');

const lugaresPath = 'proyectos/biblia/codice/data/lugares.json';
let lugaresData = JSON.parse(fs.readFileSync(lugaresPath, 'utf8'));

// Handle both object wrapper and raw array
let lugaresList = Array.isArray(lugaresData) ? lugaresData : (lugaresData.lugares || []);

const new_place = {
    "id": "gabaa-saul",
    "nombre": "Gabaa de Saúl",
    "descripcion_corta": "La Fortaleza Rústica",
    "coordenadas": [31.8236, 35.2300],
    "region": "Benjamín",
    "tipo": "Fortaleza/Capital",
    "imagen": "../img/lugares/gabaa-saul.webp",
    "historia": "Gabaa (Tell el-Ful) fue la residencia y centro de operaciones del primer rey de Israel, Saúl. A diferencia de los grandes palacios orientales, era una fortaleza rústica, diseñada más para la guerra defensiva que para establecer un imperio.",
    "significado_espiritual": "Gabaa representa un liderazgo basado en la supervivencia física y la paranoia militar, en contraste con Sion, que representa el establecimiento de la adoración y la presencia de Dios en el centro del reinado.",
    "eventos_clave": [
        "El Espíritu de Dios viene sobre Saúl tras ser ungido (1 Sam 10).",
        "Saúl establece su modesto 'palacio' militar.",
        "Saúl planea desde aquí la persecución contra David impulsado por la envidia."
    ],
    "estado_actual": "Ruinas en la cima de una colina (Tell el-Ful) cerca de la actual Jerusalén. Las excavaciones han revelado cimientos masivos pero toscos, de estilo militar (casamatas).",
    "conexiones_estudio": [
        {"id": "historia-gabaa-saul", "titulo": "Gabaa de Saúl: El Palacio Rústico"}
    ]
};

lugaresList = lugaresList.filter(l => l.id !== new_place.id);
lugaresList.unshift(new_place);

if (Array.isArray(lugaresData)) {
    lugaresData = lugaresList;
} else {
    lugaresData.lugares = lugaresList;
}

fs.writeFileSync(lugaresPath, JSON.stringify(lugaresData, null, 2), 'utf8');

const indicePath = 'proyectos/biblia/codice/data/indices/indice_lugares.json';
let indice = JSON.parse(fs.readFileSync(indicePath, 'utf8'));
let entries = Object.entries(indice);
entries = entries.filter(e => e[0] !== new_place.id);
entries.unshift([new_place.id, new_place.region]);
const output = {};
entries.forEach(([k, v]) => output[k] = v);
fs.writeFileSync(indicePath, JSON.stringify(output, null, 2), 'utf8');

console.log('✅ Gabaa inyectada en Cronos.');

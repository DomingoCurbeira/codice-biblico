import json
import os

LUGARES_PATH = "proyectos/biblia/codice/data/lugares.json"

new_places = [
    {
        "id": "silo-santuario",
        "nombre": "Silo",
        "descripcion_corta": "El Santuario Olvidado",
        "coordenadas": [32.0556, 35.2894],
        "region": "Efraín",
        "tipo": "Santuario/Ruina",
        "imagen": "../img/lugares/silo-ruinas.webp",
        "historia": "Antes de Jerusalén, Silo fue el centro espiritual de Israel. Albergó el Tabernáculo y el Arca del Pacto durante casi cuatro siglos tras la conquista de Canaán.",
        "significado_espiritual": "Silo representa la falsa seguridad institucional. Nos enseña que la religión externa y la estructura física no garantizan la presencia de Dios si hay corrupción moral.",
        "eventos_clave": [
            "Josué reparte las tierras a las tribus restantes.",
            "Ana llora por su esterilidad y concibe a Samuel.",
            "Samuel escucha la voz de Dios por primera vez.",
            "El sacerdocio de Elí es corrompido y el Arca es capturada por los filisteos, llevando a la destrucción del santuario."
        ],
        "estado_actual": "Sitio arqueológico (Tel Shiloh) donde las excavaciones han encontrado masivas capas de ceniza, confirmando la destrucción repentina descrita en las Escrituras.",
        "conexiones_estudio": [
            {"id": "historia-silo-arqueologia", "titulo": "Silo: El Santuario Olvidado"}
        ]
    }
]

def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

lugares_data = read_json(LUGARES_PATH)
lugares_list = lugares_data if isinstance(lugares_data, list) else lugares_data.get('lugares', [])

for place in new_places:
    lugares_list = [l for l in lugares_list if l['id'] != place['id']]
    lugares_list.insert(0, place)

if isinstance(lugares_data, list):
    lugares_data = lugares_list
else:
    lugares_data['lugares'] = lugares_list

write_json(LUGARES_PATH, lugares_data)

print("✅ Lugares de Cronos de la Semana 4 inyectados.")

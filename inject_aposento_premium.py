import json
import os

DIR = "data/aposento"
INDICE_PATH = "data/indices/indice_aposento.json"

# --- 1. LUNES (Huellas) -> matutinas.json (Renuncia a las Hojas de Higuera)
lunes_oracion = {
    "id": "renuncia-hojas-higuera",
    "titulo": "La Religión de las Hojas y la Túnica de Gracia",
    "cita": "Y Jehová Dios hizo al hombre y a su mujer túnicas de pieles, y los vistió. (Génesis 3:21)",
    "contenido": "Padre Eterno, hoy me presento ante Ti cansado de intentar coser mis propias túnicas de mérito. Confieso que he usado el perfeccionismo, el activismo religioso y la apariencia de santidad como 'hojas de higuera' para tapar mis vacíos y mi temor al juicio. He huido de Tu voz cuando me siento indigno, creyendo que debo arreglarme primero para poder acercarme a Ti. [SELAH] Pero hoy escucho Tu llamado en medio de mi huerto caído. Tú no esperaste a que yo fuera perfecto; Tú mismo sacrificaste al Cordero para proveer mi cobertura. Renuncio a la fatiga de la auto-justificación y dejo caer mis hojas secas ante Tus pies. [SELAH] Me visto ahora con la túnica inmaculada de Cristo. Declaro que Su sangre es mi único escudo y Su justicia es mi estatus legal permanente. No camino en vergüenza, sino en la dignidad de Tu hijo amado. Amén."
}

# --- 2. MARTES (Mitos) -> proposito.json (Bajar del Trono de la Autonomía)
martes_oracion = {
    "id": "rendicion-autonomia-moral",
    "titulo": "El Altar de la Voluntad Rendida",
    "cita": "Sino que sabe Dios que el día que comáis de él... seréis como Dios. (Génesis 3:5)",
    "contenido": "Señor de la Verdad, hoy reconozco que el veneno de la autonomía moral sigue intentando correr por mis venas. Confieso las veces que he dicho 'yo siento' por encima de Tu Palabra, y las veces que he intentado ser mi propio legislador, decidiendo qué es bueno y malo según mi conveniencia. Me arrepiento por mi soberbia intelectual. [SELAH] Tú eres el único Rey y el único Diseñador. En este momento de silencio, bajo del trono de mis opiniones y establezco que solo Tu revelación tiene la autoridad final en mi casa, en mis finanzas y en mis emociones. Rindo mi derecho a decidir sin consultarte. [SELAH] Declaro que Tu voluntad es buena, agradable y perfecta. Me alineo con el diseño de Getsemaní: 'No se haga mi voluntad, sino la Tuya'. Encuentro mi verdadera libertad en mi total dependencia de Ti. Amén."
}

# --- 3. MIÉRCOLES (Etymos) -> vespertinas.json (Alineación de la Flecha)
miercoles_oracion = {
    "id": "alineacion-trayectoria-gloria",
    "titulo": "El Retorno de la Flecha al Blanco",
    "cita": "Por cuanto todos pecaron (Hamartia), y están destituidos de la gloria de Dios. (Romanos 3:23)",
    "contenido": "Espíritu Santo, examina hoy la trayectoria de mi vida. Confieso que muchas veces me he conformado con blancos pequeños y terrenales, desviando mi fuerza hacia metas que no portan Tu gloria. Me siento cansado de tirar flechas que terminan en el barro de la distracción y el pecado. [SELAH] Tú me diseñaste para impactar el centro mismo de Tu majestad. No soy un error, soy una flecha fabricada a mano por el Diseñador Maestro. En Cristo, mi trayectoria es restaurada y mi puntería es calibrada por la gracia. [SELAH] Hoy decreto que mi vida no se quedará corta de su destino. Apunto mi día y mis decisiones hacia el reflejo de Tu Doxa. Soy portador de gloria y mi caminar tiene un peso eterno en el espíritu. Amén."
}

# --- 4. JUEVES (Historia) -> guerra_espiritual.json (Limpieza del Santuario)
jueves_oracion = {
    "id": "limpieza-sacerdotal-hogar",
    "titulo": "El Centinela del Templo Personal",
    "cita": "Tomó, pues, Jehová Dios al hombre, y lo puso en el huerto de Edén, para que lo labrara y lo guardase (Shamar). (Génesis 2:15)",
    "contenido": "Jehová Shamar, hoy asumo mi investidura sacerdotal. Reconozco que he fallado en vigilar las puertas de mi mente y de mi hogar, permitiendo que 'serpientes' de división, queja y pecado profanen el santuario que me confiaste. Pido perdón por mi pasividad. [SELAH] Pero ahora, revestido con la autoridad del Último Adán, levanto un cerco de protección sobre mi jurisdicción. Expulso toda influencia extraña de mi hogar y declaro que mi mente es un huerto donde Dios camina con libertad. [SELAH] Hoy establezco orden y santidad en mi territorio. Soy el Shamar (guardián) de mis ojos y mis oídos. Mi casa es una embajada del Reino de Dios y ninguna profanación tiene permiso de habitar aquí. Amén."
}

# --- 5. VIERNES (Sermones) -> familia.json (Descanso en el Representante)
viernes_oracion = {
    "id": "reposo-victoria-federal",
    "titulo": "Bajo la Cobertura del Segundo Adán",
    "cita": "Porque así como por la desobediencia de un hombre los muchos fueron constituidos pecadores... (Romanos 5:19)",
    "contenido": "Abba Padre, hoy decido dejar de pelear batallas que ya fueron ganadas. Confieso que muchas veces vivo bajo la sombra del fracaso del primer Adán, sintiéndome sentenciado por mi naturaleza caída y limitado por mis errores hereditarios. [SELAH] Pero hoy me cambio de fila legal. Acepto por fe que mi Representante es Jesucristo, el Hombre que venció en el desierto por mí. Su historial de pureza es ahora mi historial. Su victoria es mi herencia. [SELAH] Declaro que estoy posicionado legalmente en el Segundo Adán. No temo al futuro ni a la escasez, porque mi Cabeza Federal es el Dueño de todo. Descanso en Su obediencia perfecta y camino en Su bendición inmerecida. Amén."
}

def inject_aposento():
    mapa = {
        "matutinas.json": lunes_oracion,
        "proposito.json": martes_oracion,
        "vespertinas.json": miercoles_oracion,
        "guerra_espiritual.json": jueves_oracion,
        "familia.json": viernes_oracion
    }
    
    for file, prayer in mapa.items():
        path = os.path.join(DIR, file)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Remove existing to update
            data = [p for p in data if p.get('id') != prayer['id']]
            data.append(prayer)
            
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Oración '{prayer['id']}' inyectada en {file}")

def update_indice_aposento():
    if os.path.exists(INDICE_PATH):
        with open(INDICE_PATH, 'r', encoding='utf-8') as f:
            indice = json.load(f)
        
        nuevos_ids = {
            "renuncia-hojas-higuera": "matutinas",
            "rendicion-autonomia-moral": "proposito",
            "alineacion-trayectoria-gloria": "vespertinas",
            "limpieza-sacerdotal-hogar": "guerra_espiritual",
            "reposo-victoria-federal": "familia"
        }
        
        # Merge new ids at the beginning for visibility
        indice = {**nuevos_ids, **indice}
        
        with open(INDICE_PATH, 'w', encoding='utf-8') as f:
            json.dump(indice, f, indent=2, ensure_ascii=False)
        print(f"✅ Índice {INDICE_PATH} actualizado.")

if __name__ == "__main__":
    inject_aposento()
    update_indice_aposento()

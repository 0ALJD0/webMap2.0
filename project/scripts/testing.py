import pandas as pd
import spacy
from collections import Counter
from datetime import datetime

##Proceso para la obtención del histograma:
# Cargar el modelo de spaCy en español
nlp = spacy.load("es_core_news_sm")

# Características clave de los establecimientos
caracteristicas_clave = {
    "tipo_establecimiento": ["cafetería", "restaurante", "bar", "discoteca", "plaza de comida", "establecimiento movil","servicio de catering"],
    "horarios": ["matutinos", "vespertinos", "nocturnos", "24 horas"],
    "servicios": ["servicio a domicilio", "servicio al auto", "menú", "autoservicio","menú fijo","buffet"],
    "tipo_cocina":["argentina","asiatica","brasilera","china","colombiana","coreana","costa Rica","escandinava","ecuatoriana","venezolana","italiana","japonesa",
                    "kosher","mexicana"",rusa","cocina Andina","cocina patrimonial","comida rapida","frutas y vegetales","mariscos","nediterranea","novoandina",
                    "panaderia, pasteleri­a y reposteri­a","parrilladas","pizza","vegetariana"],
    "numero_tazas":["1 taza","2 tazas"],
    "numero_cubiertos":["1 cubierto","2 cubiertos","3 cubiertos","4 cubiertos","5 cubiertos",],
    "numero_copas":["1 copa","2 copas","3 copas"],
}



# Función para extraer características de los textos con indicaciones explícitas
def extraer_caracteristicas(texto):
    """
    Extrae características relevantes de un texto basado en palabras clave, con desglose por subcategorías.

    Args:
        texto (str): Texto a analizar.

    Returns:
        dict: Diccionario con las características encontradas y el conteo por palabra clave.
    """
    # Procesar el texto con spaCy
    doc = nlp(texto.lower())

    # Diccionario para almacenar resultados
    caracteristicas_encontradas = {categoria: Counter() for categoria in caracteristicas_clave.keys()}

    # Buscar combinaciones de palabras (frases de 2 o más palabras)
    for categoria, palabras_clave in caracteristicas_clave.items():
        # Buscar combinaciones de n palabras consecutivas
        for n in range(2, len(doc) + 1):  # Comenzamos con combinaciones de 2 palabras hasta N palabras
            for i in range(len(doc) - n + 1):
                # Crear una combinación de n palabras consecutivas
                combinacion = " ".join([doc[j].text for j in range(i, i + n)])
                if combinacion in palabras_clave:
                    caracteristicas_encontradas[categoria][combinacion] += 1
        
        # También buscamos las palabras individuales
        for token in doc:
            if token.text in palabras_clave:
                caracteristicas_encontradas[categoria][token.text] += 1

    # Convertir los Contadores a diccionarios simples para serialización
    return {categoria: dict(contador) for categoria, contador in caracteristicas_encontradas.items()}

awa="Ola conoces de vespertinos cafetería, nocturnos, china, 2 copas, 2 tazas, servicio a domicilio, pizza, 2 cubiertos"
print(extraer_caracteristicas(awa))


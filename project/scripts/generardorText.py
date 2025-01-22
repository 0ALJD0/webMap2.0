import openai
import random
from datetime import datetime, timedelta
import time
import unicodedata

def remove_accents(text):
    # Normaliza el texto para separar caracteres base y acentos
    normalized_text = unicodedata.normalize('NFD', text)
    # Filtra los caracteres base eliminando los acentos
    text_without_accents = ''.join(c for c in normalized_text if unicodedata.category(c) != 'Mn')
    return text_without_accents

# Configura tu API key
openai.api_key = 'SECRET_KEY'

def generate_message():
    # Características clave para incluir en los mensajes
    caracteristicas_clave = {
        "tipo_establecimiento": ["cafeteria", "restaurante", "bar", "discoteca", "plaza de comida", "establecimiento movil", "servicio de catering"],
        "horarios": ["matutinos", "vespertinos", "nocturnos", "24 horas"],
        "servicios": ["servicio a domicilio", "servicio al auto", "menu", "autoservicio", "menu fijo", "buffet"],
        "tipo_cocina": ["argentina", "asiatica", "brasilera", "china", "colombiana", "coreana", "costa rica", "escandinava", "ecuatoriana", "venezolana", "italiana", "japonesa",
                        "kosher", "mexicana", "rusa", "cocina Andina", "cocina patrimonial", "comida rapida", "frutas y vegetales", "mariscos", "mediterranea", "novoandina",
                        "panaderia, pasteleri­a y reposteri­a", "parrilladas", "pizza", "vegetariana"],
        "numero_tazas": ["1 taza", "2 tazas"],
        "numero_cubiertos": ["1 cubierto", "2 cubiertos", "3 cubiertos", "4 cubiertos", "5 cubiertos"],
        "numero_copas": ["1 copa", "2 copas", "3 copas"]
    }

    # Seleccionar aleatoriamente características
    tipo_establecimiento = random.choice(caracteristicas_clave["tipo_establecimiento"])
    horario = random.choice(caracteristicas_clave["horarios"])
    servicio = random.choice(caracteristicas_clave["servicios"])
    tipo_cocina = random.choice(caracteristicas_clave["tipo_cocina"])
    numero_tazas = random.choice(caracteristicas_clave["numero_tazas"])
    numero_copas = random.choice(caracteristicas_clave["numero_copas"])
    numero_cubiertos = random.choice(caracteristicas_clave["numero_cubiertos"])

    # Crear un prompt más centrado en el contexto de lo que quieres generar
    prompt = (f"Crea un mensaje como si fueras un usuario preguntando a un agente virtual de establecimientos alimenticios: "
              f"Ten en cuenta que solo debes hacer de usuario, no respondas con Usuario: solo el mensaje"
              f"trata de que sean mensajes no ta largos y que usen explicitamente las palabras que te indico, porque usare esos mnesajes para ser procesados por otra ia que las contará, asi que deben ser identicas a como te la escribo"
              f"no coloques tildes en las palabras por favor y no es cribas una taza, escribe 1 taza y asi con los otros conjunto de palabras clave"
              f"Ten en cuenta las siguientes palabras para crear el mensaje, obviamente no escribas las palabras que no tengan que ver con el tipo de  establecimiento de que preguntes: "
              f"tipo de establecimiento: {tipo_establecimiento}, tipo de cocina: {tipo_cocina}, horario: {horario}, servicio: {servicio}, "
              f"número de copas: {numero_copas}, número de cubiertos: {numero_cubiertos}, número de tazas: {numero_tazas}. "
              f"Genera una respuesta coherente en español sobre este establecimiento.")

    # Llamar al modelo GPT-3.5 de chat para generar el mensaje
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Usando el modelo chat
        messages=[
            {"role": "system", "content": "Eres un asistente útil."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0.7
    )

    # Extraer el texto generado
    generated_text = response['choices'][0]['message']['content'].strip()

    return generated_text

def generate_datetime():
    # Define el rango de fechas (desde el 1 de enero de 2024 hasta la fecha actual)
    start_date = datetime(2024, 1, 1)
    end_date = datetime.now()

    # Genera una fecha y hora aleatoria dentro del rango
    random_date = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))

    return random_date.strftime("%Y-%m-%d %H:%M:%S")

def generate_sql_insert():
    # Genera el mensaje y la fecha aleatoria
    message = generate_message()
    message = remove_accents(message)  # Elimina las tildes del mensaje
    date_time = generate_datetime()

    # Formatea la línea de SQL
    sql_insert = f"insert into chats(mensaje, fechayhora) values ('{message}','{date_time}');"

    return sql_insert

def generate_sql_file(filename, num_records=1000):
    # Abre el archivo .sql en modo escritura
    with open(filename, 'w', encoding='utf-8') as f:
        i=0
        start_time = time.time()  # Captura el tiempo de inicio
        # Genera 1000 registros e insértalos en el archivo
        for _ in range(num_records):
            i=i+1
            sql_line = generate_sql_insert()
            f.write(sql_line + '\n')

            # Calcula el tiempo transcurrido
            elapsed_time = time.time() - start_time
            print(f"Se han generado {i} registros. Tiempo transcurrido: {elapsed_time:.2f} segundos")

    print(f"Archivo {filename} generado con {num_records} registros.")

if __name__ == "__main__":
    # Genera el archivo .sql con 1000 registros
    generate_sql_file('inserts.sql', 1000)
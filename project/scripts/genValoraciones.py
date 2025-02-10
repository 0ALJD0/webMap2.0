import random
from datetime import datetime, timedelta
import time

# Función para generar una fecha aleatoria desde diciembre de 2023 hasta la fecha actual
def generar_fecha_aleatoria():
    inicio = datetime(2023, 12, 1)
    fin = datetime.now()
    diferencia = fin - inicio
    dias_aleatorios = random.randint(0, diferencia.days)
    return inicio + timedelta(days=dias_aleatorios)

# Función para generar un insert SQL
def generar_insert(establecimiento_id):
    puntuacion = random.randint(1, 5)  # Puntuación aleatoria entre 1 y 5
    fecha = generar_fecha_aleatoria().strftime('%Y-%m-%d %H:%M:%S')  # Fecha aleatoria
    nombre_anonimo = "Anonimo"  # Nombre anónimo fijo
    comentario = ""  # Comentario vacío

    # Crear el insert
    return f"INSERT INTO valoraciones (puntuacion, establecimiento_id, nombre_anonimo, comentario, fecha) VALUES ({puntuacion}, {establecimiento_id}, '{nombre_anonimo}', '{comentario}', '{fecha}');"

# Función para generar el archivo SQL
def generate_sql_file(filename):
    # Abre el archivo .sql en modo escritura
    with open(filename, 'w', encoding='utf-8') as f:
        i = 0
        start_time = time.time()  # Captura el tiempo de inicio

        # Genera 4 inserts para cada establecimiento_id (del 1 al 40)
        for establecimiento_id in range(1, 41):  # Establecimientos del 1 al 40
            for _ in range(4):  # 4 valoraciones por establecimiento
                i += 1
                sql_line = generar_insert(establecimiento_id)
                f.write(sql_line + '\n')

                # Calcula el tiempo transcurrido
                elapsed_time = time.time() - start_time
                print(f"Se han generado {i} registros. Tiempo transcurrido: {elapsed_time:.2f} segundos")

    print(f"Archivo {filename} generado con {i} registros.")

# Llamada a la función para generar el archivo SQL
generate_sql_file("valoraciones.sql")
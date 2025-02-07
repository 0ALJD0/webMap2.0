import random

def generar_patron():
    for _ in range(188):
        # Siempre incluir 1 y 2
        patron = [1, 2]
        
        # Decidir aleatoriamente si incluir 5
        if random.choice([True, False]):
            patron.append(5)
        
        # Decidir aleatoriamente si incluir 6
        if random.choice([True, False]):
            patron.append(6)
        
        # Imprimir el patrón separado por ";"
        print(";".join(map(str, patron)))

generar_patron()
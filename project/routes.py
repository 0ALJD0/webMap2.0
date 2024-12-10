from flask import Blueprint, request, jsonify, session, current_app
from . import db
from .models import Administrador, Establecimiento, Horario, Tipo_servicio, Tipo_cocina
import openai
import json

bp = Blueprint('routes', __name__)

#ruta para realizar el login
@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        usuario = data.get('usuario')
        contrasena = data.get('contrasena')

        admin = Administrador.query.filter_by(usuario=usuario).first()
        if admin and admin.contrasena == contrasena:
            session['admin_id'] = admin.id  # Establecer la sesión
            return jsonify({'message': 'Login successful'}), 200
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#ruta para realizar el logout
@bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.pop('admin_id', None)  # Eliminar la sesión
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#ruta para obtener los establecimientos
@bp.route('/establecimientos', methods=['GET'])
def obtener_establecimientos():
    try:


        establecimientos = Establecimiento.query.filter_by(eliminado=False).all()
        lista_establecimientos = []

        for establecimiento in establecimientos:
            horarios = Horario.query.filter_by(establecimiento_id=establecimiento.id).all()
            horarios_json = [
                {
                    'dia': horario.dia_semana,
                    'apertura': horario.hora_apertura.strftime('%H:%M'),  # Convertir a formato de cadena HH:MM
                    'cierre': horario.hora_cierre.strftime('%H:%M')      # Convertir a formato de cadena HH:MM
                }
                for horario in horarios
            ]
            tipo_servicio = [ts.nombre for ts in Tipo_servicio.query.filter_by(establecimiento_id=establecimiento.id).all()]
            tipo_cocina = [tc.nombre for tc in Tipo_cocina.query.filter_by(establecimiento_id=establecimiento.id).all()]

            lista_establecimientos.append({
                'id': establecimiento.id,
                'nombre': establecimiento.nombre,
                'direccion': establecimiento.direccion,
                'latitud': str(establecimiento.latitud),
                'longitud': str(establecimiento.longitud),
                'descripcion': establecimiento.descripcion,
                'tipo': establecimiento.tipo,
                ################################################################
                'tipo_servicio': tipo_servicio,
                'tipo_cocina': tipo_cocina,
                'numero_taza': establecimiento.numero_taza,
                'numero_cubiertos': establecimiento.numero_cubiertos,
                'numero_copas': establecimiento.numero_copas,
                'petfriendly': establecimiento.petfriendly,
                'accesibilidad': establecimiento.accesibilidad,
                'horarios': horarios_json
            })

        return jsonify(lista_establecimientos), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#ruta para crear un establecimiento
@bp.route('/establecimientos', methods=['POST'])
def add_establecimiento():
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        data = request.get_json()
        nombre = data.get('nombre')
        # Verificar si el nombre ya existe
        if Establecimiento.query.filter_by(nombre=nombre).first():
            return jsonify({'message': 'Establecimiento con este nombre ya existe'}), 409
        
        direccion = data.get('direccion')
        tipo = data.get('tipo')

        tipo_servicio_ids = data.get('tipo_servicio', [])
        tipo_cocina_ids = data.get('tipo_cocina', [])
        numero_taza = data.get('numero_taza', 0)  # Por defecto 0
        numero_cubiertos = data.get('numero_cubiertos', 0)  # Por defecto 0
        numero_copas = data.get('numero_copas', 0)  # Por defecto 0
        petfriendly = data.get('petfriendly', False)
        accesibilidad = data.get('accesibilidad', False)
        
        latitud = data.get('latitud')
        longitud = data.get('longitud')
        descripcion = data.get('descripcion')


        nuevo_establecimiento = Establecimiento(
            nombre=nombre,
            direccion=direccion,
            tipo=tipo,
            tipo_servicio=tipo_servicio_ids,
            tipo_cocina=tipo_cocina_ids,
            numero_taza=numero_taza,
            numero_cubiertos=numero_cubiertos,
            numero_copas=numero_copas,
            petfriendly=petfriendly,
            accesibilidad=accesibilidad,
            latitud=latitud,
            longitud=longitud,
            descripcion=descripcion,
            administrador_id=session['admin_id']
        )


       # Asociar tipos de servicio y cocina
        for ts_id in tipo_servicio_ids:
            tipo_servicio = Tipo_servicio.query.get(ts_id)
            if tipo_servicio:
                nuevo_establecimiento.tipo_servicio.append(tipo_servicio)
        
        for tc_id in tipo_cocina_ids:
            tipo_cocina = Tipo_cocina.query.get(tc_id)
            if tipo_cocina:
                nuevo_establecimiento.tipo_cocina.append(tipo_cocina)

        db.session.add(nuevo_establecimiento)
        db.session.commit()

        return jsonify({'message': 'Establecimiento added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#ruta para actualizar un establecimiento
@bp.route('/establecimientos/<int:id>', methods=['PUT'])
def edit_establecimiento(id):
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        data = request.get_json()
        establecimiento = Establecimiento.query.filter_by(id=id, administrador_id=session['admin_id']).first()

        if establecimiento is None:
            return jsonify({'message': 'Establecimiento no encontrado'}), 404

        establecimiento.nombre = data.get('nombre', establecimiento.nombre)
        establecimiento.direccion = data.get('direccion', establecimiento.direccion)
        establecimiento.tipo = data.get('tipo', establecimiento.tipo)
        
        establecimiento.numero_taza = data.get('numero_taza', establecimiento.numero_taza)
        establecimiento.numero_cubiertos = data.get('numero_cubiertos', establecimiento.numero_cubiertos)
        establecimiento.numero_copas = data.get('numero_copas', establecimiento.numero_copas)
        establecimiento.petfriendly = data.get('petfriendly', establecimiento.petfriendly)
        establecimiento.accesibilidad = data.get('accesibilidad', establecimiento.accesibilidad)
        establecimiento.latitud=data.get('latitud', establecimiento.latitud)
        establecimiento.longitud=data.get('longitud', establecimiento.longitud)
        establecimiento.descripcion=data.get('descripcion', establecimiento.descripcion)

        # Actualizar tipos de servicio y cocina
        tipo_servicio_ids = data.get('tipo_servicio', [])
        tipo_cocina_ids = data.get('tipo_cocina', [])

        # Limpiar relaciones existentes
        establecimiento.tipo_servicio = []
        establecimiento.tipo_cocina = []

        for ts_id in tipo_servicio_ids:
            tipo_servicio = Tipo_servicio.query.get(ts_id)
            if tipo_servicio:
                establecimiento.tipo_servicio.append(tipo_servicio)
        
        for tc_id in tipo_cocina_ids:
            tipo_cocina = Tipo_cocina.query.get(tc_id)
            if tipo_cocina:
                establecimiento.tipo_cocina.append(tipo_cocina)

        db.session.commit()

        return jsonify({'message': 'Establecimiento updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#actualizar un establecimiento a eliminado
@bp.route('/eliminar_establecimiento/<int:id>', methods=['PUT'])
def actualizar_estado_establecimiento(id):
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        establecimiento = Establecimiento.query.get(id)
        if not establecimiento:
            return jsonify({'message': 'Establecimiento not found'}), 404

        data = request.get_json()
        eliminado = data.get('eliminado')

        establecimiento.eliminado = eliminado
        db.session.commit()

        return jsonify({'message': 'Establecimiento eliminado correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#agregar un horario a un establecimiento
@bp.route('/establecimientos/<int:establecimiento_id>/horarios', methods=['POST'])
def add_horario(establecimiento_id):
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        data = request.get_json()
        dia = data.get('dia_semana')
        apertura = data.get('hora_apertura')
        cierre = data.get('hora_cierre')

        nuevo_horario = Horario(
            dia_semana=dia,
            hora_apertura=apertura,
            hora_cierre=cierre,
            establecimiento_id=establecimiento_id
        )

        db.session.add(nuevo_horario)
        db.session.commit()

        return jsonify({'message': 'Horario added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#actualizar un horario
@bp.route('/horarios/<int:id>', methods=['PUT'])
def edit_horario(id):
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        data = request.get_json()
        horario = Horario.query.filter_by(id=id).first()

        if not horario:
            return jsonify({'message': 'Horario not found'}), 404

        # Actualizar los atributos del horario con los valores recibidos
        horario.dia_semana = data.get('dia_semana', horario.dia_semana)
        horario.hora_apertura = data.get('hora_apertura', horario.hora_apertura)
        horario.hora_cierre = data.get('hora_cierre', horario.hora_cierre)

        db.session.commit()

        return jsonify({'message': 'Horario updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#eliminar un horario
@bp.route('/horarios/<int:id>', methods=['DELETE'])
def delete_horario(id):
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        horario = Horario.query.filter_by(id=id).first()

        if horario is None:
            return jsonify({'message': 'Horario not found'}), 404

        db.session.delete(horario)
        db.session.commit()

        return jsonify({'message': 'Horario deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/password', methods=['PUT'])
def update_password():
    try:
        if 'admin_id' not in session:
            return jsonify({'message': 'Not authorized'}), 403

        data = request.get_json()
        new_password = data.get('new_password')

        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        admin = Administrador.query.get(session['admin_id'])
        admin.contrasena = new_password
        db.session.commit()

        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#Mostrar los horarios de un establecimiento
@bp.route('/establecimientos/<int:establecimiento_id>/horarios', methods=['GET'])
def obtener_horarios(establecimiento_id):
    try:
        horarios = Horario.query.filter_by(establecimiento_id=establecimiento_id).all()
        if not horarios:
            return jsonify({'error': 'No se encontraron horarios para el establecimiento especificado.'}), 404

        lista_horarios = [
            {   
                'horario.id':horario.id,
                'dia': horario.dia_semana,
                'apertura': horario.hora_apertura.strftime('%H:%M'),  # Convertir a formato de cadena HH:MM
                'cierre': horario.hora_cierre.strftime('%H:%M')      # Convertir a formato de cadena HH:MM
            }
            for horario in horarios
        ]

        return jsonify(lista_horarios), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

openai.api_key =current_app.config['OPENAI_API_KEY']

# @bp.route('/preguntar', methods=['POST'])
# def preguntar_openai():
#     try:
#         data = request.get_json()
#         pregunta_usuario = data.get('pregunta')

#         # Obtener los establecimientos de la base de datos
#         establecimientos = Establecimiento.query.all()
#         establecimientos_info = [
#             {
#                 'nombre': est.nombre,
#                 'direccion': est.direccion,
#                 'latitud': str(est.latitud),
#                 'longitud': str(est.longitud),
#                 'descripcion': est.descripcion,
#                 'tipo': est.tipo,
#                 'horarios': [
#                     {
#                         'dia': horario.dia_semana,
#                         'apertura': str(horario.hora_apertura),
#                         'cierre': str(horario.hora_cierre)
#                     } for horario in est.horarios
#                 ]
#             } for est in establecimientos
#         ]

#         # Preparar el mensaje para la API de OpenAI
#         mensaje = f"""
#         Esta es la información de los establecimientos:
#         {establecimientos_info}

#         Pregunta del usuario:
#         {pregunta_usuario}
#         """

#         # Realizar la solicitud a la API de OpenAI
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "Eres un asistente virtual que ayuda a los usuarios con información sobre establecimientos."},
#                 {"role": "user", "content": mensaje}
#             ]
#         )

#         respuesta = response['choices'][0]['message']['content']

#         return jsonify({'respuesta': respuesta}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
@bp.route('/preguntar', methods=['POST'])
def preguntar_openai():
    try:
        data = request.get_json()
        pregunta_usuario = data.get('pregunta')

        # Obtener los establecimientos de la base de datos
        establecimientos = Establecimiento.query.all()
        establecimientos_info = [
            {
                'nombre': est.nombre,
                'direccion': est.direccion,
                'latitud': str(est.latitud),
                'longitud': str(est.longitud),
                'descripcion': est.descripcion,
                'tipo': est.tipo,
                'horarios': [
                    {
                        'dia': horario.dia_semana,
                        'apertura': str(horario.hora_apertura),
                        'cierre': str(horario.hora_cierre)
                    } for horario in est.horarios
                ]
            } for est in establecimientos
        ]

        # Inicializar el historial de mensajes si no existe
        if 'chat_history' not in session:
            session['chat_history'] = []

        # Añadir el mensaje del usuario al historial
        session['chat_history'].append({"role": "user", "content": pregunta_usuario})

        # Crear la solicitud a la API de OpenAI con el historial de mensajes
        messages = [
            {"role": "system", "content": "Eres un asistente virtual que ayuda a los usuarios con información sobre establecimientos. Solo puedes hablar sobre los establecimientos, obiviamente puedes interactuar con el usuario, pero que el tema solo sea de los establecimientos"},
            {"role": "system", "content": f"Esta es la información de los establecimientos: {establecimientos_info}"}
        ] + session['chat_history']

        # Realizar la solicitud a la API de OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        respuesta = response['choices'][0]['message']['content']

        # Añadir la respuesta de la API al historial
        session['chat_history'].append({"role": "assistant", "content": respuesta})

        return jsonify({'respuesta': respuesta}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
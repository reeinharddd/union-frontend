

Especificación de Requerimientos de Software
para
UniON
Version 0.5 
Realizado por Aguilar Ríos Héctor Daniel, Mendoza Contreras Fabian, Beltrán Ramírez Erik Alfonso, Dominguez Diaz Alma Juanita, Robledo Ramírez Jorge Rafael, Olmos Labastida Jesús Esteban
Universidad Tecnológica de Tijuana
 27 de junio 2025

Tabla de Contenido
1. Introducción	1
1.1 Propósito	1
1.2 Convenciones del Documento	1
1.3 Público objetivo y sugerencias de lectura	1
1.4 Alcance del producto	1
1.5 Referencias	2
2. Descripción General	2
2.1 Perspectiva del producto	2
2.2 Funciones del Producto	2
2.3 Clases y Características de Usuarios	3
2.4 Entorno Operativo	4
2.5 Diseño y Restricciones de Implementación	4
2.6 Documentación del Usuario	4
2.7 Supuestos y Dependencias	4
3. Requisitos de la Interfaz Externa	4
3.1 Interfaces de usuario	4
3.2 Interfaces de Software	4
3.3 Software Interfaces	5
3.4 Interfaces de Comunicación	5
4. Características del Sistema	5
4.1 Registro de Usuario	5
4.2 Validación de inscripción	5
4.3 Login & Autenticación	6
4.4 Interacción Feed	6
4.5 Creación de Foros	7
4.6 Búsqueda de Usuarios	7
4.7 Creación de Proyectos Colaborativos	7
4.8 Espacio de Colaboración en Proyectos	8
4.9 Verificación de Proyectos por Instituciones	8
4.10 Privilegios Administrativos	9
4.11 Seguridad	9
4.12 Manejo de Errores	10
4.14   Conversaciones	11
4.15  Eventos y Webinars.	11
4.16  Asistencia a Eventos.	12
4.16 Publicación de oportunidades	12
4.17 Postulaciones	13
4.18 Hilos de discusión	13
4.19 Etiquetados de contenido	13
4.20 Reporte de contenido	14
4.21 Registro de experiencias del alumno	14
5. Otros Requisitos No Funcionales	15
5.1 Requisitos de Rendimiento	15
5.2 Requisitos de Seguridad	15
5.3 Requisitos de Seguridad Técnica	15
5.4 Atributos de Calidad del Software	16
5.5 Reglas de Negocio	16
6. Propuesta de base de datos	17
7. Otros Requerimientos	17

Historial de revisiones
Profesor
Fecha
Razón por los Cambios
Version
Ray Parra
03/06/2025
falta de firmas y no se especificó la funcionalidad de los roles
1.1
Laura Trejo
06/06/2025
No le gustó la idea del proyecto, lo vio muy pequeño.
1.2
Laura trejo
23/06/2025
Sigue sin gustarle la idea, pero aprobó las funcionalidades y el esquema de la base de datos.
1.3
Ray Parra
27/06/2025
Cambios en la estructura del documento y especificación en la estructura de roles.
2





Introducción
Propósito 
UniON se desarrolla para democratizar y mejorar la colaboración académica global al crear un ecosistema digital seguro y validado donde los estudiantes y graduados universitarios pueden conectarse, compartir conocimientos y desarrollar proyectos innovadores. A diferencia de las plataformas sociales convencionales, UniON asegura la credibilidad institucional y la relevancia, fomentando una interacción académicamente significativa entre instituciones. 

La misión de UniON es transformar ideas en acción académica concreta. Va más allá del networking al servir como un catalizador para la innovación interuniversitaria, empoderando a los usuarios para lanzar, crecer y colaborar en proyectos multidisciplinarios que abordan problemas del mundo real. 

Para las instituciones participantes, UniON ofrece una perspectiva estratégica sobre el potencial de los estudiantes y graduados. Proporciona métricas perspicaces para medir la participación, descubrir talento y promover iniciativas de investigación, ampliando así la influencia académica de cada institución a lo largo de un panorama educativo global más amplio.
Convenciones del Documento
Los requisitos se etiquetan utilizando el formato REQ-<sección>-<número> (por ejemplo, REQ-3.1). 
Se asignan etiquetas de prioridad Alta, Media y Baja para cada característica.
Público objetivo y sugerencias de lectura
Este documento está destinado a: 
Desarrolladores y diseñadores. 
QA/Tester. 
Gerentes de proyecto. 
Usuarios finales y asesores académicos.
Alcance del producto
El producto de software UniON es una plataforma web diseñada para facilitar el networking académico y la colaboración entre estudiantes y graduados verificados de universidades participantes. Ofrece un entorno seguro basado en roles donde los usuarios pueden conectarse, compartir opiniones y desarrollar proyectos académicos interdisciplinarios.

La versión inicial de UniON admitirá las siguientes capacidades principales:

Registro de usuarios.
Interacción con contenido.
Descubrimiento de usuarios.
Creación de foros.
Listado y exploración de foros.
Gestión de contenido basada en roles.
Herramientas de administración universitaria.
Publicación de oportunidades académicas.
Postulaciones profesionales.
Registro de experiencias de alumnos.

Fuera de alcance:

El acceso está restringido a usuarios verificados afiliados con universidades participantes; las personas no afiliadas no pueden registrarse. 
Sin integración con plataformas de redes sociales o bases de datos gubernamentales para verificación de identidad. 
Notificaciones en tiempo real. 
Mensajería privada. 
Carga y compartición de archivos multimedia complejos. 
Edición colaborativa de documentos.
Referencias
Estándar SRS IEEE 830-1998 
Descripción General
Funciones del Producto
UniON es una plataforma segura y verificada por universidades que ofrece un conjunto de funcionalidades de redes académicas y colaboración. El acceso a la plataforma está restringido a usuarios con una afiliación institucional validada. El sistema permite a los usuarios:

Autenticación y Registro: 
Registro y autenticación mediante credenciales universitarias verificadas (correo electrónico institucional o ID de matrícula).

Interacción Académica:
Participación en discusiones académicas a través de:
Foros temáticos.
Comentarios en hilo (respuestas anidadas).
Acceso a feeds de contenido personalizado según grupos y universidad del usuario.

Gestión de Proyectos Colaborativos
Creación y administración de proyectos académicos, incluyendo:

Propuestas con metadatos (descripción, tecnologías, roles).
Verificación institucional para proyectos formales.

Búsqueda y Conexiones
Búsqueda avanzada de usuarios por nombre, universidad, año de graduación, y rol académico.
Sistema de seguimiento para conectar con otros usuarios o proyectos.
Visualización de perfiles y experiencias publicadas.

Entorno Seguro y Validado
Garantía de confianza mediante:
Verificación institucional de usuarios.
Restricciones de acceso basadas en roles.

Conversaciones académicas:
Módulo de conversaciones privadas o grupales relacionadas a proyectos o foros.
Envío y recepción de mensajes almacenados por conversación.
Participación restringida a miembros del proyecto o comunidad correspondiente.

Eventos y webinars: 
Creación de eventos o webinars por parte de las universidades.
Publicación de información relevante: título, descripción, modalidad (presencial/virtual), fecha y hora.
Visualización y registro por parte de los estudiantes o egresados.
Filtros para búsqueda por tipo de evento, fecha y organizador.

Asistencia a Eventos
Registro y control de asistencia de usuarios a eventos organizados.
Visualización del historial personal de eventos asistidos.
Consulta de listas de asistencia por parte de las universidades.
Posibilidad de generar constancias o certificados de participación.Perspectiva del producto
UniON es una aplicación web independiente basada en navegadores. No se basa en ningún sistema existente y actúa de forma independiente de las API de redes sociales. El sistema opera dentro de una arquitectura multi-tenant para apoyar a múltiples universidades.



Clases y Características de Usuarios
Tipo de Usuario
Características
Estudiantes
Verificado por inscripción; participantes activos. 
Graduados
Similar a los estudiantes pero marcados como exalumnos. 
Administración Universitaria
Gestiona usuarios/proyectos en su propia institución. 
Administración General
Supervisa todas las funciones a nivel del sistema.
Promotores
Personas ajenas a las universidades que publican oportunidades laborales para la comunidad universitaria


Entorno Operativo
Plataforma: Web. 
SO: Windows, macOS, Linux. 
Navegador: Chrome, Firefox, Safari, Edge. 
Backend: Node.js. 
DB: PostgreSQL.
Diseño y Restricciones de Implementación
Idioma: Soporte en español. 
Solo se permiten dominios de universidades verificados para el inicio de sesión 
Deben seguir las pautas de privacidad académica.
Documentación del Usuario
Manual de Usuario.
Tutorial de incorporación en línea.
Guia del administrador.
Supuestos y Dependencias
Las universidades participantes proporcionarán datos de inscripción actualizados. 
No se utilizará OAuth de redes sociales para la validación. 
Los mecanismos de verificación asumen la corrección del dominio del correo electrónico. 
La expansión a la mensajería privada y multimedia se pospone.
Requisitos de la Interfaz Externa
Interfaces de usuario
Interfaz de usuario receptiva con navegación estructurada. 
Secciones principales: Feed, Grupos, Proyectos, Perfil, Administrador. 
Cumple con la accesibilidad.
Herramienta de administración universitaria. 
API interna para interacciones de feed/post. 
Base de datos: PostgreSQL para escalabilidad.
HTTPS.
API RESTful.
Características del Sistema
Registro de Usuario
4.1.1 Descripción y Prioridad

Permite que nuevos usuarios se registren en la plataforma utilizando sus credenciales universitarias. Prioridad: Alta

4.1.2 Secuencias de Estímulo/Respuesta

El usuario ingresa su correo electrónico universitario y su identificación. 
El sistema solicita la configuración de la contraseña y confirma la entrada. 
El registro procede sólo después de la validación exitosa.

4.1.3 Requisitos Funcionales
REQ-4.1.1: El sistema deberá permitir el registro utilizando un correo electrónico universitario y un ID de matrícula.
REQ-4.1.2: El sistema deberá prevenir el registro con credenciales inválidas o duplicadas.
REQ-4.1.3: El sistema deberá cifrar todas las contraseñas utilizando un hash seguro. (bcrypt)
Validación de inscripción
4.2.1 Descripción y Prioridad
Garantiza que los usuarios sean validados con base en los registros de matrícula oficiales antes de acceder al sistema.
Prioridad: Alta

4.2.2 Secuencias de Estímulo/Respuesta

El sistema verifica el ID de matrícula/correo electrónico con los registros cargados.
El usuario recibe una confirmación o rechazo con las razones correspondientes.

4.2.3 Requisitos Funcionales

REQ-4.2.1: El sistema deberá verificar automáticamente el ID de matrícula con el conjunto de datos en formato CSV/Excel de la universidad.
REQ-4.2.2: El sistema deberá asignar un rol (estudiante o egresado) según el año de matrícula.
Login & Autenticación
4.3.1 Descripción y Prioridad

Sistema de inicio de sesión seguro para permitir el acceso únicamente a usuarios verificados.
Prioridad: Alta

4.3.2 Secuencias de Estímulo/Respuesta

El usuario ingresa sus credenciales.
El sistema válida y concede acceso a la interfaz principal.

4.3.3 Requisitos Funcionales

REQ-4.3.1: El sistema deberá autenticar a los usuarios mediante correo electrónico y contraseña.
REQ-4.3.2: El sistema deberá bloquear el acceso después de 5 intentos fallidos y requerir recuperación por correo electrónico.

Interacción Feed
4.4.1 Descripción y Prioridad

Muestra un feed personalizable con contenido relevante y publicaciones de foros.
Prioridad: Alta

4.4.2 Secuencias de Estímulo/Respuesta

El usuario accede a la página de inicio/feed.
El feed se genera en función de los foros a los que pertenece y su afiliación universitaria.

4.4.3 Requisitos Funcionales

REQ-4.4.1: El sistema deberá mostrar un feed general y vistas filtradas (universidad, grupo).
REQ-4.4.2: El sistema deberá permitir a los usuarios dar "me gusta" y comentar publicaciones.
REQ-4.4.3: El sistema deberá soportar visualización de comentarios en hilos (respuestas anidadas).

Creación de Foros
4.5.1 Descripción y Prioridad

Permite a los usuarios crear foros temáticos donde posteriormente se podrán iniciar hilos de discusión. Cada foro está orientado a un área de interés o categoría académica, institucional o profesional. Prioridad: Alta.

4.5.2 Secuencias de Estímulo/Respuesta

El usuario autorizado accede a la sección de foros, redacta el nombre, descripción y categoría del foro y lo publica.

4.5.3 Requisitos Funcionales

REQ-4.5.1: El sistema deberá permitir a los usuarios con permisos crear nuevos foros temáticos
REQ-4.5.2: El sistema deberá permitir asociar a cada foro un título, una descripción y una categoría.
REQ-4.5.3: El sistema deberá mostrar los foros creados en un listado ordenado por fecha o relevancia.
REQ-4.5.4: El sistema deberá registrar el identificador del usuario que creó el foro.

Búsqueda de Usuarios
4.6.1 Descripción y Prioridad

Los usuarios pueden buscar otros miembros utilizando filtros.
Prioridad: Alta

4.6.2 Secuencias de Estímulo/Respuesta

El usuario ingresa una consulta o aplica filtros.
El sistema devuelve los perfiles coincidentes.
4.6.3 Requisitos Funcionales
REQ-4.6.1: El sistema deberá permitir la búsqueda de usuarios por nombre, universidad, año de graduación o rol.

Creación de Proyectos Colaborativos
4.8.1 Descripción y Prioridad

Permite a los usuarios iniciar proyectos académicos e invitar colaboradores.
Prioridad: Alta
4.8.2 Secuencias de Estímulo/Respuesta

El usuario ingresa los detalles del proyecto.
El proyecto se publica como "no verificado" hasta su revisión.

4.8.3 Requisitos Funcionales

REQ-4.8.1: Los usuarios podrán crear proyectos personales o grupales con metadatos (nombre, descripción, tecnologías usadas, etc.).
REQ-4.8.2: El sistema permitirá a otros usuarios visualizar una vista previa del proyecto y solicitar unirse.

Espacio de Colaboración en Proyectos
4.9.1 Descripción y Prioridad

Los usuarios pueden iniciar proyectos académicos e invitar colaboradores.
Prioridad: Alta

4.9.2 Secuencias de Estímulo/Respuesta

El usuario se une a un proyecto. 
Obtiene acceso a los bloques/sub-bloques de colaboración.

4.9.3 Requisitos Funcionales

REQ-4.9.1: El sistema deberá proporcionar espacios de proyecto con roles (creador, colaborador, observador).
REQ-4.9.2: El sistema deberá mostrar el estado actual del proyecto (activo, pausado, cerrado).

Verificación de Proyectos por Instituciones
4.10.1 Descripción y Prioridad
Permite a los administradores de la universidad apoyar y aprobar proyectos.
Prioridad: Alta

4.10.2 Secuencias de Estímulo/Respuesta

El creador del proyecto solicita verificación.
Un administrador revisa y aprueba o solicita modificaciones.

4.10.3 Requisitos Funcionales

REQ-4.10.1: Los administradores podrán acceder a solicitudes de proyectos pendientes para su universidad.
REQ-4.10.2: Los proyectos verificados mostrarán una insignia visual distintiva.

Privilegios Administrativos
4.11.1 Descripción y Prioridad

Otorga roles y permisos específicos a administradores (tanto a nivel universitario como de plataforma) para gestionar contenido del sistema, registros de usuarios y verificaciones de proyectos.
Prioridad: Alta

4.11.2 Secuencias de Estímulo/Respuesta

Un administrador universitario carga nuevos registros de estudiantes; el sistema actualiza la base de usuarios válidos.
Un administrador verifica un proyecto enviado; su estado cambia a "Verificado" y se aplica la insignia.

4.11.3 Requisitos Funcionales

REQ-4.11.1: Los administradores universitarios podrán registrar su institución, definir su dominio de correo electrónico y cargar archivos de matrícula verificados.
REQ-4.11.2: Los administradores universitarios podrán verificar o rechazar proyectos académicos de estudiantes.
REQ-4.11.3: Los administradores de la plataforma supervisarán todas las instituciones, usuarios y configuraciones globales del sistema.
REQ-4.11.4: Los administradores de la plataforma podrán suspender o eliminar cuentas de usuarios que incumplan las normas.
REQ-4.11.5: Los administradores universitarios no podrán acceder a datos o usuarios de otras instituciones.

Control y Protección de datos
4.12.1 Descripción y Prioridad

Implementa controles de acceso seguros, encriptación, protección de datos y restricciones por roles para garantizar que todas las interacciones de los usuarios sean seguras y cumplan con los estándares académicos y de privacidad.
Prioridad: Alta

4.12.2 Secuencias de Estímulo/Respuesta

Un usuario intenta iniciar sesión; la contraseña se encripta y se crea una sesión segura.
Un usuario permanece inactivo por 30 minutos; la sesión expira y se cierra automáticamente.
Se solicita un restablecimiento de contraseña; se envía por correo un enlace con token temporal.
Un usuario intenta acceder a datos de otra universidad; el acceso es denegado.

4.12.3 Requisitos Funcionales

REQ-4.12.1: Todas las contraseñas se almacenan encriptadas usando un algoritmo seguro (bcrypt).
REQ-4.12.2: Todos los datos transmitidos entre cliente y servidor usarán HTTPS.
REQ-4.12.3: El sistema forzará cierre de sesión automático tras 30 minutos de inactividad.
REQ-4.12.4: Los usuarios tendrán un mecanismo seguro de restablecimiento de contraseña mediante tokens temporales enviados por email.
REQ-4.12.5: El sistema bloqueará cuentas tras 5 intentos fallidos de inicio de sesión (desbloqueo vía email).
REQ-4.12.6: Los roles de usuario (estudiante, egresado, admin) determinarán los niveles de acceso a datos y funciones.
REQ-4.12.7: Solo los administradores universitarios podrán acceder a registros de matrícula de su institución.
REQ-4.12.8: Los datos personales cumplirán políticas de privacidad, y campos sensibles (email, ID) no se expondrán en APIs públicas.

Manejo de Errores
4.13.1 Descripción y Prioridad

Esta funcionalidad garantiza que el sistema proporcione retroalimentación clara y amigable ante errores, incluyendo entradas inválidas, fallos del sistema o acciones no autorizadas. Se aplica a todos los módulos funcionales disponibles.
Prioridad: Alta

4.13.2 Secuencias de Estímulo/Respuesta

Un usuario ingresa credenciales incorrectas; el sistema muestra: "Email o contraseña incorrectos".
Se intenta registrar un ID de matrícula no reconocido o ya usado; "La matrícula no está registrada o ya fue utilizada".
Un usuario intenta publicar contenido vacío; "El contenido no puede estar vacío".
Un estudiante intenta unirse a un proyecto cerrado; "Este proyecto ya no acepta nuevos participantes".

4.13.3 Requisitos Funcionales

REQ-4.13.1: El sistema mostrará mensajes de error descriptivos en intentos de inicio de sesión fallidos (contraseña incorrecta o email no registrado).
REQ-4.13.2: El sistema notificará a los usuarios si el registro falla por matrículas no válidas o ya utilizadas.
REQ-4.13.3: El sistema validará entradas de publicaciones y comentarios, mostrando errores si los campos obligatorios están vacíos o mal formados.
REQ-4.13.5: Si un usuario intenta unirse a un proyecto/grupo con restricciones (lleno, cerrado), el sistema explicará el motivo de denegación.
REQ-4.13.6: Los errores nunca expondrán información sensible (rutas de servidor, errores de base de datos) en la interfaz.

4.14   Conversaciones
 
4.14.1 Descripción y Prioridad
 Permite la comunicación entre los usuarios a través de conversaciones asociadas a proyectos o hilos. Prioridad: Alta.
4.14.2 Secuencias de Estímulo/Respuesta
Un usuario accede a una conversación de proyecto o foro. El sistema muestra el historial de mensajes y permite enviar nuevos. Los mensajes se almacenan con su orden y autor.
4.14.3 Requisitos Funcionales
REQ-4.14.1: El sistema deberá permitir a los usuarios enviar y recibir mensajes dentro de conversaciones asociadas a proyectos o hilos.


REQ-4.14.2: El sistema deberá almacenar el historial de mensajes por conversación.


REQ-4.14.3: Solo los usuarios con acceso al proyecto, hilo o foro correspondiente podrán ver y participar en las conversaciones.

4.15  Eventos y Webinars.

 4.15.1 Descripción y Prioridad
Permite a las universidades organizar eventos y webinars. Los usuarios pueden visualizar, registrarse y marcar asistencia a eventos.
Prioridad: Media.
4.15.2 Secuencias de Estímulo/Respuesta
Una universidad crea un nuevo evento. El evento se publica en la plataforma. Los estudiantes pueden registrarse y marcar asistencia. La universidad ve la lista de asistentes.
4.15.3 Requisitos Funcionales
REQ-4.14.1: El sistema deberá permitir únicamente a las universidades crear, editar y eliminar eventos o webinars.
REQ-4.14.2: El sistema deberá mostrar los eventos disponibles a los usuarios registrados.
REQ-4.14.3: El sistema deberá permitir filtrar los eventos por fecha, tipo y universidad.
REQ-4.14.4: Los usuarios deberán poder registrarse en eventos desde la interfaz pública.
REQ-4.14.5: Los eventos deberán mostrar información detallada: descripción, organizador, fecha, modalidad y lugar/enlace.

4.16  Asistencia a Eventos.
4.16.1 Descripción y Prioridad
Permite registrar y consultar la asistencia de los usuarios a eventos académicos o webinars organizados por universidades.
Prioridad: Alta.

4.16.2 Secuencias de Estímulo/Respuesta

Un usuario se registra en un evento previamente publicado,
El sistema confirma su registro y posteriormente registra su asistencia (manualmente o por sistema).
La universidad organizadora puede acceder a la lista de asistentes.
El usuario puede consultar su historial de asistencia.

4.15.3 Requisitos Funcionales
REQ-4.15.1: El sistema deberá registrar la asistencia de los usuarios en cada evento.
REQ-4.15.2: El sistema deberá permitir a los usuarios consultar el historial de eventos asistidos.
REQ-4.15.3: Las universidades deberán poder consultar el listado de asistentes por evento.
REQ-4.15.4: El sistema deberá validar la asistencia real (opcionalmente con código QR, presencia online o formulario).
REQ-4.15.5: El sistema podrá emitir constancias de participación en eventos asistidos.


4.17 Publicación de oportunidades
4.17.1 Descripción y Prioridad
Permite a las universidades publicar oportunidades académicas dirigidas a estudiantes, como convocatorias a intercambios, becas, programas académicos y otras iniciativas que requieren postulación formal. Prioridad: Alta.

4.17.2 Secuencias de Estímulo/Respuesta
Una universidad accede al módulo de oportunidades.
Registra una nueva oportunidad con título, requisitos, fechas clave y descripción.
El sistema guarda y publica la oportunidad en el listado visible para los estudiantes,
Los estudiantes pueden consultar, filtrar y revisar oportunidades públicas, pero no modificarlas ni crearlas.
Las universidades pueden editar o eliminar sus propias oportunidades.

 4.17.3 Requisitos Funcionales
REQ-4.17.1: El sistema deberá permitir únicamente a los usuarios con rol de universidad crear, editar y eliminar oportunidades académicas.
REQ-4.17.2: El sistema deberá permitir a los estudiantes visualizar las oportunidades públicas.
REQ-4.17.3: El sistema deberá permitir filtrar las oportunidades por tipo y fecha
REQ-4.17.4: El sistema deberá mostrar todos los datos relevantes de la oportunidad (título, descripción, requisitos, fechas, etc.). 
REQ-4.17.5:  el sistema deberá registrar qué universidad creó cada oportunidad.




4.18 Postulaciones
4.18.1 Descripción y Prioridad
Permite a las empresas registrar oportunidades como vacantes, estadías, prácticas profesionales u otras ofertas dirigidas a estudiantes. Los estudiantes pueden visualizar estas ofertas y postularse a través de la plataforma. Las empresas son las únicas autorizadas para crear, editar o eliminar publicaciones. Prioridad: Alta.

4.18.2 Secuencias de Estímulo/Respuesta
Una empresa publica una nueva oferta. El sistema la guarda y la pone disponible para los estudiantes. Un estudiante interesado accede a la oportunidad, revisa los detalles y se postula. La empresa es notificada de la postulación y puede gestionar a los postulantes.

4.18.3 Requisitos funcionales
REQ-4.18.1: El sistema deberá permitir únicamente a los usuarios con rol de empresa crear, editar y eliminar oportunidades de postulación.
REQ-4.18.2: El sistema deberá permitir a los estudiantes visualizar las oportunidades disponibles y enviar su postulación.
REQ-4.18.3: El sistema deberá notificar a las empresas cuando un estudiante se postule a una oportunidad.
REQ-4.18.4: El sistema deberá permitir a  las empresas revisar los datos de los estudiantes postulados y gestionar su proceso (aceptar, rechazar, contactar, etc.).

4.19 Hilos de discusión
4.19.1 Descripción y Prioridad
Funcionalidad que permite a los usuarios participar en foros de discusión mediante hilos. Prioridad: Media

4.19.2 Requisitos Funcionales
REQ-4.19.1: Crear hilos dentro de un foro
REQ-4.19.2: Responder hilos
REQ-4.19.3: Visualizar hilos por orden cronológico o por relevancia
REQ-4.19.4: Relacionar hilos con usuarios (autor) y foros (contexto)
4.20 Etiquetados de contenido
4.20.1 Descripción y Prioridad
Permite a los usuarios organizar el contenido, como hilos de discusión, mediante etiquetas temáticas. Las etiquetas ayudan a clasificar, buscar y filtrar la información de forma eficiente. Prioridad: Media.

4.20.2 Requisitos Funcionales
REQ-4.20.1: El sistema deberá permitir a los usuarios asignar una o más etiquetas a un hilo durante su creación o edición.
REQ-4.20.2: El sistema deberá registrar el identificador del usuario que realizó el etiquetado.
REQ-4.20.3: El sistema deberá permitir visualizar las etiquetas asociadas a cada hilo
REQ-4.20.4: El sistema deberá permitir buscar y filtrar hilos por una o más etiquetas.
REQ-4.20.5: El sistema deberá permitir la gestión (creación, edición y eliminación) de etiquetas por parte de usuarios con permisos definidos.
4.21 Reporte de contenido
4.21.1 Descripción y Prioridad
Permite a los usuarios reportar contenido inapropiado (como comentarios ofensivos o spam) para que los moderadores del sistema puedan revisarlo y tomar acciones, Esta funcionalidad es clave para mantener un entorno seguro y respetuoso. Prioridad: Alta.

4.21.1 Requisitos Funcionales
REQ-4.21.1: El sistema deberá permitir a los usuarios reportar comentarios o contenidos que consideren inapropiados
REQ-4.21.2: El sistema deberá registrar los reportes con el identificador del comentario, el motivo del reporte y el usuario que lo reporto.
REQ-4.21.3: El sistema deberá notificar a los administradores o moderadores sobre nuevos reportes.
REQ-4.21.4: El sistema deberá permitir a los administradores revisar los reportes y tomar acciones (eliminar comentario, advertir usuario, etc.).
REQ-4.21.5: El sistema deberá evitar reportes duplicados por el mismo usuario sobre el mismo.
4.22 Registro de experiencias del alumno
4.22.1 Descripción y prioridad
Permite a los estudiantes registrar, actualizar o eliminar sus experiencias académicas o profesionales, facilitando que empresas o universidades conozcan su trayectoria. Estas experiencias pueden ser usadas como parte de filtros o métricas dentro de búsquedas o postulaciones

4.22.2 Secuencia de Estímulo/Respuesta
El estudiante accede a su perfil
Selecciona la opción para añadir una nueva experiencia.
Completa los campos requeridos.
Guarda la información.
El sistema actualiza el perfil con la experiencia registrada.
Las experiencias pueden ser consultadas por el propio usuario, y opcionalmente por empresas o universidades en proceso de búsqueda o postulación.

4.22.3 Requisitos Funcionales
REQ-4.22.1: El sistema deberá permitir a los usuarios con el rol de estudiante crear, editar y eliminar experiencias personales desde su perfil.
REQ-4.22.2: El sistema deberá asociar cada experiencia al identificador único del estudiante.
REQ-4.22.3: El sistema deberá permitir registrar datos como: empresa, cargo, descripción de actividad, fecha de inicio y fin.
REQ-4.22.4: El sistema deberá mostrar las experiencias del estudiante en su perfil de forma ordenada por fecha.
REQ-4.22.5: el sistema deberá permitir a empresas y universidades (según configuración de privacidad) visualizar las experiencias de un estudiante al revisar su perfil o postulación.


Roles
Funcionalidades de cada rol
Estudiantes
4.1 Registro de usuario
4.3 Login y autorización
4.4 Interacción Feed
4.5 Creación de foros
4.6 Búsqueda de usuarios
4.7 Creación de proyectos colaborativos
4.8 Espacio de colaboración en proyectos
4.14 Conversaciones
4.19 Hilos de discusión
4.20 Etiquetados de contenido
4.21 Reporte de contenido
4.22 Registro de experiencias
Graduados
Aplican las mismas funcionalidades del usuario “Estudiantes”
Administración Universitaria
4.2 Validación de inscripción
4.9 Verificación de proyectos por instituciones
4.10 Privilegios Administrativos
4.15 Eventos y Webinars
4.16 Asistencia a Eventos
4.17 Publicación de Oportunidades
Administration general (Super Administrador)
Tiene acceso a todas las funcionalidades
Promotores
4.6 Búsqueda de usuarios
4.18 Postulaciones


Otros Requisitos No Funcionales
Requisitos de Rendimiento
El sistema soportará mínimo 5,000 usuarios concurrentes sin degradación de rendimiento.
El tiempo de carga del feed no excederá 2 segundos en condiciones normales.
La autenticación de usuarios (inicio de sesión) se procesa en menos de 1.5 segundos.
La carga de archivos CSV de matrícula (hasta 5MB) y su validación se completará en 10 segundos máximo.
Las búsquedas (usuarios, proyectos o grupos) devolverán resultados en menos de 2 segundos para bases de hasta 50,000 usuarios.
Requisitos de Seguridad
UniON no maneja operaciones de riesgo vital o físicamente peligrosas. Sin embargo, debe garantizar la integridad de los datos académicos y de identidad.

El sistema evitará la eliminación de proyectos académicos verificados sin doble confirmación y aprobación institucional.
Un usuario no podrá realizar acciones críticas (abandonar un grupo verificado o borrar un proyecto) sin advertencias y confirmación secundaria.
Los archivos de matrícula corruptos o inválidos serán rechazados y no se almacenarán.
Ante fallos inesperados, el sistema informará al usuario y preservará los datos ingresados cuando sea posible.
Requisitos de Seguridad Técnica
Todas las credenciales de usuario se encriptan con un algoritmo de hashing seguro (ej. bcrypt).
Las transferencias de datos usarán HTTPS para protección.
La autenticación requerirá credenciales universitarias verificadas y registro vía email.
El control de acceso basado en roles evitará que estudiantes accedan a funciones administrativas o datos no autorizados.
Solo los administradores universitarios podrán subir o gestionar registros de matrícula de su institución.
Los datos personales/académicos cumplirán normativas de privacidad.
El sistema no expondrá emails o IDs internos en endpoints públicos o resultados de búsqueda.
Las sesiones caducarán automáticamente tras 30 minutos de inactividad.
Atributos de Calidad del Software
Atributo
Descripción
Usabilidad
La interfaz será intuitiva, con acciones accesibles en máximo 3 clics (para estudiantes, egresados y admins).
Disponibilidad
El sistema deberá mantener un 99.5% de tiempo de actividad, excluyendo las ventanas de mantenimiento programadas.
Escalabilidad
La infraestructura del backend y de la base de datos deberá soportar la escalabilidad horizontal para acomodar más universidades y usuarios con el tiempo.
Mantenibilidad
La arquitectura deberá permitir actualizaciones modulares, lo que posibilitará la adición de futuras características como notificaciones, mensajería y carga de multimedia sin requerir un rediseño completo.
Portabilidad
El sistema deberá ser completamente accesible en los principales navegadores modernos de escritorio.
Confiabilidad
UniON garantizará transacciones de datos fiables, particularmente durante la validación de inscripciones, después de la publicación y las actualizaciones del proyecto.
Adaptabilidad
El sistema debe ser lo suficientemente flexible para soportar la expansión multilingüe (español e inglés) y la tematización visual (modo oscuro/claro) en futuras versiones.


Reglas de Negocio
Solo los usuarios con estado de matrícula o graduación verificado pueden registrarse y participar en la plataforma. 
Los administradores universitarios solo pueden acceder y gestionar datos de su propia institución. 
Los proyectos no verificados siguen siendo visibles pero están limitados en visibilidad y capacidades hasta que sean aprobados. 
Solo los creadores de proyectos o administradores asignados pueden invitar a miembros o modificar información básica del proyecto. 
Los usuarios verificados pueden crear y participar en grupos, pero las herramientas de moderación de grupos solo están disponibles para sus creadores. 
Todo el contenido publicado (comentarios, publicaciones, descripciones de proyectos) debe cumplir con las pautas de la plataforma y puede ser eliminado por los administradores en caso de violaciones. 
Cada institución debe tener al menos un administrador asignado para gestionar matrículas y verificación de proyectos.

Propuesta de base de datos



Otros Requerimientos
<Defina cualquier otro requisito no cubierto en otra parte del SRS. Esto puede incluir requisitos de base de datos, requisitos de internacionalización, requisitos legales, objetivos de reutilización para el proyecto, etc. Agregue cualquier nueva sección que sea pertinente para el proyecto.>

Apéndice A: Glosario
<Definir todos los términos necesarios para interpretar correctamente el documento de Especificación de Requisitos de Software (SRS), incluyendo acrónimos y abreviaturas. Puede ser útil crear un glosario separado que abarque múltiples proyectos o toda la organización, incluyendo sólo los términos específicos de cada proyecto en su respectivo SRS.>

Apéndice B: Modelos de Análisis
<Opcionalmente, incluir cualquier modelo de análisis relevante, como diagramas de flujo de datos, diagramas de clases, diagramas de transición de estados o diagramas entidad-relación.>
Apéndice C: Lista por Determinar
<Coleccionar una lista numerada de las referencias TBD (por determinar) que quedan en el SRS para que puedan ser rastreadas hasta su cierre.>



































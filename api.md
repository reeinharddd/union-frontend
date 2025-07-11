Te ayudo a crear un documento completo y descriptivo de todos los endpoints de tu API Union. Basándome en el análisis de tu código, aquí tienes la documentación:

# 📚 Documentación Completa - Union API

## 🌟 Información General

**Union API** es una plataforma REST diseñada para conectar estudiantes universitarios, facilitando la comunicación, colaboración y acceso a oportunidades académicas.

- **Base URL:** `http://localhost:3000`
- **Documentación Interactiva:** `http://localhost:3000/api-docs`
- **Versión:** 1.0.0
- **Arquitectura:** REST API con Express.js y TypeScript
- **Base de Datos:** PostgreSQL con Drizzle ORM
- **Autenticación:** JWT (JSON Web Tokens)

---

## 🔐 Sistema de Autenticación

La API utiliza **JWT Tokens** para proteger los endpoints. Los tokens deben incluirse en el header de cada petición:

```http
Authorization: Bearer <tu-jwt-token>
```

### Roles de Usuario
- **user**: Usuario estándar con permisos básicos
- **admin**: Administrador con permisos completos

---

## 📋 Endpoints de Autenticación

### 🔓 POST `/api/auth/register`
**Propósito:** Registrar un nuevo usuario en la plataforma.

**Autenticación:** ❌ No requerida

**Descripción:** Este endpoint permite crear una nueva cuenta de usuario. El sistema automáticamente encripta la contraseña usando bcrypt y genera un token JWT para autenticación inmediata.

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu.co",
  "password": "password123",
  "name": "Juan Pérez",
  "role": "user",
  "address": "Carrera 10 #15-30, Bogotá"
}
```

**Campos Requeridos:**
- `email` (string): Email válido del usuario
- `password` (string): Contraseña de mínimo 6 caracteres

**Campos Opcionales:**
- `name` (string): Nombre completo del usuario
- `role` (string): Rol del usuario (por defecto "user")
- `address` (string): Dirección del usuario

**Response Exitoso (201):**
```json
{
  "user": {
    "id": 1,
    "email": "estudiante@universidad.edu.co",
    "name": "Juan Pérez",
    "role": "user",
    "address": "Carrera 10 #15-30, Bogotá"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Casos de Error:**
- **400**: Datos inválidos (email duplicado, contraseña muy corta)
- **500**: Error interno del servidor

---

### 🔑 POST `/api/auth/login`
**Propósito:** Iniciar sesión en la plataforma.

**Autenticación:** ❌ No requerida

**Descripción:** Valida las credenciales del usuario y retorna un token JWT válido por 30 días. El sistema verifica la contraseña usando bcrypt.

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu.co",
  "password": "password123"
}
```

**Response Exitoso (200):**
```json
{
  "user": {
    "id": 1,
    "email": "estudiante@universidad.edu.co",
    "name": "Juan Pérez",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Casos de Error:**
- **401**: Credenciales incorrectas
- **500**: Error interno del servidor

---

## 👥 Endpoints de Gestión de Usuarios

### 👤 GET `/api/users`
**Propósito:** Obtener lista completa de usuarios registrados.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna todos los usuarios del sistema. Las contraseñas están ocultas por seguridad. Útil para administradores o funcionalidades de búsqueda de usuarios.

**Parámetros:** Ninguno

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "email": "usuario1@universidad.edu.co",
    "name": "Juan Pérez",
    "role": "user",
    "address": "Calle 123"
  },
  {
    "id": 2,
    "email": "admin@universidad.edu.co",
    "name": "María Admin",
    "role": "admin",
    "address": "Oficina Central"
  }
]
```

**Casos de Error:**
- **401**: Token inválido o no proporcionado
- **500**: Error interno del servidor

---

### 👤 GET `/api/users/{id}`
**Propósito:** Obtener información detallada de un usuario específico.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna la información completa de un usuario por su ID. La contraseña está oculta por seguridad.

**Parámetros URL:**
- `id` (integer): ID único del usuario

**Response Exitoso (200):**
```json
{
  "id": 1,
  "email": "usuario@universidad.edu.co",
  "name": "Juan Pérez",
  "role": "user",
  "address": "Calle 123"
}
```

**Casos de Error:**
- **401**: Token inválido
- **404**: Usuario no encontrado
- **500**: Error interno del servidor

---

### 👥 POST `/api/users`
**Propósito:** Crear un nuevo usuario (solo administradores).

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite a administradores crear nuevos usuarios directamente. Útil para registro masivo o creación de cuentas especiales.

**Request Body:**
```json
{
  "email": "nuevo@universidad.edu.co",
  "password": "password123",
  "name": "Nuevo Usuario",
  "role": "user",
  "address": "Nueva dirección"
}
```

**Response Exitoso (201):**
```json
{
  "id": 3,
  "email": "nuevo@universidad.edu.co",
  "name": "Nuevo Usuario",
  "role": "user",
  "address": "Nueva dirección"
}
```

**Casos de Error:**
- **401**: No autorizado (no es admin)
- **400**: Datos inválidos
- **500**: Error interno del servidor

---

### ✏️ PUT `/api/users/{id}`
**Propósito:** Actualizar información de un usuario existente.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite modificar cualquier campo del usuario. Si se actualiza la contraseña, se reencripta automáticamente.

**Parámetros URL:**
- `id` (integer): ID del usuario a actualizar

**Request Body (todos los campos son opcionales):**
```json
{
  "email": "emailactualizado@universidad.edu.co",
  "password": "nuevapassword123",
  "name": "Nombre Actualizado",
  "role": "admin",
  "address": "Nueva dirección"
}
```

**Response Exitoso (200):**
```json
{
  "id": 1,
  "email": "emailactualizado@universidad.edu.co",
  "name": "Nombre Actualizado",
  "role": "admin",
  "address": "Nueva dirección"
}
```

---

### 🗑️ DELETE `/api/users/{id}`
**Propósito:** Eliminar un usuario del sistema.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Elimina permanentemente un usuario y toda su información asociada.

**Parámetros URL:**
- `id` (integer): ID del usuario a eliminar

**Response Exitoso (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

**Casos de Error:**
- **401**: No autorizado
- **404**: Usuario no encontrado
- **500**: Error interno del servidor

---

## 🏫 Endpoints de Universidades

### 🏛️ GET `/api/universidades`
**Propósito:** Obtener lista de todas las universidades registradas.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna información completa de todas las universidades en el sistema. Útil para formularios de selección y búsquedas.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "nombre": "Universidad Nacional de Colombia",
    "dominio_correo": "unal.edu.co",
    "logo_url": "https://ejemplo.com/logos/unal.png"
  },
  {
    "id": 2,
    "nombre": "Universidad de los Andes",
    "dominio_correo": "uniandes.edu.co",
    "logo_url": "https://ejemplo.com/logos/uniandes.png"
  }
]
```

---

### 🏛️ GET `/api/universidades/{id}`
**Propósito:** Obtener información detallada de una universidad específica.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna todos los datos de una universidad particular, incluyendo nombre, dominio de correo y URL del logo.

**Parámetros URL:**
- `id` (integer): ID único de la universidad

**Response Exitoso (200):**
```json
{
  "id": 1,
  "nombre": "Universidad Nacional de Colombia",
  "dominio_correo": "unal.edu.co",
  "logo_url": "https://ejemplo.com/logos/unal.png"
}
```

---

### 🏛️ POST `/api/universidades`
**Propósito:** Registrar una nueva universidad en el sistema.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite a administradores agregar nuevas instituciones educativas al directorio.

**Request Body:**
```json
{
  "nombre": "Universidad Pontificia Javeriana",
  "dominio_correo": "javeriana.edu.co",
  "logo_url": "https://ejemplo.com/logos/javeriana.png"
}
```

**Campos Requeridos:**
- `nombre` (string, max 150): Nombre oficial de la universidad
- `dominio_correo` (string, max 100): Dominio del correo institucional

**Campos Opcionales:**
- `logo_url` (string): URL del logo institucional

**Response Exitoso (201):**
```json
{
  "id": 3,
  "nombre": "Universidad Pontificia Javeriana",
  "dominio_correo": "javeriana.edu.co",
  "logo_url": "https://ejemplo.com/logos/javeriana.png"
}
```

---

### ✏️ PUT `/api/universidades/{id}`
**Propósito:** Actualizar información de una universidad existente.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite modificar datos institucionales como nombre, dominio de correo o logo.

**Parámetros URL:**
- `id` (integer): ID de la universidad

**Request Body (todos los campos son opcionales):**
```json
{
  "nombre": "Nombre Actualizado",
  "dominio_correo": "nuevo-dominio.edu.co",
  "logo_url": "https://nuevo-logo.com/logo.png"
}
```

---

### 🗑️ DELETE `/api/universidades/{id}`
**Propósito:** Eliminar una universidad del sistema.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Elimina una institución educativa del directorio. **Precaución:** Esta acción puede afectar datos relacionados.

**Response Exitoso (200):**
```json
{
  "message": "Universidad eliminada correctamente"
}
```

---

## 📅 Endpoints de Eventos

### 🎉 GET `/api/eventos`
**Propósito:** Obtener lista de todos los eventos programados.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna eventos académicos, conferencias, talleres y actividades universitarias. Incluye información completa con fechas, ubicaciones y enlaces de acceso.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "titulo": "Conferencia de Inteligencia Artificial",
    "descripcion": "Evento sobre las últimas tendencias en IA aplicada a la educación",
    "tipo": "Conferencia",
    "creador_id": 1,
    "universidad_id": 1,
    "fecha_inicio": "2024-02-15T09:00:00Z",
    "fecha_fin": "2024-02-15T17:00:00Z",
    "enlace_acceso": "https://meet.google.com/abc-def-ghi",
    "creado_en": "2024-01-20T10:00:00Z"
  }
]
```

---

### 🎉 GET `/api/eventos/{id}`
**Propósito:** Obtener detalles completos de un evento específico.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna información detallada de un evento, incluyendo descripción completa, horarios exactos y enlaces de participación.

**Parámetros URL:**
- `id` (integer): ID único del evento

---

### 🎉 POST `/api/eventos`
**Propósito:** Crear un nuevo evento.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite a administradores programar nuevos eventos académicos, sociales o institucionales.

**Request Body:**
```json
{
  "titulo": "Hackathón Universitario 2024",
  "descripcion": "Competencia de programación de 48 horas para estudiantes universitarios",
  "tipo": "Competencia",
  "creador_id": 1,
  "universidad_id": 1,
  "fecha_inicio": "2024-03-20T18:00:00Z",
  "fecha_fin": "2024-03-22T18:00:00Z",
  "enlace_acceso": "https://hackathon.universidad.edu.co"
}
```

**Campos Requeridos:**
- `titulo` (string, max 200): Nombre del evento
- `descripcion` (string): Descripción detallada
- `tipo` (string, max 100): Categoría del evento
- `creador_id` (integer): ID del usuario organizador
- `universidad_id` (integer): ID de la universidad anfitriona
- `fecha_inicio` (datetime): Fecha y hora de inicio
- `fecha_fin` (datetime): Fecha y hora de finalización

**Campos Opcionales:**
- `enlace_acceso` (string): URL para participar virtualmente

---

### ✏️ PUT `/api/eventos/{id}`
**Propósito:** Actualizar información de un evento existente.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite modificar detalles del evento como fechas, descripción o enlaces de acceso.

---

### 🗑️ DELETE `/api/eventos/{id}`
**Propósito:** Cancelar y eliminar un evento.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Elimina un evento del calendario. **Nota:** Esto también puede afectar las asistencias registradas.

---

## 💬 Endpoints de Foros

### 🗣️ GET `/api/foros`
**Propósito:** Obtener lista de todos los foros de discusión.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna espacios de discusión temáticos donde los estudiantes pueden intercambiar ideas y conocimientos.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "nombre": "Foro de Programación",
    "descripcion": "Espacio para discutir sobre lenguajes de programación, frameworks y mejores prácticas"
  },
  {
    "id": 2,
    "nombre": "Foro de Matemáticas",
    "descripcion": "Resolución de problemas matemáticos y discusión de teoremas"
  }
]
```

---

### 🗣️ POST `/api/foros`
**Propósito:** Crear un nuevo foro de discusión.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite a administradores establecer nuevos espacios de discusión temáticos para la comunidad universitaria.

**Request Body:**
```json
{
  "nombre": "Foro de Inteligencia Artificial",
  "descripcion": "Discusión sobre machine learning, deep learning y aplicaciones de IA"
}
```

**Campos Requeridos:**
- `nombre` (string, max 100): Nombre del foro

**Campos Opcionales:**
- `descripcion` (string): Descripción del propósito del foro

---

## 🎯 Endpoints de Oportunidades

### 🌟 GET `/api/oportunidades`
**Propósito:** Listar todas las oportunidades académicas y profesionales.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna becas, intercambios, prácticas profesionales, empleos y otras oportunidades disponibles para estudiantes.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "titulo": "Beca de Excelencia Académica 2024",
    "descripcion": "Beca completa para estudiantes destacados con promedio superior a 4.5",
    "tipo": "Beca",
    "universidad_id": 1,
    "fecha_limite": "2024-03-31"
  },
  {
    "id": 2,
    "titulo": "Intercambio con Universidad de Barcelona",
    "descripcion": "Programa de intercambio académico de un semestre en España",
    "tipo": "Intercambio",
    "universidad_id": 1,
    "fecha_limite": "2024-04-15"
  }
]
```

---

### 🌟 POST `/api/oportunidades`
**Propósito:** Publicar una nueva oportunidad.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite a administradores agregar nuevas oportunidades como becas, empleos, intercambios o prácticas profesionales.

**Request Body:**
```json
{
  "titulo": "Práctica Profesional en Google",
  "descripcion": "Programa de prácticas de verano en desarrollo de software con mentores senior",
  "tipo": "Práctica Profesional",
  "universidad_id": 1,
  "fecha_limite": "2024-05-20"
}
```

**Campos Requeridos:**
- `titulo` (string, max 200): Título de la oportunidad
- `descripcion` (string): Descripción detallada
- `tipo` (string, max 100): Categoría (Beca, Intercambio, Empleo, etc.)
- `universidad_id` (integer): Universidad patrocinadora
- `fecha_limite` (date): Fecha límite para aplicar

---

## 🏷️ Endpoints de Tags

### 🔖 GET `/api/tags`
**Propósito:** Obtener lista de todas las etiquetas disponibles.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna etiquetas usadas para categorizar contenido, proyectos y áreas de interés. Útil para filtros y búsquedas.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "nombre": "JavaScript"
  },
  {
    "id": 2,
    "nombre": "Machine Learning"
  },
  {
    "id": 3,
    "nombre": "Diseño UX"
  }
]
```

---

### 🔖 POST `/api/tags`
**Propósito:** Crear una nueva etiqueta.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite agregar nuevas etiquetas al sistema para mejorar la categorización del contenido.

**Request Body:**
```json
{
  "nombre": "Blockchain"
}
```

---

## 💭 Endpoints de Conversaciones

### 💬 GET `/api/conversaciones`
**Propósito:** Obtener lista de conversaciones del usuario.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna las conversaciones privadas entre usuarios para facilitar la comunicación directa.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "usuario_1_id": 1,
    "usuario_2_id": 2,
    "creado_en": "2024-01-15T10:30:00Z"
  }
]
```

---

### 💬 POST `/api/conversaciones`
**Propósito:** Iniciar una nueva conversación entre usuarios.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Crea un canal de comunicación privado entre dos usuarios. El sistema previene conversaciones duplicadas.

**Request Body:**
```json
{
  "usuario_1_id": 1,
  "usuario_2_id": 3
}
```

**Casos Especiales:**
- **409**: La conversación ya existe entre estos usuarios

---

## 💌 Endpoints de Mensajes

### 📨 GET `/api/mensajes`
**Propósito:** Obtener mensajes del sistema.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna mensajes de conversaciones. Incluye información sobre estado de lectura y timestamps.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "conversacion_id": 1,
    "emisor_id": 1,
    "contenido": "Hola, ¿cómo estás?",
    "enviado_en": "2024-01-15T14:30:00Z",
    "leido": false
  }
]
```

---

### 📨 POST `/api/mensajes`
**Propósito:** Enviar un nuevo mensaje.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite enviar mensajes dentro de una conversación existente.

**Request Body:**
```json
{
  "conversacion_id": 1,
  "emisor_id": 1,
  "contenido": "¡Perfecto! Nos vemos mañana en la biblioteca.",
  "leido": false
}
```

---

## 👨‍💼 Endpoints de Roles

### 👤 Roles de Usuario - `/api/roles-usuario`

**Propósito:** Gestionar roles y permisos de usuarios en el sistema.

**Operaciones Disponibles:**
- **GET** `/api/roles-usuario` - Listar todos los roles
- **GET** `/api/roles-usuario/{id}` - Obtener rol específico
- **POST** `/api/roles-usuario` - Crear nuevo rol (Admin)
- **PUT** `/api/roles-usuario/{id}` - Actualizar rol (Admin)
- **DELETE** `/api/roles-usuario/{id}` - Eliminar rol (Admin)

**Ejemplo de Rol:**
```json
{
  "id": 1,
  "nombre": "Estudiante de Pregrado"
}
```

---

### 📋 Roles de Proyecto - `/api/roles-proyecto`

**Propósito:** Definir roles específicos para colaboración en proyectos académicos.

**Ejemplo de Rol de Proyecto:**
```json
{
  "id": 1,
  "nombre": "Líder de Proyecto",
  "puede_editar": true,
  "puede_comentar": true,
  "puede_subir_archivos": true,
  "puede_validar": true
}
```

**Permisos Configurables:**
- `puede_editar`: Modificar contenido del proyecto
- `puede_comentar`: Agregar comentarios y feedback
- `puede_subir_archivos`: Cargar documentos y recursos
- `puede_validar`: Aprobar cambios y validar trabajo

---

## ✅ Endpoints de Asistencias a Eventos

### 📋 GET `/api/asistencias-eventos`
**Propósito:** Obtener registros de asistencia a eventos.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna información sobre quién se ha registrado para asistir a eventos específicos.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "evento_id": 1,
    "usuario_id": 2,
    "registrado_en": "2024-01-20T09:15:00Z"
  }
]
```

---

### 📋 POST `/api/asistencias-eventos`
**Propósito:** Registrar asistencia a un evento.

**Autenticación:** ✅ Token + Admin requerido

**Descripción:** Permite confirmar la participación de un usuario en un evento específico.

**Request Body:**
```json
{
  "evento_id": 1,
  "usuario_id": 2
}
```

---

## 📊 Endpoints de Actividad de Usuario

### 📈 GET `/api/actividad-usuario`
**Propósito:** Obtener registro de actividades de los usuarios.

**Autenticación:** ✅ Token requerido

**Descripción:** Retorna un historial de acciones realizadas por los usuarios en la plataforma para análisis y seguimiento.

**Response Exitoso (200):**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "tipo_actividad": "evento_asistido",
    "objeto_id": 5,
    "contexto": "eventos",
    "fecha": "2024-01-15T16:00:00Z"
  }
]
```

**Tipos de Actividad Comunes:**
- `evento_asistido`: Usuario asistió a un evento
- `mensaje_enviado`: Usuario envió un mensaje
- `foro_comentario`: Usuario comentó en un foro
- `oportunidad_aplicada`: Usuario aplicó a una oportunidad

---

## 🛍️ Endpoints de E-commerce (Productos y Órdenes)

### 📦 Productos - `/api/products`

**Propósito:** Gestionar productos en el marketplace universitario.

#### GET `/api/products`
**Autenticación:** ❌ Público

**Descripción:** Retorna catálogo de productos disponibles (libros, materiales, servicios).

#### POST `/api/products`
**Autenticación:** ✅ Token + Admin requerido

**Request Body:**
```json
{
  "name": "Cálculo Diferencial - James Stewart",
  "description": "Libro de texto para curso de Cálculo I",
  "image": "https://ejemplo.com/libro-calculo.jpg",
  "price": 150000
}
```

---

### 🛒 Órdenes - `/api/orders`

**Propósito:** Gestionar pedidos y transacciones.

#### POST `/api/orders`
**Autenticación:** ✅ Token requerido

**Descripción:** Crear nueva orden de compra con múltiples productos.

**Request Body:**
```json
{
  "order": {},
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "price": 150000
    }
  ]
}
```

---

## ⚠️ Códigos de Estado HTTP

| Código | Descripción | Cuándo Ocurre |
|--------|-------------|---------------|
| **200** | OK | Operación exitosa |
| **201** | Created | Recurso creado correctamente |
| **400** | Bad Request | Datos inválidos o faltantes |
| **401** | Unauthorized | Token inválido o permisos insuficientes |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: duplicado) |
| **500** | Internal Server Error | Error del servidor |

---

## 🔒 Ejemplos de Errores Comunes

### Error de Validación (400)
```json
{
  "error": "Invalid data",
  "details": [
    {
      "message": "Email is required"
    },
    {
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Error de Autenticación (401)
```json
{
  "error": "Access denied"
}
```

### Error de Recurso No Encontrado (404)
```json
{
  "error": "Usuario no encontrado"
}
```

### Error de Conflicto (409)
```json
{
  "error": "La conversación ya existe"
}
```

---

## 🚀 Instrucciones de Desarrollo

### Ejecutar el Proyecto
```bash
# Desarrollo con npm
npm run dev

# Desarrollo con bun
bun run dev

# Construir para producción
npm run build
```

### Base de Datos
```bash
# Generar migraciones
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio
```

### Variables de Entorno
Crear archivo .env:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/union
JWT_SECRET=your-super-secret-key
```

---

## 📚 Recursos Adicionales

- **Swagger UI Interactivo:** `http://localhost:3000/api-docs`
- **Schema JSON:** `http://localhost:3000/api-docs.json`
- **Puerto de Desarrollo:** 3000
- **Puerto Docker:** 13000 (configurado en docker-compose)

---

Esta documentación cubre todos los aspectos funcionales de la API Union, proporcionando ejemplos claros y casos de uso para cada endpoint. La plataforma está diseñada para facilitar la colaboración académica y el intercambio de oportunidades en el entorno universitario.

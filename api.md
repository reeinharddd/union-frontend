# 📖 UniON API - Documentación Completa de Endpoints

## 🔐 Sistema de Autenticación

### Seguridad Global
- **Bearer Token**: La mayoría de endpoints requieren `Authorization: Bearer <jwt_token>`
- **Rate Limiting**: No implementado actualmente
- **CORS**: Configurado para `http://localhost:4200`
- **Validación**: Todos los endpoints usan Zod para validación de datos

---

## 📋 MÓDULOS Y ENDPOINTS

### 1. 🔐 **Autenticación (`/api/auth`)**

#### **POST `/api/auth/register`**
**Descripción**: Registra un nuevo usuario en el sistema.
**Seguridad**: Público
**Validación**: `insertUsuarioSchema`

**Request Body**:
```json
{
  "nombre": "string (max 100)",
  "correo": "string (email, max 150)",
  "contraseña": "string (min 6)",
  "rol_id": "integer",
  "universidad_id": "integer (opcional)",
  "matricula": "string (max 50, opcional)",
  "telefono": "string (max 20, opcional)",
  "github_url": "string (url, opcional)",
  "linkedin_url": "string (url, opcional)",
  "biografia": "string (opcional)",
  "cv_url": "string (url, opcional)",
  "cv_publico": "boolean (opcional, default: false)"
}
```

**Response (201)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@universidad.edu",
    "rol_id": 2,
    "universidad_id": 1,
    "verificado": false,
    "is_active": true,
    "creado_en": "2025-01-01T00:00:00.000Z"
  }
}
```

**Errores**:
- `400`: Datos de validación incorrectos
- `500`: Error interno del servidor

**Logging**:
- Request: Email de registro
- Success: Usuario creado exitosamente
- Error: Fallos de validación o creación

---

#### **POST `/api/auth/login`**
**Descripción**: Autentica un usuario con email y contraseña.
**Seguridad**: Público
**Validación**: `loginSchema`

**Request Body**:
```json
{
  "correo": "string (email, max 150)",
  "contraseña": "string (min 1)"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@universidad.edu",
    "rol_id": 2,
    "last_login_at": "2025-01-01T12:00:00.000Z"
  }
}
```

**Errores**:
- `401`: Credenciales inválidas
- `400`: Datos de validación incorrectos
- `500`: Error interno del servidor

**Logging**:
- Request: Intento de login
- Success: Login exitoso con actualización de last_login_at
- Error: Credenciales inválidas o errores de BD

---

### 2. 👥 **Usuarios (`/api/usuarios`)**

#### **GET `/api/usuarios`**
**Descripción**: Obtiene lista de todos los usuarios registrados.
**Seguridad**: Requiere autenticación
**Permisos**: Cualquier usuario autenticado

**Query Parameters**:
```
?limit=10&offset=0&search=juan&universidad_id=1&rol_id=2&is_active=true
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@universidad.edu",
    "rol_id": 2,
    "universidad_id": 1,
    "matricula": "123456",
    "telefono": "+1234567890",
    "verificado": true,
    "is_active": true,
    "github_url": "https://github.com/juan",
    "linkedin_url": "https://linkedin.com/in/juan",
    "biografia": "Estudiante de ingeniería",
    "cv_publico": true,
    "creado_en": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T12:00:00.000Z",
    "last_login_at": "2025-01-01T12:00:00.000Z"
  }
]
```

---

#### **GET `/api/usuarios/{id}`**
**Descripción**: Obtiene información detallada de un usuario específico.
**Seguridad**: Requiere autenticación
**Permisos**: 
- Propietario: Ve toda la información
- Otros usuarios: Solo información pública

**Parameters**:
- `id` (path): ID del usuario (integer, required)

**Response (200)**:
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan@universidad.edu", // Solo si es propietario o admin
  "telefono": "+1234567890", // Solo si es propietario o admin
  "rol_id": 2,
  "universidad_id": 1,
  "matricula": "123456",
  "verificado": true,
  "github_url": "https://github.com/juan",
  "linkedin_url": "https://linkedin.com/in/juan",
  "biografia": "Estudiante de ingeniería",
  "cv_url": "https://example.com/cv.pdf", // Solo si cv_publico=true o es propietario
  "cv_publico": true,
  "proyectos_count": 5,
  "participaciones_count": 12
}
```

**Errores**:
- `404`: Usuario no encontrado
- `401`: No autenticado
- `403`: Sin permisos para ver información privada

---

#### **PUT `/api/usuarios/{id}`**
**Descripción**: Actualiza información de un usuario.
**Seguridad**: Requiere autenticación
**Permisos**: Solo el propietario o administradores
**Validación**: `updateUsuarioSchema`

**Parameters**:
- `id` (path): ID del usuario (integer, required)

**Request Body** (todos los campos opcionales):
```json
{
  "nombre": "string (max 100)",
  "telefono": "string (max 20)",
  "github_url": "string (url)",
  "linkedin_url": "string (url)",
  "biografia": "string",
  "cv_url": "string (url)",
  "cv_publico": "boolean"
}
```

**Response (200)**:
```json
{
  "id": 1,
  "nombre": "Juan Pérez Actualizado",
  "updated_at": "2025-01-01T13:00:00.000Z",
  "message": "Usuario actualizado exitosamente"
}
```

---

#### **DELETE `/api/usuarios/{id}`**
**Descripción**: Desactiva un usuario (soft delete).
**Seguridad**: Requiere autenticación
**Permisos**: Solo administradores o el propio usuario

**Parameters**:
- `id` (path): ID del usuario (integer, required)

**Response (200)**:
```json
{
  "message": "Usuario desactivado exitosamente",
  "id": 1
}
```

---

### 3. 🏫 **Universidades (`/api/universidades`)**

#### **GET `/api/universidades`**
**Descripción**: Obtiene lista de todas las universidades registradas.
**Seguridad**: Público

**Response (200)**:
```json
[
  {
    "id": 1,
    "nombre": "Universidad Tecnológica Nacional",
    "dominio_correo": "universidad.edu",
    "logo_url": "https://example.com/logo.png",
    "estudiantes_count": 1250,
    "proyectos_count": 45
  }
]
```

---

#### **POST `/api/universidades`**
**Descripción**: Registra una nueva universidad.
**Seguridad**: Requiere autenticación
**Permisos**: Solo administradores
**Validación**: `insertUniversidadSchema`

**Request Body**:
```json
{
  "nombre": "string (max 150, required)",
  "dominio_correo": "string (max 100, required)",
  "logo_url": "string (url, opcional)"
}
```

---

### 4. 🚀 **Proyectos (`/api/proyectos`)**

#### **GET `/api/proyectos`**
**Descripción**: Obtiene lista de proyectos con filtros y paginación.
**Seguridad**: Requiere autenticación

**Query Parameters**:
```
?limit=10&offset=0&universidad_id=1&creador_id=5&estado_verificacion=aprobado&vista_publica=true&search=react
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Sistema de Gestión Estudiantil",
      "descripcion": "Plataforma web para gestión académica",
      "creador_id": 1,
      "creador_nombre": "Juan Pérez",
      "universidad_id": 1,
      "universidad_nombre": "UTN",
      "estado_verificacion": "aprobado",
      "vista_publica": true,
      "repositorio_url": "https://github.com/juan/proyecto",
      "demo_url": "https://demo.proyecto.com",
      "creado_en": "2025-01-01T00:00:00.000Z",
      "participantes_count": 5,
      "tecnologias": ["React", "Node.js", "PostgreSQL"],
      "likes_count": 23
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

#### **POST `/api/proyectos`**
**Descripción**: Crea un nuevo proyecto.
**Seguridad**: Requiere autenticación
**Permisos**: Estudiantes y superiores
**Validación**: `insertProyectoSchema`

**Request Body**:
```json
{
  "nombre": "string (max 200, required)",
  "descripcion": "string (required)",
  "universidad_id": "integer (required)",
  "repositorio_url": "string (url, opcional)",
  "demo_url": "string (url, opcional)",
  "vista_publica": "boolean (opcional, default: true)"
}
```

**Response (201)**:
```json
{
  "id": 1,
  "nombre": "Mi Proyecto",
  "creador_id": 5,
  "estado_verificacion": "pendiente",
  "creado_en": "2025-01-01T12:00:00.000Z",
  "message": "Proyecto creado exitosamente"
}
```

---

### 5. 🎉 **Eventos (`/api/eventos`)**

#### **GET `/api/eventos`**
**Descripción**: Obtiene lista de eventos disponibles.
**Seguridad**: Requiere autenticación

**Query Parameters**:
```
?limit=10&offset=0&universidad_id=1&tipo=conferencia&fecha_desde=2025-01-01&fecha_hasta=2025-12-31&es_virtual=true
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Conferencia de Tecnología 2025",
      "descripcion": "Evento sobre las últimas tendencias tecnológicas",
      "tipo": "conferencia",
      "creador_id": 1,
      "creador_nombre": "Dr. María González",
      "universidad_id": 1,
      "universidad_nombre": "UTN",
      "fecha_inicio": "2025-03-15T09:00:00.000Z",
      "fecha_fin": "2025-03-15T17:00:00.000Z",
      "enlace_acceso": "https://zoom.us/meeting/123",
      "ubicacion": "Auditorio Principal",
      "capacidad_maxima": 200,
      "es_virtual": false,
      "requiere_registro": true,
      "asistentes_registrados": 150,
      "creado_en": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### **POST `/api/eventos`**
**Descripción**: Crea un nuevo evento.
**Seguridad**: Requiere autenticación
**Permisos**: Profesores y administradores
**Validación**: `insertEventoSchema`

**Request Body**:
```json
{
  "titulo": "string (max 200, required)",
  "descripcion": "string (required)",
  "tipo": "string (max 100, required)",
  "universidad_id": "integer (required)",
  "fecha_inicio": "string ISO date (required)",
  "fecha_fin": "string ISO date (opcional)",
  "enlace_acceso": "string (opcional)",
  "ubicacion": "string (max 200, opcional)",
  "capacidad_maxima": "integer (opcional)",
  "es_virtual": "boolean (opcional, default: false)",
  "requiere_registro": "boolean (opcional, default: true)"
}
```

---

### 6. 📝 **Ofertas Laborales (`/api/ofertas-laborales`)**

#### **GET `/api/ofertas-laborales`**
**Descripción**: Obtiene lista de ofertas laborales activas.
**Seguridad**: Requiere autenticación

**Query Parameters**:
```
?limit=10&offset=0&empresa=google&ubicacion=remoto&tipo_contrato=tiempo_completo&salario_min=50000&activo=true
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "logo_url": "https://company.com/logo.png",
      "titulo": "Desarrollador Frontend React",
      "descripcion": "Buscamos desarrollador con experiencia en React...",
      "empresa": "TechCorp",
      "ubicacion": "Ciudad de México / Remoto",
      "tipo_contrato": "Tiempo completo",
      "salario": "$50,000 - $70,000 MXN",
      "fecha_publicacion": "2025-01-15",
      "fecha_limite": "2025-02-15",
      "creado_por": 1,
      "estado": "activo",
      "postulaciones_count": 25,
      "creado_en": "2025-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 7. 💬 **Foros (`/api/foros`)**

#### **GET `/api/foros`**
**Descripción**: Obtiene lista de foros disponibles.
**Seguridad**: Requiere autenticación

**Response (200)**:
```json
[
  {
    "id": 1,
    "nombre": "Desarrollo Web",
    "descripcion": "Discusiones sobre tecnologías web",
    "hilos_count": 125,
    "ultimo_hilo": {
      "id": 45,
      "titulo": "¿Mejores prácticas en React?",
      "creado_en": "2025-01-20T10:30:00.000Z"
    }
  }
]
```

---

### 8. 🧵 **Hilos (`/api/hilos`)**

#### **GET `/api/hilos`**
**Descripción**: Obtiene hilos de discusión con filtros.
**Seguridad**: Requiere autenticación

**Query Parameters**:
```
?foro_id=1&limit=20&offset=0&creador_id=5&search=react
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "foro_id": 1,
      "foro_nombre": "Desarrollo Web",
      "titulo": "¿Mejores prácticas en React Hooks?",
      "contenido": "Me gustaría conocer sus opiniones sobre...",
      "creador_id": 5,
      "creador_nombre": "Ana López",
      "creado_en": "2025-01-20T10:30:00.000Z",
      "respuestas_count": 12,
      "ultima_respuesta": "2025-01-20T15:45:00.000Z"
    }
  ]
}
```

---

## 🔒 **CÓDIGOS DE ESTADO Y MANEJO DE ERRORES**

### Códigos HTTP Estándar:
- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o faltantes
- **401**: Unauthorized - Token faltante o inválido
- **403**: Forbidden - Sin permisos para la operación
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - Conflicto (ej: email ya existe)
- **422**: Unprocessable Entity - Error de validación
- **500**: Internal Server Error - Error interno

### Formato de Errores:
```json
{
  "error": "Validation failed",
  "message": "Los datos proporcionados no son válidos",
  "details": [
    {
      "field": "correo",
      "message": "Debe ser un email válido"
    }
  ],
  "timestamp": "2025-01-20T12:00:00.000Z",
  "path": "/api/usuarios",
  "requestId": "uuid-request-id"
}
```

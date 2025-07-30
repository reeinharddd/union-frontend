export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  // Usuarios
  USERS: {
    BASE: '/usuarios',
    BY_ID: (id: number) => `/usuarios/${id}`,
  },

  // Universidades - ✅ Corregidos según API
  UNIVERSITIES: {
    BASE: '/universidades',
    BY_ID: (id: number) => `/universidades/${id}`,
  },

  // Eventos - ✅ Corregidos según API
  EVENTS: {
    BASE: '/eventos',
    BY_ID: (id: number) => `/eventos/${id}`,
    ATTENDANCES: '/asistencias-eventos',
  },

  // Foros
  FORUMS: {
    BASE: '/foros',
    BY_ID: (id: number) => `/foros/${id}`,
  },

  // Oportunidades
  OPPORTUNITIES: {
    BASE: '/oportunidades',
    BY_ID: (id: number) => `/oportunidades/${id}`,
  },

  // Tags
  TAGS: {
    BASE: '/tags',
    BY_ID: (id: number) => `/tags/${id}`,
  },

  // Conversaciones y Mensajes
  CONVERSATIONS: {
    BASE: '/conversaciones',
    BY_ID: (id: number) => `/conversaciones/${id}`,
  },

  MESSAGES: {
    BASE: '/mensajes',
    BY_ID: (id: number) => `/mensajes/${id}`,
  },

  // Roles
  USER_ROLES: {
    BASE: '/roles-usuario',
    BY_ID: (id: number) => `/roles-usuario/${id}`,
  },

  PROJECTS: {
    BASE: '/proyectos',
    BY_ID: (id: number) => `/proyectos/${id}`,
    BY_CREATOR: (creatorId: number) => `/proyectos?creador_id=${creatorId}`,
    BY_UNIVERSITY: (universityId: number) => `/proyectos?universidad_id=${universityId}`,
  },

  PROJECT_ROLES: {
    BASE: '/roles-proyecto',
    BY_ID: (id: number) => `/roles-proyecto/${id}`,
  },

  // Actividad
  USER_ACTIVITY: {
    BASE: '/actividad-usuario',
    BY_USER: (userId: number) => `/actividad-usuario?usuario_id=${userId}`,
  },
} as const;

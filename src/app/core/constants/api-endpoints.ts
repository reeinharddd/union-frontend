//Fabian Mendoza
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
    UPDATE: (id: number) => `/usuarios/${id}`,
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
    BY_PROMOTER: (userId: number) => `/oportunidades/creadas-por/${userId}`,
    PENDING_REVIEW: '/oportunidades/pending-review',
    UPDATE: (id: number) => `/oportunidades/${id}`,
    DELETE: (id: number) => `/oportunidades/${id}`,
  },

  //Oportunidades por tipo
  OPPORTUNITIES_TYPE: {
    BASE: '/opportunity-types',
    BY_ID: (id: number) => `/opportunity-types/${id}`,
  },

  // Modalidades de trabajo
  WORK_MODALITIES: {
    BASE: '/work-modalities',
    BY_ID: (id: number) => `/work-modalities/${id}`,
  },

  // Postulaciones
  POSTULATIONS: {
    BASE: '/postulaciones',
    BY_ID: (id: number) => `/postulaciones/${id}`,
    RECENT: '/postulaciones/recent',
    PENDING_REVIEW: '/postulaciones/pending-review',
    BY_OPPORTUNITY: (opportunityId: number) => `/postulaciones?oportunidad_id=${opportunityId}`,
    BY_USER: (userId: number) => `/postulaciones?usuario_id=${userId}`,
  },

  // Tags
  TAGS: {
    BASE: '/tags',
    BY_ID: (id: number) => `/tags/${id}`,
  },

  // Seguimientos
  FOLLOWINGS: {
    BASE: '/seguimientos',
    BY_ID: (id: number) => `/seguimientos/${id}`,
    MUTUAL_FOLLOWERS: (userId: number) => `/seguimientos/mutuos/${userId}`,
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
    PERMIT: (projectId: number, userId: number) => `/proyectos/${projectId}/permiso/${userId}`,
    PAGES: (projectId: number) => `/proyectos/${projectId}/paginas-colaborativas`,
  },

  COLAB_PAGE: {
    LIST: (projectId: number) => `/paginas-colaborativas?proyecto_id=${projectId}`,
    CREATE: '/paginas-colaborativas',
    BY_ID: (id: number) => `/paginas-colaborativas/${id}`,
    UPDATE: (id: number) => `/paginas-colaborativas/${id}`,
    DELETE: (id: number) => `/paginas-colaborativas/${id}`,
  },
  BLOQUES: {
    BY_PAGE: (pageId: number) => `/paginas-colaborativas/${pageId}/bloques`,
    BY_ID: (blockId: number) => `/bloques/${blockId}`,
    REORDER: '/bloques/reorder',
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
  // Reportes
  REPORTES: {
    BASE: '/reportes',
    BY_ID: (id: number) => `/reportes/${id}`,
  },
} as const;

// src/app/core/constants/roles.constants.ts
export const USER_ROLES = {
  ADMIN: 1,
  STUDENT: 2,
  PROFESSOR: 3,
  ADMIN_UNI: 9,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Mapeo para mostrar nombres
export const ROLE_NAMES: Record<number, string> = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.STUDENT]: 'Estudiante',
  [USER_ROLES.PROFESSOR]: 'Profesor',
  [USER_ROLES.ADMIN_UNI]: 'Admin Universitario',
};

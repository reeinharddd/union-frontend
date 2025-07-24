export const Roles = {
  ADMIN: 'admin', // ← Minúsculas para consistencia
  ADMIN_UNI: 'profesor',
  PROMOTER: 'promoter',
  USER: 'estudiante', // ← Consistente con la API
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];

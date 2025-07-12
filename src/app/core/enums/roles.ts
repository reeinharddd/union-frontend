export const Roles = {
  ADMIN: 'admin', // ← Minúsculas para consistencia
  ADMIN_UNI: 'admin_uni',
  PROMOTER: 'promoter',
  USER: 'user', // ← Consistente con la API
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];

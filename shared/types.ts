/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export * from "./_core/errors";

// Tipo de usuário
export type User = {
  id: string;
  openId: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  passwordHash?: string | null;
};

export type UserRole = 'admin' | 'user';
